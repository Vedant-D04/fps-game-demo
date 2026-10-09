## 0.11.1 HUD repair

Fixed the Armory button filling the viewport in solo matches: old absolute-position anchors are reset before setting its compact size. Desktop and touch layouts use separate anchors. Weapon cards now show distinct locally bundled gun illustrations. Added regression checks for compact HUD anchors and the four served SVG previews; 43 tests pass.

## 0.11.0 match-first update

Start with **Play with bots**, **Play online**, or **Tutorials**. Create an operator and complete the beginner range once through the guided interface before matches unlock. Tutorials have their own map selector and screen. CTF remains a solo tutorial with armed defenders; guild territory is available in the online mode selector.

- Bot DM is free-for-all: bots roam, select visible opponents by distance, fight one another, and continue during your respawn. Individual kills and a live leaderboard track everyone.
- Online free-for-all supports 2–8 players with all four guns free. Team DM and guild wars remain available. Online play needs everyone connected to the same reachable Node server; this ZIP does not provide public hosting or matchmaking.
- **B** opens the weapon menu; **1–4** selects rifle, SMG, marksman or shotgun; **E** cycles owned guns. Solo magazines preserve spent ammo across switches; respawns replenish them.
- **G** throws a frag grenade; mobile has a FRAG button. Two per life, 1.8-second fuse, collision bounce, five-metre damage falloff, shield absorption and cover checks. Friendly fire is disabled in team DM; self-damage is enabled. The visible projectile and explosion use authoritative state.
- Profile customization includes Helmet, Cap, Beanie or no headwear, five skin tones, armor colors and three cosmetic armor styles. Choices appear in portraits and multiplayer operators; first-person hands match skin tone.
- Standing first shots have tighter spread. Camera height matches the authoritative eye, tracer endpoints copy the actual shot, and empty-range misses do not create fake impact chips. Recoil, moving/air spread, terrain and cover still affect shots.
- Fixed terrain beginner target respawns that could leave the playable range.

Run `npm start`, then open `http://localhost:3000`. Run `npm test` for 41 checks covering geometry, low cover, terrain traversal, recoil, bot FFA, online FFA, weapons, grenades, rewards and saved cosmetics. Numeric Three.js rig checks cover 60 appearance combinations. Browser appearance, touch controls and real internet latency remain unverified.

## 0.10.0 explorable terrain maps

Select **Tidewatch Cove** or **Canopy Ridge** in the Arena menu. Both maps are 72 × 56 m islands with winding paths, a hillside, upper flag terrace, twelve central stairs and a lower beach. Existing classic maps remain selectable.

See `design/Terrain-Blueprint.png` for the precise topographic plan. `terrain-maps.json` supplies the same dimensions, elevation grid, stairs, routes, bases and cover to the game. The height sampler matches the rendered terrain triangles; bots, spawns, flags and shots use that ground data.

Brighter moving bullet streaks replace hairline tracers. Low cover uses the correct ground-relative collision height, and its top trim stays within the solid cover bounds. CTF has a larger cloth flag, beacon, screen direction/distance marker, home marker and minimap icons. Terrain CTF allows six minutes for three deliveries.

Run `npm start`, open `http://localhost:3000`, then choose a terrain arena. `npm test` verifies classic mechanics, terrain traversal, cover, flag delivery and navigation. Browser appearance and live network latency remain unverified. Multiplayer modes remain guild territory and team deathmatch; capture the flag is the solo bot challenge.

## 0.9.5 researched verification suite
Added verification.test.js to npm test: independent ray oracle, low-cover matrix, pose/elevation classification, nearest-hit obstruction, landing frame rates, tracer endpoints and recoil behavior. Fixed player hitboxes failing to rotate with character yaw. See VERIFICATION.md for sources, coverage and remaining browser/network limitations.

## 0.9.4 low-cover aim and tactical recoil
Active grounded camera height now reconciles with authoritative platform height. Added authoritative weapon recoil: vertical climb, later horizontal direction changes, movement/air firing error, ADS/crouch reduction and burst recovery. Camera follows recoil; mouse counter-steering controls spray. Tuning is original and inspired by Riot descriptions, not an exact Valorant replication. Browser visual verification remains pending.

## 0.9.3 cover, damage direction and surrounding terrain
Corrected the 90-degree incoming-damage indicator offset, exact close-impact tracer paths, near-wall weapon retraction, crate/barrel collision and crouch-aware bot visibility. Removed ships/cranes from playable districts. Added surrounding voxel ridges, cliffs, trees, clouds, timber trim, vines and lanterns. Online team deathmatch requires players on the same reachable Node server; solo deathmatch uses bots. Browser visual verification remains pending.

## 0.9.2 larger maps
Both maps now have 64 × 44 playable layouts (previously 28 × 20), connected district streets, enterable courtyards, side routes, low cover and climbable market steps. Movement bounds, bot pathfinding, multiplayer spawns and rendering use map dimensions. Solo deathmatch enemies occupy the new districts; tutorials retain their nearby objectives. Browser visuals remain unverified.

## 0.9.1 character and combat repair
Layered voxel operator gear, improved proportions, horizontal chest-mounted rifle, relaxed portrait pose, and uncached static assets. Short traveling tracers and small impact particles replace full ray lines and glowing impact spheres. Rifle damage is head 100, torso 34, limbs 22. Browser visual verification remains pending.

# Block Boroughs 0.9: Modes and flag combat

Unzip, open the `block-boroughs` directory and run `npm start` with Node.js 18+. Open http://localhost:3000. No dependencies need installing. Keep your existing `data` directory when updating; profiles and guilds are preserved.

## Play, earn, repeat

The Free Play screen offers repeatable three-minute **bot deathmatch** with respawns. Completed matches earn 25 coins plus 5 per elimination (maximum 225). Quitting early does not pay a completion reward. Choose Copper Harbor or Neon Garden.

War Rooms now offer **team deathmatch** as well as existing territory guild wars. Deathmatch has free entry, no guild requirement and no energy cost. Two players minimum, with both teams represented. First to 20 eliminations wins, or the higher score after three minutes; equal scores end as a draw. Each saved operator receives the same completion/kill coin formula. Ranked territory guild wars retain their existing rules.

Guild creation requires 250 personal coins; tutorials are optional. Match rewards can fund guild creation. Existing completion of both legacy capture and survival tutorials migrates to the combined tutorial.

## Exactly two tutorials

1. **Live-fire range:** eliminate 10 targets in 90 seconds.
2. **Capture the flag:** steal the blue flag and return it to the orange base three times within four minutes, against armed defenders. Touch the flag to pick it up and touch your base to deliver it. Deaths respawn you after 2.5 seconds. A carried flag drops when eliminated and returns home after 10 seconds. Orange floor ring marks your base. First completion pays 120 coins plus 100 XP; tutorial replays pay 20 coins at most once per minute.

Solo games pause their clock and bot simulation while the mouse is released or a menu is open. Multiplayer rooms continue running. Incoming bot fire uses actual aim/ray hits with visible muzzle flashes and tracers. Damage shows a directional indicator and warning; targets flash when hit and briefly fall when eliminated. Spawn protection gives you time to reorient. Bot route finding avoids map walls.

## Environment and operators

Building names use transparent, wall-aligned lettering with an inset shadow effect, attached to facades; no floating building-name cards. Objective labels remain gameplay indicators. Vanguard, Sentinel and Scout now have different visible kits and explanatory descriptions; all three styles have equal combat stats. Armor colors update the live preview and saved operator.

The requested generated image is a design concept for the wall lettering and combat presentation, not a rendered screenshot of the implementation.

## Validation

Eleven automated tests cover original combat/progression, flag pickup/delivery, visible bot shooting, respawns, paused clocks, deathmatch rewards and idempotency, optional tutorials, legacy completion migration, and online deathmatch scoring/free entry/draws. JavaScript syntax, literal UI element references and articulated rig transforms are checked. Browser visual/play-feel verification remains unavailable following the earlier declined local-preview request.

---

## Earlier update notes

# Block Boroughs 0.8: Arcade FPS movement

Start with Node.js 18 or newer:

```sh
npm start
```

Open http://localhost:3000. No package installation is needed. Friends connect to the same running server address. `npm test` runs nine integration and physics tests. Existing operator and guild data remain in `data/progression.json` when you replace application files; keep your existing data directory.

## Krunker-inspired feel update

Original implementation informed by Krunker references; no Krunker code or assets included. This is a close-approach prototype, not a verified exact match to proprietary game physics. The live reference stayed on its loading screen, and local browser preview access was declined. Visuals and subjective feel therefore still need side-by-side play-testing.

- Shared 120 Hz physics substeps run in both server authority and local prediction. The server runs at approximately 60 Hz; client input requests run at up to 30 Hz. Networking still uses HTTP polling, so internet latency can affect the feel.
- Faster grounded acceleration, diagonal strafing, air control, momentum retention and capped slide-hop speed. Shift now crouches/slides instead of sprinting. Press Shift just before landing, then jump again to carry slide momentum. Ground slides can also begin by crouching while moving quickly.
- Low cover is now jumpable and landable. Crouching lowers the camera, character and authoritative hitboxes together.
- Wider default 90-degree FOV, reduced head bob, immediate camera look, ADS sensitivity reduction, independent weapon FOV, block arms, weapon sway/recoil and animated magazine/hand reload motion.
- Cleaner arcade HUD: large health/ammo, compact shield/objective indicators and movement speed. Existing shields, guilds, training, map themes and armory remain.
- Faster rifle and SMG cadence, longer rifle/marksman range, automatic empty-magazine reload, and in-match owned-weapon switching that preserves magazine counts.
- Synthesized firing, jumping and footstep sounds. Sound volume, mouse sensitivity, FOV, weapon bob and shadows save per browser.

## Controls

| Input | Action |
| --- | --- |
| WASD | Move / strafe |
| Space | Jump; holding repeats jumps on landing |
| Shift or left Ctrl | Crouch / slide |
| Left mouse | Fire |
| Right mouse | Aim down sights |
| R | Reload |
| E | Cycle purchased weapons |
| 1 / 2 / 3 / 4 | Equip owned rifle / SMG / marksman / shotgun |
| B | Armory; purchase at your home base |
| F2 | FPS settings |
| Tab | Scoreboard |
| Esc | Release mouse |

Touch controls include movement, jump, slide, aim, reload and fire buttons.

100 HP plus 50 shield. Shield recharge starts after five seconds without damage. AR/SMG/marksman/shotgun magazines hold 30/36/8/6 rounds. Reloads take 1.8 seconds, or 2.4 seconds for shotgun. Reserve ammunition is unlimited.

## Validation

Nine passing tests cover multiplayer combat and objectives, purchases and magazine-preserving quick equip, guild progression, training collision/aim, jumping, ray geometry, shields and reloads, frame-rate-independent movement, slide-hop momentum, landable low cover and crouch hitboxes. Rig walk/aim/jump/reload transforms checked for finite values; HTML element references and JavaScript syntax checked. Browser visual QA remains unverified.

## Reference material

- https://krunker.io/guides/controls/
- https://docs.krunker.io/guides/game-logic
- https://www.speedrun.com/krunker/guides/vm2um
- https://blockbench.net/wiki/guides/minecraft-style-guide/

---

## Previous version notes

# Block Boroughs 0.7: Voxel Ops

Run with Node.js 18 or newer:

```sh
npm start
```

Open http://localhost:3000. Friends must connect to the same running server address. No installation of packages is needed. Run `npm test` for the combat, multiplayer and progression checks.

## This update

Original Minecraft-inspired articulated characters replace the imported soldier. Hip/knee and shoulder/elbow pivots animate walking, aiming, jumping and reloading; armor colors work in the animated operator preview. Both arenas have additional server-authoritative lane cover. Copper Harbor uses warm masonry, quay details and voxel planting; Neon Garden uses dark facades, cyan trim and a lit city skyline. Dynamic soft shadows follow moving players.

100 HP plus 50 shield; shields regenerate at 12 points/sec after five seconds without damage. AR/SMG/DMR/shotgun magazines hold 30/36/8/6 rounds. R reloads (1.8 seconds, shotgun 2.4); ammunition replenishes on respawn. No reserve ammunition limit. Shift sprints; right mouse aims with a narrower field of view. Reloading blocks shots on the server. Training uses the same shield/reload rules.

The tactical HUD displays health, shields, magazine state, reload timer, objective status, minimap and hit feedback. Existing profiles, guild progression and room-code multiplayer are retained.

## Design references

Used as visual inspiration only; no marketplace assets copied:
- https://blockbench.net/wiki/guides/minecraft-style-guide/
- https://learn.microsoft.com/en-us/minecraft/creator/documents/blockbench
- https://www.minecraft.net/en-us/marketplace/pdp/team-visionary/cyberpunk-mashup/2f31f3c3-6fff-40e3-a20b-31541609dcc6
- https://book.leveldesignbook.com/process/combat/cover

## Verification

Seven automated checks cover multiplayer combat/capture, loadouts, guild progression, training collisions and aim, jumping, ray geometry, shield absorption/recharge and reload completion. JavaScript syntax checked. Browser visual QA could not run in the editing environment because its Chromium executable is unavailable. Please play-test balance and rendering on your target hardware.
