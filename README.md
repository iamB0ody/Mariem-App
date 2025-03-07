# 💖 Mariem's Islamic Kids TV 💖

<div align="center">
  <img src="first-app/icon.svg" alt="Mariem's Islamic Kids TV Logo" width="200"/>
  <br>
  <h3>A kid-friendly Islamic content app designed for toddlers</h3>
  <p>Built with WebOS TV for LG Smart TVs</p>
  
  ![License](https://img.shields.io/badge/license-Apache--2.0-blue)
  ![Platform](https://img.shields.io/badge/platform-WebOS%20TV-brightgreen)
  ![Version](https://img.shields.io/badge/version-1.0.0-pink)
</div>

## ✨ Features

- 🌙 **Islamic Content**: Curated collection of Islamic videos for young children
- 🔤 **Bilingual Support**: Full English and Arabic language support
- 📱 **TV Remote Friendly**: Optimized for navigation with a TV remote control
- 👶 **Toddler-Friendly UI**: Large buttons, clear visuals, and intuitive navigation
- 💕 **Personalized Experience**: Designed specifically for toddlers like Mariem
- 🎬 **Categorized Content**: Organized into easy-to-navigate categories
- 🔍 **YouTube Integration**: Fetches content from YouTube with safe filters
- 💾 **Caching**: Reduces API usage and improves performance

## 📋 Content Categories

- 🏠 **Home**: Featured and recommended videos
- 💕 **Pink Islamic Songs**: Islamic songs with a pink theme
- 🎵 **Arabic Nursery Rhymes**: Fun nursery rhymes in Arabic
- 📖 **Simple Quran**: Easy-to-understand Quran recitations for kids
- 🔤 **Arabic Alphabet**: Learn the Arabic alphabet through videos
- 🎬 **Islamic Cartoons**: Kid-friendly Islamic cartoon content
- 🐘 **Arabic Animals**: Learn about animals in Arabic

## 🖥️ Screenshots

<div align="center">
  <p><i>Screenshots will be added here</i></p>
</div>

## 🚀 Installation

### Prerequisites

- LG WebOS TV (compatible with WebOS 3.0 and above)
- WebOS TV SDK and CLI tools (for development)

### Developer Installation

1. **Enable Developer Mode on your TV**:
   ```
   Settings > General > About This TV > Click "webOS TV Version" 5 times
   ```

2. **Set up Developer Mode**:
   - Open the Developer Mode app
   - Accept terms and create a PIN
   - Note your TV's IP address

3. **Install WebOS CLI tools on your computer**:
   ```bash
   npm install -g @webosose/ares-cli
   ```

4. **Connect to your TV**:
   ```bash
   ares-setup-device --add myTV <TV_IP_ADDRESS>
   ```

5. **Package and install the app**:
   ```bash
   ares-package ./first-app
   ares-install --device myTV com.mariem.islamickidstv_1.0.0_all.ipk
   ares-launch --device myTV com.mariem.islamickidstv
   ```

### USB Installation

1. Package the app as described above
2. Copy the IPK file to a USB drive
3. On your TV, install the Developer Mode app
4. Insert the USB drive into your TV
5. In the Developer Mode app, select "Install apps from USB storage"
6. Select your IPK file to install

## 🛠️ Development

### Project Structure

```
first-app/
├── appinfo.json        # WebOS app manifest
├── icon.png            # App icon
├── index.html          # Main HTML file
├── scripts.js          # Application logic
├── splash.png          # Splash screen
├── styles.css          # Styling
└── webOSTVjs-1.2.10/   # WebOS TV JavaScript library
```

### Key Technologies

- **WebOS TV SDK**: For LG Smart TV compatibility
- **YouTube Data API**: For fetching video content
- **HTML5/CSS3/JavaScript**: Core web technologies
- **Cairo Font**: Beautiful bilingual typography

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## 💕 Acknowledgements

- Special thanks to Mariem for being the inspiration behind this app
- LG Electronics for the WebOS TV platform
- All the creators of Islamic children's content

---

<div align="center">
  <p>Made with 💖 for Mariem</p>
</div> 