import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import mapData from './map_data.json';

// Seeded random number generator for synchronized crate spawning
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  // Returns 0 to 1
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  // Range: min to max
  range(min, max) {
    return min + this.next() * (max - min);
  }
}

export class Map {
  constructor(width, height, seed) {
    this.width = width;
    this.height = height;
    this.rng = new SeededRandom(seed);
    
    this.walls = []; // Array of Wall objects {x, y, w, h, type: 'wall'|'crate', health: 100, maxHealth: 100}
    this.items = []; // Array of Items {id, x, y, type: 'health'|'ammo', active: true}
    
    this.segments = []; // Pre-computed line segments for raycasting
    
    this.generateMap();
  }

  generateMap() {
    this.walls = [];
    this.items = [];

    // 1. Boundary Walls
    const borderThickness = 40;
    // Top
    this.walls.push({ x: 0, y: 0, w: this.width, h: borderThickness, type: 'wall' });
    // Bottom
    this.walls.push({ x: 0, y: this.height - borderThickness, w: this.width, h: borderThickness, type: 'wall' });
    // Left
    this.walls.push({ x: 0, y: borderThickness, w: borderThickness, h: this.height - borderThickness * 2, type: 'wall' });
    // Right
    this.walls.push({ x: this.width - borderThickness, y: borderThickness, w: borderThickness, h: this.height - borderThickness * 2, type: 'wall' });

    // 2. Load custom mapData from the 3D projected layout
    mapData.forEach(item => {
      if (item.type === 'crate') {
        this.walls.push({
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          type: 'crate',
          health: item.health,
          maxHealth: item.maxHealth,
          id: item.id
        });
      } else {
        this.walls.push({
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          type: 'wall'
        });
      }
    });

    this.rebuildSegments();
  }

  // Pre-calculate line segments of all active walls for the raycaster
  rebuildSegments() {
    this.segments = [];
    this.walls.forEach(wall => {
      // 4 edges of the rectangle
      this.segments.push({ p1: { x: wall.x, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y } }); // Top
      this.segments.push({ p1: { x: wall.x + wall.w, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y + wall.h } }); // Right
      this.segments.push({ p1: { x: wall.x + wall.w, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y + wall.h } }); // Bottom
      this.segments.push({ p1: { x: wall.x, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y } }); // Left
    });
  }

  // Break a crate (damage it, remove if health <= 0)
  damageCrate(crateId, damage) {
    const crateIdx = this.walls.findIndex(w => w.id === crateId);
    if (crateIdx === -1) return null;

    const crate = this.walls[crateIdx];
    crate.health -= damage;

    if (crate.health <= 0) {
      // Remove crate
      this.walls.splice(crateIdx, 1);
      this.rebuildSegments();

      // Hide 3D mesh
      if (this.crateMeshes && this.crateMeshes[crateId]) {
        this.crateMeshes[crateId].visible = false;
      }
      
      // Spawn items from crate (seeded probabilities)
      // 40% chance of item spawn
      const itemRoll = this.rng.next();
      let spawnedItem = null;
      
      if (itemRoll < 0.45) {
        const itemType = this.rng.next() < 0.5 ? 'health' : 'ammo';
        spawnedItem = {
          id: `item_${crateId}_${Date.now()}`,
          x: crate.x + crate.w / 2,
          y: crate.y + crate.h / 2,
          type: itemType,
          active: true
        };
        this.items.push(spawnedItem);
      }
      
      return { broken: true, item: spawnedItem, crateX: crate.x + crate.w/2, crateY: crate.y + crate.h/2 };
    }
    
    return { broken: false, health: crate.health };
  }

  // Sync crate breaking for network events
  syncBreakCrate(crateId, spawnedItem) {
    const crateIdx = this.walls.findIndex(w => w.id === crateId);
    if (crateIdx !== -1) {
      this.walls.splice(crateIdx, 1);
      this.rebuildSegments();
    }
    // Hide 3D mesh
    if (this.crateMeshes && this.crateMeshes[crateId]) {
      this.crateMeshes[crateId].visible = false;
    }
    if (spawnedItem) {
      // Avoid duplicate spawning
      if (!this.items.some(i => i.id === spawnedItem.id)) {
        this.items.push(spawnedItem);
      }
    }
  }

  // Check Circle vs Rectangle Collision
  checkCircleCollision(cx, cy, r, playerX = 0, playerY = 0) {
    let correctedX = cx;
    let correctedY = cy;
    let collided = false;

    for (const wall of this.walls) {
      // Find closest point on wall to circle center
      const closestX = Math.max(wall.x, Math.min(correctedX, wall.x + wall.w));
      const closestY = Math.max(wall.y, Math.min(correctedY, wall.y + wall.h));

      // Distance between closest point and circle center
      const distPercentX = correctedX - closestX;
      const distPercentY = correctedY - closestY;
      const distSqr = distPercentX * distPercentX + distPercentY * distPercentY;

      if (distSqr < r * r) {
        collided = true;
        const dist = Math.sqrt(distSqr);
        
        if (dist === 0) continue; // safety check

        // Push circle away from the closest point
        const overlap = r - dist;
        correctedX += (distPercentX / dist) * overlap;
        correctedY += (distPercentY / dist) * overlap;
      }
    }

    return { x: correctedX, y: correctedY, collided };
  }

  // Check Line vs Rectangle (Raycasting for Bullets/Walls)
  // Returns intersection point {x, y, dist, wallRef} or null
  getLineIntersection(p1, p2) {
    let closestIntersection = null;

    for (const wall of this.walls) {
      const wallEdges = [
        { p1: { x: wall.x, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y } }, // Top
        { p1: { x: wall.x + wall.w, y: wall.y }, p2: { x: wall.x + wall.w, y: wall.y + wall.h } }, // Right
        { p1: { x: wall.x + wall.w, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y + wall.h } }, // Bottom
        { p1: { x: wall.x, y: wall.y + wall.h }, p2: { x: wall.x, y: wall.y } } // Left
      ];

      for (const edge of wallEdges) {
        const intersect = this.getLineSegmentIntersection(p1, p2, edge.p1, edge.p2);
        if (intersect) {
          const dx = intersect.x - p1.x;
          const dy = intersect.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!closestIntersection || dist < closestIntersection.dist) {
            closestIntersection = { x: intersect.x, y: intersect.y, dist, wall };
          }
        }
      }
    }

    return closestIntersection;
  }

  getLineSegmentIntersection(line1_p1, line1_p2, line2_p1, line2_p2) {
    const s1_x = line1_p2.x - line1_p1.x;
    const s1_y = line1_p2.y - line1_p1.y;
    const s2_x = line2_p2.x - line2_p1.x;
    const s2_y = line2_p2.y - line2_p1.y;

    const s = (-s1_y * (line1_p1.x - line2_p1.x) + s1_x * (line1_p1.y - line2_p1.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (line1_p1.y - line2_p1.y) - s2_y * (line1_p1.x - line2_p1.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        x: line1_p1.x + (t * s1_x),
        y: line1_p1.y + (t * s1_y)
      };
    }

    return null;
  }

  // --- Dynamic Lighting Engine (2D Raycaster Shadows) ---
  // Computes the visibility polygon from lightX, lightY
  computeVisibilityPolygon(lightX, lightY, maxRadius) {
    const points = [];
    
    // Gather all wall vertices, including boundary points
    const vertices = [];
    this.walls.forEach(wall => {
      vertices.push({ x: wall.x, y: wall.y });
      vertices.push({ x: wall.x + wall.w, y: wall.y });
      vertices.push({ x: wall.x + wall.w, y: wall.y + wall.h });
      vertices.push({ x: wall.x, y: wall.y + wall.h });
    });

    // Extract unique angles to vertices from the light source
    const angles = new Set();
    vertices.forEach(v => {
      const angle = Math.atan2(v.y - lightY, v.x - lightX);
      angles.add(angle);
      angles.add(angle - 0.0001); // cast ray slightly left
      angles.add(angle + 0.0001); // cast ray slightly right
    });

    // Add standard 4 corners of screen radius angles to fill gaps
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      angles.add(a);
    }

    // Cast rays and check intersections
    const rayEndList = [];
    angles.forEach(angle => {
      // Calculate ray target end coordinates
      const rayEnd = {
        x: lightX + Math.cos(angle) * maxRadius,
        y: lightY + Math.sin(angle) * maxRadius
      };

      // Find closest wall intersection
      const intersect = this.getLineIntersection({ x: lightX, y: lightY }, rayEnd);
      
      if (intersect && intersect.dist < maxRadius) {
        rayEndList.push({ x: intersect.x, y: intersect.y, angle });
      } else {
        rayEndList.push({ x: rayEnd.x, y: rayEnd.y, angle });
      }
    });

    // Sort endpoints by angle to form a clean clockwise polygon
    rayEndList.sort((a, b) => a.angle - b.angle);

    return rayEndList;
  }

  // Draw the entire map: Static Walls, Crates, and Items
  draw(ctx, configSettings = { shadows: true }, visibilityPolygon = null) {
    // 1. Draw floor tiling grid
    ctx.strokeStyle = '#121620';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // 2. Draw Items
    this.items.forEach(item => {
      if (!item.active) return;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
      
      // Floating glowing animation
      const scale = 1 + Math.sin(Date.now() / 150) * 0.15;
      
      if (item.type === 'health') {
        // Red Cross
        ctx.fillStyle = '#ff2e2e';
        ctx.shadowColor = '#ff2e2e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillRect(item.x - 2, item.y - 6, 4, 12);
        ctx.fillRect(item.x - 6, item.y - 2, 12, 4);
      } else {
        // Yellow Ammo Pack
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        // Draw bullet shape
        ctx.fillRect(item.x - 4, item.y - 4, 8, 8);
        ctx.moveTo(item.x - 4, item.y - 4);
        ctx.lineTo(item.x, item.y - 8);
        ctx.lineTo(item.x + 4, item.y - 4);
        ctx.fill();
      }
      ctx.restore();
    });

    // 3. Draw static elements: Walls and Crates
    this.walls.forEach(wall => {
      ctx.save();

      if (wall.type === 'wall') {
        // Futuristic Concrete Wall with Cyber Neon lines
        ctx.fillStyle = '#10141d';
        ctx.strokeStyle = '#45a29e';
        ctx.lineWidth = 2;
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

        // Pattern inside wall to look heavy
        ctx.fillStyle = 'rgba(69, 162, 158, 0.05)';
        ctx.fillRect(wall.x + 4, wall.y + 4, wall.w - 8, wall.h - 8);
      } else {
        // Destructible Wooden/Metal Crate
        ctx.fillStyle = '#4e3629';
        ctx.strokeStyle = '#d79e69';
        ctx.lineWidth = 1.5;
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);

        // Inner bracing details
        ctx.beginPath();
        ctx.moveTo(wall.x + 2, wall.y + 2);
        ctx.lineTo(wall.x + wall.w - 2, wall.y + wall.h - 2);
        ctx.moveTo(wall.x + wall.w - 2, wall.y + 2);
        ctx.lineTo(wall.x + 2, wall.y + wall.h - 2);
        ctx.stroke();

        // Draw Health bar on damaged crates
        if (wall.health < wall.maxHealth) {
          const hpPercent = wall.health / wall.maxHealth;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(wall.x + 5, wall.y + 5, wall.w - 10, 5);
          ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : '#ff0000';
          ctx.fillRect(wall.x + 5, wall.y + 5, (wall.w - 10) * hpPercent, 5);
        }
      }

      ctx.restore();
    });

    // 4. Render Dynamic Visibility Shadow Overlay (Fog of War)
    if (configSettings.shadows && visibilityPolygon && visibilityPolygon.length > 0) {
      // To overlay dark shadows outside visibility polygon:
      // We draw shadows on an offscreen canvas or use clip.
      // Easiest inline trick:
      // Draw a black screen, but clip it to exclude the visibility polygon
      
      // Save canvas state
      ctx.save();
      
      // Create shadow paths covering the map, except the polygon
      ctx.beginPath();
      // Outer rect (counter-clockwise)
      ctx.rect(this.width, 0, -this.width, this.height);
      
      // Inner polygon (clockwise)
      const startPt = visibilityPolygon[0];
      ctx.moveTo(startPt.x, startPt.y);
      for (let i = 1; i < visibilityPolygon.length; i++) {
        ctx.lineTo(visibilityPolygon[i].x, visibilityPolygon[i].y);
      }
      ctx.closePath();
      
      // Fill the remainder (shadows)
      ctx.fillStyle = 'rgba(4, 5, 8, 0.94)'; // Dark tactical fog of war
      ctx.fill();
      
      ctx.restore();
    }
  }

  init3D(scene, mapName) {
    this.scene = scene;
    this.mapName = mapName;
    this.meshes = [];
    this.crateMeshes = {};
    this.crateNames = ['Cube.002', 'Cube.016', 'Cube.017', 'Cube.018', 'Cube.019', 'Cube.020', 'Cube.021', 'Cube.022', 'Cube.023', 'Cube.024'];

    // 1. Create 3D floor plane (dark concrete floor)
    const floorGeo = new THREE.PlaneGeometry(this.width * 2, this.height * 2);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x050608, 
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Grid helper on the floor for alignment/visuals
    const grid = new THREE.GridHelper(this.width * 2, 70, 0x45a29e, 0x121620);
    grid.position.y = -0.49;
    this.scene.add(grid);

    if (this.mapName === 'warface') {
      // 2. Load the 3D GLB Map
      const loader = new GLTFLoader();
      loader.load('/Warfacemap.glb', (gltf) => {
        const model = gltf.scene;
        
        // World space scale
        const scaleX = 1200 / (21.51 - (-20.90)); // ~28.3
        const scaleZ = 1200 / (9.44 - (-9.04));   // ~65.0
        
        model.scale.set(scaleX, 28.0, scaleZ);
        
        const posX = 100 - (-20.90 * scaleX);
        const posZ = 100 - (-9.04 * scaleZ);
        model.position.set(posX, -0.49, posZ);
        
        // Traverse model to set shadow casting and materials
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Adjust materials to look glowing and metallic
            if (child.material) {
              child.material.roughness = 0.5;
              child.material.metalness = 0.7;
              
              if (child.name.toLowerCase().includes('glow') || child.name.toLowerCase().includes('neon')) {
                child.material.emissive = new THREE.Color(0x66fcf1);
                child.material.emissiveIntensity = 2.0;
              }
            }

            // Map crate child meshes to hide them when broken
            if (this.crateNames.includes(child.name)) {
              const idx = this.crateNames.indexOf(child.name);
              this.crateMeshes[`crate_${idx}`] = child;
            }
          }
        });
        
        this.scene.add(model);
      });
    } else {
      // 3. Render Neon Grid Map in 3D
      this.walls.forEach(wall => {
        // Exclude boundary walls from visuals
        if (wall.x === 0 || wall.y === 0 || wall.x + wall.w === this.width || wall.y + wall.h === this.height) {
          // Boundary walls: big dark concrete walls
          const geom = new THREE.BoxGeometry(wall.w, 40, wall.h);
          const mat = new THREE.MeshStandardMaterial({ color: 0x07090c, roughness: 0.9, metalness: 0.1 });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(wall.x + wall.w / 2, 20, wall.y + wall.h / 2);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.scene.add(mesh);
          return;
        }

        const height = wall.type === 'crate' ? 18 : 35;
        const geom = new THREE.BoxGeometry(wall.w, height, wall.h);
        
        let mat;
        if (wall.type === 'crate') {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0x4e3629, 
            roughness: 0.9, 
            metalness: 0.1 
          });
        } else {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0x10141d, 
            roughness: 0.4, 
            metalness: 0.8,
            emissive: 0x45a29e,
            emissiveIntensity: 0.05
          });
        }
        
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(wall.x + wall.w / 2, height / 2 - 0.5, wall.y + wall.h / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.scene.add(mesh);
        
        if (wall.type === 'crate') {
          this.crateMeshes[wall.id] = mesh;
        } else {
          this.meshes.push(mesh);
        }
      });
    }
  }

  update3D() {
    if (!this.scene) return;
    
    // Create meshes for items if they don't have them
    this.items.forEach(item => {
      if (item.active && !item.mesh) {
        let geom, mat;
        if (item.type === 'health') {
          geom = new THREE.BoxGeometry(10, 10, 10);
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xff2e2e, 
            roughness: 0.3, 
            metalness: 0.5,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
          });
        } else {
          geom = new THREE.CylinderGeometry(2, 2, 8, 8);
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xffcc00, 
            roughness: 0.2, 
            metalness: 0.8,
            emissive: 0xccaa00,
            emissiveIntensity: 0.4
          });
        }
        
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(item.x, 2, item.y);
        mesh.castShadow = true;
        this.scene.add(mesh);
        item.mesh = mesh;
      } else if (!item.active && item.mesh) {
        this.scene.remove(item.mesh);
        item.mesh = null;
      }
      
      if (item.active && item.mesh) {
        item.mesh.position.y = 2.5 + Math.sin(Date.now() / 150) * 0.5;
        item.mesh.rotation.y += 0.03;
      }
    });
  }
}
