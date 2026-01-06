# 🎰 Casino Bingo Game

A real-time bingo game for casino promotions featuring a display screen and admin control panel.

![Bingo Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)

## ✨ Features

- **Real-time Updates**: Instant synchronization between admin and display using WebSockets
- **Configurable Boards**: Choose 1-4 boards with sizes from 3x3 to 10x10
- **Auto Win Detection**: Automatically detects winning boards (rows, columns, diagonals)
- **Winner Celebration**: Animated "WINNER!" overlay on winning boards
- **Called Numbers Display**: Visual grid showing all called numbers
- **Undo Functionality**: Remove the last called number
- **Full-screen Optimized**: Designed for TV/monitor displays
- **Animated Stamps**: Colorful animations when numbers are marked

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#007dba` | Primary accent, borders |
| Maroon | `#6d332f` | Secondary accent, stamps |
| Charcoal | `#212322` | Backgrounds |

## 📁 Project Structure

```
BingoGame/
├── server.js              # Node.js + Express + Socket.io server
├── package.json           # Dependencies and scripts
├── README.md              # This file
└── public/
    ├── display.html       # Display screen (for TV/monitor)
    ├── admin.html         # Admin control panel
    ├── css/
    │   └── styles.css     # All styling and animations
    └── js/
        ├── display.js     # Display page logic
        └── admin.js       # Admin control logic
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BingoGame.git
   cd BingoGame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Display: http://localhost:3000/display.html
   - Admin: http://localhost:3000/admin.html

## 🌐 Deployment to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Casino Bingo Game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/BingoGame.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `casino-bingo` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**

### Step 3: Access Your Game

Once deployed, Render will provide a URL like:
- Display: `https://casino-bingo.onrender.com/display.html`
- Admin: `https://casino-bingo.onrender.com/admin.html`

## 📖 How to Use

### For Operators

1. **Open Admin Panel** on your device (phone, tablet, or computer)
2. **Configure Game Settings**:
   - Select number of boards (1-4)
   - Select board size (3x3 to 10x10)
   - Click "NEW GAME" to generate fresh boards
3. **Open Display** on the main screen/TV
4. **Call Numbers**:
   - Enter a number in the input field
   - Press Enter or click "CALL"
   - The display updates instantly
5. **Undo if needed**: Click "UNDO LAST" to remove the last called number
6. **Winner detected**: When a board wins, a "WINNER!" overlay appears

### Keyboard Shortcuts (Admin)

| Shortcut | Action |
|----------|--------|
| `Enter` | Call the entered number |
| `Ctrl+Z` | Undo last number |
| `Escape` | Close confirmation modal |

## 🔧 Configuration Options

### Board Count
- 1 Board: Single board display
- 2 Boards: Side-by-side boards (default)
- 3-4 Boards: Multiple boards layout

### Board Size
- **3x3**: Quick games (9 cells)
- **4x4**: Fast games (16 cells)
- **5x5**: Standard bingo (25 cells, center FREE space)
- **6x6 to 10x10**: Extended games (36-100 cells)

## 🛠️ Technical Details

- **Backend**: Node.js + Express
- **Real-time**: Socket.io for WebSocket communication
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Fonts**: Russo One (display), Oswald (body)
- **Responsive**: Works on all screen sizes

## 📝 License

MIT License - Feel free to use for your casino promotions!

---

Made with ❤️ for casino entertainment

