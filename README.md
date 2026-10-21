# Gridiron

An original, single-player arcade football game in your browser. Play offense against a simulated opponent over four quarters using the built-in fictional players or a manually entered roster.

Play: https://machine0005-a11y.github.io/gridiron/

- No install or account required. Mouse and touch controls.
- Drag to aim and release to throw; tap to tuck and run. Drag to steer a runner.
- Enter at least four players as `Name, POS, rating`. Supported positions: QB, RB, WR, TE. Ratings are clamped to 50–99; missing positions use fictional defaults.
- Rosters remain in the current tab until reload. No roster data is sent to a server.
- Sleeper/ESPN URL import, real weekly matchup synchronization, multiplayer, and result sharing are not implemented.
- Original game. Not affiliated with any league, players' association, or existing football title. Player names are text labels supplied by you.

## Checks

Run `node test.cjs` (Node.js built-in modules only). Tests cover simulation completion, roster validation, cancellation, duplicate kicks, drive skipping, and final-quarter handling. These are deterministic logic tests with a minimal DOM stub, not full browser or device tests.

## Hosting and rollback

Existing GitHub Pages deployment publishes main. The pre-launch baseline is commit `36d7d0cdc6fdddd0faf1db9b74d5c8361ba7dc4f` (tree `8f172403248422ed468c80c3f6bf2246b4f40d81`). Roll back by reverting the launch commit on main, then confirm the Pages build and live game; do not force-reset shared history.
