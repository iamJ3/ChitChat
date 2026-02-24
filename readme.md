
https://github.com/user-attachments/assets/6f8366c5-1f3f-4ec9-9f01-2c78b485c9e2
<!--- ChitChat README -->

# ChitChat 🚀

![MERN](https://img.shields.io/badge/Stack-MERN-informational?style=flat&logo=mern)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-blue)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-teal)
![Zustand](https://img.shields.io/badge/State-Zustand-6fb0ff)
![License MIT](https://img.shields.io/badge/License-MIT-lightgrey)

## Short Description

ChitChat is a production-ready, full-stack real-time chat application built with the MERN stack, Socket.io for live messaging, Zustand for lightweight state management, and Tailwind CSS for UI. It provides authenticated real-time messaging, user profiles, and a modern developer experience. 💬

## Live Demo

[Live demo placeholder](Uploading chitchat2.mp4…) 

## Features

- Real-time messaging with Socket.io
- User authentication (signup / login)
- Persistent chat history (MongoDB)
- User profiles with avatar support
- Responsive UI built with Tailwind CSS
- Client state managed with Zustand
- Optimized for development and production builds

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB (Mongoose) |
| Storage | Cloudinary (optional for avatars) |
| Auth | JWT (JSON Web Tokens) |

## Architecture Overview

ChitChat follows a typical MERN architecture with a Socket.io layer for real-time events:

- Client (React + Zustand) connects to the server via HTTP for REST endpoints and a WebSocket connection (Socket.io) for live messaging.
- Server (Express) handles authentication, REST APIs for messages/users, and upgrades sockets for realtime events.
- MongoDB stores users and messages; optional Cloudinary stores user avatars.

## Installation Guide

Clone the repo and install dependencies for both server and client.

```bash
# Clone
git clone https://github.com/<your-username>/ChitChat.git
cd ChitChat

# Server
cd server
npm install

# Client
cd ../client
npm install
```

Run in development (two terminals):

```bash
# Terminal 1 -> server
cd server
npm run dev

# Terminal 2 -> client
cd client
npm run dev
```

Build for production:

```bash
# Server (example)
cd server
npm run build

# Client
cd client
npm run build
```

## Environment Variables

Create `.env` files for server and client as described below.

### Server (`server/.env`)

| Variable | Description | Example |
|---|---:|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs | `your_jwt_secret` |
| `CLOUDINARY_URL` | Cloudinary config (optional) | `cloudinary://...` |

### Client (`client/.env`) — optional

| Variable | Description | Example |
|---|---:|---|
| `VITE_API_BASE` | API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket server URL | `http://localhost:5000` |

Keep secrets out of version control and use environment-specific configurations for production.

## Usage Instructions

1. Start the server and client as shown in Installation Guide.
2. Open the client app in your browser (Vite will show URL, typically `http://localhost:5173`).
3. Sign up or log in, create or join chats, and message in real time.
4. Open multiple browser windows or different accounts to test live updates.

## 📸 Screenshots

### 🏠 Home Page
![Home Page](./screenshots/home.png)

### 💬 Chat Interface
![Chat Interface](./screenshots/chat.png)

### 👤 User Profile
![User Profile](./screenshots/profile.png)

## Folder Structure

```
ChitChat/
├─ client/                # React client (Vite)
│  ├─ public/
│  ├─ src/
│  └─ package.json
├─ server/                # Express + Socket.io server
│  ├─ src/
│  └─ package.json
├─ screenshots/           # Example screenshots used in README
└─ README.md
```

## API Overview

- `POST /api/auth/signup` — create a new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/messages/:chatId` — fetch messages for a chat
- `POST /api/messages` — send a message (also emitted via Socket.io)

Socket.io topics (examples): `connection`, `joinRoom`, `leaveRoom`, `newMessage`, `typing`

## Contributing Guidelines

- Fork the repository and create a feature branch: `git checkout -b feat/your-feature`
- Keep commits small and focused; follow conventional commit messages.
- Open a pull request describing the change and related issue.
- Run linters and tests before submitting a PR.

Consider opening issues for feature requests or bugs. Be respectful and follow a professional code of conduct.

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Author

- Jatin — https://github.com/your-username

---

If you'd like, replace placeholders (links, examples) with real values and add screenshots to `/screenshots/`.
# ChitChat

A modern chat application built with clean architecture and intuitive design.

## Features

- Real-time messaging
- User authentication
- Message history
- Responsive UI

## Installation

```bash
git clone https://github.com/yourusername/ChitChat.git
cd ChitChat
npm install
```

## Usage

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`

## Technologies

- Node.js
- Express
- React
- MongoDB

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue.

🌟 Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
🎃 Authentication && Authorization with JWT
👾 Real-time messaging with Socket.io
🚀 Online user status
👌 Global state management with Zustand
🐞 Error handling both on the server and on the client
⭐ At the end Deployment like a pro for FREE!
