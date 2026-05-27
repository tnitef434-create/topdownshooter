class Particle {
  constructor(x, y, vx, vy, color, size, life, decay, type = 'normal') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life; // 0.0 to 1.0
    this.decay = decay; // rate of life reduction per frame
    this.type = type;
    
    // Type-specific modifiers
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.3;
    this.bounceCount = 0;
  }

  update(map) {
    this.life -= this.decay;
    
    // Apply friction/gravity simulation
    if (this.type === 'casing' || this.type === 'splinter') {
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.angle += this.spin;
      
      // Casings & splinters bounce off walls
      const nextX = this.x + this.vx;
      const nextY = this.y + this.vy;
      
      const check = map.checkCircleCollision(nextX, nextY, this.size);
      if (check.collided && this.bounceCount < 2) {
        this.bounceCount++;
        // Reverse velocity with dampening
        this.vx = -this.vx * 0.4;
        this.vy = -this.vy * 0.4;
      } else {
        this.x = check.x;
        this.y = check.y;
      }
    } else {
      this.x += this.vx;
      this.y += this.vy;
      
      // Standard friction
      this.vx *= 0.92;
      this.vy *= 0.92;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);

    if (this.type === 'casing') {
      // Draw rectangular brass shell casing
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = '#d4af37'; // gold/brass
      ctx.strokeStyle = '#996515';
      ctx.lineWidth = 0.5;
      ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
      ctx.strokeRect(-this.size, -this.size / 2, this.size * 2, this.size);
    } else if (this.type === 'splinter') {
      // Draw wooden shard
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = '#8b5a2b'; // dark wood
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.lineTo(this.size, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'blood') {
      // Red fleshy circles
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Standard glowing spark / smoke
      ctx.fillStyle = this.color;
      if (this.color.startsWith('#66fc') || this.color.startsWith('#ff3c')) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Floor Blood/Casing decals that stay permanently during a round
class Decal {
  constructor(x, y, size, color, type = 'blood') {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.type = type;
    this.angle = Math.random() * Math.PI * 2;
    
    // Slight randomized scale shape for blood pools
    this.scaleX = 1 + (Math.random() - 0.5) * 0.4;
    this.scaleY = 1 + (Math.random() - 0.5) * 0.4;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.type === 'blood' ? 0.75 : 0.9;

    if (this.type === 'blood') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Draw asymmetric puddle
      ctx.ellipse(0, 0, this.size * this.scaleX, this.size * this.scaleY, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'casing') {
      ctx.fillStyle = '#b5921c'; // gold brass laying flat
      ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
    } else if (this.type === 'splinter') {
      ctx.fillStyle = '#6e441c';
      ctx.fillRect(-this.size, -this.size / 3, this.size * 1.5, this.size * 0.7);
    }
    
    ctx.restore();
  }
}

export class ParticleEngine {
  constructor() {
    this.particles = [];
    this.decals = [];
    this.bloodEnabled = true;
  }

  clear() {
    this.particles = [];
    this.decals = [];
  }

  setBloodEnabled(enabled) {
    this.bloodEnabled = enabled;
  }

  update(map) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(map);
      
      // If particle dies, convert to flat ground decal if applicable
      if (p.life <= 0) {
        if (p.type === 'blood' && this.bloodEnabled && Math.random() < 0.6) {
          this.decals.push(new Decal(p.x, p.y, p.size * 1.2, p.color, 'blood'));
        } else if (p.type === 'casing') {
          this.decals.push(new Decal(p.x, p.y, p.size, '#996515', 'casing'));
        } else if (p.type === 'splinter' && Math.random() < 0.4) {
          this.decals.push(new Decal(p.x, p.y, p.size, '#5c3917', 'splinter'));
        }
        
        this.particles.splice(i, 1);
      }
    }

    // Limit maximum decals to keep performance at 60fps
    if (this.decals.length > 250) {
      this.decals.shift();
    }
  }

  drawDecals(ctx) {
    this.decals.forEach(d => d.draw(ctx));
  }

  drawParticles(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  // --- Emitter Methods ---

  // 1. Spawning sparks off wall bullet impacts
  spawnWallImpact(x, y, bulletAngle) {
    const bounceAngle = bulletAngle + Math.PI; // push backwards
    
    // Sparks
    const numSparks = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < numSparks; i++) {
      const angle = bounceAngle + (Math.random() - 0.5) * 1.2;
      const speed = Math.random() * 3 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 2.2 + 1.2;
      const decay = Math.random() * 0.04 + 0.04;
      
      this.particles.push(new Particle(
        x, y, vx, vy, 
        Math.random() > 0.5 ? '#66fcf1' : '#ffffff', 
        size, 1.0, decay, 'spark'
      ));
    }

    // Small smoke puff
    this.particles.push(new Particle(
      x, y, 
      (Math.random() - 0.5) * 0.3, 
      (Math.random() - 0.5) * 0.3, 
      'rgba(197, 198, 199, 0.25)', 
      Math.random() * 6 + 4, 1.0, 0.03, 'smoke'
    ));
  }

  // 2. Splattering blood when operatives are shot
  spawnBloodSplatter(x, y, bulletAngle) {
    if (!this.bloodEnabled) return;

    // Fleshy red splatters spraying along bullet trajectory
    const numSplatters = Math.floor(Math.random() * 6) + 6;
    for (let i = 0; i < numSplatters; i++) {
      const angle = bulletAngle + (Math.random() - 0.5) * 1.1; // spray forward
      const speed = Math.random() * 4.5 + 2.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 3 + 1.5;
      const decay = Math.random() * 0.05 + 0.04;
      
      // Random shades of dark crimson blood
      const red = Math.floor(Math.random() * 60) + 120;
      const color = `rgb(${red}, 10, 10)`;
      
      this.particles.push(new Particle(
        x, y, vx, vy, color, 
        size, 1.0, decay, 'blood'
      ));
    }
  }

  // 3. Ejecting brass shells from gun ejection ports
  spawnGunCasing(x, y, playerAngle, weaponKey) {
    // Eject to the right side of gun barrel (playerAngle + 90 deg)
    const ejectAngle = playerAngle + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 2.0 + 1.8;
    
    // Initial velocity
    const vx = Math.cos(ejectAngle) * speed;
    const vy = Math.sin(ejectAngle) * speed;
    
    const size = weaponKey === 'sniper' ? 3.5 : weaponKey === 'pistol' ? 2.0 : 2.6;
    const decay = 0.02; // linger longer before flattening
    
    this.particles.push(new Particle(
      x, y, vx, vy, '#d4af37', 
      size, 1.0, decay, 'casing'
    ));

    // Also emit soft muzzle smoke
    const smokeAngle = playerAngle + (Math.random() - 0.5) * 0.3;
    const smokeSpeed = Math.random() * 0.6 + 0.3;
    this.particles.push(new Particle(
      x + Math.cos(playerAngle)*6, 
      y + Math.sin(playerAngle)*6, 
      Math.cos(smokeAngle)*smokeSpeed, 
      Math.sin(smokeAngle)*smokeSpeed, 
      'rgba(200, 200, 200, 0.15)', 
      Math.random() * 5 + 3, 1.0, 0.04, 'smoke'
    ));
  }

  // 4. Debris when wooden crates break
  spawnCrateSplinters(x, y) {
    const numSplinters = Math.floor(Math.random() * 12) + 10;
    
    for (let i = 0; i < numSplinters; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = Math.random() * 4 + 2;
      const decay = Math.random() * 0.03 + 0.02;
      
      this.particles.push(new Particle(
        x, y, vx, vy, '#8b5a2b', 
        size, 1.0, decay, 'splinter'
      ));
    }

    // Large smoke cloud on break
    for (let i = 0; i < 4; i++) {
      this.particles.push(new Particle(
        x + (Math.random() - 0.5) * 10,
        y + (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        'rgba(140, 130, 120, 0.2)',
        Math.random() * 12 + 8, 1.0, 0.02, 'smoke'
      ));
    }
  }
}
