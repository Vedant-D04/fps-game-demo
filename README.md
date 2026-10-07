# 🎮 Block Boroughs (v0.9.5)

> A fast-paced 3D voxel arcade FPS featuring tactical movement, guild wars, team deathmatch, capture the flag, and customizable operators built with Three.js and Node.js.

---

## 📖 Official Game Guide

### 01 / The Individual (Operators & Customization)
- **Callsign & Identity**: Choose your callsign, armor colors, home region, and operator backstory. Your profile follows you across every game room.
- **Operator Classes (Cosmetic Styles)**:
  - 🛡️ **Vanguard**: Versatile harbor operator with a standard field vest and rifle kit. Built for pushing lanes and bringing flags home.
  - 🗼 **Sentinel**: Watchkeeper with broad shoulder plates and a reinforced chest panel for holding ground and covering squadmates.
  - ⚡ **Scout**: Slim field kit with a compact pack and radio antenna, optimized for fast movement, flanks, and flag runs.
  *(Note: Class styles are cosmetic; all operators have equal combat statistics.)*
- **Progression & Ratings**:
  - **Personal Coins**: 100 starting coins. Earned via matches, tutorials, and range challenges.
  - **Player Level**: Advances 1 level per 100 XP gained.
  - **Regional Rank**: Your standing among operators in your home region, ordered by rating and war wins.

---

### 02 / Prove Yourself (Game Modes & Training)
- 🎯 **Live-Fire Range (Tutorial)**: Eliminate 10 target drones in 90 seconds. First completion awards 120 coins + 100 XP.
- 🚩 **Capture the Flag (Tutorial & Objective Mode)**: Retrieve the blue flag and return it to your orange base 3 times within 4 minutes while fighting armed defenders.
  - Touch a flag to pick it up; carried flags drop on elimination and return home after 10 seconds.
- ⚔️ **Bot Deathmatch (Solo Free Play)**: Repeatable 3-minute bot match with respawns across *Copper Harbor* and *Neon Garden*. Earn 25 coins plus 5 per elimination (up to 225 coins max).
- 🏆 **Team Deathmatch (Online Multiplayer)**: Free-entry 2v2 to 4v4 multiplayer combat. First team to 20 eliminations (or highest score after 3 minutes) wins. Equal scores end in a draw.

---

### 03 / Find Your Guild (Guild System)
- 🚩 **Founding a Guild**: Requires 250 personal coins (tutorials optional).
- 🤝 **Joining a Guild**: Free to join any active guild in your home region.
- 👥 **Guild Roster**: Up to 8 members per guild, with up to 4 operators fighting per side in active guild wars.
- 💰 **Currencies & Treasury**:
  - **Personal Coins**: Out-of-game currency used to found guilds, buy energy, and unlock cosmetics.
  - **Combat Credits**: In-match currency earned by playing rounds, used at base Armories (`B`) to purchase upgraded weapons.
  - **Guild Treasury**: Members donate personal coins to the guild; officers spend guild coins on energy for territory wars.

---

### 04 / The War (Territory Control Guild Wars)
- ⚡ **War Entry Cost**: 20 guild energy per war match.
- ⚔️ **Match Rules**: Best of three 3-minute rounds. Holding captured flag zones earns 1 point per second. Zones require 25 uncontested seconds to capture; enemy presence inside pauses capture progress.
- 🎁 **Rewards**:
  - **Winning Guild**: 30 guild coins | **Runner-up Guild**: 10 guild coins
  - **Winning Operators**: 40 coins + 50 XP | **Runner-up Operators**: 15 coins + 25 XP
- ⚡ **Energy Shop**: 20 guild coins buys 20 energy (up to 100 max stored energy).

---

### 05 / Rise Through the Tiers (Rankings & Ratings)
- 📈 **Rating Mechanics**:
  - **Guild Rating**: Starts at 1000 (+25 for win, -15 for loss).
  - **Operator Rating**: Starts at 1000 (+20 for win, -10 for loss).
- 🎖️ **Competitive Tiers**:
  - 🟢 **Rookie**: Below 1100 rating
  - 🥉 **Bronze**: 1100 – 1299 rating
  - 🥈 **Silver**: 1300 – 1599 rating
  - 🥇 **Gold**: 1600+ rating

---

## 🎮 Controls & Gameplay Mechanics

### Controls Keybindings

| Input | Action |
| --- | --- |
| **WASD** | Movement / Diagonal Strafing |
| **Space** | Jump (Hold to automatically repeat jumps on landing) |
| **Shift** / **Left Ctrl** | Crouch / Slide (Press before landing to slide-hop) |
| **Left Mouse** | Primary Fire |
| **Right Mouse** | Aim Down Sights (ADS) |
| **R** | Reload Weapon |
| **E** | Cycle Owned Weapons |
| **1 / 2 / 3 / 4** | Equip Owned Rifle / SMG / Marksman / Shotgun |
| **B** | Open Armory (Purchase at home base) |
| **F2** | Open Performance / FPS Settings |
| **Tab** | Show In-Match Scoreboard |
| **Esc** | Pause Menu / Release Pointer Lock |

*Touch controls are supported for mobile/tablet browsers (movement joystick, jump, slide, aim, reload, and fire).*

### Weapon Arsenal

| Weapon | Magazine | Reload Time | Characteristics |
| --- | --- | --- | --- |
| **Assault Rifle** | 30 rounds | 1.8s | Balanced cadence, 100 head / 34 torso / 22 limb damage |
| **SMG** | 36 rounds | 1.8s | High rate of fire, ideal for close-quarters slide engagements |
| **Marksman (DMR)** | 8 rounds | 1.8s | High precision, extended effective range |
| **Shotgun** | 6 rounds | 2.4s | High close-range burst damage, wide spread |

*Health & Shield*: Operators spawn with **100 HP + 50 Shield**. Shields automatically regenerate at 12 points/sec after 5 seconds without taking damage.

### Movement & Recoil Mechanics
- **Slide-hopping & Air Control**: Retain momentum by holding jump or hitting crouch just as you land. Diagonal strafing & air acceleration capped for fluid movement.
- **Authoritative Weapon Recoil**: Features vertical climb, late horizontal wander, movement/air firing bloom, crouching/ADS spread reduction, and burst recovery.
- **Low Cover & Crouch Hitboxes**: Jump onto and over low cover crates/walls. Crouching lowers eye level, character visual model, and server-authoritative hitboxes in sync.

---

## 🚀 Quick Start & Installation

### Requirements
- **Node.js**: Version 18.0 or higher
- **Dependencies**: None! Built with standard Web/Node APIs.

### Running the Game Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vedant-D04/fps-game-demo.git
   cd fps-game-demo
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Play in browser**:
   Open your browser and navigate to `http://localhost:3000`.
   *(To play LAN or online multiplayer, connect friends to your server's IP address on port 3000).*

### Running Verification Tests

Run the automated test suite covering raycast geometry, recoil curves, crouch hitboxes, game logic, and multiplayer server authority:

```bash
npm test
```

---

## 🛠️ Technical Architecture

- **Rendering Engine**: Three.js (custom voxel pipeline, procedural lighting, dynamic soft shadows, custom character rigs & animations).
- **Physics & Netcode**: 120 Hz client prediction & server authority loop, raycasting oracle, hit validation across pitch/yaw transformations.
- **Zero External Dependencies**: Server runs on native Node.js HTTP/FS modules; client scripts loaded directly.
- **Data Persistence**: Profiles and guild rosters saved locally in `data/progression.json`.

---

## 📜 License & Credits
See [FONT-LICENSE.txt](file:///Users/vedantdesai/Downloads/block-boroughs/FONT-LICENSE.txt) and [THREE-LICENSE.txt](file:///Users/vedantdesai/Downloads/block-boroughs/THREE-LICENSE.txt) for asset licenses.
