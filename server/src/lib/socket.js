import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const normalize = (u) => (typeof u === "string" ? u.replace(/\/$/, "") : u);
const CLIENT = normalize(process.env.CLIENT_URL) || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow server-to-server or tools (no origin)
      if (!origin) return callback(null, true);
      const incoming = normalize(origin);
      if (incoming === CLIENT || incoming.endsWith(".vercel.app") || incoming === "http://localhost:5173") {
        return callback(null, true);
      }
      return callback(new Error("Socket CORS not allowed"));
    },
    credentials: true,
  },
});

// ---------------------------------------------------------------------------
// Event names (single source of truth; keep in sync with client socketEvents.js)
// ---------------------------------------------------------------------------
const EVENTS = {
  GET_ONLINE_USERS: "getOnlineUsers",
  NEW_MESSAGE: "newMessage",
};

// ---------------------------------------------------------------------------
// Multi-socket per user: userId -> Set<socketId>
// ---------------------------------------------------------------------------
/** @type {Record<string, Set<string>>} */
const userSocketMap = {};

function addUserSocket(userId, socketId) {
  const normalized = String(userId);
  if (!userSocketMap[normalized]) userSocketMap[normalized] = new Set();
  userSocketMap[normalized].add(socketId);
}

function removeUserSocket(userId, socketId) {
  const normalized = String(userId);
  if (!userSocketMap[normalized]) return;
  userSocketMap[normalized].delete(socketId);
  if (userSocketMap[normalized].size === 0) delete userSocketMap[normalized];
}

/**
 * Returns all socket IDs for a user (all tabs).
 * @param {string} userId
 * @returns {string[]}
 */
function getSocketIdsForUser(userId) {
  const normalized = String(userId);
  const set = userSocketMap[normalized];
  return set ? Array.from(set) : [];
}

function getOnlineUserIds() {
  return Object.keys(userSocketMap);
}

// ---------------------------------------------------------------------------
// Safe emit to user (all sockets for that user)
// ---------------------------------------------------------------------------
/**
 * Emit an event to all sockets belonging to a user (multi-tab safe).
 * @param {string} userId - Receiver user ID
 * @param {string} event - Event name
 * @param {unknown} payload - Payload (will be serialized)
 */
export function emitToUser(userId, event, payload) {
  const socketIds = getSocketIdsForUser(userId);
  if (socketIds.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Socket] emitToUser: no sockets for user", userId, event);
    }
    return;
  }
  for (const sid of socketIds) {
    io.to(sid).emit(event, payload);
  }
}

// Legacy export for any code that still expects a single socket id
export function getReceiverSocketId(userId) {
  const ids = getSocketIdsForUser(userId);
  return ids.length > 0 ? ids[0] : null;
}

// ---------------------------------------------------------------------------
// Connection lifecycle
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  if (!userId || String(userId).trim() === "") {
    console.warn("[Socket] connection without valid userId", socket.id);
    socket.disconnect(true);
    return;
  }

  const normalizedUserId = String(userId);
  addUserSocket(normalizedUserId, socket.id);

  io.emit(EVENTS.GET_ONLINE_USERS, getOnlineUserIds());

  socket.on("disconnect", (reason) => {
    removeUserSocket(normalizedUserId, socket.id);
    io.emit(EVENTS.GET_ONLINE_USERS, getOnlineUserIds());
  });
});

export { io, app, server };
