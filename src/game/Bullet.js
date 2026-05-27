export class Bullet {
  constructor(shootData) {
    this.id = `${shootData.playerId}_bullet_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    this.playerId = shootData.playerId;
    this.x = shootData.x;
    this.y = shootData.y;
    this.prevX = shootData.x;
    this.prevY = shootData.y;
    
    this.angle = shootData.angle;
    this.speed = shootData.bulletSpeed;
    this.damage = shootData.damage;
    this.rangeRemaining = shootData.range;
    
    // Spread offset calculation (applies spread based on weapon accuracy)
    const accuracy = shootData.accuracy;
    const spreadAngle = (1 - accuracy) * (Math.random() - 0.5) * 0.5; // spread cone
    const finalAngle = this.angle + spreadAngle;

    this.vx = Math.cos(finalAngle) * this.speed;
    this.vy = Math.sin(finalAngle) * this.speed;

    this.active = true;
  }

  update(map, players, particlesEngine, soundEngine) {
    if (!this.active) return;

    this.prevX = this.x;
    this.prevY = this.y;

    // Move bullet
    this.x += this.vx;
    this.y += this.vy;
    this.rangeRemaining -= this.speed;

    if (this.rangeRemaining <= 0) {
      this.active = false;
      return;
    }

    // --- Sub-step Raycast Collision Detection (prevents tunneling through walls/players) ---
    const lineStart = { x: this.prevX, y: this.prevY };
    const lineEnd = { x: this.x, y: this.y };

    // 1. Check Wall/Crate collisions first
    const wallIntersect = map.getLineIntersection(lineStart, lineEnd);
    if (wallIntersect) {
      this.x = wallIntersect.x;
      this.y = wallIntersect.y;
      this.active = false;

      // Handle hitting a breakable crate
      if (wallIntersect.wall && wallIntersect.wall.type === 'crate') {
        const crateId = wallIntersect.wall.id;
        const result = map.damageCrate(crateId, this.damage);
        
        if (result) {
          // Play wooden break sound
          if (result.broken) {
            if (soundEngine) soundEngine.playCrateBreak();
            // Spawn wooden splinter debris particles
            particlesEngine.spawnCrateSplinters(result.crateX, result.crateY);
            
            // Broadcast crate break online if we are local player
            if (this.playerId === window.LocalPlayerId && window.AppSocket) {
              window.AppSocket.emit('break-crate', { crateId, spawnedItem: result.item });
            }
          } else {
            // Soft wood impact scrape sound
            if (soundEngine) soundEngine.playFleshHit(); // wood thump
          }
        }
      }

      // Spawn spark and smoke particles at collision point
      particlesEngine.spawnWallImpact(this.x, this.y, this.angle);
      return;
    }

    // 2. Check Player collisions (line segment intersection with circle)
    for (const player of players) {
      if (player.id === this.playerId || player.health <= 0) continue;

      // Calculate distance from player center to bullet path segment
      const intersectPoint = this.getSegmentCircleIntersection(lineStart, lineEnd, player);
      
      if (intersectPoint) {
        this.x = intersectPoint.x;
        this.y = intersectPoint.y;
        this.active = false;

        // Spawn flesh blood splatter
        particlesEngine.spawnBloodSplatter(this.x, this.y, this.angle);

        // Apply damage if we are the local player shooting (or if it's offline bot shooting)
        // Hit detection is resolved client-side by the shooter
        if (this.playerId === window.LocalPlayerId) {
          player.takeDamage(this.damage, soundEngine);
          if (soundEngine) soundEngine.playHitMarker();

          // Collect match accuracy stat
          if (window.MatchStats) {
            window.MatchStats.damageDealt += this.damage;
          }

          // Emit hit damage to target player
          if (window.AppSocket) {
            window.AppSocket.emit('hit', {
              damage: this.damage,
              shooterId: this.playerId,
              targetId: player.id,
              x: this.x,
              y: this.y
            });
          }
        } else if (player.id === window.LocalPlayerId) {
          // Visual/Audio indicators for local player when hit by bot (offline)
          if (window.IsOfflineMode) {
            player.takeDamage(this.damage, soundEngine);
          }
        }
        
        return;
      }
    }
  }

  // Find closest point on line segment to circle center. If distance < circle radius, return intersection.
  getSegmentCircleIntersection(p1, p2, circle) {
    const ab_x = p2.x - p1.x;
    const ab_y = p2.y - p1.y;
    
    const ac_x = circle.x - p1.x;
    const ac_y = circle.y - p1.y;

    // Segment length squared
    const ab2 = ab_x * ab_x + ab_y * ab_y;
    if (ab2 === 0) return null;

    // Projection scalar t
    let t = (ac_x * ab_x + ac_y * ab_y) / ab2;
    // Clamp to segment range
    t = Math.max(0, Math.min(1, t));

    // Closest point coordinates
    const closestX = p1.x + t * ab_x;
    const closestY = p1.y + t * ab_y;

    // Distance squared
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distSqr = dx * dx + dy * dy;

    if (distSqr <= circle.radius * circle.radius) {
      return { x: closestX, y: closestY };
    }

    return null;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    
    // Draw glowing bullet tracer path
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    // Highlight local player bullets in cyan, opponents in red/orange
    const isLocal = this.playerId === window.LocalPlayerId;
    
    const gradient = ctx.createLinearGradient(this.prevX, this.prevY, this.x, this.y);
    if (isLocal) {
      gradient.addColorStop(0, 'rgba(102, 252, 241, 0.0)');
      gradient.addColorStop(1, 'rgba(102, 252, 241, 1.0)');
      ctx.strokeStyle = gradient;
      ctx.shadowColor = '#66fcf1';
    } else {
      gradient.addColorStop(0, 'rgba(255, 60, 60, 0.0)');
      gradient.addColorStop(1, 'rgba(255, 60, 60, 1.0)');
      ctx.strokeStyle = gradient;
      ctx.shadowColor = '#ff3c3c';
    }
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.moveTo(this.prevX, this.prevY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    ctx.restore();
  }
}
