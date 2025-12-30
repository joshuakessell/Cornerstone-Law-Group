# intro-movie-and-default-light

Implement the intro movie overlay experience and switch the site to light mode by default (dark mode still available via the existing toggle).

## Requirements

### A) Video format and delivery
1. Ensure the intro video is served in a web-optimized format:
   - Prefer WebM (VP9 + Opus) with MP4 fallback (H.264 + AAC).
2. Video must be loaded efficiently:
   - Use preload="metadata" (not "auto")
   - Use playsInline
   - Do not autoplay
3. Add sources in this order in the <video> element:
   - /intro_video.webm (type="video/webm")
   - /intro_video.mp4 (type="video/mp4")

### B) First-visit overlay behavior
On a user’s first visit:
1. Darken the entire browser screen with an overlay.
2. Center the video on screen, paused by default.
3. Show small text above the video:
   - "Volume up for the best experience."
4. Show very small text beneath the video:
   - "Dramatization. No actual incidents occurred"
5. Show a normal-sized button beneath the video:
   - "Skip movie"
6. Block scrolling while overlay is open.
7. Store a persistent flag when the user completes the intro or skips it:
   - localStorage key: "clg_intro_seen" with value "1"

### C) Playback and transition sequence
After the user clicks Play:
1. Video plays from the beginning.
2. During the last second of the movie, the entire screen fades to white.
3. After fade-to-white completes, show large text centered on the white screen:
   - "It doesn't have to be like this..."
4. Text styling:
   - Font: Avenir Next LT Pro Demi (use CSS font-family stack with fallbacks)
   - Responsive size based on viewport (mobile smaller, desktop larger)
5. Text fades in, lingers briefly, then the overlay and message fade out into the default light version of the site.

Implementation detail guidance (use a robust approach):
- Listen to timeupdate and/or a requestAnimationFrame loop while playing.
- When (duration - currentTime) <= 1.0 seconds:
  - Start the white fade transition (duration ~1000ms).
- On ended:
  - Ensure white overlay is fully opaque.
  - Fade in the message.
  - Linger ~1500-2500ms.
  - Fade out overlay to reveal the site.

### D) Replay Video button in the top toolbar
1. Add a "Replay Video?" button in the top right toolbar, to the right of "Client Intake".
2. Button style:
   - Transparent background
   - White text
   - White border optional (subtle)
   - Small size
3. Clicking it should:
   - Open the intro overlay again
   - Restart the video from the beginning
   - Not require clearing localStorage
   - Not change the user’s theme choice

### E) Light mode default
There is an existing dark/light toggle left of the Clio button and it works.
Change behavior:
1. Default theme should be LIGHT on first visit.
2. Keep persistence:
   - localStorage key: "clg_theme" with values "light" or "dark"
3. If "clg_theme" is not present:
   - Use light
4. Apply theme class early to avoid flash:
   - If stored theme is dark, apply the dark class to <html> before paint.

## Implementation instructions for Cursor Agent

1. Identify the framework (React/Next/Vue/static) and the existing theme toggle implementation.
2. Implement an "IntroOverlay" as a self-contained component with state machine:
   - closed
   - idle (visible, paused)
   - playing
   - fadingToWhite
   - message
   - exiting
3. Provide a global way to open it from the header:
   - React: Context provider + hook (preferred), or a simple event emitter
   - Non-React: use a singleton controller or custom event
4. Ensure accessibility:
   - Esc key closes the overlay (treat as Skip)
   - Focus is managed (focus Skip or Play button when opened)
   - Buttons have aria-labels
5. Make animations respect prefers-reduced-motion:
   - If reduced motion, skip fade timing and go directly to the message then close quickly.

## Files and placement (adapt to repo structure)
- Put optimized video in the public/static assets directory used by the project:
  - intro_video.webm
  - intro_video.mp4
- Add new component file(s) in the project’s component directory.
- Update the header/topbar component to add Replay Video? button.
- Update theme initialization to default to light and apply dark early only when saved.

## Acceptance checklist (must pass)
- Fresh browser session (no localStorage keys):
  - Site loads in light mode behind overlay
  - Overlay appears with paused video and both disclaimer texts
  - Skip movie closes overlay and sets clg_intro_seen=1
- Clicking Play:
  - Video plays
  - White fade starts in last ~1s
  - Message appears on full white
  - Then transitions to the site
- Returning visitor (clg_intro_seen=1):
  - No overlay shown by default
- Replay Video? button:
  - Always opens overlay and restarts video
- Theme:
  - No saved theme -> light
  - Saved dark -> dark applies before paint
  - Toggle still works and persists
