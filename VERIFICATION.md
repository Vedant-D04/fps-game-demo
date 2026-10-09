# Terrain update verification — 0.10.0

32 automated test groups pass, including both terrain maps: route/base connectivity, stairs and ramps in both directions at 30/60/144 FPS, platform jumping, negative beach elevation, low-cover rays on slopes, hill obstruction and all solo mode spawns/flag pickup/return. Numerical Three.js scene construction checks finite terrain geometry, character transforms, flag meshes and tracer meshes. No GPU/browser appearance or network latency claim is made.

Ground heights are sampled from the same two triangles per cell as the terrain mesh. Stair boxes have explicit support heights. Cover has a ground-relative base and consistent server/rendered top. Character hitboxes remain simplified regions rather than animated limb meshes.

The topology PNG shows exact coordinate locations and 0.5 m contours, three route centerlines, boundary, cover, stairs and flag/home locations. The two arenas share their route graph and have distinct terrace heights and visual themes; they are not two unrelated layouts.

# Shooting verification — 0.9.5

Run `npm test`. Result: all 26 test groups passed. This is automated numerical and local HTTP verification, not browser gameplay certification or a claim to cover every possible FPS defect.

| Verification | Evidence | Result |
| --- | --- | --- |
| Ray/box geometry | 2,000 seeded cases compared against a separate six-face intersection oracle | Pass |
| Boundary conditions | Parallel rays, grazing faces, origin inside solid, solid behind ray, range clipping | Pass |
| Low cover | 384 combinations: four directions, six cover heights, two stances, two elevations, four distances | Pass |
| Occlusion ordering | Near target, reversed target order, dead target, wall before target | Pass |
| Hit regions | 27 stance/elevation/head-torso-limb combinations | Pass |
| Character yaw | Frontal torso classification at 36 character rotations | Pass after fix |
| Platform support | Landing and firing above cover at 30, 60 and 144 simulation FPS | Pass |
| Tracer records | Authoritative origin, endpoint, zone and hit flag | Pass |
| Recoil | All four weapons, 800 long-spray samples, finite bounds, protected initial yaw, ADS/crouch reduction, moving/air error, counter-aim and recovery | Pass |
| Reload and respawn | Exact reload deadline, ammunition refill and recoil reset | Pass |
| Existing gameplay | Local HTTP multiplayer, damage/shields, weapon timing, deathmatch rewards, CTF, movement, map connectivity | Pass |
| Animated rig | Finite world transforms for walk, aim, jump and reload | Pass; separate numerical rig check |

## Failure corrected

The character mesh rotated with facing direction but head/torso/limb boxes remained aligned to world axes. A frontal torso shot could be classified as an arm hit when the character faced along the X direction. Rays now transform into each target's local coordinate system before region intersection. A regression checks 36 rotations.

The initial pose test also assumed a chest-center ray fired into the character's side should count as torso damage. An arm legitimately occludes that ray. The pose test now aims from the front; the separate rotation test exposed the actual world-axis bug.

## Limits and pending checks

- No browser visual/playability run was performed. Screen crosshair alignment, viewmodel overlap, particle timing and perceived controls require browser inspection.
- Platform tests validate physics and authoritative ray geometry; they do not establish visual prediction accuracy with network delay.
- Real remote multiplayer under latency, jitter, packet loss and server stalls has not been validated. Existing HTTP tests run locally.
- Historical target rewind/lag compensation is not implemented. Moving targets on delayed snapshots can disagree with current server positions.
- Hitboxes are simplified rotated regions, not limb-by-limb animated mesh collision. Highly animated poses can differ from the region geometry.
- Recoil uses original tuning inspired by Riot's explanation; it is not a reproduction of Valorant weapon statistics.

## Primary references

- Riot, The State of Hit Registration: https://playvalorant.com/en-gb/news/dev/the-state-of-hit-registration/ — server-confirmed impact classification, moving/crouching targets, delayed hit VFX.
- Riot, Peeking into VALORANT's Netcode: https://www.riotgames.com/en/news/peeking-valorants-netcode — target rewind and limits under latency.
- Valve Source SDK collision utilities: https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/public/collisionutils.cpp — bounded ray intersections, parallel cases, start-solid handling.
- Valve networking: https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking — prediction, interpolation and authoritative hit testing.
- Riot Patch 11.08: https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-11-08/ — protected spray bullets, yaw switching and recovery/tap behavior.
- Riot Patch 6.11: https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-6-11/ — running/jumping firing error.
