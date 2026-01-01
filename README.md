# Fastor - Restaurant Discovery & Image Sharing PWA

A modern Progressive Web Application (PWA) for discovering nearby restaurants and sharing customized restaurant images with the Fastor logo. Built with React, Vite, and Tailwind CSS.

## 🔗 Links

- **Live Demo**: [https://fastor-restaurants.vercel.app/login](https://fastor-restaurants.vercel.app/login)
- **GitHub Repository**: [https://github.com/anshultiwari95/fastor-restaurants](https://github.com/anshultiwari95/fastor-restaurants)

## 🚀 Features

### Authentication
- **Mobile Number Login**: Enter a 10-digit mobile number to get started
- **OTP Verification**: Secure 6-digit OTP verification (hardcoded: `123456` for testing)
- **Protected Routes**: Authentication-based route protection

### Restaurant Discovery
- **Nearby Restaurants**: Browse a list of nearby restaurants fetched from REST API
- **Restaurant Cards**: Beautiful cards displaying restaurant information, images, and addresses
- **Responsive Design**: Modern, clean UI with smooth animations and transitions

### Image Superimposing & Sharing
- **Logo Overlay**: Superimpose Fastor logo on restaurant images
- **Interactive Logo**: 
  - **Drag & Drop**: Click and drag the logo to reposition it anywhere on the image
  - **Resize**: Scroll over the logo to resize it (60px - 250px range)
  - **Visual Feedback**: Hover effects, borders, and corner indicators
- **PWA Sharing**: Share the customized image directly from the browser to any application
- **Download Fallback**: Automatic download if Web Share API is not available

### UI/UX Enhancements
- **Urbanist Font**: Modern typography throughout the application
- **Status Bar**: Dynamic time display and notification bar on all pages
- **Sticky Location Bar**: "Pre Order From" section with bulging shadow effect
- **Promotional Banner**: Horizontally scrollable banner with dot indicators
- **Smooth Animations**: Hover effects, transitions, zoom effects, and smooth interactions
- **Responsive Layout**: Optimized for various screen sizes

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurantproject
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
restaurantproject/
├── public/
│   ├── fastor-logo.svg          # Fastor logo for superimposing
│   └── notificationbar.svg      # Status bar SVG
├── src/
│   ├── api/
│   │   ├── auth.js              # Authentication API calls
│   │   └── restaurant.js        # Restaurant API calls
│   ├── auth/
│   │   └── AuthContext.jsx      # Authentication context provider
│   ├── components/
│   │   ├── ImageStage.jsx       # Canvas component for image manipulation
│   │   └── StatusBar.jsx        # Status bar component
│   ├── pages/
│   │   ├── Login.jsx            # Mobile number login page
│   │   ├── Otp.jsx              # OTP verification page
│   │   ├── Home.jsx             # Restaurant listing page
│   │   └── RestaurantDetail.jsx # Restaurant detail & image sharing
│   ├── routes/
│   │   └── ProtectedRoute.jsx   # Route protection component
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind imports
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- **Register**: `POST https://staging.fastor.ai/v1/pwa/user/register`
- **Login**: `POST https://staging.fastor.ai/v1/pwa/user/login`

### Restaurants
- **Get Restaurants**: `GET https://staging.fastor.ai/v1/m/restaurant?city_id=118`
  - Requires: `Authorization` header with Bearer token

## 🎨 Key Technologies

- **React 19**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **HTML5 Canvas API**: Native canvas for image manipulation
- **Web Share API**: PWA sharing functionality

## 🎯 Usage

### Login Flow
1. Enter your 10-digit mobile number on the login page
2. Click "Send OTP"
3. Enter the OTP (use `123456` for testing)
4. You'll be redirected to the home page

### Restaurant Discovery
1. Browse the list of nearby restaurants on the home page
2. Click on any restaurant card to view details

### Image Customization & Sharing
1. On the restaurant detail page, you'll see the restaurant image with the Fastor logo
2. **To Reposition Logo**: Click and drag the logo to any position on the image
3. **To Resize Logo**: Hover over the logo and scroll with your mouse wheel
4. Click "Share Image" to share the customized image via Web Share API or download it

## 🎨 Design Specifications

- **Primary Button Color**: `#FF6D6A`
- **Font**: Urbanist (from Google Fonts)
- **Status Bar**: White background with dynamic time
- **Location Section**: Sticky with bulging shadow effect
- **Action Buttons**: Rounded corners (`rounded-2xl`)
- **Promotional Banner**: Horizontal scroll with snap points and dot indicators

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📱 PWA Features

The application supports Progressive Web App features:
- **Web Share API**: Share images directly from the browser
- **Responsive Design**: Works on mobile and desktop
- **Offline Capability**: Can be installed as a PWA (with service worker setup)

## 🐛 Known Issues & Notes

- OTP is hardcoded to `123456` for testing purposes
- Restaurant images use Unsplash fallback images if API images fail to load
- Canvas uses native HTML5 Canvas API (no external libraries for image manipulation)
- Logo repositioning works with both mouse and touch events

## 📝 License

This project is private and proprietary.

## 👨‍💻 Development Notes

- The logo repositioning feature uses native Canvas API with custom drag-and-drop implementation
- High DPI displays are handled with device pixel ratio scaling
- Image loading includes comprehensive error handling with fallback images
- All interactive elements have smooth transitions and hover effects for better UX

---

Built with ❤️ for Fastor
