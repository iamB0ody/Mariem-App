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

// Function to fetch videos from YouTube API
async function fetchYouTubeVideos(keyword, maxResults = 4) {
  try {
    // Add "toddler" to search queries to get age-appropriate content
    const searchQuery = `${keyword} toddler`

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`)

    if (!response.ok) {
      throw new Error("YouTube API request failed")
    }

    const data = await response.json()
    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: formatPublishedDate(item.snippet.publishedAt),
    }))
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

// Function to generate videos from YouTube API
async function generateVideos() {
  const content = document.querySelector(".content")

  // Clear any existing content
  content.innerHTML = ""

  // Define categories and their search keywords for toddlers (2-3 years)
  const categories = [
    {
      name: "Mariem's Favorite Colors (Pink)",
      keywords: "pink colors for toddlers",
    },
    {
      name: "Islamic Songs for Toddlers",
      keywords: "islamic songs for toddlers",
    },
    {
      name: "Arabic Nursery Rhymes",
      keywords: "arabic nursery rhymes",
    },
    {
      name: "Simple Counting & Numbers",
      keywords: "counting numbers for toddlers",
    },
    {
      name: "Animal Sounds & Stories",
      keywords: "animal sounds for toddlers",
    },
    {
      name: "Shapes & Colors",
      keywords: "shapes and colors for toddlers",
    },
  ]

  // Fetch and display videos for each category
  for (const category of categories) {
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
      // Fetch videos from YouTube API
      const videos = await fetchYouTubeVideos(category.keywords)

      // Remove loading indicator
      content.removeChild(loadingIndicator)

      if (videos.length === 0) {
        const noVideosMessage = document.createElement("div")
        noVideosMessage.className = "no-videos-message"
        noVideosMessage.textContent = "No videos found for this category."
        content.appendChild(noVideosMessage)
        continue
      }

      // Create a container for the videos in this category
      const videosContainer = document.createElement("div")
      videosContainer.className = "videos-container"
      content.appendChild(videosContainer)

      // Add videos to the container
      videos.forEach((video) => {
        const videoCard = createVideoCard(video, category.name)
        videosContainer.appendChild(videoCard)
      })
    } catch (error) {
      console.error(`Error loading videos for ${category.name}:`, error)

      // Remove loading indicator
      content.removeChild(loadingIndicator)

      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.className = "error-message"
      errorMessage.textContent = "Failed to load videos. Please try again later."
      content.appendChild(errorMessage)
    }
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
    case "Islamic Stories":
      searchQuery = "simple islamic stories for toddlers"
      break
    case "Quran":
      searchQuery = "quran for toddlers"
      break
    case "Arabic Cartoons":
      searchQuery = "arabic cartoons for toddlers"
      break
    case "Nasheeds":
      searchQuery = "simple islamic nasheeds for toddlers"
      break
    case "Learn Arabic":
      searchQuery = "learn arabic for toddlers"
      break
    case "Islamic Values":
      searchQuery = "simple islamic values for toddlers"
      break
    case "Toddlers (2-4)":
      searchQuery = "islamic content for 2 year old"
      break
    case "Preschool (4-6)":
      searchQuery = "islamic content for preschool"
      break
    case "Elementary (6-9)":
      searchQuery = "islamic content for elementary children"
      break
    case "Pre-teens (9-12)":
      searchQuery = "islamic content for preteens"
      break
    default:
      searchQuery = `simple ${category.toLowerCase()} for toddlers`
  }

  try {
    // Fetch videos from YouTube API
    const videos = await fetchYouTubeVideos(searchQuery)

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
