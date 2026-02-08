// 1️⃣ Import io dynamically (ESM compatible)
const { io } = await import("socket.io-client");

// 2️⃣ Connect to your Socket.IO server on port 3000
const socket = io("http://localhost:3000");

// 3️⃣ Listen to a specific event
socket.on("tile-claimed", (data) => {
  console.log("🔥 tile claimed:", data);
});

// 4️⃣ Optional: log all events for debugging
socket.onAny((event, data) => {
  console.log("📡 Event:", event, "Data:", data);
});

// 5️⃣ Optional: emit an event to test the server
// socket.emit("claim-tile", { x: 1, y: 2 });

console.log("✅ Socket connected and listening on port 3000");
