//sample code for calling LS2 API
webOS.service.request("luna://com.palm.systemservice", {
  method: "clock/getTime",
  parameters: {},
  onSuccess: function (args) {
    console.log("UTC:", args.utc)
  },
  onFailure: function (args) {
    console.log("Failed to getTime")
  },
})

// YouTube API Key - Replace with your own API key
const YOUTUBE_API_KEY = "AIzaSyBZWVWhRzZTKjRJXXNryryxzW6Pa2EjShs"

// Cache for storing API responses to reduce API calls
const apiCache = {}
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Function to fetch videos from YouTube API with caching
async function fetchYouTubeVideos(keyword, maxResults = 4) {
  try {
    // Add "toddler" to search queries to get age-appropriate content
    const searchQuery = `${keyword} toddler`

    // Check if we have a valid cached response
    const cacheKey = `${searchQuery}_${maxResults}`
    const cachedData = apiCache[cacheKey]

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      console.log(`Using cached data for: ${searchQuery}`)
      return cachedData.data
    }

    // If no cache or expired, make the API call
    console.log(`Fetching from API: ${searchQuery}`)

    // Use fields parameter to reduce response size and quota usage
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${maxResults}` +
        `&q=${encodeURIComponent(searchQuery)}` +
        `&type=video` +
        `&videoEmbeddable=true` +
        `&fields=items(id/videoId,snippet(title,channelTitle,thumbnails/high/url,publishedAt))` +
        `&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      throw new Error("YouTube API request failed")
    }

    const data = await response.json()
    const processedData = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: formatPublishedDate(item.snippet.publishedAt),
    }))

    // Cache the processed data
    apiCache[cacheKey] = {
      data: processedData,
      timestamp: Date.now(),
    }

    return processedData
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}

// Format the published date to a more readable format
function formatPublishedDate(publishedDate) {
  const date = new Date(publishedDate)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

// Function to get age range appropriate for the content
function getRandomAgeRange(category) {
  // Since Mariem is 2 years and 5 months, focus on 2-4 age range
  return "2-4"
}

// Function to create a video card element
function createVideoCard(video, category) {
  const videoCard = document.createElement("div")
  videoCard.className = "video-card"

  // Get first letter of channel name for the icon
  const channelInitial = video.channel.charAt(0)

  // Get age range
  const ageRange = getRandomAgeRange(category)

  videoCard.innerHTML = `
    <div class="thumbnail" style="background-image: url('${video.thumbnail}'); background-size: cover; background-position: center;">
      <div class="age-badge">Ages ${ageRange}</div>
    </div>
    <div class="video-info">
      <div class="channel-icon">${channelInitial}</div>
      <div class="video-details">
        <div class="video-title">${video.title}</div>
        <div class="channel-name">${video.channel}</div>
        <div class="video-stats">${video.publishedAt}</div>
      </div>
    </div>
  `

  // Add click event to play the video
  videoCard.addEventListener("click", () => {
    playVideo(video.id, video.title)
  })

  return videoCard
}

// Function to play a video
function playVideo(videoId, videoTitle) {
  // Create a modal for the video player
  const modal = document.createElement("div")
  modal.className = "video-modal"
  modal.innerHTML = `
    <div class="video-modal-content">
      <div class="video-modal-header">
        <h3>${videoTitle}</h3>
        <button class="close-button">&times;</button>
      </div>
      <div class="video-player">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Add event listener to close button
  const closeButton = modal.querySelector(".close-button")
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal)
  })

  // Close modal when clicking outside the content
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

// Predefined video data to use when API quota is exceeded
const fallbackVideos = {
  islamic: [
    {
      id: "8Yzqz_s8Xbc",
      title: "Islamic Songs For Kids | Nasheed For Children",
      channel: "Muslim Kids TV",
      thumbnail: "https://i.ytimg.com/vi/8Yzqz_s8Xbc/hqdefault.jpg",
      publishedAt: "2 years ago",
    },
    {
      id: "GQ7XZGrY1cE",
      title: "Arabic Alphabet Song for Kids",
      channel: "Arabic For Kids",
      thumbnail: "https://i.ytimg.com/vi/GQ7XZGrY1cE/hqdefault.jpg",
      publishedAt: "3 years ago",
    },
  ],
  quran: [
    {
      id: "JlA2_Oi-Xug",
      title: "Quran for Kids: Learn Surah Al-Fatiha",
      channel: "Quran For Kids",
      thumbnail: "https://i.ytimg.com/vi/JlA2_Oi-Xug/hqdefault.jpg",
      publishedAt: "1 year ago",
    },
  ],
  arabic: [
    {
      id: "JZhvyZ0RH5c",
      title: "Arabic Nursery Rhymes Collection",
      channel: "Arabic Songs",
      thumbnail: "https://i.ytimg.com/vi/JZhvyZ0RH5c/hqdefault.jpg",
      publishedAt: "2 years ago",
    },
  ],
}

// Function to get fallback videos based on category
function getFallbackVideos(category) {
  let type = "islamic"

  if (category.toLowerCase().includes("quran")) {
    type = "quran"
  } else if (category.toLowerCase().includes("arabic") || category.toLowerCase().includes("alphabet")) {
    type = "arabic"
  }

  return fallbackVideos[type] || fallbackVideos["islamic"]
}

// Function to generate videos from YouTube API
async function generateVideos() {
  const content = document.querySelector(".content")

  // Clear any existing content
  content.innerHTML = ""

  // Define categories and their search keywords for Islamic/Arabic content for toddlers
  const categories = [
    {
      name: "Mariem's Pink Islamic Songs",
      keywords: "islamic songs for toddlers pink",
    },
    {
      name: "Arabic Nursery Rhymes",
      keywords: "arabic nursery rhymes for toddlers",
    },
    {
      name: "Simple Quran for Toddlers",
      keywords: "quran for toddlers simple",
    },
    {
      name: "Arabic Alphabet & Letters",
      keywords: "arabic alphabet for toddlers",
    },
    {
      name: "Islamic Cartoons in Arabic",
      keywords: "islamic cartoons arabic for toddlers",
    },
    {
      name: "Arabic Animal Names & Sounds",
      keywords: "arabic animal names for toddlers",
    },
  ]

  // Load only 2 categories at a time to reduce API usage
  const visibleCategories = categories.slice(0, 2)

  // Add a "Load More" button container
  const loadMoreContainer = document.createElement("div")
  loadMoreContainer.className = "load-more-container"

  // Function to load a category
  async function loadCategory(category, index) {
    // Add category header
    const categoryHeader = document.createElement("h2")
    categoryHeader.className = "category-header"
    categoryHeader.textContent = category.name
    content.appendChild(categoryHeader)

    // Show loading indicator
    const loadingIndicator = document.createElement("div")
    loadingIndicator.className = "loading-indicator"
    loadingIndicator.textContent = "Loading videos for Mariem..."
    content.appendChild(loadingIndicator)

    try {
      // Try to fetch videos from YouTube API
      let videos = []

      try {
        videos = await fetchYouTubeVideos(category.keywords, 3) // Reduced from 4 to 3 videos per category
      } catch (apiError) {
        console.error("API error, using fallback data:", apiError)
        videos = getFallbackVideos(category.name)
      }

      // Remove loading indicator
      content.removeChild(loadingIndicator)

      if (videos.length === 0) {
        const noVideosMessage = document.createElement("div")
        noVideosMessage.className = "no-videos-message"
        noVideosMessage.textContent = "No videos found for this category."
        content.appendChild(noVideosMessage)
        return
      }

      // Create a container for the videos in this category
      const videosContainer = document.createElement("div")
      videosContainer.className = "videos-container"
      videosContainer.dataset.category = index
      content.appendChild(videosContainer)

      // Add videos to the container
      videos.forEach((video) => {
        const videoCard = createVideoCard(video, category.name)
        videosContainer.appendChild(videoCard)
      })
    } catch (error) {
      console.error(`Error loading videos for ${category.name}:`, error)

      // Remove loading indicator
      if (document.contains(loadingIndicator)) {
        content.removeChild(loadingIndicator)
      }

      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.className = "error-message"
      errorMessage.textContent = "Failed to load videos. Please try again later."
      content.appendChild(errorMessage)
    }
  }

  // Load initial categories
  for (let i = 0; i < visibleCategories.length; i++) {
    await loadCategory(visibleCategories[i], i)
  }

  // Add "Load More" button if there are more categories
  if (categories.length > visibleCategories.length) {
    const loadMoreButton = document.createElement("button")
    loadMoreButton.className = "load-more-button"
    loadMoreButton.textContent = "Load More Categories"
    loadMoreContainer.appendChild(loadMoreButton)
    content.appendChild(loadMoreContainer)

    let nextCategoryIndex = visibleCategories.length

    loadMoreButton.addEventListener("click", async () => {
      // Remove the button temporarily
      loadMoreContainer.removeChild(loadMoreButton)

      // Load next category
      if (nextCategoryIndex < categories.length) {
        await loadCategory(categories[nextCategoryIndex], nextCategoryIndex)
        nextCategoryIndex++

        // Add the button back if there are more categories
        if (nextCategoryIndex < categories.length) {
          loadMoreContainer.appendChild(loadMoreButton)
        }
      }
    })
  }
}

// Add event listeners for sidebar items
function setupSidebarNavigation() {
  const sidebarItems = document.querySelectorAll(".sidebar-item")

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.querySelector(".sidebar-item-text").textContent

      // Handle navigation based on the clicked item
      if (text === "Home") {
        generateVideos() // Reload the main page
      } else {
        // For other categories, search for videos related to that category
        searchVideosByCategory(text)
      }
    })
  })
}

// Function to search videos by category
async function searchVideosByCategory(category) {
  const content = document.querySelector(".content")

  // Clear any existing content
  content.innerHTML = ""

  // Add category header
  const categoryHeader = document.createElement("h2")
  categoryHeader.className = "category-header"
  categoryHeader.textContent = category
  content.appendChild(categoryHeader)

  // Show loading indicator
  const loadingIndicator = document.createElement("div")
  loadingIndicator.className = "loading-indicator"
  loadingIndicator.textContent = "Loading videos for Mariem..."
  content.appendChild(loadingIndicator)

  // Map sidebar text to search keywords for a 2-year-old
  let searchQuery = ""
  switch (category) {
    case "Home":
      // Just reload the main page
      content.innerHTML = ""
      generateVideos()
      return
    case "Pink Islamic Songs":
      searchQuery = "islamic songs for toddlers pink"
      break
    case "Arabic Nursery Rhymes":
      searchQuery = "arabic nursery rhymes for toddlers"
      break
    case "Simple Quran":
      searchQuery = "quran for toddlers simple"
      break
    case "Arabic Alphabet":
      searchQuery = "arabic alphabet for toddlers"
      break
    case "Islamic Cartoons":
      searchQuery = "islamic cartoons arabic for toddlers"
      break
    case "Arabic Animals":
      searchQuery = "arabic animal names for toddlers"
      break
    default:
      searchQuery = `arabic islamic ${category.toLowerCase()} for toddlers`
  }

  try {
    // Try to fetch videos from YouTube API
    let videos = []

    try {
      videos = await fetchYouTubeVideos(searchQuery, 6) // Load more videos for direct category search
    } catch (apiError) {
      console.error("API error, using fallback data:", apiError)
      videos = getFallbackVideos(category)
    }

    // Remove loading indicator
    content.removeChild(loadingIndicator)

    if (videos.length === 0) {
      const noVideosMessage = document.createElement("div")
      noVideosMessage.className = "no-videos-message"
      noVideosMessage.textContent = "No videos found for this category."
      content.appendChild(noVideosMessage)
      return
    }

    // Create a container for the videos
    const videosContainer = document.createElement("div")
    videosContainer.className = "videos-container"
    content.appendChild(videosContainer)

    // Add videos to the container
    videos.forEach((video) => {
      const videoCard = createVideoCard(video, category)
      videosContainer.appendChild(videoCard)
    })
  } catch (error) {
    console.error(`Error loading videos for ${category}:`, error)

    // Remove loading indicator
    content.removeChild(loadingIndicator)

    // Show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "error-message"
    errorMessage.textContent = "Failed to load videos. Please try again later."
    content.appendChild(errorMessage)
  }
}

// Initialize the app when the window loads
window.onload = function () {
  generateVideos()
  setupSidebarNavigation()
}
