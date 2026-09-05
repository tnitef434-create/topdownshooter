export const SHOOTER_RECOVERY_MS = 120_000;
export const SHOOTER_SOCKET_OPTIONS = Object.freeze({
  pingInterval: 25_000,
  // Chromium may batch background timers once a minute. A hidden tab is not
  // evidence that its player intentionally left the match.
  pingTimeout: 120_000,
  connectionStateRecovery: { maxDisconnectionDuration: SHOOTER_RECOVERY_MS, skipMiddlewares: false },
});

const recoverable = new Set(['transport error', 'transport close', 'forced close', 'ping timeout', 'forced server close']);
const matchActions = new Set(['player-state', 'shoot', 'hit', 'sync-health', 'player-died', 'break-crate', 'pickup-item', 'sabotage-alarm', 'throw-grenade', 'player-ready', 'request-rematch']);

/** Preserve actual room membership while Socket.IO restores a transport. */
export function createShooterRoomRecovery({ io, rooms, onLeave, graceMs = SHOOTER_RECOVERY_MS }) {
  const pending = new Map();

  function publish(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;
    const disconnected = room.players.filter(player => pending.has(player.id)).map(player => player.id);
    const hidden = room.players.filter(player => player.tabHidden).map(player => player.id);
    room.connectionPaused = disconnected.length > 0 || hidden.length > 0;
    io.to(roomId).emit('room-connection-state', {
      roomId, paused: room.connectionPaused, disconnected, hidden,
      reason: disconnected.length ? 'Waiting for a player to reconnect…' : hidden.length ? 'Paused while a player is away from the tab' : '',
    });
  }

  function clearPending(id) {
    const record = pending.get(id);
    if (record) clearTimeout(record.timer);
    pending.delete(id);
  }

  function leave(socket, roomId = socket.data.shooterRoomId) {
    clearPending(socket.id);
    socket.data.shooterRoomId = null;
    if (roomId) onLeave(socket, roomId);
    publish(roomId);
  }

  function resume(socket) {
    let roomId = socket.recovered ? socket.data.shooterRoomId : null;
    const room = rooms.get(roomId);
    const player = room?.players.find(player => player.id === socket.id);
    if (!player) {
      if (roomId) socket.leave(roomId);
      roomId = null;
    } else {
      clearPending(socket.id);
      player.name = socket.data.accountName || player.name;
    }
    socket.data.shooterRoomId = roomId;
    socket.on('match-visibility', ({ hidden } = {}) => {
      socket.data.tabHidden = Boolean(hidden);
      const current = rooms.get(socket.data.shooterRoomId);
      const member = current?.players.find(player => player.id === socket.id);
      if (member) {
        member.tabHidden = Boolean(hidden);
        publish(current.id);
      }
    });
    socket.use((packet, next) => {
      const current = rooms.get(socket.data.shooterRoomId);
      // Never replay combat clicks queued during an outage into a paused game.
      if (current?.connectionPaused && matchActions.has(packet[0])) return;
      next();
    });
    if (socket.recovered) socket.emit('room-recovered', { roomId, players: player ? room.players : [] });
    if (roomId) publish(roomId);
    return roomId;
  }

  function joined(socket, roomId) {
    socket.data.shooterRoomId = roomId;
    const player = rooms.get(roomId)?.players.find(player => player.id === socket.id);
    if (player) player.tabHidden = Boolean(socket.data.tabHidden);
    publish(roomId);
  }

  function disconnect(socket, reason) {
    const roomId = socket.data.shooterRoomId;
    if (!roomId) return;
    if (!recoverable.has(reason)) return leave(socket, roomId);
    clearPending(socket.id);
    const timer = setTimeout(() => leave(socket, roomId), graceMs);
    timer.unref?.();
    pending.set(socket.id, { roomId, timer });
    publish(roomId);
  }

  return { resume, joined, disconnect, leave, publish, close() { for (const id of pending.keys()) clearPending(id); } };
}
