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

// Function to generate kid-friendly videos
function generateVideos() {
  const content = document.querySelector(".content")

  // Add category headers
  const categories = ["Educational Videos", "Fun Cartoons", "Science for Kids"]

  const videosByCategory = {
    "Educational Videos": [
      {
        title: "Learn the Alphabet with Fun Songs",
        channel: "Kids Learning",
        views: "2.3M views",
        time: "2 months ago",
        age: "3-5",
      },
      {
        title: "Count from 1 to 20 with Animals",
        channel: "Math for Kids",
        views: "1.8M views",
        time: "3 months ago",
        age: "3-5",
      },
      {
        title: "Colors and Shapes for Toddlers",
        channel: "Early Learning",
        views: "3.1M views",
        time: "1 month ago",
        age: "2-4",
      },
      {
        title: "Easy English Words for Beginners",
        channel: "Language Kids",
        views: "1.5M views",
        time: "4 months ago",
        age: "4-7",
      },
    ],
    "Fun Cartoons": [
      {
        title: "Adventures of Friendly Animals",
        channel: "Kids Cartoons",
        views: "4.2M views",
        time: "2 months ago",
        age: "4-8",
      },
      {
        title: "The Magic School Bus",
        channel: "Science Fun",
        views: "2.7M views",
        time: "3 months ago",
        age: "5-10",
      },
      {
        title: "Dinosaur Friends",
        channel: "Dino World",
        views: "3.5M views",
        time: "1 month ago",
        age: "3-7",
      },
      {
        title: "Space Adventures for Kids",
        channel: "Galaxy Kids",
        views: "1.9M views",
        time: "5 months ago",
        age: "6-10",
      },
    ],
    "Science for Kids": [
      {
        title: "How Plants Grow - Kids Science",
        channel: "Science Kids",
        views: "1.4M views",
        time: "2 months ago",
        age: "6-10",
      },
      {
        title: "Amazing Animal Facts for Children",
        channel: "Nature Kids",
        views: "2.2M views",
        time: "3 months ago",
        age: "5-9",
      },
      {
        title: "Simple Science Experiments at Home",
        channel: "Experiment Kids",
        views: "3.3M views",
        time: "1 month ago",
        age: "7-12",
      },
      {
        title: "The Solar System for Children",
        channel: "Space Kids",
        views: "1.7M views",
        time: "4 months ago",
        age: "6-12",
      },
    ],
  }

  // Generate videos by category
  categories.forEach((category) => {
    // Add category header
    const categoryHeader = document.createElement("h2")
    categoryHeader.className = "category-header"
    categoryHeader.textContent = category
    content.appendChild(categoryHeader)

    // Add videos for this category
    videosByCategory[category].forEach((video) => {
      const videoCard = document.createElement("div")
      videoCard.className = "video-card"

      // Get first letter of channel name for the icon
      const channelInitial = video.channel.charAt(0)

      videoCard.innerHTML = `
        <div class="thumbnail">
          <div class="age-badge">Ages ${video.age}</div>
        </div>
        <div class="video-info">
          <div class="channel-icon">${channelInitial}</div>
          <div class="video-details">
            <div class="video-title">${video.title}</div>
            <div class="channel-name">${video.channel}</div>
            <div class="video-stats">${video.views} • ${video.time}</div>
          </div>
        </div>
      `

      content.appendChild(videoCard)
    })
  })
}

window.onload = function () {
  generateVideos()
}
