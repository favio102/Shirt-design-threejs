# 3D T-Shirt Design Customizer

> **Create unique, personalized 3D t-shirt designs with AI-powered image generation**

A modern, interactive web application that allows users to customize t-shirt designs in real-time using 3D visualization. Built with React Three Fiber for stunning 3D rendering and integrated with OpenAI's DALL-E API for AI-generated designs.

## ✨ Key Features

- **3D Visualization**: Interactive 3D t-shirt model rendered with Three.js and React Three Fiber
- **Real-time Color Customization**: Choose from unlimited color options with an intuitive color picker
- **AI-Powered Design Generation**: Generate unique designs using OpenAI's DALL-E API
- **Custom Logo Upload**: Upload your own images to use as logos or full designs
- **Multiple Design Modes**:
  - Logo placement (small decal on the chest)
  - Full t-shirt texture (pattern covers the entire shirt)
- **Download Designs**: Export your customized t-shirt as an image
- **Smooth Animations**: Beautiful transitions powered by Framer Motion
- **Responsive Design**: Works seamlessly across different screen sizes

## 🛠️ Tech Stack

### Client (Frontend)
- **Language**: JavaScript (ES6+)
- **Framework**: React ^18.2.0
- **Build Tool**: Vite ^5.2.0
- **3D Graphics**: 
  - Three.js ^0.163.0
  - @react-three/fiber ^8.16.1
  - @react-three/drei ^9.105.1
- **State Management**: Valtio ^1.13.2
- **Styling**: 
  - Tailwind CSS ^3.4.3
  - PostCSS ^8.4.38
  - Autoprefixer ^10.4.19
- **UI Components**:
  - react-color ^2.19.3 (color picker)
  - Framer Motion ^11.0.25 (animations)
- **Utilities**: maath ^0.10.7 (math utilities for 3D)
- **Linting**: ESLint ^8.57.0

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express ^4.19.2
- **AI Integration**: OpenAI API ^4.33.1
- **Cloud Services**: Cloudinary ^2.1.0
- **Database**: Mongoose ^8.3.1
- **Environment Management**: dotenv ^16.4.5
- **CORS**: cors ^2.8.5
- **Auto-restart**: nodemon ^3.1.0

## 📁 Project Structure

```
Shirt-design-threejs/
├── client/                    # Frontend application
│   ├── public/               # Static assets (3D models, images)
│   ├── src/
│   │   ├── assets/          # UI assets (icons, images)
│   │   ├── canvas/          # Three.js 3D components
│   │   │   ├── Backdrop.jsx      # Scene backdrop
│   │   │   ├── CameraRig.jsx     # Camera controls
│   │   │   ├── Shirt.jsx         # 3D shirt model
│   │   │   └── index.jsx         # Canvas setup
│   │   ├── components/      # Reusable UI components
│   │   │   ├── AIPicker.jsx      # AI prompt interface
│   │   │   ├── ColorPicker.jsx   # Color selection
│   │   │   ├── CustomButton.jsx  # Button component
│   │   │   ├── FilePicker.jsx    # File upload interface
│   │   │   └── Tab.jsx           # Tab component
│   │   ├── config/          # Configuration files
│   │   │   ├── config.js         # Environment configs
│   │   │   ├── constants.js      # App constants
│   │   │   ├── helpers.js        # Helper functions
│   │   │   └── motion.js         # Animation configs
│   │   ├── pages/           # Main page components
│   │   │   ├── Customizer.jsx    # Customization interface
│   │   │   └── Home.jsx          # Landing page
│   │   ├── store/           # State management
│   │   │   └── index.js          # Valtio state store
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # App entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── postcss.config.js    # PostCSS config
├── server/                   # Backend application
│   ├── routes/
│   │   └── dalle.routes.js  # DALL-E API routes
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
└── .gitignore               # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/)

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/favio102/Shirt-design-threejs.git
   cd Shirt-design-threejs
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ../server
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

## 💻 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   The server will start on `http://localhost:8080`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The application will open at `http://localhost:5173`

### Production Build

1. **Build the client application**
   ```bash
   cd client
   npm run build
   ```
   This creates an optimized production build in the `dist` folder.

2. **Preview the production build**
   ```bash
   npm run preview
   ```

### Usage Examples

#### Customize T-Shirt Color
1. Click "Customize it" on the home page
2. Click the color picker icon (paint swatch)
3. Select your desired color from the picker
4. Watch the t-shirt color change in real-time

#### Upload Custom Design
1. Enter customization mode
2. Click the file picker icon
3. Upload an image file (PNG, JPG, etc.)
4. Choose "Logo" for a small chest logo or "Full" for an all-over design

#### Generate AI Design
1. Enter customization mode
2. Click the AI picker icon (sparkle/star)
3. Enter a text prompt (e.g., "a futuristic geometric pattern")
4. Click "AI Logo" or "AI Full" to generate the design
5. Wait for the AI to generate your unique design

#### Download Your Design
1. After customizing your t-shirt
2. Click the download icon at the bottom
3. Your design will be saved as a PNG image

## 🔌 API Documentation

### Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://devswag.onrender.com/api/v1`

### Endpoints

#### Generate AI Image

**Endpoint**: `POST /dalle`

**Description**: Generates an image using OpenAI's DALL-E API based on a text prompt.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "prompt": "a colorful abstract pattern with geometric shapes"
}
```

**Response** (Success - 200):
```json
{
  "photo": "base64_encoded_image_string"
}
```

**Response** (Error - 500):
```json
{
  "message": "Something went wrong"
}
```

**Example using cURL**:
```bash
curl -X POST http://localhost:8080/api/v1/dalle \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a vibrant sunset over mountains"}'
```

**Example using JavaScript fetch**:
```javascript
const response = await fetch('http://localhost:8080/api/v1/dalle', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'a vibrant sunset over mountains'
  })
});
const data = await response.json();
const imageUrl = `data:image/png;base64,${data.photo}`;
```

#### Health Check

**Endpoint**: `GET /`

**Description**: Simple health check endpoint.

**Response** (200):
```json
{
  "message": "Hello from DALLE"
}
```

## ⚙️ Configuration

### Client Configuration

**Backend URL** (`client/src/config/config.js`):
- `development.backendUrl`: Backend API URL for development (default: `http://localhost:8080/api/v1/dalle`)
- `production.backendUrl`: Backend API URL for production

**Default State** (`client/src/store/index.js`):
- `color`: Default t-shirt color (hex value)
- `logoDecal`: Default logo image path
- `fullDecal`: Default full texture image path
- `isLogoTexture`: Enable/disable logo display
- `isFullTexture`: Enable/disable full texture display

### Server Configuration

**Port**: The server runs on port `8080` by default (configurable in `server/index.js`)

**CORS**: Enabled for all origins (for development)

**JSON Payload Limit**: 50MB (to handle base64 encoded images)

### OpenAI Configuration

The application uses OpenAI's DALL-E API with the following settings:
- **Model**: DALL-E (via OpenAI API)
- **Image Size**: 1024x1024 pixels
- **Response Format**: base64_json
- **Number of Images**: 1 per request

## 🤝 Contributing

We welcome contributions to improve this project! Here's how you can help:

1. **Open an Issue or Feature Request**
   - Before starting work, create an issue to discuss your proposed changes
   - Describe the bug you're fixing or the feature you're adding
   - Wait for feedback from maintainers

2. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/Shirt-design-threejs.git
     ```

3. **Add Fixes or Features**
   - Create a new branch for your work:
     ```bash
     git checkout -b feature/your-feature-name
     ```
   - Make your changes following the existing code style
   - Test your changes thoroughly
   - Commit your changes with clear, descriptive messages:
     ```bash
     git commit -m "Add feature: description of your changes"
     ```

4. **Make a Pull Request (PR)**
   - Push your changes to your fork:
     ```bash
     git push origin feature/your-feature-name
     ```
   - Open a Pull Request from your fork to the main repository
   - Provide a clear description of your changes
   - Link any related issues
   - Wait for review and address any feedback

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, self-documenting code
- Test your changes before submitting
- Update documentation if needed
- Keep pull requests focused on a single feature or fix

## 📄 License

This project is open source and available for educational and commercial use.

## 🙏 Acknowledgments

- Three.js and React Three Fiber for 3D rendering capabilities
- OpenAI for the DALL-E API
- The React and Vite communities for excellent tooling
- All contributors who help improve this project

## 📧 Contact

For questions, suggestions, or issues, please open an issue on the [GitHub repository](https://github.com/favio102/Shirt-design-threejs/issues).

---

Made with ❤️ using React, Three.js, and AI
