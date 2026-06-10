import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory Users database and persistent file storage
let users = {};
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(data || '{}');
      console.log(`Loaded ${Object.keys(users).length} registered operatives.`);
    } else {
      users = {};
      fs.writeFileSync(USERS_FILE, '{}', 'utf8');
    }
  } catch (e) {
    console.error("Failed to load users database:", e);
    users = {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to save users database:", e);
  }
}

loadUsers();

// Socket session registry mapping socket ID to authenticated user key
const socketToUser = new Map();

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

function broadcastPlayerCounts() {
  let quickplay = 0;
  let ranked_realistic = 0;
  let ranked_competitive = 0;

  for (const room of rooms.values()) {
    const count = room.players.length;
    if (room.isRanked) {
      if (room.mode && room.mode.includes('realistic')) {
        ranked_realistic += count;
      } else if (room.mode && room.mode.includes('competitive')) {
        ranked_competitive += count;
      } else {
        ranked_realistic += count;
      }
    } else {
      quickplay += count;
    }
  }

  const totalOnline = io.engine.clientsCount;

  io.emit('player-counts', {
    total: totalOnline,
    quickplay,
    ranked_realistic,
    ranked_competitive
  });
}

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
  broadcastPlayerCounts();

  // 0. Authentication Events
  socket.on('register', ({ username, password }) => {
    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 15) {
      socket.emit('register-response', { success: false, error: 'Invalid codename length (3-15 chars).' });
      return;
    }
    
    // Check characters (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      socket.emit('register-response', { success: false, error: 'Codename must contain only letters, numbers, and underscores.' });
      return;
    }

    const lowerName = cleanUsername.toLowerCase();
    if (users[lowerName]) {
      socket.emit('register-response', { success: false, error: 'Codename already registered.' });
      return;
    }

    users[lowerName] = {
      username: cleanUsername,
      password: password, // client sends hashed password
      stats: { wins: 0, rounds: 0, hits: 0, shots: 0 }
    };
    saveUsers();
    socket.emit('register-response', { success: true });
    console.log(`Registered new operative: ${cleanUsername}`);
  });

  socket.on('login', ({ username, password }) => {
    const cleanUsername = username.trim();
    const lowerName = cleanUsername.toLowerCase();
    const user = users[lowerName];
    if (!user || user.password !== password) {
      socket.emit('login-response', { success: false, error: 'Invalid Codename or Secure Passkey.' });
      return;
    }
    
    // Bind socket session to user record
    socketToUser.set(socket.id, lowerName);
    socket.emit('login-response', { 
      success: true, 
      username: user.username,
      stats: user.stats
    });
    console.log(`Operative logged in: ${user.username} (${socket.id})`);
  });

  socket.on('match-stats', ({ isWin, rounds, shots, hits }) => {
    const userKey = socketToUser.get(socket.id);
    if (userKey && users[userKey]) {
      const user = users[userKey];
      if (isWin) user.stats.wins++;
      user.stats.rounds += rounds;
      user.stats.shots += shots;
      user.stats.hits += hits;
      saveUsers();
      socket.emit('stats-updated', { stats: user.stats });
      console.log(`Updated stats for ${user.username}: wins=${user.stats.wins}, rounds=${user.stats.rounds}`);
    }
  });

  // 1. Create a custom room
  socket.on('create-room', ({ playerName, mode, color, mapId, weapon, renderStyle }) => {
    let roomId = generateRoomId();
    while (rooms.has(roomId)) {
      roomId = generateRoomId();
    }

    const roomMode = (mode === '2v2') ? '2v2' : '1v1';
    const room = {
      id: roomId,
      mode: roomMode,
      isRanked: false, // Custom rooms are never ranked
      mapId: mapId || 'manor',
      renderStyle: renderStyle || 'realistic',
      players: [{
        id: socket.id,
        name: playerName || 'Player 1',
        ready: false,
        weapon: weapon || 'pistol',
        color: color || 'cyan',
        rp: 0
      }],
      status: 'lobby',
      score1: 0,
      score2: 0,
      roundNumber: 1
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoomId = roomId;

    socket.emit('room-created', { roomId, players: room.players, mode: roomMode, mapId: room.mapId, renderStyle: room.renderStyle });
    console.log(`Room created: ${roomId} (${roomMode}, Map: ${room.mapId}, Style: ${room.renderStyle}) by player: ${playerName} (${socket.id})`);
    broadcastPlayerCounts();
  });

  // 1.1 Select map (Quick Play Custom Lobby)
  socket.on('select-map', ({ mapId }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    // Check if sender is admin/host
    if (room.players[0] && room.players[0].id === socket.id) {
      room.mapId = mapId;
      io.to(currentRoomId).emit('lobby-map-update', { mapId });
      console.log(`[Server] Map updated to ${mapId} in room: ${currentRoomId}`);
    }
  });

  // 1.2 Select game mode (custom lobby)
  socket.on('select-game-mode', ({ mode }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    if (room.players[0] && room.players[0].id === socket.id) {
      room.mode = mode;
      io.to(currentRoomId).emit('lobby-mode-update', { mode });
      console.log(`[Server] Game mode updated to ${mode} in room: ${currentRoomId}`);
    }
  });

  // 1.3 Select render style (custom lobby)
  socket.on('select-render-style', ({ renderStyle }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    if (room.players[0] && room.players[0].id === socket.id) {
      room.renderStyle = renderStyle;
      io.to(currentRoomId).emit('lobby-style-update', { renderStyle });
      console.log(`[Server] Render style updated to ${renderStyle} in room: ${currentRoomId}`);
    }
  });

  socket.on('join-room', ({ roomId, playerName, color, weapon }) => {
    const cleanRoomId = roomId.trim().toUpperCase();
    const room = rooms.get(cleanRoomId);

    if (!room) {
      socket.emit('room-error', 'Room not found.');
      return;
    }

    const maxPlayers = (room.mode && room.mode.startsWith('2v2')) ? 4 : 2;
    if (room.players.length >= maxPlayers) {
      socket.emit('room-error', 'Room is full.');
      return;
    }

    // Add player
    const newPlayer = {
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      ready: false,
      weapon: weapon || 'pistol',
      color: color || 'cyan',
      rp: 0
    };
    room.players.push(newPlayer);
    
    socket.join(cleanRoomId);
    currentRoomId = cleanRoomId;

    socket.emit('room-joined', { roomId: cleanRoomId, players: room.players, mode: room.mode, mapId: room.mapId || 'manor', renderStyle: room.renderStyle || 'realistic' });
    socket.to(cleanRoomId).emit('player-joined', { players: room.players });
    console.log(`Player ${playerName} (${socket.id}) joined room: ${cleanRoomId}`);
    broadcastPlayerCounts();
  });

  // 3. Auto-matchmaking (Ranked)
  socket.on('auto-match', ({ playerName, mode, color, rp, rankStrict, weapon }) => {
    let searchMode = mode;
    if (!['1v1_realistic', '1v1_competitive', '2v2_realistic', '2v2_competitive'].includes(searchMode)) {
      searchMode = '1v1_realistic';
    }
    const maxPlayers = searchMode.startsWith('2v2') ? 4 : 2;
    const playerRP = typeof rp === 'number' ? rp : 0;
    
    // Find a room with space in lobby status and matching mode
    let targetRoom = null;
    for (const [id, room] of rooms.entries()) {
      if (room.status === 'lobby' && room.mode === searchMode && room.players.length < maxPlayers && room.isRanked) {
        if (!rankStrict) {
          targetRoom = room;
          break;
        } else {
          // Strict check: all players in room must be within 1000 RP of playerRP
          const withinBracket = room.players.every(p => Math.abs((p.rp || 0) - playerRP) <= 1000);
          if (withinBracket) {
            targetRoom = room;
            break;
          }
        }
      }
    }

    if (targetRoom) {
      // Join it
      const newPlayer = {
        id: socket.id,
        name: playerName || `Player ${targetRoom.players.length + 1}`,
        ready: false,
        weapon: weapon || 'pistol',
        color: color || 'cyan',
        rp: playerRP
      };
      targetRoom.players.push(newPlayer);
      socket.join(targetRoom.id);
      currentRoomId = targetRoom.id;

      socket.emit('room-joined', { roomId: targetRoom.id, players: targetRoom.players, mode: targetRoom.mode });
      socket.to(targetRoom.id).emit('player-joined', { players: targetRoom.players });
      console.log(`Auto-matched Player ${playerName} (RP: ${playerRP}) into room: ${targetRoom.id}`);
      broadcastPlayerCounts();
    } else {
      // Create a room
      let roomId = generateRoomId();
      while (rooms.has(roomId)) {
        roomId = generateRoomId();
      }

      const room = {
        id: roomId,
        mode: searchMode,
        isRanked: true, // Lobbies created via matchmaking are ranked
        players: [{
          id: socket.id,
          name: playerName || 'Player 1',
          ready: false,
          weapon: weapon || 'pistol',
          color: color || 'cyan',
          rp: playerRP
        }],
        status: 'lobby',
        score1: 0,
        score2: 0,
        roundNumber: 1
      };

      rooms.set(roomId, room);
      socket.join(roomId);
      currentRoomId = roomId;

      socket.emit('room-created', { roomId, players: room.players, autoMatch: true, mode: searchMode });
      console.log(`Auto-match created room: ${roomId} (${searchMode}) for player: ${playerName} (RP: ${playerRP})`);
      broadcastPlayerCounts();
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

  // 4.1 Update Color selection
  socket.on('select-color', ({ color }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.color = color;
      io.to(currentRoomId).emit('players-update', { players: room.players });
    }
  });

  // 4.2 Update Name selection
  socket.on('change-name', ({ name }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.name = name || 'Operative';
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

      // Start match if all players are ready and lobby is full
      const maxPlayers = (room.mode && room.mode.startsWith('2v2')) ? 4 : 2;
      const allReady = room.players.every(p => p.ready) && room.players.length === maxPlayers;
      if (allReady) {
        room.status = 'playing';
        room.score1 = 0;
        room.score2 = 0;
        room.roundNumber = 1;
        room.players.forEach(p => p.wantsRematch = false); // clear any old rematch tags
        const startMapId = room.isRanked
          ? (Math.random() < 0.5 ? 'manor' : 'cyberlab')
          : (room.mapId || 'manor');
        const startRenderStyle = room.isRanked 
          ? (room.mode.includes('competitive') ? 'competitive' : 'realistic')
          : (room.renderStyle || 'realistic');
        io.to(currentRoomId).emit('match-start', {
          players: room.players,
          seed: Math.random(), // synchronized seed for map spawns / layouts
          isRanked: room.isRanked,
          mode: room.mode,
          mapId: startMapId,
          renderStyle: startRenderStyle
        });
        console.log(`Match started in room: ${currentRoomId} (${room.mode}, Ranked: ${room.isRanked})`);
      }
    }
  });

  // Rematch request
  socket.on('request-rematch', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.wantsRematch = true;
      socket.to(currentRoomId).emit('opponent-requested-rematch', { playerId: socket.id });
      
      const allWantRematch = room.players.every(p => p.wantsRematch);
      if (allWantRematch && room.players.length >= 2) {
        room.status = 'playing';
        room.score1 = 0;
        room.score2 = 0;
        room.roundNumber = 1;
        room.players.forEach(p => {
          p.ready = false;
          p.wantsRematch = false;
        });
        const rematchMapId = room.isRanked
          ? (Math.random() < 0.5 ? 'manor' : 'cyberlab')
          : (room.mapId || 'manor');
        const rematchRenderStyle = room.isRanked 
          ? (room.mode.includes('competitive') ? 'competitive' : 'realistic')
          : (room.renderStyle || 'realistic');
        io.to(currentRoomId).emit('match-start', {
          players: room.players,
          seed: Math.random(),
          isRanked: room.isRanked,
          mode: room.mode,
          mapId: rematchMapId,
          renderStyle: rematchRenderStyle
        });
        console.log(`Rematch started in room: ${currentRoomId} (Ranked: ${room.isRanked})`);
      }
    }
  });


  // 6. In-game: Relay Player State (60hz updates)
  socket.on('player-state', (state) => {
    if (!currentRoomId) return;
    state.id = socket.id; // inject sender ID
    socket.to(currentRoomId).emit('opponent-state', state);
  });

  // 7. In-game: Relay Shooting Action
  socket.on('shoot', (shootData) => {
    if (!currentRoomId) return;
    shootData.playerId = socket.id; // tag shooter ID
    socket.to(currentRoomId).emit('opponent-shoot', shootData);
  });

  // 8. In-game: Hit Event
  socket.on('hit', (hitData) => {
    if (!currentRoomId) return;
    hitData.shooterId = socket.id; // tag shooter ID
    socket.to(currentRoomId).emit('damage-taken', hitData);
  });

  // 9. In-game: Health Sync
  socket.on('sync-health', (healthData) => {
    if (!currentRoomId) return;
    healthData.playerId = socket.id; // tag player ID
    socket.to(currentRoomId).emit('opponent-health-sync', healthData);
  });

  // 10. In-game: Player Died
  socket.on('player-died', (deathData) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (room && room.status === 'playing') {
      if (deathData && deathData.roundNumber !== undefined && deathData.roundNumber !== room.roundNumber) {
        console.log(`[Server] Ignored duplicate/late death event for round ${deathData.roundNumber} (current server round: ${room.roundNumber})`);
        return;
      }
      const loserId = deathData.loserId;
      const loserIdx = room.players.findIndex(p => p.id === loserId);
      if (loserIdx !== -1) {
        const loserTeam = (loserIdx % 2 === 0) ? 1 : 2;
        const winnerTeam = (loserTeam === 1) ? 2 : 1;

        if (winnerTeam === 1) {
          room.score1++;
        } else {
          room.score2++;
        }

        const matchFinished = (room.mode === 'sabotage') || (room.score1 >= 3 || room.score2 >= 3);
        if (matchFinished) {
          room.status = 'lobby';
          // Reset ready states for next match
          room.players.forEach(p => p.ready = false);
          
          const winnerPlayer = room.players.find(p => {
            const idx = room.players.indexOf(p);
            const team = (idx % 2 === 0) ? 1 : 2;
            return team === winnerTeam;
          });

          io.to(currentRoomId).emit('match-over', {
            winnerId: winnerPlayer ? winnerPlayer.id : deathData.winnerId,
            score1: room.score1,
            score2: room.score2
          });
          io.to(currentRoomId).emit('players-update', { players: room.players });
          console.log(`Match finished in room: ${currentRoomId}. Score: ${room.score1}-${room.score2}`);
        } else {
          room.roundNumber++;
          io.to(currentRoomId).emit('round-over', {
            winningTeam: winnerTeam,
            score1: room.score1,
            score2: room.score2,
            roundNumber: room.roundNumber
          });
          console.log(`Round finished in room: ${currentRoomId}. Round Winner Team: ${winnerTeam}. Score: ${room.score1}-${room.score2}`);
        }
      }
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

  // 14. In-game: Sabotage Alarm
  socket.on('sabotage-alarm', (alarmData) => {
    if (!currentRoomId) return;
    socket.to(currentRoomId).emit('opponent-sabotage-alarm', alarmData);
  });

  // 13. Text Chat
  socket.on('chat-message', (msg) => {
    if (!currentRoomId) return;
    msg.id = socket.id; // tag sender ID
    socket.to(currentRoomId).emit('opponent-chat', msg);
  });

  // 13.1 Device Sync & Backup
  socket.on('sync-device', ({ uuid, rp, wins, losses, name, credits, purchasedWeapons }) => {
    if (!uuid) return;
    const id = uuid.toLowerCase();
    
    if (!users[id]) {
      users[id] = {
        username: name || 'Operative',
        rp: rp || 0,
        credits: credits || 0,
        purchasedWeapons: purchasedWeapons || [],
        stats: { wins: wins || 0, losses: losses || 0, rounds: 0, hits: 0, shots: 0 }
      };
      saveUsers();
    } else {
      const sProfile = users[id];
      sProfile.rp = Math.max(sProfile.rp || 0, rp || 0);
      sProfile.stats.wins = Math.max(sProfile.stats.wins || 0, wins || 0);
      sProfile.stats.losses = Math.max(sProfile.stats.losses || 0, losses || 0);
      sProfile.credits = Math.max(sProfile.credits || 0, credits || 0);
      sProfile.purchasedWeapons = Array.from(new Set([...(sProfile.purchasedWeapons || []), ...(purchasedWeapons || [])]));
      if (name && name !== 'Operative' && (!sProfile.username || sProfile.username === 'Operative')) {
        sProfile.username = name;
      }
      saveUsers();
    }
    
    const sProfile = users[id];
    socket.emit('device-synced', {
      rp: sProfile.rp,
      wins: sProfile.stats.wins,
      losses: sProfile.stats.losses,
      name: sProfile.username,
      credits: sProfile.credits || 0,
      purchasedWeapons: sProfile.purchasedWeapons || []
    });
  });

  // 13.2 Relay Grenade
  socket.on('throw-grenade', (data) => {
    if (!currentRoomId) return;
    data.playerId = socket.id;
    socket.to(currentRoomId).emit('opponent-throw-grenade', data);
  });

  // 14. Leave Room
  socket.on('leave-room', () => {
    if (currentRoomId) {
      handleRoomLeave(socket, currentRoomId);
      currentRoomId = null;
      broadcastPlayerCounts();
    }
  });

  // 15. Disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socketToUser.delete(socket.id);
    if (currentRoomId) {
      handleRoomLeave(socket, currentRoomId);
    }
    broadcastPlayerCounts();
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
    room.players.forEach(p => {
      p.ready = false;
      p.wantsRematch = false;
    }); // reset ready and rematch
    io.to(roomId).emit('player-left', {
      players: room.players,
      message: 'Opponent disconnected. Returned to lobby.'
    });
    console.log(`Player left room: ${roomId}. 1 player remaining.`);
  }
  broadcastPlayerCounts();
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
