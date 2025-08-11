# Real-Time Chat App

A modern real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io for real-time messaging.

## Features

✅ **User Authentication**: Complete signup/signin system with JWT authentication
✅ **Profile Management**: User profiles with image upload and customization
✅ **Real-Time Messaging**: Instant messaging using Socket.io
✅ **Contact Search**: Search and add new contacts
✅ **Message History**: Persistent chat history stored in MongoDB
✅ **Modern UI**: Beautiful interface built with React, Tailwind CSS, and Radix UI
✅ **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **Socket.io Client** for real-time communication
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/chwaleed/Real-Time-Chat-App.git
cd Real-Time-Chat-App
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=4000
DATABASE_URL=mongodb://localhost:27017/chatapp
ORIGIN=http://localhost:5173
JWT_KEY=your_super_secret_jwt_key_here
```

**For MongoDB Atlas (cloud database):**
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/chatapp
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

The frontend environment is already configured in `.env`:
```env
VITE_SERVER_URL="http://localhost:4000"
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development with auto-restart:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Profile Setup**: Add your name, choose an avatar color, and optionally upload a profile picture
3. **Find Contacts**: Use the search feature to find other users by name or email
4. **Start Chatting**: Click on a contact to start a conversation
5. **Real-Time Messaging**: Send messages instantly with real-time delivery
6. **Emoji Support**: Use the emoji picker to add emojis to your messages

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/user-info` - Get user information
- `POST /api/auth/update-profile` - Update user profile
- `POST /api/auth/add-profile-image` - Upload profile image
- `DELETE /api/auth/remove-profile-image` - Remove profile image
- `POST /api/auth/logout` - User logout

### Contacts
- `POST /api/contacts/search` - Search for contacts
- `GET /api/contacts/get-contacts-for-dm` - Get user's contact list

### Messages
- `POST /api/messages/get-messages` - Get conversation history

## Socket.io Events

### Client to Server
- `sendMessage` - Send a new message

### Server to Client
- `receiveMessage` - Receive a new message

## Project Structure

```
Real-Time-Chat-App/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads directory
│   ├── socket.js        # Socket.io configuration
│   └── index.js         # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   ├── store/       # Zustand state management
│   │   ├── utils/       # Utility functions
│   │   └── context/     # React contexts
│   └── public/          # Static assets
└── README.md
```

## Features Completed

- ✅ Complete authentication system
- ✅ User profile management with image upload
- ✅ Real-time messaging with Socket.io
- ✅ Contact search and management
- ✅ Message history retrieval
- ✅ Modern, responsive UI
- ✅ Emoji picker integration
- ✅ Message timestamps and formatting

## Future Enhancements

- 📎 File sharing and image attachments
- 🔔 Push notifications
- 👥 Group chat functionality
- 🌙 Dark/light theme toggle
- 📱 Mobile app with React Native
- 🔍 Message search functionality
- ⚡ Message status indicators (sent, delivered, read)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).