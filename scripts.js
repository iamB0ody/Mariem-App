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

// Language settings
let currentLanguage = "en" // Default language is English

// Translations
const translations = {
  en: {
    welcomeHeader: "Mariem's Favorite Videos",
    loadingText: "Loading videos for Mariem...",
    loadMoreButton: "Load More Videos",
    loadingButton: "Loading...",
    tryAgainButton: "Try Again",
    noVideosMessage: "No videos found. Please try again later.",
    errorMessage: "Failed to load videos. Please try again later.",
    sidebarCategory: "Mariem's Islamic Favorites",
    home: "Home",
    pinkIslamicSongs: "Pink Islamic Songs",
    arabicNurseryRhymes: "Arabic Nursery Rhymes",
    simpleQuran: "Simple Quran",
    arabicAlphabet: "Arabic Alphabet",
    islamicCartoons: "Islamic Cartoons",
    arabicAnimals: "Arabic Animals",
  },
  ar: {
    welcomeHeader: "فيديوهات مريم المفضلة",
    loadingText: "جاري تحميل الفيديوهات لمريم...",
    loadMoreButton: "تحميل المزيد من الفيديوهات",
    loadingButton: "جاري التحميل...",
    tryAgainButton: "حاول مرة أخرى",
    noVideosMessage: "لم يتم العثور على فيديوهات. يرجى المحاولة مرة أخرى لاحقًا.",
    errorMessage: "فشل تحميل الفيديوهات. يرجى المحاولة مرة أخرى لاحقًا.",
    sidebarCategory: "مفضلات مريم الإسلامية",
    home: "الرئيسية",
    pinkIslamicSongs: "أناشيد إسلامية وردية",
    arabicNurseryRhymes: "أغاني أطفال عربية",
    simpleQuran: "قرآن مبسط",
    arabicAlphabet: "الحروف العربية",
    islamicCartoons: "رسوم متحركة إسلامية",
    arabicAnimals: "الحيوانات باللغة العربية",
  },
}

// Function to toggle language
function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "ar" : "en"

  // Toggle RTL class on body
  if (currentLanguage === "ar") {
    document.body.classList.add("rtl")
  } else {
    document.body.classList.remove("rtl")
  }

  // Update UI text
  updateUILanguage()

  // Reload current view
  if (document.querySelector(".category-header") && document.querySelector(".category-header").textContent !== translations[currentLanguage].welcomeHeader) {
    // We're in a category view, reload that category
    const categoryName = document.querySelector(".category-header").textContent
    const categoryKey = getCategoryKeyByName(categoryName)
    if (categoryKey) {
      searchVideosByCategory(translations[currentLanguage][categoryKey])
    } else {
      generateVideos() // Fallback to home
    }
  } else {
    // We're in home view
    generateVideos()
  }
}

// Function to get category key by name
function getCategoryKeyByName(name) {
  const enEntries = Object.entries(translations.en)
  for (const [key, value] of enEntries) {
    if (value === name) return key
  }

  const arEntries = Object.entries(translations.ar)
  for (const [key, value] of arEntries) {
    if (value === name) return key
  }

  return null
}

// Function to update UI language
function updateUILanguage() {
  // Update sidebar category
  const sidebarCategory = document.querySelector(".sidebar-category")
  if (sidebarCategory) {
    sidebarCategory.textContent = translations[currentLanguage].sidebarCategory
  }

  // Update sidebar items
  const sidebarItems = document.querySelectorAll(".sidebar-item-text")
  if (sidebarItems.length > 0) {
    sidebarItems[0].textContent = translations[currentLanguage].home
    sidebarItems[1].textContent = translations[currentLanguage].pinkIslamicSongs
    sidebarItems[2].textContent = translations[currentLanguage].arabicNurseryRhymes
    sidebarItems[3].textContent = translations[currentLanguage].simpleQuran
    sidebarItems[4].textContent = translations[currentLanguage].arabicAlphabet
    sidebarItems[5].textContent = translations[currentLanguage].islamicCartoons
    sidebarItems[6].textContent = translations[currentLanguage].arabicAnimals
  }

  // Update language button text
  const langButton = document.getElementById("language-button")
  if (langButton) {
    const langTexts = langButton.querySelectorAll(".lang-text")
    if (currentLanguage === "en") {
      langTexts[0].style.fontWeight = "bold"
      langTexts[1].style.fontWeight = "normal"
    } else {
      langTexts[0].style.fontWeight = "normal"
      langTexts[1].style.fontWeight = "bold"
    }
  }

  // Update welcome header if present
  const welcomeHeader = document.querySelector(".welcome-header")
  if (welcomeHeader) {
    welcomeHeader.textContent = translations[currentLanguage].welcomeHeader
  }

  // Update load more button if present
  const loadMoreButton = document.querySelector(".load-more-button")
  if (loadMoreButton && !loadMoreButton.disabled) {
    loadMoreButton.textContent = translations[currentLanguage].loadMoreButton
  }
}

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

  if (currentLanguage === "en") {
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
  } else {
    // Arabic date format
    if (diffDays < 7) {
      return `منذ ${diffDays} أيام`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `منذ ${weeks} ${weeks === 1 ? "أسبوع" : "أسابيع"}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `منذ ${months} ${months === 1 ? "شهر" : "أشهر"}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `منذ ${years} ${years === 1 ? "سنة" : "سنوات"}`
    }
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
  videoCard.setAttribute("tabindex", "0") // Make focusable for TV remote

  // Get first letter of channel name for the icon
  const channelInitial = video.channel.charAt(0)

  // Get age range
  const ageRange = getRandomAgeRange(category)

  // Age badge text based on language
  const ageBadgeText = currentLanguage === "en" ? `Ages ${ageRange}` : `الأعمار ${ageRange}`

  videoCard.innerHTML = `
    <div class="thumbnail" style="background-image: url('${video.thumbnail}'); background-size: cover; background-position: center;">
      <div class="age-badge">${ageBadgeText}</div>
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

  // Add keydown event for TV remote (Enter key)
  videoCard.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      // Enter key
      playVideo(video.id, video.title)
      event.preventDefault()
    }
  })

  return videoCard
}

// Function to play a video
function playVideo(videoId, videoTitle) {
  // Create a modal for the video player
  const modal = document.createElement("div")
  modal.className = "video-modal"

  // Close button text based on language
  const closeButtonText = currentLanguage === "en" ? "×" : "×"

  modal.innerHTML = `
    <div class="video-modal-content">
      <div class="video-modal-header">
        <h3>${videoTitle}</h3>
        <button class="close-button">${closeButtonText}</button>
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

  // Add welcome header for home page
  const welcomeHeader = document.createElement("h1")
  welcomeHeader.className = "welcome-header"
  welcomeHeader.textContent = translations[currentLanguage].welcomeHeader
  content.appendChild(welcomeHeader)

  // Show loading indicator
  const loadingIndicator = document.createElement("div")
  loadingIndicator.className = "loading-indicator"
  loadingIndicator.textContent = translations[currentLanguage].loadingText
  content.appendChild(loadingIndicator)

  // Define all categories keywords for search
  const allCategories = ["islamic songs for toddlers pink", "arabic nursery rhymes for toddlers", "quran for toddlers simple", "arabic alphabet for toddlers", "islamic cartoons arabic for toddlers", "arabic animal names for toddlers"]

  // Create a combined search query with OR operator
  // This will get a mix of videos from different categories
  const combinedQuery = "toddler (islamic OR arabic) (songs OR nursery OR quran OR alphabet OR cartoon)"

  try {
    // Try to fetch mixed videos with a single API call
    let videos = []

    try {
      // Fetch 8 videos initially
      videos = await fetchYouTubeVideos(combinedQuery, 8)
    } catch (apiError) {
      console.error("API error, using fallback data:", apiError)

      // Get mixed fallback videos
      videos = [...getFallbackVideos("islamic"), ...getFallbackVideos("arabic"), ...getFallbackVideos("quran")].slice(0, 8) // Limit to 8 videos
    }

    // Remove loading indicator
    content.removeChild(loadingIndicator)

    if (videos.length === 0) {
      const noVideosMessage = document.createElement("div")
      noVideosMessage.className = "no-videos-message"
      noVideosMessage.textContent = translations[currentLanguage].noVideosMessage
      content.appendChild(noVideosMessage)
      return
    }

    // Create a container for the videos
    const videosContainer = document.createElement("div")
    videosContainer.className = "videos-container"
    content.appendChild(videosContainer)

    // Add videos to the container
    videos.forEach((video) => {
      const videoCard = createVideoCard(video, "Mixed")
      videosContainer.appendChild(videoCard)
    })

    // Add "Load More Videos" button
    const loadMoreContainer = document.createElement("div")
    loadMoreContainer.className = "load-more-container"

    const loadMoreButton = document.createElement("button")
    loadMoreButton.className = "load-more-button"
    loadMoreButton.textContent = translations[currentLanguage].loadMoreButton
    loadMoreButton.setAttribute("tabindex", "0") // Make focusable for TV remote
    loadMoreContainer.appendChild(loadMoreButton)
    content.appendChild(loadMoreContainer)

    // Track which category to load next
    let currentCategoryIndex = 0
    let videosLoaded = videos.length
    const maxVideos = 24 // Maximum videos to load

    loadMoreButton.addEventListener("click", async () => {
      // Show loading state
      loadMoreButton.textContent = translations[currentLanguage].loadingButton
      loadMoreButton.disabled = true

      try {
        // Get the next category to load
        const categoryQuery = allCategories[currentCategoryIndex]
        currentCategoryIndex = (currentCategoryIndex + 1) % allCategories.length

        // Fetch 4 more videos from this category
        let moreVideos = []
        try {
          moreVideos = await fetchYouTubeVideos(categoryQuery, 4)
        } catch (apiError) {
          console.error("API error when loading more videos:", apiError)
          moreVideos = getFallbackVideos(categoryQuery)
        }

        // Add new videos to the container
        moreVideos.forEach((video) => {
          const videoCard = createVideoCard(video, "Mixed")
          videosContainer.appendChild(videoCard)
        })

        // Update count of loaded videos
        videosLoaded += moreVideos.length

        // Reset button state
        loadMoreButton.textContent = translations[currentLanguage].loadMoreButton
        loadMoreButton.disabled = false

        // Hide button if we've reached the maximum
        if (videosLoaded >= maxVideos) {
          loadMoreContainer.style.display = "none"
        }
      } catch (error) {
        console.error("Error loading more videos:", error)
        loadMoreButton.textContent = translations[currentLanguage].tryAgainButton
        loadMoreButton.disabled = false
      }
    })
  } catch (error) {
    console.error("Error loading home page videos:", error)

    // Remove loading indicator if it exists
    if (document.contains(loadingIndicator)) {
      content.removeChild(loadingIndicator)
    }

    // Show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "error-message"
    errorMessage.textContent = translations[currentLanguage].errorMessage
    content.appendChild(errorMessage)
  }
}

// Add event listeners for sidebar items
function setupSidebarNavigation() {
  const sidebarItems = document.querySelectorAll(".sidebar-item")

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.querySelector(".sidebar-item-text").textContent

      // Handle navigation based on the clicked item
      if (text === translations[currentLanguage].home) {
        generateVideos() // Reload the main page
      } else {
        // For other categories, search for videos related to that category
        searchVideosByCategory(text)
      }
    })
  })

  // Add event listener for language toggle button
  const languageButton = document.getElementById("language-button")
  if (languageButton) {
    languageButton.addEventListener("click", toggleLanguage)
  }
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
  loadingIndicator.textContent = translations[currentLanguage].loadingText
  content.appendChild(loadingIndicator)

  // Map sidebar text to search keywords for a 2-year-old
  let searchQuery = ""

  // English category names
  if (category === translations.en.pinkIslamicSongs || category === translations.ar.pinkIslamicSongs) {
    searchQuery = "islamic songs for toddlers pink"
  } else if (category === translations.en.arabicNurseryRhymes || category === translations.ar.arabicNurseryRhymes) {
    searchQuery = "arabic nursery rhymes for toddlers"
  } else if (category === translations.en.simpleQuran || category === translations.ar.simpleQuran) {
    searchQuery = "quran for toddlers simple"
  } else if (category === translations.en.arabicAlphabet || category === translations.ar.arabicAlphabet) {
    searchQuery = "arabic alphabet for toddlers"
  } else if (category === translations.en.islamicCartoons || category === translations.ar.islamicCartoons) {
    searchQuery = "islamic cartoons arabic for toddlers"
  } else if (category === translations.en.arabicAnimals || category === translations.ar.arabicAnimals) {
    searchQuery = "arabic animal names for toddlers"
  } else if (category === translations.en.home || category === translations.ar.home) {
    // Just reload the main page
    content.innerHTML = ""
    generateVideos()
    return
  } else {
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
      noVideosMessage.textContent = translations[currentLanguage].noVideosMessage
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
    errorMessage.textContent = translations[currentLanguage].errorMessage
    content.appendChild(errorMessage)
  }
}

// WebOS TV Remote Navigation Support
let currentFocusIndex = 0
let focusableElements = []

// Function to initialize TV remote navigation
function initTVNavigation() {
  // Get all focusable elements
  updateFocusableElements()

  // Set initial focus
  if (focusableElements.length > 0) {
    setFocus(0)
  }

  // Listen for remote control key events
  document.addEventListener("keydown", handleKeyNavigation)
}

// Function to update the list of focusable elements
function updateFocusableElements() {
  // Get all interactive elements
  focusableElements = Array.from(document.querySelectorAll(".sidebar-item, .video-card, .load-more-button, #language-button"))

  // Make all elements programmatically focusable
  focusableElements.forEach((el) => {
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "0")
    }
  })
}

// Function to set focus on an element by index
function setFocus(index) {
  // Remove focus from all elements
  focusableElements.forEach((el) => {
    el.classList.remove("tv-focus")
  })

  // Ensure index is within bounds
  if (index < 0) index = focusableElements.length - 1
  if (index >= focusableElements.length) index = 0

  // Set current focus index
  currentFocusIndex = index

  // Focus the element
  const element = focusableElements[currentFocusIndex]
  if (element) {
    element.classList.add("tv-focus")
    element.focus()

    // Ensure the element is visible by scrolling if needed
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

// Handle key navigation for TV remote
function handleKeyNavigation(event) {
  // Update the list of focusable elements in case DOM has changed
  updateFocusableElements()

  switch (event.keyCode) {
    // Up arrow
    case 38:
      navigateVertical(-1)
      event.preventDefault()
      break

    // Down arrow
    case 40:
      navigateVertical(1)
      event.preventDefault()
      break

    // Left arrow
    case 37:
      navigateHorizontal(-1)
      event.preventDefault()
      break

    // Right arrow
    case 39:
      navigateHorizontal(1)
      event.preventDefault()
      break

    // Enter/Select button
    case 13:
      selectCurrentElement()
      event.preventDefault()
      break

    // Back button
    case 461: // WebOS back button
    case 27: // ESC key as fallback
      handleBackButton()
      event.preventDefault()
      break
  }
}

// Navigate vertically (up/down)
function navigateVertical(direction) {
  // Get current element position
  const currentElement = focusableElements[currentFocusIndex]
  const currentRect = currentElement.getBoundingClientRect()

  // Find the next element in the vertical direction
  let nextIndex = currentFocusIndex
  let minDistance = Infinity

  focusableElements.forEach((element, index) => {
    if (index === currentFocusIndex) return

    const rect = element.getBoundingClientRect()

    // Check if element is above/below current element
    const isAbove = rect.bottom < currentRect.top
    const isBelow = rect.top > currentRect.bottom

    if ((direction < 0 && isAbove) || (direction > 0 && isBelow)) {
      // Calculate horizontal distance
      const horizontalOverlap = Math.max(0, Math.min(currentRect.right, rect.right) - Math.max(currentRect.left, rect.left))

      // Calculate vertical distance
      const verticalDistance = direction < 0 ? currentRect.top - rect.bottom : rect.top - currentRect.bottom

      // Prioritize elements with horizontal overlap
      if (horizontalOverlap > 0 && verticalDistance < minDistance) {
        minDistance = verticalDistance
        nextIndex = index
      }
    }
  })

  // If no suitable element found, try to find any element in that direction
  if (nextIndex === currentFocusIndex) {
    focusableElements.forEach((element, index) => {
      if (index === currentFocusIndex) return

      const rect = element.getBoundingClientRect()

      // Check if element is above/below current element
      const isAbove = rect.bottom < currentRect.top
      const isBelow = rect.top > currentRect.bottom

      if ((direction < 0 && isAbove) || (direction > 0 && isBelow)) {
        const distance = direction < 0 ? currentRect.top - rect.bottom : rect.top - currentRect.bottom

        if (distance < minDistance) {
          minDistance = distance
          nextIndex = index
        }
      }
    })
  }

  // Set focus to the next element
  if (nextIndex !== currentFocusIndex) {
    setFocus(nextIndex)
  }
}

// Navigate horizontally (left/right)
function navigateHorizontal(direction) {
  // Get current element position
  const currentElement = focusableElements[currentFocusIndex]
  const currentRect = currentElement.getBoundingClientRect()

  // Find the next element in the horizontal direction
  let nextIndex = currentFocusIndex
  let minDistance = Infinity

  focusableElements.forEach((element, index) => {
    if (index === currentFocusIndex) return

    const rect = element.getBoundingClientRect()

    // Check if element is to the left/right of current element
    const isLeft = rect.right < currentRect.left
    const isRight = rect.left > currentRect.right

    if ((direction < 0 && isLeft) || (direction > 0 && isRight)) {
      // Calculate vertical distance
      const verticalOverlap = Math.max(0, Math.min(currentRect.bottom, rect.bottom) - Math.max(currentRect.top, rect.top))

      // Calculate horizontal distance
      const horizontalDistance = direction < 0 ? currentRect.left - rect.right : rect.left - currentRect.right

      // Prioritize elements with vertical overlap
      if (verticalOverlap > 0 && horizontalDistance < minDistance) {
        minDistance = horizontalDistance
        nextIndex = index
      }
    }
  })

  // If no suitable element found, try to find any element in that direction
  if (nextIndex === currentFocusIndex) {
    focusableElements.forEach((element, index) => {
      if (index === currentFocusIndex) return

      const rect = element.getBoundingClientRect()

      // Check if element is to the left/right of current element
      const isLeft = rect.right < currentRect.left
      const isRight = rect.left > currentRect.right

      if ((direction < 0 && isLeft) || (direction > 0 && isRight)) {
        const distance = direction < 0 ? currentRect.left - rect.right : rect.left - currentRect.right

        if (distance < minDistance) {
          minDistance = distance
          nextIndex = index
        }
      }
    })
  }

  // Set focus to the next element
  if (nextIndex !== currentFocusIndex) {
    setFocus(nextIndex)
  }
}

// Select the currently focused element
function selectCurrentElement() {
  const element = focusableElements[currentFocusIndex]
  if (element) {
    // Simulate a click event
    element.click()
  }
}

// Handle back button
function handleBackButton() {
  // If video modal is open, close it
  const videoModal = document.querySelector(".video-modal")
  if (videoModal) {
    document.body.removeChild(videoModal)
    return
  }

  // If we're in a category view, go back to home
  const categoryHeader = document.querySelector(".category-header")
  if (categoryHeader && categoryHeader.textContent !== translations[currentLanguage].welcomeHeader) {
    generateVideos()
  }
}

// Initialize the app when the window loads
window.onload = function () {
  generateVideos()
  setupSidebarNavigation()

  // Initialize TV navigation after a short delay to ensure DOM is ready
  setTimeout(initTVNavigation, 1000)

  // Listen for DOM changes to update focusable elements
  const observer = new MutationObserver(function (mutations) {
    updateFocusableElements()

    // If current focus is lost (element removed), reset focus
    if (!document.activeElement || !focusableElements.includes(document.activeElement)) {
      if (focusableElements.length > 0) {
        setFocus(0)
      }
    }
  })

  // Observe changes to the content area
  observer.observe(document.querySelector(".content"), {
    childList: true,
    subtree: true,
  })

  // Register for WebOS TV specific events if available
  if (window.webOS && window.webOS.platformBack) {
    // Override the platform back button
    window.webOS.platformBack = function () {
      handleBackButton()
      return true // Prevent default back action
    }
  }
}
