# Twibbon Maker - BEM Unsoed 2026

High-performance Twibbon Maker web app built with Vite, React.js, Tailwind CSS, and Fabric.js.

## 🚀 Features

- **Client-side Image Processing**: All image manipulation (drag, zoom, rotate, merge) happens in the browser using Fabric.js
- **Zero Server Load**: User photos are never uploaded to any server
- **Responsive Design**: Fully optimized for mobile browsers
- **Modern UI/UX**: Sleek interface with custom color palette
- **1080x1350 Output**: High-quality vertical format export resolution (perfect for Instagram Stories)

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

## 📦 Production Build

```bash
npm run build
```

## 📁 Project Structure

```
├── public/
│   └── twibbons/           # Place your twibbon PNG files here
│       ├── twibbon-1.png   # 1080x1350 PNG with transparency
│       ├── twibbon-2.png
│       ├── twibbon-3.png
│       └── twibbon-4.png
├── src/
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind + custom styles
├── index.html              # Vite entry HTML
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── package.json
```

## 🎨 Color Palette

| Type | Gradient | Usage |
|------|----------|-------|
| Primary | `#212A47` → `#5066AD` | Background (60%) |
| Secondary | `#872B2E` → `#A64F52` | Buttons (30%) |
| Highlights | `#D79146` → `#EEC69B` | Accents (10%) |

## 📸 Adding Twibbons

1. Create your twibbon PNG files at **1080x1350 pixels** with transparent backgrounds
2. Place them in `public/twibbons/` folder
3. Update the `TWIBBONS_DATA` array in `src/App.jsx`:

```javascript
const TWIBBONS_DATA = [
  {
    id: 1,
    title: 'Your Twibbon Title',
    image_url: '/twibbons/your-twibbon.png'
  },
  // Add more twibbons...
]
```

## 📱 Mobile Optimization

- Touch-friendly controls with large tap targets
- Drag support on canvas
- Responsive layout adapts to all screen sizes
- Slider controls for precise adjustments

## 🔧 Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **Fabric.js** - Canvas manipulation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📄 License

© 2026 BEM Unsoed. All rights reserved.
