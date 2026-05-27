import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Configure Socket.io with CORS enabled for local development
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve client build files if they exist, otherwise serve src directory for dev/fallback
const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

app.use(express.static(distPath));
app.use('/src', express.static(srcPath));

// Fallback to index.html for single page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // If build files don't exist, serve src index.html
      res.sendFile(path.join(srcPath, 'index.html'));
    }
  });
});

// Matchmaking and Room State
const rooms = new Map(); // roomId -> { id, players: [{id, name, ready, weapon}], status: 'lobby'|'playing' }

// Helper to generate a room ID
function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Readable chars (no O/0/I/1)
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  let currentRoomId = null;

  // 1. Create a custom room
  socket.on('create-room', ({ playerName }) => {
    let roomId = generateRoomId();
    while (rooms.has(roomId)) {
      roomId = generateRoomId();
    }

    const room = {
      id: roomId,
      players: [{
        id: socket.id,
        name: playerName || 'Player 1',
        ready: false,
        weapon: 'pistol'
      }],
      status: 'lobby'
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoomId = roomId;

    socket.emit('room-created', { roomId, players: room.players });
    console.log(`Room created: ${roomId} by player: ${playerName} (${socket.id})`);
  });

  // 2. Join a room via code
  socket.on('join-room', ({ roomId, playerName }) => {
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = rooms.get(cleanRoomId);

    if (!room) {
      socket.emit('room-error', 'Room not found.');
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('room-error', 'Room is full.');
      return;
    }

    // Add player
    const newPlayer = {
      id: socket.id,
      name: playerName || 'Player 2',
      ready: false,
      weapon: 'pistol'
    };
    room.players.push(newPlayer);
    
    socket.join(cleanRoomId);
    currentRoomId = cleanRoomId;

    socket.emit('room-joined', { roomId: cleanRoomId, players: room.players });
    socket.to(cleanRoomId).emit('player-joined', { players: room.players });
    console.log(`Player ${playerName} (${socket.id}) joined room: ${cleanRoomId}`);
  });

  // 3. Auto-matchmaking
  socket.on('auto-match', ({ playerName }) => {
    // Find a room with 1 player in lobby status
    let targetRoom = null;
    for (const [id, room] of rooms.entries()) {
      if (room.status === 'lobby' && room.players.length === 1) {
        targetRoom = room;
        break;
      }
    }

    if (targetRoom) {
      // Join it
      const newPlayer = {
        id: socket.id,
        name: playerName || 'Player 2',
        ready: false,
        weapon: 'pistol'
      };
      targetRoom.players.push(newPlayer);
      socket.join(targetRoom.id);
      currentRoomId = targetRoom.id;

      socket.emit('room-joined', { roomId: targetRoom.id, players: targetRoom.players });
      socket.to(targetRoom.id).emit('player-joined', { players: targetRoom.players });
      console.log(`Auto-matched Player ${playerName} into room: ${targetRoom.id}`);
    } else {
      // Create a room
      let roomId = generateRoomId();
      while (rooms.has(roomId)) {
        roomId = generateRoomId();
      }

      const room = {
        id: roomId,
        players: [{
          id: socket.id,
          name: playerName || 'Player 1',
          ready: false,
          weapon: 'pistol'
        }],
        status: 'lobby'
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      currentRoomId = roomId;

      socket.emit('room-created', { roomId, players: room.players, autoMatch: true });
      console.log(`Auto-match created room: ${roomId} for player: ${playerName}`);
    }
  });

  // 4. Update Weapon selection
  socket.on('select-weapon', ({ weapon }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.weapon = weapon;
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });

  // 5. Ready state toggle
  socket.on('player-ready', ({ ready }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = ready;
      io.to(currentRoomId).emit('players-update', { players: room.players });

      // Start match if all players are ready and we have 2 players
      const allReady = room.players.every(p => p.ready) && room.players.length === 2;
      if (allReady) {
        room.status = 'playing';
        io.to(currentRoomId).emit('match-start', {
          players: room.players,
          seed: Math.random() // synchronized seed for map spawns / layouts
        });
        console.log(`Match started in room: ${currentRoomId}`);
      }
    }
  });

  // 6. In-game: Relay Player State (60hz updates)
  socket.on('player-state', (state) => {
    if (!currentRoomId) return;
    // Broadcast directly to other socket in room to minimize latency
    socket.to(currentRoomId).emit('opponent-state', state);
  });

  // 7. In-game: Relay Shooting Action
  socket.on('shoot', (shootData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-shoot', shootData);
  });

  // 8. In-game: Hit Event
  socket.on('hit', (hitData) => {
    if (!currentRoomId) return;
    // Forward the hit details to the opponent so they take damage
    socket.to(currentRoomId).emit('damage-taken', hitData);
  });

  // 9. In-game: Health Sync
  socket.on('sync-health', (healthData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-health-sync', healthData);
  });

  // 10. In-game: Player Died
  socket.on('player-died', (deathData) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (room) {
      room.status = 'lobby';
      // Reset ready states for next round
      room.players.forEach(p => p.ready = false);
      io.to(currentRoomId).emit('match-over', deathData);
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });

  // 11. In-game: Break Crate
  socket.on('break-crate', (crateData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-break-crate', crateData);
  });

  // 12. In-game: Pickup Item
  socket.on('pickup-item', (pickupData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-pickup-item', pickupData);
  });

  // 13. Text Chat
  socket.on('chat-message', (msg) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-chat', msg);
  });

  // 14. Leave Room
  socket.on('leave-room', () => {
    if (currentRoomId) {
      handleRoomLeave(socket, currentRoomId);
      currentRoomId = null;
    }
  });

  // 15. Disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (currentRoomId) {
      handleRoomLeave(socket, currentRoomId);
    }
  });
});

function handleRoomLeave(socket, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  // Remove player from room list
  room.players = room.players.filter(p => p.id !== socket.id);
  socket.leave(roomId);

  if (room.players.length === 0) {
    rooms.delete(roomId);
    console.log(`Room: ${roomId} deleted (empty)`);
  } else {
    // Notify remaining player
    room.status = 'lobby';
    room.players.forEach(p => p.ready = false); // reset ready
    io.to(roomId).emit('player-left', {
      players: room.players,
      message: 'Opponent disconnected. Returned to lobby.'
    });
    console.log(`Player left room: ${roomId}. 1 player remaining.`);
  }
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
