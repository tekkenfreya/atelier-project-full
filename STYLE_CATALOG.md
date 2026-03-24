# Orbit-Matter Style Catalog

> **Source:** `d:\Downloads\CGMWTNOV2025\CGMWTNOV2025\orbit-matter`
> **Purpose:** Complete reusable pattern reference extracted from the orbit-matter project. Pick any pattern below and adapt it to vectrx sections without re-reading the reference.

## Pattern Index — Quick Scan

| # | Name | What It Is |
|---|---|---|
| 2a | **Billboard** | Massive screen-filling heading text |
| 2b | **Section Title** | Bold all-caps section intro heading |
| 2c | **Card Title** | Smaller heading inside cards/components |
| 2d | **Tech Tag** | Tiny monospaced labels and metadata |
| 2e | **Reading Text** | Normal-case body paragraphs |
| 3a | **Cinematic Splash** | Full-screen hero with photo, gradient, and overlaid content |
| 3b | **Frozen Word** | Giant word pinned behind scrolling content |
| 3c | **Sideways Scroll** | Section freezes, content slides horizontally via scroll |
| 3d | **Card Fan** | Cards arranged on a circular arc, fan open on scroll |
| 3e | **Info + Form** | Two-column: info left, form inputs right |
| 3f | **Exploding Grid** | 3x2 card grid that scatters apart on scroll |
| 4a | **Metric Chip** | Small dark stat card with accent dot |
| 4b | **Spotlight Card** | Light-background card with inverted colors |
| 4c | **Diamond Photo** | Image card with octagonal clip-path corners |
| 4d | **Service Slide** | Tall card for horizontal slider items |
| 4e | **Vintage Portrait** | Desaturated sepia team member card |
| 5 | **Bracket Button** | Button with corner-line hover animation |
| 6a | **Starfield** | Subtle dot grid background texture |
| 6b | **VHS Static** | Horizontal scan-lines slowly scrolling upward |
| 6c | **Bottom Fade** | Dark gradient overlay for text readability |
| 6d | **Radar Grid** | Mouse-following grid highlight behind content |
| 6e | **Diamond Cut** | Octagonal clip-path shape on containers |
| 7a | **Curtain Rise** | Text lines slide up from behind a mask |
| 7b | **Matrix Type** | Characters appear randomly like a terminal |
| 7c | **Highlighter Swipe** | Text fills from dark to light on scroll |
| 7d | **Drop Panel** | FAQ accordion expand/collapse |
| 7e | **Card Explosion** | Paired cards scatter outward on scroll |
| 7f | **Spotlight Carousel** | Center slide scales up, sides shrink |
| 7g | **Iris Open** | Detail panel slides up with circular clip-path |
| 7h | **Pixel Dissolve** | Grid blocks vanish randomly (preloader exit) |
| 7i | **Pixel Wipe** | Grid blocks cover/reveal screen (page transition) |
| 7j | **Odometer** | Number counter rolls to next digit on scroll |
| 8a | **Butter Scroll** | Smooth scroll via Lenis |
| 8b | **Freeze Frame** | Section pins to viewport during scroll |
| 8c | **Scroll-Linked** | Animation position tied to scroll % |
| 8d | **Enter/Exit** | Animation plays/reverses on scroll in/out |
| 9a | **Slot Machine Row** | List row rolls to colored variant on hover |
| 9b | **Mouse Trail** | Grid squares light up near cursor |
| 9c | **Dropdown Nav** | Mobile menu expands/collapses |
| 9d | **Infinite Deck** | Carousel with buffer-managed prev/next |
| 10 | **One-Cut** | Single 1000px breakpoint for all responsive |

---

## 1. Color Palette & Token Mapping

Orbit-matter uses a 5-token system. Vectrx maps each to its own design tokens.

| Orbit-Matter Token | Orbit Value | Vectrx Token | Vectrx Value | Usage |
|---|---|---|---|---|
| `--base-100` | `#f2eeda` | `--text-primary` | `#f2f2f0` | Primary text, heading color |
| `--base-200` | `#8c8a7f` | `--text-secondary` | `#8a8a82` | Secondary text, labels, muted copy |
| `--base-300` | `#262626` | `--bg-card` | `#141414` | Card backgrounds, section surfaces |
| `--base-400` | `#141414` | `--bg-primary` | `#0a0a0a` | Page background, button bg |
| `--base-500` | `#ee6436` | `--accent` | `#4361ee` | Accent color, CTAs, highlights |

**Additional vectrx tokens not in orbit-matter:**
- `--bg-secondary: #0e0e0e` — section alternates
- `--bg-card-hover: #1a1a1a` — card hover state
- `--surface-light: #ede9e2` — dirty white for light-surface cards
- `--border: #1f1f1f` / `--border-hover: #2a2a2a`
- `--accent-hover: #6b84f1` / `--accent-dim: rgba(67, 97, 238, 0.15)`
- `--text-muted: #404040`

**Border pattern (orbit-matter):**
```css
border: 1px solid rgba(242, 238, 218, 0.15);
```
**Vectrx equivalent:**
```css
border: 1px solid var(--border);
/* or for subtle: */
border: 1px solid rgba(242, 242, 240, 0.15);
```

---

## 2. Typography Styles

### 2a. "Billboard" — Display / Cinematic — SCHABO

> The massive, impossible-to-miss text that fills the entire screen. Think of a movie poster title — all caps, tightly packed letters, taking up as much space as possible. Used when one word needs to own the whole viewport (like "MISSIONS" frozen behind scrolling content).

```css
/* orbit-matter: h1 */
font-family: "SCHABO", sans-serif;
font-size: clamp(4rem, 10vw, 10rem);
font-weight: 500;
line-height: 0.85;
letter-spacing: clamp(-0.05rem, -1vw, -0.15rem);
text-transform: uppercase;
```

**Vectrx adaptation:**
```css
font-family: var(--font-display);
font-size: clamp(4rem, 10vw, 10rem);
font-weight: 500;
line-height: 0.85;
letter-spacing: clamp(-0.05rem, -1vw, -0.15rem);
text-transform: uppercase;
```

### 2b. "Section Title" — Section Heading — SCHABO

> The bold all-caps heading that introduces a new section of the page. Slightly smaller than Billboard but still large and commanding. The first thing your eye lands on when a new section scrolls into view.

```css
/* orbit-matter: h2 */
font-family: "SCHABO", sans-serif;
font-size: clamp(3.25rem, 8vw, 8rem);
font-weight: 500;
line-height: 0.85;
letter-spacing: clamp(-0.025rem, -0.75vw, -0.1rem);
text-transform: uppercase;
```

### 2c. "Card Title" — Sub-Heading — SCHABO

> A smaller version of the section heading. Used inside cards, FAQ questions, or as a secondary title within a section. Still all-caps and condensed, but doesn't dominate the page — it labels a specific piece of content.

```css
/* orbit-matter: h3 */
font-family: "SCHABO", sans-serif;
font-size: clamp(2.5rem, 6.5vw, 5rem);
font-weight: 500;
line-height: 0.85;
letter-spacing: clamp(0rem, -0.5vw, -0.075rem);
text-transform: uppercase;
```

### 2d. "Tech Tag" — Mono Label — Geist Mono

> The tiny, all-caps monospaced text you see on buttons, navigation links, metadata badges, and small labels. Looks like a terminal readout or data tag. It's the "fine print" font — small, precise, and technical-looking.

```css
/* orbit-matter: a, p (default) */
font-family: "Geist Mono", monospace;
font-size: clamp(0.8rem, 0.75vw, 0.85rem);
font-weight: 500;
line-height: 1;
text-transform: uppercase;

/* Size variants */
/* .md */ font-size: clamp(1rem, 0.8vw, 1.25rem);
/* .lg */ font-size: clamp(1.1rem, 0.85vw, 1.35rem);
```

**Vectrx:** `font-family: var(--font-mono);`

### 2e. "Reading Text" — Body Copy — Host Grotesk

> The only font that's normal case (not uppercase). This is the comfortable, readable font for paragraphs and descriptions — the text people actually sit and read. Slightly heavier than typical body text (weight 450) with tight line-height.

```css
/* orbit-matter: p.bodyCopy */
font-family: "Host Grotesk", sans-serif;
font-size: clamp(1.125rem, 0.75vw, 1.25rem);
font-weight: 450;
line-height: 1.1;
text-transform: none;

/* Size variants */
/* .md */ font-size: clamp(1.25rem, 0.85vw, 1.35rem);
/* .lg */ font-size: clamp(1.375rem, 0.95vw, 1.45rem);
```

**Vectrx:** `font-family: var(--font-body);` with class `body-copy`

---

## 3. Layout Patterns

### 3a. "Cinematic Splash" — Full-Viewport Hero

> The landing screen that fills your entire browser window. A big photo/image takes up the whole background, a dark gradient fades in at the bottom so you can read text over it, and content sits at the top and bottom edges (like a movie poster — logo top-left, tagline bottom-left). Everything is inset with generous padding.

```css
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Content overlaid on image */
.hero-content .container {
  padding: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;  /* top nav / bottom footer */
  align-items: flex-start;
}

/* Two-column ratio within hero content */
.hero-content-nav div:nth-child(1) { flex: 4; }
.hero-content-nav div:nth-child(2) { flex: 1; }
```

### 3b. "Frozen Word" — Pinned Scroll Header

> One giant word (like "MISSIONS") at 20vw size sits dead center of the screen and freezes in place. As you keep scrolling, the next section's content slides up and covers it like a curtain being pulled over a sign. The word stays behind everything — it never moves, the page moves over it. Creates a dramatic depth effect.

```css
.featured-missions-header {
  position: relative;
  width: 100vw;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  z-index: -1;   /* stays behind content */
}

.featured-missions-header h1 {
  font-size: 20vw;  /* massive display text */
}
```

```javascript
// JS: Pin the header while next section scrolls
ScrollTrigger.create({
  trigger: workHeaderSection,
  start: 'top top',
  endTrigger: nextSection,
  end: 'bottom bottom',
  pin: true,
  pinSpacing: false,
});
```

### 3c. "Sideways Scroll" — Horizontal Scroll Section

> The page freezes in place and instead of scrolling down, content slides sideways from right to left. A thin progress bar at the top fills from left to right showing how far through the horizontal content you are. The user is still scrolling their mouse wheel normally — but the movement is translated into horizontal sliding. Think Netflix row but controlled by scroll.

```css
.routine {
  position: relative;
  width: 100%;
  height: 100svh;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.routine-slider-wrapper {
  position: relative;
  width: 350%;  /* wider than viewport */
  height: 100%;
  display: flex;
  gap: 1.5rem;
  will-change: transform;
}

.routine-progress-bar {
  width: 100%;
  height: 0.25rem;
  background-color: #3f3f3f;
  overflow: hidden;
}

.routine-progress {
  width: 100%;
  height: 100%;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
}
```

```javascript
// JS: Pin + scrub horizontal scroll
ScrollTrigger.create({
  trigger: '.routine',
  start: 'top top',
  end: `+=${window.innerHeight * 5}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;
    const maxTranslateX = -(wrapperWidth - containerWidth);
    gsap.set(sliderWrapper, { x: progress * maxTranslateX });
    gsap.set(progressBar, { scaleX: progress });
  },
});
```

### 3d. "Card Fan" — Arc Card Layout

> Imagine holding a hand of playing cards and slowly fanning them open. That's this layout. Team member cards are arranged along an invisible curved arc (like the bottom of a circle). As you scroll, the cards spread apart along that curve, each one slightly tilted. A big number counter ticks up as each card enters view. The whole section stays frozen while the fan opens.

```css
.team {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.cards {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150vw;
  height: 600px;
}

.card {
  position: absolute;
  width: 425px;
  height: 575px;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  margin-left: -250px;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
```

```javascript
// JS: Position cards on arc
const arcAngle = Math.PI * 0.4;
const startAngle = Math.PI / 2 - arcAngle / 2;

function getRadius() {
  return window.innerWidth < 900
    ? window.innerWidth * 7.5
    : window.innerWidth * 2.5;
}

function positionCards(progress) {
  const radius = getRadius();
  const cardSpacing = 0.15;
  const initialOffset = -cardSpacing * (totalCards - 1);
  const totalTravel = 1 - initialOffset;
  const arcProgress = initialOffset + progress * totalTravel;

  cards.forEach((card, i) => {
    const cardOffset = (totalCards - 1 - i) * cardSpacing;
    const angle = startAngle + arcAngle * (cardOffset + arcProgress);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

    gsap.set(card, {
      x: x,
      y: -y + radius,
      rotation: -rotation,
      transformOrigin: 'center center',
    });
  });
}

// ScrollTrigger: 7x viewport height, pinned
ScrollTrigger.create({
  trigger: stickySection,
  start: 'top top',
  end: `+=${window.innerHeight * 7}px`,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => positionCards(self.progress),
});
```

### 3e. "Info + Form" — Two-Column Split

> A section split into two sides: the left side has the heading, description, and contact info (takes up about 80% of the width), and the right side has form inputs stacked vertically. The inputs have dark grey rounded backgrounds, uppercase placeholder text in monospace. The whole thing sits on a dark card surface with chamfered corners. On mobile, it collapses into a single column.

```css
.contact-form .container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 6rem;
}

/* Row with two columns */
.contact-form-row:nth-child(3) {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form inputs */
.form-item input,
.form-item textarea {
  border: none;
  outline: none;
  width: 100%;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-transform: uppercase;
  background-color: #3a3a3a;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 500;
  line-height: 1;
}
```

### 3f. "Exploding Grid" — Card Grid with Parallax

> Six image cards arranged in 3 rows of 2 (left + right). In the center sits a logo, tagline, and CTA button. As you scroll past, the cards fly outward — left cards drift left with counter-clockwise rotation, right cards drift right with clockwise rotation. It looks like the grid is exploding apart to reveal the CTA message in the middle. Each row scatters at different speeds and angles.

```css
.cta-row {
  position: relative;
  width: 100%;
  max-width: 2000px;
  margin: 0.75rem 0;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  pointer-events: none;
}

.cta-card {
  position: relative;
  flex: 1;
  height: 360px;
  border-radius: 0.75em;
  overflow: hidden;
  will-change: transform;
}
```

---

## 4. Card Styles

### 4a. "Metric Chip" — Stat Card

> A small, dark, rounded rectangle showing a single number or stat. Has a tiny colored dot (accent blue) to the left of a label, with the big number below it. Think of a dashboard widget — compact, informational, no images. Multiple of these sit side by side in a row. Subtle border gives it a slightly raised look against the dark background.

```css
.stat {
  flex: 1;
  background-color: var(--bg-card);          /* orbit: base-300 */
  border: 1px solid rgba(242, 242, 240, 0.15);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

/* Accent dot before label */
.stats-copy-label::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--accent);
}

.stats-copy-label p {
  margin-left: 1rem;
}
```

### 4b. "Spotlight Card" — Mission Card (Light Surface)

> The one card that stands out because it flips the color scheme — light/cream background with dark text instead of the usual dark-bg-light-text. Centered text, a wide landscape image (5:3 ratio) inside, generous padding. These stack vertically in a narrow centered column with big gaps between them. It's the "look at this featured thing" card.

```css
.featured-missions-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  background-color: var(--surface-light);   /* orbit: base-200 (#8c8a7f) */
  padding: 3rem 1.5rem;
  border-radius: 0.5rem;
}

/* Inverted text */
.featured-missions-item h3,
.featured-missions-item p {
  color: var(--bg-primary);
}

/* Image container */
.featured-mission-item-img {
  aspect-ratio: 5/3;
  overflow: hidden;
  border-radius: 0.5rem;
}
```

### 4c. "Diamond Photo" — CTA Card (Chamfered)

> A tall image card (360px) where the corners are cut at 45-degree angles instead of being rounded — giving it an octagonal, gem-like shape. A dark gradient fades up from the bottom over the image. These cards are the ones that fly apart in the "Exploding Grid" layout. On mobile, the diamond cut disappears and they become simple rounded rectangles.

```css
.cta-card {
  position: relative;
  flex: 1;
  height: 360px;
  border-radius: 0.75em;
  overflow: hidden;
  will-change: transform;
}

.cta-card-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--bg-card);
  clip-path: polygon(
    2rem 0px,
    calc(100% - 2rem) 0px,
    100% 2rem,
    100% calc(100% - 2rem),
    calc(100% - 2rem) 100%,
    2rem 100%,
    0px calc(100% - 2rem),
    0px 2rem
  );
}

.cta-card-gradient {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%);
  z-index: 1;
}
```

### 4d. "Service Slide" — Routine Block

> A tall, full-height card that slides by in the "Sideways Scroll" section. Dark grey background (#303030), rounded corners. Content is spread top-to-bottom: a title + label at the top, a big icon centered in the middle, and footer info at the bottom. Think of an app feature card in a horizontal carousel — self-contained, uniform height, lots of breathing room.

```css
.routine-block {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #303030;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header and footer rows */
.routine-block-header,
.routine-block-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.routine-block-header { align-items: flex-start; }
.routine-block-footer { align-items: flex-end; }

/* Centered icon */
.routine-icon {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  min-width: 5rem;
  aspect-ratio: 1;
}
```

### 4e. "Vintage Portrait" — Team Card

> A tall portrait card (425x575px) with a person's photo that's been desaturated and given a warm sepia tone — looks like an old photograph. Below the image is a name and role. These are the cards used in the "Card Fan" arc layout. The vintage filter gives all team photos a cohesive, editorial look regardless of the original photo quality.

```css
.card {
  position: absolute;
  width: 425px;
  height: 575px;
  left: 50%; top: 50%;
  transform-origin: center center;
  margin-left: -250px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  will-change: transform;
}

.card-img {
  flex: 1;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Desaturated + sepia image filter */
.card-img img {
  filter: saturate(0) sepia(1) brightness(0.85);
}

.card-content {
  width: 100%;
  height: 60px;
}

.card-content h3 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  letter-spacing: clamp(0rem, -0.5vw, -0.05rem);
  margin-bottom: 0.5rem;
}
```

**Mobile (≤1000px):** `width: 375px; height: 500px;`

---

## 5. "Bracket Button" — Corner-Line Button

> A dark, flat rectangle with a thin border. What makes it unique: small white accent lines sit along the edges — two horizontal lines (top and bottom, offset from center) and two vertical lines (left and right sides). On hover, all four lines slide to the corners and shrink, like brackets tightening around the text. The text also gets a subtle white glow. It's the only button style used across the entire site — understated until you hover, then it "locks on."

```css
a.btn {
  position: relative;
  width: max-content;
  min-width: 200px;
  height: 65px;
  padding: 0 2rem;
  font-weight: 400;
  letter-spacing: 1.8px;
  color: var(--text-secondary);
  background-color: var(--bg-primary);
  border: solid 1px var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Top line — starts 60px wide, 10% from left */
a.btn::before {
  content: '';
  position: absolute;
  top: 0; left: 10%;
  width: 60px; height: 1px;
  transform: translateY(-1px);
  background: var(--text-primary);
  transition: all 0.3s ease;
}

/* Bottom line — starts 60px wide, 10% from right */
a.btn::after {
  content: '';
  position: absolute;
  bottom: 0; right: 10%;
  width: 60px; height: 1px;
  transform: translateY(1px);
  background: var(--text-primary);
  transition: all 0.3s ease;
}

/* Hover: lines shrink to 20px and move to corners */
a.btn:hover {
  color: var(--text-primary);
  text-shadow: 0 0 10px rgba(242, 238, 218, 0.2);
}
a.btn:hover::before { left: 0; width: 20px; }
a.btn:hover::after  { right: 0; width: 20px; }

/* Vertical corner lines via .btn-line element */
.btn-line {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.btn-line::before {
  content: '';
  position: absolute;
  bottom: 30%; right: -1px;
  width: 1px; height: 20px;
  background: var(--text-primary);
  transition: all 0.3s ease;
}

.btn-line::after {
  content: '';
  position: absolute;
  top: 30%; left: -1px;
  width: 1px; height: 20px;
  background: var(--text-primary);
  transition: all 0.3s ease;
}

/* Hover: vertical lines snap to edges */
a.btn:hover .btn-line::before { bottom: -1px; }
a.btn:hover .btn-line::after  { top: -1px; }
```

**HTML structure:**
```html
<div class="btn">
  <a class="btn" href="#">
    <span>Button Text</span>
    <span class="btn-line"></span>
  </a>
</div>
```

---

## 6. Background Effects

### 6a. "Starfield" — CSS Dot Grid (already in vectrx)

> A pattern of tiny dots evenly spaced across the background, like stars in a night sky or a subtle graph paper. Each dot is 1px, spaced 28px apart in both directions. The dots use the accent color at low opacity, so they're barely visible but add texture to the otherwise flat dark background.

```css
background-image: radial-gradient(circle, var(--accent-dim) 1px, transparent 1px);
background-size: 28px 28px;
```

### 6b. "VHS Static" — Scan-Line Overlay

> Faint horizontal lines that slowly scroll upward over an image, like watching a VHS tape or an old CRT monitor. The lines are semi-transparent white stripes 4px tall with 5px gaps between them, slightly blurred. They drift upward continuously on a 30-second loop. Gives images a retro-surveillance or old-broadcast feel. Hidden on mobile.

```css
.hero-img-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(
    rgb(242 238 218 / 0.125),
    rgb(242 238 218 / 0.125) 4px,
    transparent 4px,
    transparent 10px
  );
  background-size: 100% 9px;
  filter: blur(2px);
  animation: pan-overlay 30s infinite linear;
  z-index: 1;
}

@keyframes pan-overlay {
  from { background-position: 0% 0%; }
  to   { background-position: 0% -100%; }
}
```

**Vectrx adaptation** (swap base-100 color):
```css
background: linear-gradient(
  rgba(242, 242, 240, 0.125),
  rgba(242, 242, 240, 0.125) 4px,
  transparent 4px,
  transparent 10px
);
```

**Mobile:** `display: none;`

### 6c. "Bottom Fade" — Dark Gradient Overlay

> A gradient that goes from 65% black at the bottom to fully transparent at the top. Laid over images so that text at the bottom of the image is readable against any photo. Like Instagram's gradient on stories — the bottom third darkens so white text pops. There's also a lighter 25% version for when you want less darkening.

```css
.hero-img-gradient {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}
```

**Lighter variant** (observatory hero):
```css
background: linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 100%);
```

### 6d. "Radar Grid" — Interactive Hover Grid

> An invisible grid of 60px squares covers the entire viewport behind all content. As you move your mouse, the square closest to your cursor lights up (its border changes to the accent color), plus one random neighboring square also lights up briefly. The highlights fade after 300ms. The effect is like a radar sweep — wherever your mouse goes, the grid pulses to life then fades back to dark. Purely decorative, lives behind everything.

```css
.interactive-grid {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100svh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.interactive-grid .block {
  position: absolute;
  border: 0.5px solid var(--bg-card);        /* orbit: base-300 */
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  will-change: transform;
}

.interactive-grid .block.highlight {
  border-color: var(--accent);               /* orbit: base-500 */
}
```

```javascript
// JS: Key constants
const GRID_BLOCK_SIZE = 60;
const GRID_HIGHLIGHT_DURATION = 300;  // ms
const mouseRadius = GRID_BLOCK_SIZE * 2;  // 120px detection radius

// Logic: On mousemove, find closest block within radius.
// Highlight it + 1 random adjacent neighbor.
// Remove highlight after GRID_HIGHLIGHT_DURATION via rAF loop.
```

### 6e. "Diamond Cut" — Clip-Path Chamfered Corners

> Instead of normal rounded corners, the container's corners are sliced off at 45-degree angles — making it an octagon shape (like a stop sign, but rectangular). The "full" version also has a small trapezoid notch cut into the top center edge, like a sci-fi data panel. Used on hero frames, footer, routine section, and contact form. On mobile, all diamond cuts are removed and shapes become plain rectangles. Two variants: full (4rem cuts + top notch) and simple (2rem cuts, no notch).

```css
/* Full chamfer with top-center notch */
clip-path: polygon(
  4rem 0px,
  calc(50% - 15rem) 0px,
  calc(50% - 13.5rem) 2.75rem,
  calc(50% + 13.5rem) 2.75rem,
  calc(50% + 15rem) 0px,
  calc(100% - 4rem) 0px,
  100% 4rem,
  100% calc(100% - 4rem),
  calc(100% - 4rem) 100%,
  4rem 100%,
  0px calc(100% - 4rem),
  0px 4rem
);

/* Simple chamfer (no top notch) — used on CTA cards, contact form */
clip-path: polygon(
  2rem 0px,
  calc(100% - 2rem) 0px,
  100% 2rem,
  100% calc(100% - 2rem),
  calc(100% - 2rem) 100%,
  2rem 100%,
  0px calc(100% - 2rem),
  0px 2rem
);
```

**Mobile (≤1000px):** `clip-path: none;`

---

## 7. Animation Patterns

### 7a. "Curtain Rise" — Line Mask Reveal

> Each line of text starts hidden below an invisible edge (like it's behind a wall), then slides upward into view one line at a time. Imagine a window blind — the text is below it and rises up to become visible. Lines come in with a slight delay between each one (stagger), creating a cascading top-to-bottom reveal. This is the #1 most-used animation across the entire site — headings, copy blocks, everything uses this entrance.

```css
/* CSS: mask wrapper */
.line-mask {
  position: relative;
  overflow: hidden;
  display: flex;
}

.line {
  position: relative;
  will-change: transform;
}
```

```javascript
// JS: Using SplitText with mask option
const split = SplitText.create(element, {
  type: 'lines',
  mask: 'lines',
  autoSplit: true,
  linesClass: 'line',
  onSplit(self) {
    gsap.set(self.lines, { yPercent: 100 });

    gsap.to(self.lines, {
      yPercent: 0,
      duration: 0.75,
      ease: 'power3.out',
      delay: delay,
      stagger: 0.1,
    });
  },
});

// Manual version (no SplitText — for vectrx):
// Wrap each line in overflow:hidden container
// gsap.set(lineRef, { yPercent: 100 });
// gsap.to(lineRef, { yPercent: 0, duration: 0.75, ease: 'power3.out' });
```

**Scroll-triggered variant:**
```javascript
ScrollTrigger.create({
  trigger: element,
  start: 'top 70%',
  animation: animation,
  toggleActions: 'play none none none',
});
```

### 7b. "Matrix Type" — Character Flicker

> Each letter starts invisible and pops into existence individually in random order — like characters appearing on a hacking terminal in a movie. The entire text materializes over about half a second, but individual letters appear almost instantly (0.05s each). Used for small labels and metadata to give them a "systems booting up" feeling.

```javascript
const split = SplitText.create(element, {
  type: 'chars',
  autoSplit: true,
  onSplit(self) {
    gsap.set(self.chars, { opacity: 0 });

    gsap.to(self.chars, {
      duration: 0.05,
      opacity: 1,
      ease: 'power2.inOut',
      stagger: {
        amount: 0.5,
        each: 0.1,
        from: 'random',
      },
    });
  },
});
```

**Vectrx adaptation (no SplitText):** Split text into individual `<span>` elements per character, then animate with same GSAP stagger config.

### 7c. "Highlighter Swipe" — Scroll Text Fill

> A paragraph of text starts in a dark, barely-visible color. As you scroll, each character changes from dark to light, left to right, word by word — like someone is running a highlighter across the text in sync with your scrolling. When you've scrolled all the way through, the entire paragraph is fully bright. Scroll back up and it dims again.

```javascript
const split = SplitText.create(h3Element, {
  type: 'words, chars',
  charsClass: 'char',
});

ScrollTrigger.create({
  trigger: '.intro-copy',
  start: 'top 75%',
  end: 'bottom 30%',
  onUpdate: (self) => {
    const progress = self.progress;
    const charsToColor = Math.floor(progress * split.chars.length);

    split.chars.forEach((char, index) => {
      char.style.color = index < charsToColor
        ? 'var(--text-primary)'     // orbit: base-100
        : 'var(--bg-card)';         // orbit: base-300 (dimmed)
    });
  },
});
```

```css
/* Each char must be inline-block for color transition */
.char {
  display: inline-block;
  will-change: color;
}
```

### 7d. "Drop Panel" — FAQ Accordion

> Click a question row and the answer panel smoothly expands downward while fading in. The arrow icon on the right side rotates 90 degrees to point down. Click again and it collapses back to zero height and the icon rotates back. Each FAQ item is a dark card with rounded corners. When the section first scrolls into view, all the FAQ items fade in from below with a slight stagger — one after another, top to bottom.

```javascript
// Open
gsap.to(icon, { rotation: 90, duration: 0.3, ease: 'power2.out' });

answer.style.height = 'auto';
const contentHeight = answer.scrollHeight;
answer.style.height = '0';

gsap.to(answer, {
  height: contentHeight,
  opacity: 1,
  duration: 0.5,
  ease: 'power2.out',
});

// Close
gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' });
gsap.to(answer, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.out' });
```

```css
.faq-item {
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-card);
  border-radius: 0.5rem;
}

.faq-question {
  padding: 0.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.faq-answer {
  height: 0;
  opacity: 0;
  overflow: hidden;
  will-change: height, opacity;
}
```

**Staggered entry of FAQ items:**
```javascript
gsap.set(faqItems, { opacity: 0, y: 30 });
gsap.to(faqItems, {
  opacity: 1, y: 0,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
  delay: 0.3,
  scrollTrigger: {
    trigger: faqSection,
    start: 'top 70%',
    toggleActions: 'play none none none',
  },
});
```

### 7e. "Card Explosion" — Parallax Card Scatter

> Three rows of paired image cards. As you scroll, the left card in each row flies to the left (up to 900px) while rotating counter-clockwise, and the right card mirrors it — flying right with clockwise rotation. Each row has different speeds: top row drifts far, middle row drifts further, bottom row drifts moderately. The result looks like the card grid is blowing apart, revealing the CTA content behind it. All motion is tied directly to scroll position.

```javascript
const leftXValues  = [-800, -900, -400];
const rightXValues = [800, 900, 400];
const leftRotationValues  = [-30, -20, -35];
const rightRotationValues = [30, 20, 35];
const yValues = [100, -150, -400];

gsap.utils.toArray('.cta-row').forEach((row, index) => {
  const cardLeft = row.querySelector('.cta-card-left');
  const cardRight = row.querySelector('.cta-card-right');

  gsap.to(cardLeft, {
    scrollTrigger: {
      trigger: '.cta',
      start: 'top center',
      end: '150% bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        cardLeft.style.transform = `translateX(${p * leftXValues[index]}px) translateY(${p * yValues[index]}px) rotate(${p * leftRotationValues[index]}deg)`;
        cardRight.style.transform = `translateX(${p * rightXValues[index]}px) translateY(${p * yValues[index]}px) rotate(${p * rightRotationValues[index]}deg)`;
      },
    },
  });
});
```

### 7f. "Spotlight Carousel" — Scale-Based Slider

> A horizontal row of image slides. The center (active) slide is 10% bigger than normal and sits in front. The slides on either side are 25% smaller, creating a clear "this one is selected" effect — like a Cover Flow album view. Click prev/next arrows and slides smoothly shift position with the new center slide scaling up while the old one shrinks. Slides are spaced 400px apart.

```javascript
const SPACING = 0.4;
const SLIDE_WIDTH = SPACING * 1000;  // 400px between slides
let BUFFER_SIZE = 3;  // desktop: 3, mobile: 1

function updateSliderPosition() {
  const tl = gsap.timeline();
  slideItems.forEach((item) => {
    const isActive = item.relativeIndex === 0;
    tl.to(item.element, {
      x: item.relativeIndex * SLIDE_WIDTH,
      scale: isActive ? 1.1 : 0.75,
      zIndex: isActive ? 100 : 1,
      duration: 0.75,
      ease: 'power3.out',
      force3D: true,
    }, 0);
  });
}
```

### 7g. "Iris Open" — Preview Expand

> A detail panel hides below the screen. When you click a circular controller button, the panel slides up to fill half the viewport while the surrounding carousel items fade outward. The controller itself does a cool thing: its outer ring shrinks inward (like a camera iris closing) while the inner circle expands, revealing an X close icon whose two lines grow from zero width. Clicking again reverses everything — panel drops, slides come back, iris reopens. Smooth and sci-fi.

```javascript
// Panel slide
gsap.to(tracePreview, {
  y: isOpen ? '100%' : '-50%',
  duration: 0.75,
  ease: 'power3.inOut',
});

// Controller clip-path
gsap.to(controllerOuter, {
  clipPath: opening ? 'circle(0% at 50% 50%)' : 'circle(50% at 50% 50%)',
  duration: 0.75,
  ease: 'power3.inOut',
});

gsap.to(controllerInner, {
  clipPath: opening ? 'circle(50% at 50% 50%)' : 'circle(40% at 50% 50%)',
  duration: 0.75,
  ease: 'power3.inOut',
});

// Close icon stagger
gsap.to(closeIconSpans, {
  width: opening ? '20px' : '0px',
  duration: opening ? 0.4 : 0.3,
  ease: opening ? 'power3.out' : 'power3.in',
  stagger: opening ? 0.1 : 0.05,
  delay: opening ? 0.2 : 0,
});
```

### 7h. "Pixel Dissolve" — Preloader Grid Scatter

> The screen starts completely covered by a grid of small dark squares (60px each). After the loading animation plays (spinning rings), the squares start vanishing one by one in random order — like pixels being erased from a screen. Each square blinks out nearly instantly (0.05s), but they're staggered randomly over 0.5 seconds total, creating a "dissolving screen" effect that reveals the page underneath. Only shows on first visit (tracked via sessionStorage).

```javascript
const timeline = gsap.timeline({ delay: 1.75 });

// Fade out loading animation
timeline.to(preloaderAnimationWrapper, { opacity: 0, duration: 0.3 });

// Scatter blocks out
timeline.to(blocks, {
  opacity: 0,
  duration: 0.05,
  ease: 'power2.inOut',
  stagger: {
    amount: 0.5,
    each: 0.01,
    from: 'random',
  },
});
```

```css
.preloader-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100svh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.preloader-block {
  position: absolute;
  background-color: var(--bg-primary);
  opacity: 1;
  will-change: opacity;
}
```

### 7i. "Pixel Wipe" — Page Transition Grid

> The reverse of the Pixel Dissolve — used when navigating between pages. When you click a link, dark squares randomly appear and cover the screen (like pixels filling in), then the browser navigates. On the new page, the squares randomly disappear again to reveal the content. Same random stagger effect in both directions. It replaces the normal "white flash" of page navigation with a stylish grid wipe. Uses sessionStorage so the new page knows to play the reveal.

```javascript
// Cover: blocks fade in randomly
function animateTransition() {
  return new Promise((resolve) => {
    gsap.set(blocks, { opacity: 0 });
    gsap.to(blocks, {
      opacity: 1,
      duration: 0.05,
      ease: 'power2.inOut',
      stagger: { amount: 0.5, each: 0.01, from: 'random' },
      onComplete: () => setTimeout(() => resolve(), 300),
    });
  });
}

// Reveal: blocks fade out randomly
function revealTransition() {
  gsap.to(blocks, {
    opacity: 0,
    duration: 0.05,
    ease: 'power2.inOut',
    stagger: { amount: 0.5, each: 0.01, from: 'random' },
    onComplete: () => ScrollTrigger.refresh(),
  });
}

// State tracking
sessionStorage.setItem('pageTransition', 'true');  // before navigating
// On new page load: check sessionStorage, if true → reveal
```

```css
.transition-grid {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.transition-block {
  position: absolute;
  background-color: var(--bg-primary);
  opacity: 0;
}
```

### 7j. "Odometer" — Counter Scroll

> A big number display (150px tall) inside a clipped window that only shows one number at a time. As you scroll, the number column slides up to reveal the next number — like a mechanical odometer or slot machine rolling to the next digit. Used alongside the "Card Fan" to show which team member (01, 02, 03...) is currently in focus. Each number snaps into position with a quick 0.3s animation, not smooth scrolling.

```javascript
const positions = [150, 0, -150, -300, -450, -600, -750];
const startProgress = 0.15;
const endProgress = 0.9;

function updateTeamCounter(progress) {
  let index;
  if (progress < startProgress) {
    index = 0;
  } else if (progress > endProgress) {
    index = 6;
  } else {
    const normalizedProgress = (progress - startProgress) / (endProgress - startProgress);
    index = Math.min(6, Math.floor(normalizedProgress * 7));
  }

  gsap.to(countContainer, {
    y: positions[index],
    duration: 0.3,
    ease: 'power1.out',
    overwrite: true,
  });
}
```

```css
.count {
  position: relative;
  width: max-content;
  height: 150px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  overflow: hidden;
}

.count-container {
  position: relative;
  transform: translateY(150px);
  will-change: transform;
}

.count h1 {
  font-size: 150px;
  line-height: 1;
  will-change: transform;
}
```

---

## 8. Scroll Patterns

### 8a. "Butter Scroll" — Lenis Configuration

> Makes the entire page scroll feel smooth and buttery instead of the default jerky browser scroll. On desktop it's slower and more cinematic (duration 1.2), on mobile it's snappier (duration 0.8). Connected to GSAP so all scroll-triggered animations stay perfectly in sync with the smooth scroll position.

```javascript
const isMobile = window.innerWidth <= 1000;

const lenis = new Lenis({
  duration: isMobile ? 0.8 : 1.2,
  lerp: isMobile ? 0.075 : 0.1,
  smoothWheel: true,
  syncTouch: true,
  touchMultiplier: isMobile ? 1.5 : 2,
});

// Sync with GSAP + ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 8b. "Freeze Frame" — ScrollTrigger Pin

> The section sticks to the viewport and refuses to scroll away. While the user keeps scrolling their wheel, the section stays frozen and uses that scroll input to drive animations inside it (like the sideways slider or the card fan). The scroll distance is extended to 5-7x the viewport height to give enough "room" for the animation. When the animation finishes, the section unpins and normal scrolling resumes.

```javascript
// Routine slider: pin + scrub, 5x viewport
ScrollTrigger.create({
  trigger: '.routine',
  start: 'top top',
  end: `+=${window.innerHeight * 5}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => { /* update position based on self.progress */ },
});

// Team arc: pin + scroll, 7x viewport
ScrollTrigger.create({
  trigger: '.team',
  start: 'top top',
  end: `+=${window.innerHeight * 7}px`,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => { /* update card positions + counter */ },
});
```

### 8c. "Scroll-Linked" — ScrollTrigger Scrub

> The animation doesn't play on its own — it's tied directly to scroll position like a video scrubber. Scroll 50% through the section and the animation is at 50%. Scroll back up and the animation reverses. Used for the card explosion parallax: the cards fly apart exactly as much as you've scrolled, and come back together if you scroll up. No autoplay, pure scroll control.

```javascript
ScrollTrigger.create({
  trigger: '.cta',
  start: 'top center',
  end: '150% bottom',
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress;
    // Apply transforms based on progress
  },
});
```

### 8d. "Enter/Exit" — ScrollTrigger Toggle

> Animation plays forward when the section enters the viewport and reverses when it leaves. Scroll down into the section: text slides in, button fades in. Scroll back out: everything reverses and disappears. The animation plays at its own speed (not tied to scroll position) — scrolling just triggers the play/reverse. Used for CTA copy reveals and button fade-ins. There's also a variant where the header just pins behind content without reversing.

```javascript
const scrollTriggerSettings = {
  trigger: '.cta',
  start: 'top 25%',
  toggleActions: 'play reverse play reverse',
};

gsap.to(element, {
  yPercent: 0,
  duration: 0.5,
  ease: 'power1.out',
  stagger: 0.1,
  scrollTrigger: scrollTriggerSettings,
});
```

**Pinned header variant** (no reverse, pin without extra space):
```javascript
ScrollTrigger.create({
  trigger: headerSection,
  start: 'top top',
  endTrigger: contentSection,
  end: 'bottom bottom',
  pin: true,
  pinSpacing: false,
});
```

---

## 9. Interaction Patterns

### 9a. "Slot Machine Row" — Expedition Hover Roll

> Each list item is a single-line row of text. The trick: there are actually three copies of the content stacked vertically inside a clipped window that only shows one row at a time. The top and bottom copies show the default text on a transparent background. The middle copy shows alternate text on an accent-colored background. When you hover, the stack rolls to reveal the middle (colored) version — like a slot machine reel spinning to a new symbol. Leave the hover from the top or bottom, and it rolls in that direction. Fast, satisfying, very tactile.

```javascript
const POSITIONS = {
  BOTTOM: '0%',
  MIDDLE: '-33.333%',
  TOP: '-66.666%',
};

// Enter: slide to MIDDLE
const enterHandler = (e) => {
  const rect = expedition.getBoundingClientRect();
  const enterFromTop = e.clientY < rect.top + rect.height / 2;
  // Always animate to MIDDLE
  gsap.to(wrapper, { y: POSITIONS.MIDDLE, duration: 0.4, ease: 'power2.out' });
};

// Leave: slide to TOP or BOTTOM based on exit direction
const leaveHandler = (e) => {
  const rect = expedition.getBoundingClientRect();
  const leavingFromTop = e.clientY < rect.top + rect.height / 2;
  const newPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM;
  gsap.to(wrapper, { y: newPosition, duration: 0.4, ease: 'power2.out' });
};
```

```css
.expedition {
  --h2-font-size: clamp(3.25rem, 8vw, 8rem);
  --h2-line-height: calc(var(--h2-font-size) * 0.85);
  height: var(--h2-line-height);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  overflow: hidden;
}

.expedition-wrapper {
  height: calc(var(--h2-line-height) * 3);  /* 3x for three states */
  will-change: transform;
  transform: translateY(-66.666%);          /* default: TOP */
}

/* Three rows inside wrapper: name / project / name */
.expedition-name { background-color: transparent; }
.expedition-project { background-color: var(--accent); color: var(--bg-primary); }
```

### 9b. "Mouse Trail" — Hover Grid Highlight

> Same concept as "Radar Grid" (6d) but described from the interaction perspective. As your mouse moves across the page, the nearest grid square within a 120px radius lights up in the accent color along with one random neighboring square. The highlights linger for 300ms then fade out. Creates a subtle trail of recently-visited grid cells that follows your cursor. Runs continuously via requestAnimationFrame.

```javascript
const GRID_BLOCK_SIZE = 60;
const GRID_HIGHLIGHT_DURATION = 300;
const mouseRadius = GRID_BLOCK_SIZE * 2;  // 120px

// On mousemove:
// 1. Find closest block within radius
// 2. Add 'highlight' class + set timeout
// 3. Pick 1 random adjacent neighbor, highlight it too
// 4. rAF loop removes expired highlights
```

### 9c. "Dropdown Nav" — Mobile Menu

> On mobile, the navigation bar shows a compact header. Tap it and a dropdown panel expands below via a clip-path animation (grows from zero height to full height in 0.3s). Tap a link and the menu closes after a 300ms delay (so the user sees their tap registered). If the user rotates their phone or resizes to desktop width, the menu auto-closes. Simple, no hamburger icon animation — just a class toggle.

```javascript
// Toggle
navHeader.addEventListener('click', (e) => {
  if (window.innerWidth <= 1000) {
    e.stopPropagation();
    nav.classList.toggle('nav-open');
  }
});

// Link click: close after 300ms
link.addEventListener('click', (e) => {
  if (window.innerWidth <= 1000) {
    e.stopPropagation();
    setTimeout(() => nav.classList.remove('nav-open'), 300);
  }
});

// Auto-close on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) {
    nav.classList.remove('nav-open');
  }
});
```

```css
/* Mobile overlay reveals via clip-path transition */
nav .nav-overlay::before {
  clip-path: polygon(0 0, 100% 0, 100% 0rem, 0 0rem);
  transition: clip-path 0.3s ease;
}

nav.nav-open .nav-overlay::before {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

### 9d. "Infinite Deck" — Slider Navigation

> A carousel that feels infinite — you can click next/prev forever. Behind the scenes, it maintains a buffer of 3 slides on each side of the active slide (1 on mobile). When you click next, the oldest slide on the left is removed from the DOM, all slides shift left, and a new slide is added on the right. The reverse happens for prev. This way there are always exactly 7 slides in the DOM (3 left + active + 3 right), but the user can navigate endlessly through the full list by looping around.

```javascript
function moveNext() {
  if (isAnimating || isPreviewOpen) return;
  currentIndex++;
  removeSlideItem(-BUFFER_SIZE);              // remove oldest left
  slideItems.forEach((item) => item.relativeIndex--);  // shift all left
  addSlideItem(BUFFER_SIZE);                  // add new right
  updateSliderPosition();
}

function movePrev() {
  if (isAnimating || isPreviewOpen) return;
  currentIndex--;
  removeSlideItem(BUFFER_SIZE);               // remove oldest right
  slideItems.forEach((item) => item.relativeIndex++);  // shift all right
  addSlideItem(-BUFFER_SIZE);                 // add new left
  updateSliderPosition();
}
```

---

## 10. "One-Cut" — Responsive Rules

> The entire site has exactly one breakpoint: 1000px. Above it = desktop. Below it = mobile. No tablet-specific rules, no in-between states. Everything either looks like the full desktop version or the simplified mobile version. The mobile version strips away decorative complexity: diamond cuts become rectangles, scan-lines disappear, multi-column layouts stack vertically, and gaps get smaller.

### Single Breakpoint: 1000px

All responsive changes happen at `max-width: 1000px`.

### Mobile Changes Summary

| Pattern | Desktop | Mobile (≤1000px) |
|---|---|---|
| **Clip-paths** | Chamfered corners active | `clip-path: none` |
| **Scan-line overlay** | Visible with blur(2px) | `display: none` |
| **Hero content padding** | `6rem` | `6rem 1rem 4rem 1rem`, centered |
| **CTA cards** | `height: 360px`, `radius: 0.75rem` | `height: 200px`, `radius: 0.5rem`, `opacity: 0` |
| **CTA copy width** | `width: 30%` | `width: 100%` |
| **Stats container** | `flex` (row) | `flex-direction: column` |
| **Intro header width** | `50%` | `75%` |
| **Intro copy wrapper** | `70%` | `100%` |
| **Missions list width** | `40%` | `100%` |
| **Missions gap** | `7.5rem` | `4.5rem` |
| **Routine slider width** | `350%` | `calc(600% + 7.5rem)` |
| **Routine padding** | `6rem` | `6rem 1rem 1rem 1rem` |
| **Team cards** | `425×575` | `375×500` |
| **Contact form padding** | `6rem` | `3rem 1rem` |
| **FAQ layout** | Two-column (flex) | Single column |
| **Footer layout** | Two-column (flex) | Single column, reversed bottom |
| **Expedition accent bg** | `background: accent` on project row | `background: transparent` |
| **Expedition second h2** | Visible | `display: none` |
| **Footer clip-path** | Chamfered | `clip-path: none` |
| **Nav position** | `top: 1rem`, `width: calc(100% - 2rem)` | `top: 2rem`, `width: calc(100% - 4rem)` |
| **Traces nav/footer** | Visible | `display: none` |
| **Slider buffer** | 3 items each side | 1 item each side |

### Fluid Values

All font sizes use `clamp()` — no breakpoint-based font overrides. Typography scales fluidly across all viewports.

```css
/* Example pattern */
font-size: clamp(MIN, PREFERRED, MAX);
/* MIN: mobile floor, PREFERRED: viewport-relative, MAX: desktop cap */
```

---

## Quick Reference: Easing Functions Used

| Easing | Feels Like | Used For |
|---|---|---|
| `power3.out` | Fast start, gentle stop — like tossing a ball that lands softly | Curtain Rise, slide animations, Spotlight Carousel, Pixel Dissolve entry |
| `power3.inOut` | Slow start, fast middle, slow stop — smooth and cinematic | Iris Open, controller clip-path, carousel side item hide/show |
| `power2.out` | Medium deceleration — natural and responsive | Drop Panel accordion, Slot Machine hover rolls, fade-in staggers |
| `power2.inOut` | Symmetric acceleration/deceleration — punchy | Matrix Type flicker, Pixel Dissolve/Wipe grid blocks |
| `power1.out` | Barely noticeable deceleration — almost linear | Card Explosion CTA reveals, Odometer counter |
| `linear` | Constant speed — mechanical, no personality | VHS Static pan, preloader spinner rotation |

---

## Quick Reference: Duration Cheat Sheet

| Duration | Speed Feel | Used For |
|---|---|---|
| `0.05s` | Instant blink | Matrix Type letters, Pixel Dissolve/Wipe individual blocks |
| `0.1s` | Quick flash | Hero timer flicker on/off |
| `0.2s` | Snappy | Iris Open controller nav label fade |
| `0.3s` | Responsive | Bracket Button hover, Drop Panel icon spin, Radar Grid border flash, Iris Open close icon |
| `0.4s` | Smooth | Drop Panel close, Slot Machine roll enter/leave, Iris Open close icon (opening) |
| `0.5s` | Comfortable | Enter/Exit CTA copy/button/logo reveals, Drop Panel open |
| `0.6s` | Relaxed | Drop Panel stagger entry of FAQ items |
| `0.75s` | Cinematic | Curtain Rise line reveals, Spotlight Carousel slide, Iris Open panel + clip-path |
| `1s` | Dramatic | Traces nav/footer/controller initial slide-in, carousel first appearance |
| `30s` | Ambient loop | VHS Static scan-line continuous pan |

---
---

# Polite-Chaos Style Catalog

> **Source:** `d:\Downloads\CGMWTOCT2025\CGMWTOCT2025\polite-chaos`
> **Purpose:** Complete reusable pattern reference extracted from the polite-chaos project. Pick any pattern below and adapt it to beautyProject sections without re-reading the reference.

---

## Pattern Index — Quick Scan

| # | Name | What It Is |
|---|---|---|
| PC-1a | **Condensed Display** | Massive uppercase heading — Big Shoulders Display weight 900 |
| PC-1b | **Body Sans** | Clean body paragraphs — PP Neue Montreal weight 400 |
| PC-1c | **Mono Tag** | Uppercase mono labels — Geist Mono 0.85rem |
| PC-1d | **Cap Label** | Uppercase bold sans label — PP Pangram Sans weight 900 |
| PC-1e | **Large Body** | Bigger body text — PP Neue Montreal 1.75rem |
| PC-2a | **Centered Hero** | Full-viewport hero with centered heading, bottom footer, and subtext |
| PC-2b | **Showreel Pin** | Pinned section with frame-cycling images scaling from 0.75 → 1 on scroll |
| PC-2c | **Featured Work Grid** | 2-column card grid with rotation + y-launch entrance |
| PC-2d | **Sticky Review Cards** | Full-viewport review cards stacking via pin with alternating rotation |
| PC-2e | **Image Marquee Rows** | 4-row marquee with images + text, scroll-linked horizontal movement + font-weight morph |
| PC-2f | **Two-Column CTA** | Split copy with dark card containing inverted colors |
| PC-2g | **Explosion Footer** | Footer with physics-based image particle explosion |
| PC-2h | **Folder Tabs** | OS-folder–styled work items with tab index + hover preview images |
| PC-2i | **Horizontal Team Scroll** | Pinned section with giant heading scrolling left + cards flying across |
| PC-2j | **Project Detail** | Centered project header + full-bleed banner + detail rows + next project |
| PC-2k | **Contact Screensaver** | Full-viewport contact with bouncing DVD-style screensaver image |
| PC-3a | **Underline + Flip Button** | Text button with underline scaleX reveal + icon circle 720deg Y-flip |
| PC-3b | **SVG Path Wipe** | Page transition with SVG path morph (curtain curve in/out) |
| PC-3c | **Clip-Path Preloader** | Preloader with progress bar, image sequence clip reveals, and char alternating exits |
| PC-3d | **Copy Line Reveal** | SplitText lines masked and translated up, staggered reveal |
| PC-3e | **Menu Overlay** | Full-screen menu with clip-path reveal, mouse-following link strip, char hover swap |

---

## PC-1 — Typography

### PC-1a. "Condensed Display" — Heading

> Massive uppercase condensed heading. Tight line-height and negative letter-spacing create a compressed, impactful display style. Used for hero titles, section headers, and menu links.

```css
h1, h2, h3, h4 {
  text-transform: uppercase;
  font-family: "Big Shoulders Display";
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.125rem;
}

h1 { font-size: 8rem; }
h2 { font-size: 6rem; letter-spacing: -0.2rem; }
h3 { font-size: 5rem; letter-spacing: -0.15rem; }
h4 { font-size: 4rem; letter-spacing: -0.1rem; }

/* Mobile */
@media (max-width: 1000px) {
  h1 { font-size: 3rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1rem; }
  h1, h2, h3, h4 { letter-spacing: 0 !important; }
}

/* Ultra-wide */
@media (min-width: 2400px) {
  h1 { font-size: 10rem; }
}
```

### PC-1b. "Body Sans" — Paragraph

> Clean sans-serif body text. Weight 400, generous line-height for readability. PP Neue Montreal gives a modern, slightly warm feel.

```css
p {
  font-family: "PP Neue Montreal";
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.2;
}
```

### PC-1c. "Mono Tag" — Small Label

> Uppercase monospaced label for metadata, captions, and secondary info. Muted color, wide letter-spacing for that technical, editorial feel.

```css
p.sm, a.sm {
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Geist Mono";
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.15;
  color: var(--base-300);    /* #8c7e77 */
  letter-spacing: 0.1rem;
}
```

### PC-1d. "Cap Label" — Bold Sans Tag

> Uppercase bold sans-serif label. Used for client names, button text, and strong captions. Anti-aliased for sharpness.

```css
p.cap {
  text-transform: uppercase;
  font-family: "PP Pangram Sans";
  font-size: 0.9rem;
  font-weight: 900;
  -webkit-font-smoothing: antialiased;
}
```

### PC-1e. "Large Body" — Subheading Paragraph

> Bigger body text for section intros and prominent descriptions. Slightly tighter line-height than standard body.

```css
p.lg {
  font-size: 1.75rem;
  font-weight: 400;
  line-height: 1.15;
}

/* Mobile */
@media (max-width: 1000px) {
  p.lg { font-size: 1.125rem; }
}
```

---

## PC-2 — Color System

```css
:root {
  --base-100: #e3e3db;   /* light warm cream — primary backgrounds */
  --base-200: #ccccc4;   /* muted grey — secondary backgrounds, nav toggle */
  --base-300: #8c7e77;   /* brown-grey — muted text, labels */
  --base-400: #1a1614;   /* near-black — text, dark cards, menu overlay, preloader */
  --base-500: #ff6e14;   /* vivid orange — accent, progress bar, link highlighter */

  --accent-1: #3d2fa9;   /* deep purple — review card, team card */
  --accent-2: #a92f78;   /* magenta — team card */
  --accent-3: #ff3d33;   /* red — team card */
  --accent-4: #785f47;   /* warm brown — team card */
  --accent-5: #2f72a9;   /* blue — team card */

  --variant-1: var(--base-200);  /* folder light */
  --variant-2: var(--base-400);  /* folder dark */
  --variant-3: var(--base-500);  /* folder accent */
  --disabled-folder-bg: #d4d7d0;
  --disabled-folder-fg: #989b95;
}

body {
  background-color: #000;
  color: var(--base-400);
}
```

---

## PC-3 — Layouts

### PC-3a. "Centered Hero" — Hero Section

> Full-viewport hero with centered heading, bottom-aligned footer copy, and centered subtext with CTA button. Clean, centered composition with absolute-positioned footer spanning the full width.

```css
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  background-color: var(--base-100);
  overflow: hidden;
}

.hero .container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.hero .hero-content-main {
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.hero .hero-footer {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.hero .hero-footer-outer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
}

.hero .hero-footer-outer div {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* Mobile */
@media (max-width: 1000px) {
  .hero .hero-content-main,
  .hero .hero-footer {
    width: 100%;
    justify-content: center;
    gap: 2rem;
  }
}
```

### PC-3b. "Section Header" — Centered Title Block

> Reusable centered section header with title, arrow icon, and description. 65% width container, centered with 5rem gap between elements.

```css
.section-header-content {
  margin: 0 auto;
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 5rem;
  text-align: center;
}

.section-header-content .arrow {
  width: 3rem;
}

.section-header-content .copy {
  width: 50%;
}

/* Mobile: all widths → 100% */
```

### PC-3c. "Featured Work Grid" — Two-Column Card Layout

> Two cards per row with 4:3 aspect-ratio images, rounded corners, and overlay title badges. 80% width centered, 3rem row gap, 1.5rem column gap.

```css
.featured-work-list {
  position: relative;
  width: 100%;
  padding: 8rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.featured-work-list .row {
  margin: 0 auto;
  flex: 1;
  width: 80%;
  display: flex;
  gap: 1.5rem;
}

.featured-work-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.featured-work-item-img {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 1rem;
  overflow: hidden;
}

.featured-work-item-copy {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--base-400);
  padding: 0.5rem 0.5rem 0.35rem 0.5rem;
  border-radius: 0.5rem;
}

.featured-work-item-copy h3 {
  font-size: 1.5rem;
  letter-spacing: -0.01rem;
  color: var(--base-100);
}

/* Mobile: row stacks vertically, width 100% */
```

### PC-3d. "Review Card Stack" — Full-Viewport Stacking Cards

> Each review is a full-viewport section containing a centered 60% × 50% rounded card. Cards are pinned and stack on top of each other as you scroll. Each card has a unique background color and alternating ±3deg rotation.

```css
.review-card {
  position: relative;
  width: 100%;
  height: 100svh;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.review-card-container {
  position: relative;
  width: 60%;
  height: 50%;
  display: flex;
  padding: 2rem;
  border-radius: 1rem;
  will-change: transform;
}

/* Alternating card colors */
#review-card-1 { background-color: var(--base-200); }
#review-card-2 { background-color: var(--base-400); color: var(--base-100); }
#review-card-3 { background-color: var(--accent-1); color: var(--base-100); }
#review-card-4 { background-color: var(--base-200); }
#review-card-5 { background-color: var(--base-500); }
#review-card-6 { background-color: var(--base-400); color: var(--base-100); }

.review-card-content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

h3.review-card-text {
  font-size: 3rem;
  letter-spacing: 0;
}

/* Mobile: card 90% width, 100% height, padding shrinks */
```

### PC-3e. "Two-Column CTA" — Copy + Dark Card

> Two-column layout: left column for label, right column for description + button. Below that, a dark rounded card with same two-column structure but inverted colors.

```css
.cta .container {
  display: flex;
  flex-direction: column;
  gap: 6rem;
  padding-bottom: 10rem;
}

.cta-copy {
  width: 70%;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  padding: 4rem 0;
}

.cta-col { flex: 1; }
.cta-col:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cta-card {
  margin: 0 auto;
  width: 70%;
  background-color: var(--base-400);
  color: var(--base-100);
  padding: 2rem;
  border-radius: 1rem;
}

/* Mobile: all widths → 100%, flex-direction: column */
```

### PC-3f. "Explosion Footer" — Physics Footer

> Full-viewport dark footer with centered heading + CTA, bottom byline (time / author / copyright in 3 columns), and absolute-positioned explosion container for physics particles.

```css
footer {
  position: relative;
  width: 100vw;
  height: 100.5svh;
  background-color: var(--base-400);
  color: var(--base-100);
  padding: 2rem;
}

footer .footer-header-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

footer .explosion-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200%;
  pointer-events: none;
  overflow: hidden;
}

footer img.explosion-particle-img {
  position: absolute;
  bottom: -200px;
  left: 50%;
  width: var(--particle-size, 300px) !important;
  height: auto !important;
  border-radius: 1rem;
  object-fit: cover;
  transform: translateX(-50%);
  will-change: transform;
}

footer .footer-byline {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 2rem;
}

footer .footer-byline > div { flex: 1; display: flex; }

/* Mobile: explosion-container hidden, footer 100svh, footer-header full width */
```

### PC-3g. "Folder Tabs" — Work Page

> Full-viewport section with rows of OS-folder-styled items stacked from bottom. Each folder has a colored tab index with clip-path trapezoid, and a name area. Rows offset from bottom with negative positioning creating depth.

```css
.folders {
  width: 100%;
  height: 100svh;
  background-color: var(--base-100);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.folder {
  position: relative;
  flex: 1;
  height: 210px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.folder-index {
  position: relative;
  width: 40%;
  padding: 1rem;
  border-top-left-radius: 0.75rem;
}

/* Trapezoid pseudo-element for tab shape */
.folder-index::after {
  content: "";
  position: absolute;
  top: 0;
  left: 99%;
  height: 101%;
  aspect-ratio: 1;
  clip-path: polygon(0 0, 25% 0, 100% 100%, 0% 100%);
}

.folder-name {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-left: 2rem;
  border-top-right-radius: 0.75rem;
}

.folder-name h1 {
  font-size: 3rem;
  transition: color 250ms ease;
}

/* Variant colors */
.folder.variant-1 .folder-index,
.folder.variant-1 .folder-index::after,
.folder.variant-1 .folder-name { background-color: var(--variant-1); }

.folder.variant-2 .folder-index,
.folder.variant-2 .folder-index::after,
.folder.variant-2 .folder-name { background-color: var(--variant-2); color: #fff; }

.folder.variant-3 .folder-index,
.folder.variant-3 .folder-index::after,
.folder.variant-3 .folder-name { background-color: var(--variant-3); }

/* Disabled state (sibling hover) */
.folder.disabled .folder-index,
.folder.disabled .folder-index::after,
.folder.disabled .folder-name { background-color: var(--disabled-folder-bg); }
.folder.disabled p, .folder.disabled h1 { color: var(--disabled-folder-fg); }

/* Row offsets */
.folders .row:nth-child(1) { bottom: -13rem; }
.folders .row:nth-child(2) { bottom: -7.5rem; }
.folders .row:nth-child(3) { bottom: -2rem; }
```

### PC-3h. "Horizontal Team Scroll" — Pinned Cards Section

> Section is pinned, giant 250vw heading scrolls horizontally, team cards fly in from the right with per-card yPercent and rotation keyframes. Cards are 325×500px colored rectangles with image + text.

```css
.sticky {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background-color: var(--base-100);
}

.sticky-header {
  position: relative;
  width: 250vw;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: transform;
}

.sticky-header h1 {
  color: var(--base-400);
  font-size: 28vw;
  letter-spacing: -0.5rem;
  line-height: 100%;
}

.card {
  position: absolute;
  top: 10%;
  left: 100%;
  width: 325px;
  height: 500px;
  border-radius: 1rem;
  padding: 1rem;
  will-change: transform;
  z-index: 2;
}

/* Per-card accent colors */
#card-1 { background-color: var(--accent-1); }
#card-2 { background-color: var(--accent-2); }
#card-3 { background-color: var(--accent-3); }
#card-4 { background-color: var(--accent-4); }
#card-5 { background-color: var(--accent-5); }

.card .card-img {
  width: 100%;
  height: 200px;
  border-radius: 0.5em;
  overflow: hidden;
}

.card-content {
  width: 100%;
  height: 275px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  padding: 1rem;
}

.card-content h2 {
  font-size: 2.5rem;
  letter-spacing: -0.05rem;
}

/* Mobile: .sticky hidden, separate mobile static layout */
```

### PC-3i. "Studio Header" — Split Row Heading

> 90svh centered header with two rows — first right-aligned, second left-aligned — creating a typographic stagger. Font-size 14vw for dramatic scale.

```css
.studio-header {
  position: relative;
  width: 100%;
  height: 90svh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.studio-header .container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.studio-header-row:nth-child(1) {
  display: flex;
  justify-content: flex-end;
}

.studio-header-row:nth-child(2) {
  display: flex;
  justify-content: flex-start;
}

.studio-header-row h1 {
  font-size: 14vw;
}

/* Ultra-wide: 20rem cap */
```

### PC-3j. "Contact Page" — Screensaver + Copy

> Full-viewport contact with two-column copy (3:2 flex ratio) and absolute-positioned footer with social links. Desktop has a bouncing DVD-style screensaver image behind the content.

```css
.contact {
  position: relative;
  width: 100vw;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-100);
  overflow: hidden;
}

.contact .screensaver {
  position: absolute;
  background-size: cover;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.contact-copy {
  width: 75%;
  max-width: 2000px;
  display: flex;
  padding: 0 2rem;
  gap: 2rem;
}

.contact-col:nth-child(1) { flex: 3; }
.contact-col:nth-child(2) { flex: 2; display: flex; flex-direction: column; gap: 2rem; }

/* Mobile: full width, column layout, min-height 150svh */
```

### PC-3k. "Project Detail" — Case Study Page

> Project page with centered header (50svh, bottom-aligned), full-bleed banner image (100svh), centered detail rows (55% width), image gallery (75% container, 80svh images, 1rem radius), and next-project section (35% image width, 400px height).

```css
.project-header {
  width: 100vw;
  height: 50svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5em;
  padding-bottom: 3em;
  text-align: center;
}

.project-banner-img {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.project-details {
  width: 55%;
  padding: 8rem 1rem 2rem 1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4rem;
}

.project-img {
  position: relative;
  width: 100%;
  height: 80svh;
  overflow: hidden;
  border-radius: 1rem;
}

.next-project {
  width: 100vw;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  text-align: center;
}

.next-project-img {
  width: 35%;
  height: 400px;
  overflow: hidden;
  border-radius: 1rem;
}
```

---

## PC-4 — Components

### PC-4a. "Underline + Flip Button"

> Text button with label + circular icon. On hover: underline scales in from right to left via scaleX(0→1) with transform-origin swap. Icon circle does a 720deg Y-axis flip (CSS keyframe). Light variant inverts all colors.

```css
.button {
  position: relative;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--base-400);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-label {
  position: relative;
  display: inline-block;
  width: max-content;
  transform: translateY(0.1rem);
  font-family: "PP Pangram Sans";
  font-size: 1rem;
  font-weight: 900;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.025rem;
}

.button-label::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 0.1rem;
  bottom: -0.35rem;
  left: 0;
  background: var(--base-400);
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
  will-change: transform;
}

.button:hover .button-label::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.button-icon-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--base-400);
  color: var(--base-100);
  border-radius: 10rem;
}

.button:hover .button-icon {
  animation: flipTwice 0.8s ease-out forwards;
}

.button:not(:hover) .button-icon {
  animation: flipBack 0.8s ease-out forwards;
}

@keyframes flipTwice {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(720deg); }
}

@keyframes flipBack {
  0% { transform: rotateY(720deg); }
  100% { transform: rotateY(0deg); }
}

/* Light variant */
.button--light { color: var(--base-100); }
.button--light .button-label { color: var(--base-100); }
.button--light .button-label::after { background: var(--base-100); }
.button--light .button-icon-inner { background-color: var(--base-100); color: var(--base-400); }

/* Mobile: no underline, no flip animation */
```

```javascript
// Button text reveal via SplitText
const split = SplitText.create(labelRef.current, {
  type: "lines",
  mask: "lines",
  linesClass: "line++",
  lineThreshold: 0.1,
});

gsap.set(split.lines, { y: "100%" });
gsap.set(iconRef, { scale: 0 });

gsap.to(split.lines, {
  y: "0%",
  duration: 1,
  stagger: 0.1,
  ease: "power4.out",
  delay: delay,
});

gsap.to(iconRef, {
  scale: 1,
  duration: 0.8,
  ease: "power4.out",
  delay: delay + 0.3,
});
```

### PC-4b. "Nav Toggle" — Pill Menu Button

> Rounded pill-shaped toggle with stacked "Menu"/"Close" labels. Labels slide vertically on toggle. Background uses base-200, text uses base-400.

```css
nav .nav-toggle-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 2.5rem;
  overflow: hidden;
  background-color: var(--base-200);
  border-radius: 0.5rem;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  z-index: 2;
  cursor: pointer;
}

nav .open-label, nav .close-label {
  position: relative;
  text-transform: uppercase;
  font-family: "PP Pangram Sans";
  font-size: 0.9rem;
  font-weight: 900;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  cursor: pointer;
  padding: 0.8rem;
  color: var(--base-400);
  will-change: transform;
}
```

```javascript
// Open menu: slide labels up
gsap.to(openLabel, { y: "-100%", duration: 1, ease: "power3.out" });
gsap.to(closeLabel, { y: "-100%", duration: 1, ease: "power3.out" });

// Close menu: slide labels back
gsap.to(openLabel, { y: "0%", duration: 1, ease: "power3.out" });
gsap.to(closeLabel, { y: "0%", duration: 1, ease: "power3.out" });
```

### PC-4c. "Marquee Image Row" — Spotlight Section

> 4 horizontal marquee rows with mixed image + text items. Each row 125% width, 250px height. Text items use SplitType chars with scroll-linked fontWeight 100→900 morphing. Odd/even rows shift in opposite directions.

```css
.spotlight .marquees {
  position: relative;
  width: 100%;
  height: 150svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.marquee-container {
  position: relative;
  width: 125%;
  height: 250px;
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.marquee {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate3d(0, -50%, 0);
  display: flex;
  gap: 1em;
  will-change: transform;
}

/* Odd rows offset */
#marquee-1 .marquee, #marquee-3 .marquee {
  transform: translate3d(-15%, -50%, 0);
}

.marquee-img-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  overflow: hidden;
}

.marquee-img-item h1 {
  font-size: 4.25rem;
}

/* Mobile: height 100svh, container 250% width, 150px rows */
```

```javascript
// Scroll-linked horizontal movement
gsap.to(marquee, {
  x: index % 2 === 0 ? "5%" : "-15%",
  scrollTrigger: {
    trigger: container,
    start: "top bottom",
    end: "150% top",
    scrub: true,
  },
  force3D: true,
});

// Font-weight morphing per character
gsap.fromTo(chars,
  { fontWeight: 100 },
  {
    fontWeight: 900,
    duration: 1,
    ease: "none",
    stagger: {
      each: 0.35,
      from: index % 2 === 0 ? "end" : "start",
      ease: "linear",
    },
    scrollTrigger: {
      trigger: container,
      start: "50% bottom",
      end: "top top",
      scrub: true,
    },
  }
);
```

---

## PC-5 — Animations

### PC-5a. "Copy Line Reveal" — SplitText Masked Lines

> Core text reveal pattern. Each line is wrapped in an overflow-hidden mask, then translated 100% down. On trigger, lines stagger up with power4.out easing. Works both on-scroll and on-load with configurable delay.

```javascript
const split = SplitText.create(element, {
  type: "lines",
  mask: "lines",
  linesClass: "line++",
  lineThreshold: 0.1,
});

gsap.set(split.lines, { y: "100%" });

// On-scroll variant
gsap.to(split.lines, {
  y: "0%",
  duration: 1,
  stagger: 0.1,
  ease: "power4.out",
  delay: delay,
  scrollTrigger: {
    trigger: containerRef,
    start: "top 90%",
    once: true,
  },
});

// Immediate variant (no scroll trigger)
gsap.to(split.lines, {
  y: "0%",
  duration: 1,
  stagger: 0.1,
  ease: "power4.out",
  delay: delay,
});
```

```css
.line {
  position: relative;
  transform: translateY(100%);
  will-change: transform;
  padding-bottom: 0.2em;
  margin-bottom: -0.2em;
}
```

### PC-5b. "Clip-Path Preloader" — Image Sequence + Char Reveal

> Fixed preloader with progress bar, stacked image reveals via clip-path, alternating character exits, and final clip-path wipe. Custom "hop" ease (0.9, 0, 0.1, 1) for punchy motion.

```javascript
CustomEase.create("hop", "0.9, 0, 0.1, 1");

// Progress bar: scaleX 0→1 over 4s, then reverse
tl.to(".progress-bar", { scaleX: 1, duration: 4, ease: "power3.inOut" })
  .set(".progress-bar", { transformOrigin: "right" })
  .to(".progress-bar", { scaleX: 0, duration: 1, ease: "power3.in" });

// Image clip reveals (stacked, each 0.75s apart)
preloaderImages.forEach((img, index) => {
  tl.to(img, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1,
    ease: "hop",
    delay: index * 0.75,
  }, "-=5");
});

// Inner images scale from 2 → 1
preloaderImagesInner.forEach((inner, index) => {
  tl.to(inner, {
    scale: 1,
    duration: 1.5,
    ease: "hop",
    delay: index * 0.75,
  }, "-=5.25");
});

// Chars enter: alternating from top/bottom
chars.forEach((char, index) => {
  gsap.set(char, { yPercent: index % 2 === 0 ? -100 : 100 });
});
tl.to(chars, { yPercent: 0, duration: 1, ease: "hop", stagger: 0.025 }, "-=5");

// Chars exit: alternating directions reversed
tl.to(chars, {
  yPercent: (index) => (index % 2 === 0 ? 100 : -100),
  duration: 1,
  ease: "hop",
  stagger: 0.025,
}, "-=2.5");

// Image container clip up
tl.to(".preloader-images", {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 1,
  ease: "hop",
}, "-=1.5");

// Preloader wipe up
tl.to(".preloader", {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 1.75,
  ease: "hop",
}, "-=0.5");
```

```css
.preloader {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100svh;
  background-color: var(--base-400);
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  will-change: clip-path;
  z-index: 9999;
}

.progress-bar {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 7px;
  background-color: var(--base-500);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;
}

.preloader-images {
  position: absolute;
  top: 45%; left: 50%;
  transform: translate(-50%, -50%);
  width: 25rem; height: 25rem;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  overflow: hidden;
}

.preloader-images .img {
  position: absolute;
  width: 100%; height: 100%;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  border-radius: 0.75rem;
}

.preloader-images .img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transform: scale(2);
}

.preloader-header {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(60svh);
  z-index: 10000;
}

.preloader-header h1 {
  font-size: 8rem;
  color: var(--base-100);
}
```

### PC-5c. "SVG Path Wipe" — Page Transition

> Page transition using SVG path morphing. A curved curtain sweeps across the screen via animated `d` attribute. Two steps: cover (left-to-right with curve) then reveal (right-to-left with curve). Creates an organic, non-linear wipe.

```javascript
const paths = {
  step1: {
    unfilled: "M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z",
    inBetween: "M 0 0 h 43 c -60 55 140 65 0 100 H 0 V 0 Z",
    filled: "M 0 0 h 100 c 0 50 0 50 0 100 H 0 V 0 Z",
  },
  step2: {
    filled: "M 100 0 H 0 c 0 50 0 50 0 100 h 100 V 50 Z",
    inBetween: "M 100 0 H 50 c 28 43 4 81 0 100 h 50 V 0 Z",
    unfilled: "M 100 0 H 100 c 0 50 0 50 0 100 h 0 V 0 Z",
  },
};

const timeline = gsap.timeline();

// Cover: unfilled → curve → filled
timeline
  .set(overlayPath, { attr: { d: paths.step1.unfilled } })
  .to(overlayPath, { duration: 0.6, ease: "power4.in", attr: { d: paths.step1.inBetween } }, 0)
  .to(overlayPath, {
    duration: 0.2,
    ease: "power1",
    attr: { d: paths.step1.filled },
    onComplete: () => router.push(href),
  })
  // Pause
  .to({}, { duration: 0.75 })
  // Reveal: filled → curve → unfilled
  .set(overlayPath, { attr: { d: paths.step2.filled } })
  .to(overlayPath, { duration: 0.15, ease: "sine.in", attr: { d: paths.step2.inBetween } })
  .to(overlayPath, { duration: 1, ease: "power4", attr: { d: paths.step2.unfilled } });
```

```css
.page-transition-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.page-transition-overlay svg {
  width: 100%; height: 100%;
}

.overlay__path {
  fill: var(--base-500);    /* orange accent */
  stroke: none;
}
```

### PC-5d. "Showreel Pin" — Scroll-Linked Scale + Frame Cycle

> Section pins to viewport. As user scrolls, container scales from 0.75→1 and border-radius reduces from 2rem→0. Images cycle every 500ms (frame sequence). Progress mapped via gsap.utils.mapRange.

```javascript
// Frame cycling (independent of scroll)
const frameTimeline = gsap.timeline({ repeat: -1 });
for (let i = 1; i <= totalFrames; i++) {
  frameTimeline.add(() => setCurrentFrame(i), (i - 1) * 0.5);
}

// Scale + radius on scroll
ScrollTrigger.create({
  trigger: showreelRef,
  start: "top top",
  end: () => `+=${window.innerHeight * 2}px`,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    const progress = self.progress;
    const scaleValue = gsap.utils.mapRange(0, 1, 0.75, 1, progress);
    const borderRadiusValue = progress <= 0.5
      ? gsap.utils.mapRange(0, 0.5, 2, 0, progress)
      : 0;

    gsap.set(".showreel-container", {
      scale: scaleValue,
      borderRadius: `${borderRadiusValue}rem`,
    });
  },
});
```

```css
.showreel {
  position: relative;
  width: 100%;
  height: 100svh;
  background-color: var(--base-100);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.showreel-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform: scale(0.75);
  border-radius: 2rem;
  overflow: hidden;
}

.volume-icon {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 6.5rem; height: 6.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-100);
  border-radius: 100%;
  cursor: pointer;
}
```

### PC-5e. "Card Launch" — Featured Work Entrance

> Cards start at y: 1000 with ±60deg rotation. On scroll enter (trigger at 70%), they animate to y: 0, rotation: 0 with stagger 0.25s. Left cards rotate -60, right cards rotate +60.

```javascript
gsap.set(".featured-work-item", { y: 1000 });

document.querySelectorAll(".row").forEach((row) => {
  const items = row.querySelectorAll(".featured-work-item");

  items.forEach((item, itemIndex) => {
    const isLeft = itemIndex === 0;
    gsap.set(item, {
      rotation: isLeft ? -60 : 60,
      transformOrigin: "center center",
    });
  });

  ScrollTrigger.create({
    trigger: row,
    start: "top 70%",
    onEnter: () => {
      gsap.to(items, {
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.25,
      });
    },
  });
});
```

### PC-5f. "Sticky Card Stack" — Review Card Pinning

> Each review card except the last is pinned. Cards stack on scroll. Each card container has alternating ±3deg rotation. Uses pinSpacing: false so cards layer naturally.

```javascript
const mm = gsap.matchMedia();

mm.add("(min-width: 1000px)", () => {
  // Set alternating rotation
  cardContainers.forEach((container, index) => {
    gsap.set(container, { rotation: index % 2 === 0 ? 3 : -3 });
  });

  // Pin all cards except last
  reviewCards.forEach((card, index) => {
    if (index < reviewCards.length - 1) {
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        endTrigger: reviewCards[reviewCards.length - 1],
        end: "top top",
        pin: true,
        pinSpacing: false,
        scrub: 1,
      });
    }
  });
});
```

### PC-5g. "Explosion Physics" — Footer Particle System

> On footer scroll-into-view, 10 image particles launch upward from center-bottom with random horizontal velocity, gravity, friction, and rotation. Uses a custom Particle class with requestAnimationFrame loop.

```javascript
const config = {
  gravity: 0.25,
  friction: 0.99,
  imageSize: 300,
  horizontalForce: 20,
  verticalForce: 15,
  rotationSpeed: 10,
};

class Particle {
  constructor(element) {
    this.element = element;
    this.x = 0;
    this.y = 0;
    this.vx = (Math.random() - 0.5) * config.horizontalForce;
    this.vy = -config.verticalForce - Math.random() * 10;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
  }

  update() {
    this.vy += config.gravity;
    this.vx *= config.friction;
    this.vy *= config.friction;
    this.rotationSpeed *= config.friction;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.element.style.transform =
      `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
  }
}

// Trigger when footer enters viewport (250px before visible)
// Reset when footer scrolls far above (100px+ above viewport)
```

### PC-5h. "Menu Overlay" — Full-Screen Navigation

> Full-screen overlay revealed via clip-path polygon animation. Menu links are displayed in a horizontal strip at the bottom that follows mouse X via lerp. Each link has duplicate text — visible text slides up on hover, hidden copy slides in from below. Link highlighter bar follows hovered link position and width.

```javascript
// Open menu
gsap.to(menuOverlay, {
  clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
  duration: 1.25,
  ease: "expo.out",
});

gsap.to(menuImage, { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" });

gsap.to(menuLinks, {
  y: "0%",
  duration: 1.25,
  stagger: 0.1,
  delay: 0.25,
  ease: "expo.out",
});

// Menu col text reveal
gsap.to(splitLines, {
  y: "0%",
  duration: 1,
  stagger: 0.05,
  delay: 0.5,
  ease: "expo.out",
});

// Close menu
gsap.to(menuOverlay, {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 1.25,
  ease: "expo.out",
});

// Mouse-following link strip
const animate = () => {
  currentX += (targetX - currentX) * 0.05;  // lerp
  gsap.to(menuLinksWrapper, { x: currentX, duration: 0.3, ease: "power4.out" });
  requestAnimationFrame(animate);
};

// Link hover: char swap
gsap.to(visibleChars, { y: "-110%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });
gsap.to(animatedChars, { y: "0%", stagger: 0.05, duration: 0.5, ease: "expo.inOut" });

// Link highlighter follows hovered link
gsap.to(linkHighlighter, {
  x: linkRect.left - menuWrapperRect.left,
  width: linkCopyElement.offsetWidth,
  duration: 0.3,
  ease: "power4.out",
});
```

```css
.menu-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100svh;
  background-color: var(--base-400);
  color: var(--base-100);
  z-index: 1;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  will-change: clip-path;
}

.menu-link a {
  color: var(--base-100);
  text-transform: uppercase;
  font-family: "Big Shoulders Display";
  font-size: 10rem;
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.125rem;
  display: inline-block;
  overflow: hidden;
}

/* Duplicate text for hover swap */
.menu-link a span:nth-child(2) {
  position: absolute;
  top: 0;
  left: 0;
}

.link-highlighter {
  position: absolute;
  bottom: 0; left: 0;
  width: 400px;
  height: 0.75rem;
  background-color: var(--base-500);
  will-change: transform, width;
}

.menu-img {
  position: absolute;
  top: 45%; left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  aspect-ratio: 5/7;
}

/* Mobile: 4rem links, no image, no highlighter, vertical column layout */
```

### PC-5i. "Folder Hover" — Preview Images Pop

> On folder hover: 3 preview images pop up with random rotation (±10–20deg) using back.out(1.7) ease. Sibling folders get "disabled" class (grey-out). Folder wrapper shifts y from 25→0. On leave: everything reverses.

```javascript
const onEnter = () => {
  // Grey out siblings
  folders.forEach((sibling) => {
    if (sibling !== folder) sibling.classList.add("disabled");
  });

  // Lift folder
  gsap.to(folderWrappers[index], {
    y: 0,
    duration: 0.25,
    ease: "back.out(1.7)",
  });

  // Pop preview images with random rotation
  previewImages.forEach((img, imgIndex) => {
    let rotation;
    if (imgIndex === 0) rotation = gsap.utils.random(-20, -10);
    else if (imgIndex === 1) rotation = gsap.utils.random(-10, 10);
    else rotation = gsap.utils.random(10, 20);

    gsap.to(img, {
      y: "-100%",
      rotation,
      duration: 0.25,
      ease: "back.out(1.7)",
      delay: imgIndex * 0.025,
    });
  });
};

const onLeave = () => {
  folders.forEach((sibling) => sibling.classList.remove("disabled"));

  gsap.to(folderWrappers[index], {
    y: 25,
    duration: 0.25,
    ease: "back.out(1.7)",
  });

  previewImages.forEach((img, imgIndex) => {
    gsap.to(img, {
      y: "0%",
      rotation: 0,
      duration: 0.25,
      ease: "back.out(1.7)",
      delay: imgIndex * 0.05,
    });
  });
};
```

```css
.folder-preview {
  position: absolute;
  top: 0; left: 0;
  width: 25rem; height: 100%;
  pointer-events: none;
}

.folder-preview-img {
  position: absolute;
  top: 50%;
  width: 12rem; height: 12rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.folder-preview-img:nth-child(1) { left: 20%; transform-origin: top left; }
.folder-preview-img:nth-child(2) { left: 50%; transform-origin: center; }
.folder-preview-img:nth-child(3) { left: 80%; transform-origin: top right; }
```

### PC-5j. "Horizontal Card Throw" — Team Section

> Pinned section (5x viewport height). Giant heading (28vw, 250vw wide) scrolls left. 5 cards fly from right (100%) to left with per-card y-position and rotation keyframes. Each card has a staggered delay (index * 0.1125). Card positions use interpolation between 4 keyframe points for both y and rotation.

```javascript
ScrollTrigger.create({
  trigger: stickySection,
  start: "top top",
  end: () => `+=${window.innerHeight * 5}px`,
  pin: true,
  pinSpacing: true,
  onUpdate: (self) => {
    const progress = self.progress;

    // Heading scrolls left
    gsap.set(stickyHeader, { x: -progress * maxTranslate });

    // Each card flies across with unique path
    cards.forEach((card, index) => {
      const delay = index * 0.1125;
      const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

      if (cardProgress > 0) {
        const cardX = gsap.utils.interpolate(25, cardEndX, cardProgress);

        // Y and rotation interpolated through 4 keyframes
        const yProgress = cardProgress * 3;
        const yIndex = Math.min(Math.floor(yProgress), 2);
        const cardY = gsap.utils.interpolate(
          yPos[yIndex], yPos[yIndex + 1], yProgress - yIndex
        );
        const cardRotation = gsap.utils.interpolate(
          rotations[yIndex], rotations[yIndex + 1], yProgress - yIndex
        );

        gsap.set(card, {
          xPercent: cardX,
          yPercent: cardY,
          rotation: cardRotation,
          opacity: 1,
        });
      } else {
        gsap.set(card, { opacity: 0 });
      }
    });
  },
});

// Per-card transform keyframes [yPositions, rotations]:
const transforms = [
  [[10, 50, -10, 10], [20, -10, -45, 20]],
  [[0, 47.5, -10, 15], [-25, 15, -45, 30]],
  [[0, 52.5, -10, 5], [15, -5, -40, 60]],
  [[0, 50, 30, -80], [20, -10, 60, 5]],
  [[0, 55, -15, 30], [25, -15, 60, 95]],
];
```

### PC-5k. "Screensaver Bounce" — DVD-Style Floating Image

> A 300×300px background-image element bounces around the viewport like a DVD logo screensaver. On each wall collision it swaps to the next image (10 images cycling). Uses velocity-based physics with configurable speed, edge offset, and direction-change debounce. Desktop only.

```javascript
const config = {
  speed: 3,
  imageCount: 10,
  size: 300,
  changeDirectionDelay: 20,
  edgeOffset: -40,
};

let velX = (Math.random() > 0.5 ? 1 : -1) * config.speed;
let velY = (Math.random() > 0.5 ? 1 : -1) * config.speed;

const animate = () => {
  posX += velX;
  posY += velY;

  // Bounce off edges, swap image on collision
  if (posX <= leftEdge || posX >= rightEdge) {
    velX = -velX;
    changeImage();
  }
  if (posY <= topEdge || posY >= bottomEdge) {
    velY = -velY;
    changeImage();
  }

  element.style.left = `${posX}px`;
  element.style.top = `${posY}px`;

  requestAnimationFrame(animate);
};
```

---

## PC-6 — Scroll Patterns

### PC-6a. "Butter Scroll" — Lenis Configuration

> Same concept as orbit-matter but with responsive settings. Mobile uses shorter duration (0.8s), tighter lerp (0.09), and smoothTouch enabled. Desktop uses 1.2s duration, 0.1 lerp, no smoothTouch.

```javascript
const scrollSettings = isMobile
  ? {
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: true,
    }
  : {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
    };
```

### PC-6b. "Freeze Frame" — Pin Patterns

| Section | Scroll Distance | Purpose |
|---|---|---|
| Showreel | `innerHeight * 2` | Scale 0.75→1 + border-radius 2rem→0 |
| Team Cards | `innerHeight * 5` | Heading scroll + card throw |
| Review Cards | `pinSpacing: false` | Stacking cards on each other |

---

## PC-7 — Responsive Rules

### Single Breakpoint: 1000px + Ultra-wide: 2400px

| Pattern | Desktop | Mobile (≤1000px) |
|---|---|---|
| **Headings** | h1: 8rem, h2: 6rem, h3: 5rem, h4: 4rem | h1: 3rem, h2: 2rem, h3: 1.5rem, h4: 1rem |
| **Letter-spacing** | Negative per heading level | `0 !important` all headings |
| **p.lg** | 1.75rem | 1.125rem |
| **p.sm** | 0.85rem, 0.1rem spacing | 0.8rem, 0.05rem spacing |
| **Container padding** | 2rem | 1.25rem |
| **Hero content** | 65% width | 100% width |
| **Featured work rows** | 80% width, 2-column | 100% width, single column |
| **Review cards** | 60% × 50% centered | 90% × 100%, vertical layout |
| **CTA copy** | 70% width, row | 100% width, column |
| **Footer** | 100.5svh, explosion visible | 100svh, explosion hidden |
| **Menu links** | 10rem font, horizontal strip | 4rem font, vertical column |
| **Menu image + highlighter** | Visible | Hidden |
| **Spotlight marquees** | 150svh, 125% × 250px rows | 100svh, 250% × 150px rows |
| **Team section** | Pinned animated | Static vertical cards |
| **Folder tabs** | Offset rows, 210px folders | Stacked full-width, 200px |
| **Folder preview images** | Visible on hover | Hidden |
| **Button underline** | Visible + flip animation | Hidden + no animation |
| **Contact** | 100svh + screensaver | 150svh min, no screensaver |
| **Studio heading** | 14vw | Default mobile sizes |

### Ultra-wide (≥2400px)

```css
h1 { font-size: 10rem; }
.menu-link a { font-size: 20rem; }
.studio-header-row h1 { font-size: 20rem; }
```

---

## Quick Reference: Polite-Chaos Easing Functions

| Easing | Feels Like | Used For |
|---|---|---|
| `power4.out` | Very fast start, long deceleration — dramatic entrance | Copy line reveals, button text reveals, card launch, menu link slides |
| `power4.in` | Slow buildup, fast end — tension before release | SVG path wipe cover phase |
| `power3.out` | Fast start, gentle stop | Nav toggle labels, progress bar fill |
| `power3.inOut` | Cinematic symmetric | Progress bar main fill |
| `power3.in` | Slow start, fast exit | Progress bar reverse |
| `expo.out` | Extremely fast start, very long tail — elastic feel | Menu overlay clip-path, menu links stagger, menu image scale |
| `expo.inOut` | Punchy symmetric | Menu link char swaps (hover) |
| `back.out(1.7)` | Overshoots then settles — bouncy | Folder hover lift, preview image pop |
| `hop` (custom: 0.9, 0, 0.1, 1) | Nearly instant jump with tiny ease | Preloader clip-paths, image reveals, char enters/exits |
| `none` (linear) | Constant speed | Marquee font-weight morph (scrub), marquee horizontal shift |
| `sine.in` | Gentle acceleration | SVG path wipe reveal phase start |
| `power1` | Barely visible ease | SVG path wipe fill completion |

---

## Quick Reference: Polite-Chaos Duration Cheat Sheet

| Duration | Speed Feel | Used For |
|---|---|---|
| `0.15s` | Snap | SVG path wipe reveal start |
| `0.2s` | Quick | SVG path wipe cover end |
| `0.25s` | Snappy | Button underline, folder hover lift, folder preview pop |
| `0.3s` | Responsive | Link highlighter movement, menu links lerp |
| `0.5s` | Comfortable | Menu link char hover swaps |
| `0.6s` | Smooth | SVG path wipe cover curve |
| `0.75s` | Deliberate | SVG path wipe pause between phases |
| `0.8s` | Cinematic | Button icon flip, icon scale reveal |
| `1s` | Dramatic | Copy line reveals, preloader char animations, menu overlay clip-path, menu split-line reveals |
| `1.25s` | Sweeping | Menu overlay open/close, menu link entrance stagger |
| `1.5s` | Grand | Preloader image inner scale, menu image scale |
| `1.75s` | Epic | Preloader final wipe |
| `4s` | Slow build | Preloader progress bar fill |

---
---

# Salle-Blanche Style Catalog

> **Source:** `d:\Downloads\CGMWTFEB2026\CGMWTFEB2026\salle-blanche`
> **Purpose:** Complete reusable pattern reference extracted from the salle-blanche project. Pick any pattern below and adapt it to beautyProject sections without re-reading the reference.

---

## Pattern Index — Quick Scan

| # | Name | What It Is |
|---|---|---|
| SB-1 | **Color Palette** | 7-token warm-dark green palette with CSS custom properties |
| SB-2a | **Serif Display** | Roslindale Variable — massive uppercase serif headings |
| SB-2b | **Body Grotesk** | Host Grotesk — body copy with weight 450, tight line-height |
| SB-2c | **Mono Label** | DM Mono — uppercase 0.85rem labels in olive accent |
| SB-3a | **Full-Bleed Hero** | Full-viewport hero with gradient overlay, ambient glow, and photo drift |
| SB-3b | **Scattered Gallery** | 6 absolutely-positioned images inside 300svh container with scroll-driven scale |
| SB-3c | **Sticky Header** | Section header pins at top while content scrolls past, fades on exit |
| SB-3d | **Horizontal Slider** | Pinned sideways-scroll section with progress bar (routine/services) |
| SB-3e | **Alternating Sticky Cards** | Left/right alternating sticky cards with scroll-driven yPercent collapse |
| SB-3f | **Image Banner** | Full-viewport image section with overlaid Copy text reveals |
| SB-4a | **Slide Button** | Char-by-char hover with base/over layers sliding vertically |
| SB-4b | **Dining Nav** | Category buttons with scale-0 entrance and active press |
| SB-4c | **Preview Card** | Minimap + preview card layout with autoAlpha/y entrance |
| SB-5a | **Clip-Path Menu** | Full-screen nav overlay with clip-path polygon morph |
| SB-5b | **Page Rotation** | Background page rotates/scales when menu opens |
| SB-5c | **Menu Text Slide** | Staggered link text slides up from y:140% with opacity |
| SB-5d | **Toggle Label Swap** | Menu/Close label swaps with rotation and position tweens |
| SB-5e | **Preview Image Pop** | Mouse-hover spawns scaled/rotated image that eases to normal |
| SB-5f | **Link Underline** | CSS scaleX(0→1) underline with origin flip on hover |
| SB-6a | **Progress Preloader** | Full-screen rAF-driven 0→100% progress with title fill overlay |
| SB-6b | **Preloader Ambient** | Pulsing radial glow + background image scale/blur entrance |
| SB-6c | **Preloader Exit** | Blur return + opacity fade + Lenis unlock transition |
| SB-7a | **Curtain Rise** | SplitText line/word mask reveal — y:110%→0% with power4.out stagger |
| SB-7b | **Image Scale Scrub** | fromTo scale 0.5→1.25→0.5 on scroll scrub per image |
| SB-7c | **Infinite Carousel** | Drag + momentum + GSAP ticker with wrap utility and lerp |
| SB-7d | **SVG Circle Stroke** | strokeDashoffset reveal on scroll + looping hover redraw |
| SB-7e | **Marquee Scroll** | Infinite horizontal text scroll with timeScale pause on hover |
| SB-7f | **Avatar Name Swap** | Avatar hover expand 70→120px + letter slide swap from center |
| SB-7g | **Postcard Stack** | 5-card fan with rotation/xPercent on button hover |
| SB-7h | **Hero Parallax** | Multi-layer heading split + image scaleY zoom on scrub |
| SB-7i | **Card Grid Stagger** | Cards fade in with scale 0.75→1 + y:30→0 on scroll |
| SB-7j | **Info Panel Slide** | Panels slide from y:125% to 0% with icon scale on scrub |
| SB-7k | **Card Fan-In** | Cards fly from right with rotation, scale up in sequence |
| SB-8a | **Butter Scroll** | Lenis smooth scroll with custom exponential easing |
| SB-8b | **View Transition** | Clip-path polygon reveal + opacity/translateY old-page exit |
| SB-8c | **Scroll Lock** | Lenis stop/start + body overflow hidden during overlays |

---

## SB-1 — Color Palette

> A 7-token green nature palette. Deep forest greens dominate with a warm beige primary text color. The body background is an extremely dark green (#0C1A08) — nearly black but with a green cast. All values on `:root`.

```css
:root {
  --cement: #DDD6CC;   /* light beige — primary text, headings */
  --sage: #A3AC94;     /* muted green — paragraph text, secondary */
  --olive: #6B8055;    /* medium green — accent dots, labels, mono text */
  --forest: #3B5632;   /* dark green — borders, card accents */
  --pine: #2A4420;     /* darker green — subtle backgrounds, tints */
  --deep: #182E14;     /* very dark green — section backgrounds */
  --ink: #231F20;      /* near black — dark text on light surfaces */
}

body {
  background-color: #0C1A08;   /* hardcoded ultra-dark green */
  color: var(--cement);
}
```

**Border pattern:**
```css
border: 1px solid rgba(163, 172, 148, 0.15);  /* sage at 15% opacity */
```

**Pine-tinted card background:**
```css
background: rgba(42, 68, 32, 0.15);  /* --pine at 15% */
```

---

## SB-2 — Typography

### SB-2a. "Serif Display" — Heading — Roslindale Variable

> A warm, high-contrast serif used exclusively for headings. Weight 900, uppercase, extremely tight line-height (0.85) creates a dense, editorial impact. Loaded via CDN `@import`, not next/font. Fluid sizing via `clamp()` scales from mobile to ultra-wide.

```css
@import url("https://fonts.cdnfonts.com/css/roslindale");

h1, h2, h3, h4, h5, h6 {
  font-family: "Roslindale Variable", sans-serif;
  font-weight: 900;
  line-height: 0.85;
  text-transform: uppercase;
}

h1 { font-size: clamp(4rem, 12vw, 20rem); }
h2 { font-size: clamp(3rem, 8vw, 13rem); }
h3 { font-size: clamp(2rem, 5vw, 8rem); }
h4 { font-size: clamp(1.75rem, 3.5vw, 5.25rem); }
h5 { font-size: clamp(1.5rem, 3vw, 4.5rem); }
h6 { font-size: clamp(1.25rem, 2vw, 4rem); }
```

### SB-2b. "Body Grotesk" — Paragraph — Host Grotesk

> Clean sans-serif body text at weight 450 (slightly heavier than normal). Tight line-height 1.15 with negative letter-spacing for a modern editorial feel. Color defaults to `--sage` (muted green). Size variants via `.sm`, `.md`, `.lg` classes.

```css
p {
  font-family: var(--font-host-grotesk), sans-serif;
  font-size: 1.15rem;
  font-weight: 450;
  line-height: 1.15;
  letter-spacing: -0.025rem;
  color: var(--sage);
}

p.sm { font-size: 1rem; }
p.md { font-size: 1.45rem; letter-spacing: -0.035rem; }
p.lg { font-size: 1.75rem; letter-spacing: -0.045rem; }

/* Mobile (≤1000px) */
p    { font-size: 1rem; }
p.sm { font-size: 0.9rem; }
p.md { font-size: 1.35rem; }
p.lg { font-size: 1.5rem; }
```

### SB-2c. "Mono Label" — Tag — DM Mono

> Uppercase monospace text for small labels, metadata tags, and category markers. Olive green color makes it recede behind headings while still being legible. Used extensively for section labels ("Our Approach", "What We Offer"), navigation links, and stat labels.

```css
p.mono {
  font-family: var(--font-dm-mono), monospace;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 0.9;
  text-transform: uppercase;
  color: var(--olive);
}
```

**Loaded via `next/font/google` in layout.js:**
```javascript
import { DM_Mono } from "next/font/google";
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});
```

---

## SB-3 — Layout Patterns

### SB-3a. "Full-Bleed Hero" — Landing Section

> Full-viewport hero with a PNG background image, a left-to-right dark green gradient for text readability, and an ambient warm glow in the top-right corner. Content sits left-aligned inside the `.wrap` container. A white flash overlay fires on preloader exit (camera-flash effect). The background image subtly drifts via GSAP yoyo animation.

```css
.landing {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background-color: var(--deep);
}

.landing__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  will-change: transform, filter;
}

.landing__gradient {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to right,
    rgba(24, 46, 20, 0.8) 0%,
    rgba(24, 46, 20, 0.5) 30%,
    transparent 65%
  );
  pointer-events: none;
}

.landing__warmth {
  position: absolute;
  top: 25%; right: 15%;
  width: 45%; height: 55%;
  z-index: 1;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 170, 130, 0.15) 0%,
    transparent 70%
  );
  opacity: 0.3;
  will-change: opacity;
}

.landing__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 2000px;
  height: 100%;
  padding: 2.5rem;
  margin: 0 auto;
}
```

**Hero entrance animation (from preloader):**
```javascript
// Background starts zoomed/bright, settles to normal
gsap.set(bg, { scale: 1.08, filter: "brightness(1.6)" });
gsap.to(bg, { scale: 1.0, filter: "brightness(1)", duration: 1.5, ease: "power2.out" });

// White flash fades out
gsap.to(flash, { opacity: 0, duration: 1, ease: "power2.out" });

// Text reveals stagger in
gsap.set([label, h1, sub, cta], { autoAlpha: 0, y: 30 });
tl.to(label, { autoAlpha: 1, x: 0, duration: 0.8 }, 1.5);
tl.to(h1, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.8);
tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.8 }, 2.1);
tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.8 }, 2.4);

// Ambient glow pulse
gsap.to(warm, { opacity: 0.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });

// Background drift
gsap.to(bg, { xPercent: 1.5, yPercent: -0.75, duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
```

**Returning visitor variant:** Skips flash/zoom, reduces delays by `0.6s`.

### SB-3b. "Scattered Gallery" — About Section Images

> Six absolutely-positioned images scattered inside a tall container (300svh). Each has a different position, width, and aspect-ratio — creating an editorial magazine layout. Images scale from small to large and back as they scroll through the viewport. The about header sits sticky behind the images and fades as images reach the end.

```css
/* Container for scattered images */
.about-imgs {
  position: relative;
  height: 300svh;
  width: 100%;
}

/* Example image positions */
#about-img-1 { top: 2.5%; left: 25%; width: 12.5%; aspect-ratio: 1; }
#about-img-2 { top: 7.5%; left: 60%; width: 15%; aspect-ratio: 5/7; }
#about-img-3 { top: 20%; left: 8rem; width: 17.5%; aspect-ratio: 4/5; }
#about-img-4 { top: 30%; left: 40%; width: 20%; aspect-ratio: 1; }
#about-img-5 { top: 45%; right: 4rem; width: 10%; aspect-ratio: 1; }
#about-img-6 { top: 50%; left: 20%; width: 16%; aspect-ratio: 5/7; }

.about-img {
  position: absolute;
  overflow: hidden;
  border-radius: 0.35rem;
  will-change: transform;
}
```

```javascript
// Each image scales in/out independently as it scrolls through viewport
aboutImages.forEach((image) => {
  gsap.timeline({
    scrollTrigger: {
      trigger: image,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  })
  .fromTo(image, { scale: 0.5 }, { scale: 1.25, ease: "none" })
  .to(image, { scale: 0.5, ease: "none" });
});
```

### SB-3c. "Sticky Header" — Pinned Section Title

> The about section header is `position: sticky; top: 0; height: 100svh`. It stays visible while the scattered image gallery scrolls past. The heading opacity fades to 0 as the gallery reaches its end, creating a layered depth effect.

```css
.about-header {
  position: sticky;
  top: 0;
  height: 100svh;
  /* ... content centered */
}
```

```javascript
gsap.to(".about-header h3", {
  opacity: 0,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".about-imgs",
    start: "bottom bottom",
    end: "bottom 30%",
    scrub: true,
  },
});
```

### SB-3d. "Horizontal Slider" — Pinned Sideways Scroll

> The page freezes and content slides horizontally driven by vertical scroll. A progress bar fills from left to right. Track is 350% viewport width (desktop) or 600%+ (mobile). Used for the dining menu / services section.

```css
.routine {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.routine-slider-wrapper {
  position: relative;
  width: 350%;
  height: 100%;
  display: flex;
  gap: 1.5rem;
  will-change: transform;
}

.routine-progress {
  width: 100%;
  height: 100%;
  background-color: var(--olive);
  transform: scaleX(0);
  transform-origin: left;
}

/* Mobile */
@media (max-width: 1000px) {
  .routine-slider-wrapper { width: calc(600% + 7.5rem); }
}
```

```javascript
ScrollTrigger.create({
  trigger: ".routine",
  start: "top top",
  end: `+=${window.innerHeight * 5}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;
    const maxTranslateX = -(wrapperWidth - containerWidth);
    gsap.set(sliderWrapper, { x: progress * maxTranslateX });
    gsap.set(progressBar, { scaleX: progress });
  },
});
```

### SB-3e. "Alternating Sticky Cards" — Column Stack

> Cards are `position: sticky; top: 0; height: 100svh`. Odd cards align right (`margin-left: auto`), creating a left-right alternating column layout. Background colors cycle through 3 tones. On scroll, each card (except the last in each column) translates `yPercent: -100` via scrub.

```css
.sticky-card {
  position: sticky;
  top: 0;
  width: 50%;
  height: 100svh;
  will-change: transform;
}

.sticky-card:nth-child(odd) { margin-left: auto; }

.sticky-card:nth-child(3n + 1) { background-color: var(--base-300); }
.sticky-card:nth-child(3n + 2) { background-color: var(--base-400); }
.sticky-card:nth-child(3n + 3) { background-color: var(--base-500); }

/* Mobile: collapse to normal flow */
.sticky-cards-mobile .sticky-card {
  position: relative;
  width: 100%;
}
```

```javascript
cards.forEach((card, index) => {
  const isLastInColumn =
    index === lastLeftColumnIndex || index === lastRightColumnIndex;
  if (isLastInColumn) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "bottom top",
      end: "+=100%",
      scrub: true,
    },
  }).to(card, { yPercent: -100, ease: "none" });
});
```

### SB-3f. "Image Banner" — Full-Viewport Photo Section

> Simple full-viewport section with an absolute background image and overlaid text. No GSAP animations — relies entirely on the Copy component for text reveals. Used as a visual breather between content-heavy sections.

```css
.image-banner {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}
```

**Text animations via Copy component:**
```jsx
<Copy type="lines" animateOnScroll>
  <h2>Heading</h2>
</Copy>
<Copy type="lines" trigger=".image-banner" start="top 50%" delay={0.5}>
  <p>Description text</p>
</Copy>
```

---

## SB-4 — Component Patterns

### SB-4a. "Slide Button" — Character Hover Animation

> A flat button where each character is split into two layers: `.char-default` (visible) and `.char-hover` (hidden above). On hover, default chars slide down out of view while hover chars slide in from above, creating a slot-machine letter roll effect. Background div scales to 0.9 on hover. Disabled below 1000px.

```css
.slide-button {
  padding: 1.25rem 2.75rem;
  border-radius: 0.25rem;
  background-color: var(--cement);
  color: var(--ink);
}

.slide-char {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.char-default, .char-hover {
  display: inline-block;
  will-change: transform;
}

.slide-button-bg {
  transition: transform 0.35s ease;
}
.slide-button:hover .slide-button-bg {
  transform: scale(0.9);
}
```

```javascript
// Initial state
gsap.set(defaultChars, { yPercent: 0 });
gsap.set(hoverChars, { yPercent: -100 });

// Mouse enter
const tl = gsap.timeline();
tl.to(defaultChars, { yPercent: 100, duration: 0.3, ease: "power3.out", stagger: 0.01 }, 0);
tl.to(hoverChars, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.01 }, 0.1);

// Mouse leave
const tl = gsap.timeline();
tl.to(hoverChars, { yPercent: -100, duration: 0.4, ease: "power3.inOut", stagger: 0.01 }, 0);
tl.to(defaultChars, { yPercent: 0, duration: 0.4, ease: "power3.inOut", stagger: 0.01 }, 0.15);
```

**Mobile:** Event listeners detached, chars reset to initial state.

### SB-4b. "Dining Nav" — Category Button Entrance

> Category navigation buttons start at `scale: 0` and pop in with staggered timing on scroll. Active button press scales to 0.85 via CSS.

```javascript
gsap.set(navButtons, { scale: 0 });
gsap.to(navButtons, {
  scale: 1,
  duration: 1,
  ease: "power3.out",
  stagger: 0.1,
  scrollTrigger: { trigger: section, start: "top 30%", once: true },
});
```

```css
.dining-nav-button:active { transform: scale(0.85); }
```

### SB-4c. "Preview Card" — Minimap with Card Entrance

> A category-preview layout: small thumbnail minimap items on one side, large preview card on the other. Both enter with autoAlpha/y animation on scroll. Minimap items have a dark overlay that clears on active state.

```javascript
// Preview card entrance
gsap.set(previewCard, { autoAlpha: 0, y: 50 });
gsap.to(previewCard, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" });

// Minimap items entrance
gsap.set(minimapItems, { autoAlpha: 0, y: 30 });
gsap.to(minimapItems, {
  autoAlpha: 1, y: 0,
  duration: 1, ease: "power3.out", stagger: 0.1,
});
```

```css
.dining-minimap-img::after {
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 1;
  transition: 0.3s;
}
.dining-minimap-item.active .dining-minimap-img::after { opacity: 0; }
.dining-minimap-item.active p { color: var(--base-100); }
```

---

## SB-5 — Navigation Menu

### SB-5a. "Clip-Path Menu" — Overlay Reveal

> Full-screen menu overlay hidden via clip-path polygon (all points at top). On open, the polygon morphs to show the full overlay with an angled bottom edge (175% on right side, 100% on left). Duration 1.25s with power4.inOut easing creates a smooth, dramatic wipe.

```css
.nav-menu-overlay {
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
}
```

```javascript
// Open
gsap.to(".nav-menu-overlay", {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
  duration: 1.25,
  ease: "power4.inOut",
});

// Close
gsap.to(".nav-menu-overlay", {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  duration: 1.25,
  ease: "power4.inOut",
});
```

### SB-5b. "Page Rotation" — Shell Transform

> When the menu opens, the entire page content behind the overlay rotates, scales, and shifts — creating a dramatic 3D "pushed aside" effect. Transform origin is set to the right edge at the current scroll position so the rotation pivots naturally.

```javascript
// Open
page.style.transformOrigin = `right ${scrollY}px`;
gsap.to(page, {
  rotation: 10, x: 300, y: 450, scale: 1.5,
  duration: 1.25,
  ease: "power4.inOut",
});

// Close
gsap.to(page, {
  rotation: 0, x: 0, y: 0, scale: 1,
  duration: 1.25,
  ease: "power4.inOut",
  onComplete: () => {
    gsap.set(page, { clearProps: "all" });
    page.style.transformOrigin = "";
  },
});
```

### SB-5c. "Menu Text Slide" — Link Stagger Entrance

> All menu links and social links start at `y: 140%, opacity: 0.25` and stagger into view after a 0.75s delay. Footer text starts at `y: 120%`. The stagger creates a cascading waterfall effect from top to bottom.

```javascript
gsap.set([".nav-link a", ".nav-social a"], { y: "140%", opacity: 0.25 });
gsap.set([".nav-menu-footer p span"], { y: "120%", opacity: 0.25 });

gsap.to(allTextSelectors, {
  y: "0%", opacity: 1,
  delay: 0.75,
  duration: 1,
  ease: "power3.out",
  stagger: 0.1,
});
```

### SB-5d. "Toggle Label Swap" — Menu/Close Flip

> The menu toggle text swaps between "Menu" and "Close" labels with a subtle rotation/position/opacity tween. The outgoing label tilts and slides away, the incoming label eases in from the opposite direction. Staggered delays (0.25s out, 0.5s in) prevent visual overlap.

```javascript
// Hide outgoing
gsap.to(outgoing, {
  x: -5,
  y: isOpening ? -10 : 10,
  rotation: isOpening ? -5 : 5,
  opacity: 0,
  delay: 0.25, duration: 0.5, ease: "power2.out",
});

// Show incoming
gsap.to(incoming, {
  x: 0, y: 0, rotation: 0, opacity: 1,
  delay: 0.5, duration: 0.5, ease: "power2.out",
});
```

### SB-5e. "Preview Image Pop" — Link Hover Preview

> On menu link hover, a new `<img>` element is spawned inside a preview container with initial `opacity: 0, scale: 1.25, rotation: 10deg`. It eases to `opacity: 1, scale: 1, rotation: 0` over 0.75s. A maximum of 3 images are kept (older ones pruned from DOM), creating a stacking postcard effect.

```javascript
newImg.style.opacity = "0";
newImg.style.transform = "scale(1.25) rotate(10deg)";

gsap.to(newImg, {
  opacity: 1, scale: 1, rotation: 0,
  duration: 0.75,
  ease: "power2.out",
});
```

### SB-5f. "Link Underline" — CSS Hover Line

> Navigation links have a pseudo-element underline that starts at `scaleX(0)` with `transform-origin: right`. On hover, it scales to `scaleX(1)` while switching origin to `left`, creating a directional wipe effect.

```css
.nav-link a::after, .nav-social a::after {
  content: "";
  position: absolute;
  top: 102%;
  width: 100%;
  height: 2px;
  background: var(--base-100);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.6, 0, 0.4, 1);
}

.nav-link a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

**Mobile (<900px):** Underline pseudo-elements hidden.

---

## SB-6 — Preloader

### SB-6a. "Progress Preloader" — Title Fill Animation

> Full-screen preloader with a `requestAnimationFrame`-driven progress counter (0→100% over 2600ms). Two overlapping `<h2>` elements create the fill effect: a faint ghost title underneath and a clipped fill title on top whose width expands from 0% to 100% as loading progresses. No GSAP — pure React state + rAF.

```javascript
// rAF progress loop
const duration = 2600; // ms
const elapsed = currentTime - startTime;
const progress = Math.min(elapsed / duration, 1);

// Ghost title: fixed at rgba(224, 222, 209, 0.16)
// Fill title: width tracks progress
fillRef.current.style.width = `${progress * 100}%`;
```

```css
.preloader-title-ghost {
  color: rgba(224, 222, 209, 0.16);
}

.preloader-title-fill {
  position: absolute;
  width: 0%;
  overflow: hidden;
  color: var(--base-100);
  will-change: width;
}
```

### SB-6b. "Preloader Ambient" — Background Effects

> The preloader background image enters with `scale: 1.15` and `blur: 12px`, settling to `scale: 1.0` and `blur: 0px`. A pulsing olive-colored radial gradient glow adds warmth. Both create a soft, cinematic loading atmosphere.

```javascript
// Image entrance
gsap.fromTo(bg,
  { scale: 1.15, filter: "blur(12px)" },
  { scale: 1.0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
);

// Ambient glow pulse
gsap.to(glow, {
  opacity: 0.5,
  duration: 2,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
});
```

### SB-6c. "Preloader Exit" — Dismiss Transition

> When the enter button is clicked: background blurs back to 12px, content fades up, and after a 1350ms delay the preloader hides via CSS opacity/visibility transition (700ms). Lenis scroll unlocks on exit. Module-level flag ensures preloader only shows once per session.

```css
.preloader-button-wrap {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 10px));
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: 0.35s;
}

.preloader-button-wrap.is-visible {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.preloader.is-exiting {
  opacity: 0;
  visibility: hidden;
  /* transition: opacity 0.7s ease, visibility 0.7s ease; */
}
```

```javascript
let isInitialLoad = true; // module-level singleton
const EXIT_ANIMATION_MS = 700;
```

---

## SB-7 — Animation Patterns

### SB-7a. "Curtain Rise" — SplitText Line/Word Reveal

> The #1 animation used across salle-blanche. Every heading, label, and content block uses this. Text is split into lines (or words), each wrapped in an overflow-hidden mask. Lines start at `yPercent: 110` (hidden below the mask) and slide up to `yPercent: 0` with staggered timing. Power4.out easing gives a fast entrance with gentle deceleration. Waits for fonts to load before splitting.

```javascript
const REQUIRED_FONTS = ["Host Grotesk", "DM Mono", "Roslindale Variable"];

// Wait for fonts
await document.fonts.ready;
REQUIRED_FONTS.forEach((font) => document.fonts.check(`16px "${font}"`));
await new Promise((resolve) => setTimeout(resolve, 100));

// Split text
const split = SplitText.create(element, {
  type: "lines",    // or "words"
  mask: "lines",    // creates overflow-hidden wrapper
  linesClass: "split-line",
  lineThreshold: 0.1,
});

// Animate
gsap.set(split.lines, { yPercent: 110 });
gsap.to(split.lines, {
  yPercent: 0,
  duration: 1,
  ease: "power4.out",
  stagger: 0.1,
  delay: 0,        // configurable per instance
  paused: true,     // if scroll-triggered
});

// ScrollTrigger
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  animation: revealAnimation,
  once: true,
  refreshPriority: -1,
});
```

```css
.split-line, .split-word {
  display: inline-block;
  will-change: transform;
}
```

**Props pattern (Copy component):**
- `animateOnScroll` — scroll-triggered (default) vs immediate play
- `delay` — seconds delay before animation
- `type` — `"lines"` (default) or `"words"`
- `trigger` / `triggerPoint` — custom ScrollTrigger trigger (CSS selector)
- `start` — ScrollTrigger start position (default `"top 80%"`)

### SB-7b. "Image Scale Scrub" — Scroll-Linked Zoom

> Each image creates its own timeline with two keyframes: `scale: 0.5 → 1.25 → 0.5`. The first half zooms in as the image enters the viewport, the second half zooms out as it exits. Scrub ties it directly to scroll position. Creates a parallax breathing effect.

```javascript
aboutImages.forEach((image) => {
  gsap.timeline({
    scrollTrigger: {
      trigger: image,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  })
  .fromTo(image, { scale: 0.5 }, { scale: 1.25, ease: "none" })
  .to(image, { scale: 0.5, ease: "none" });
});
```

### SB-7c. "Infinite Carousel" — Drag + Momentum

> A drag-driven carousel with physics-like momentum. Uses `gsap.ticker` for frame-by-frame updates. Cards are positioned absolutely and wrapped using `gsap.utils.wrap()` for seamless infinite looping. Drag velocity is tracked and decays at 0.95 per frame. Position lerps at 0.075 for smooth following.

```javascript
const CARD_GAP = 20;
const LERP_FACTOR = 0.075;
const VELOCITY_DAMPING = 0.95;
const VELOCITY_THRESHOLD = 0.05;

// Card positioning
gsap.set(cards, {
  position: "absolute",
  left: 0, top: 0,
  x: (index) => index * itemWidth,
});
gsap.set(track, { height: cards[0].offsetHeight });

// Wrap utility for infinite loop
const wrapPosition = gsap.utils.wrap(-itemWidth, totalWidth - itemWidth);

// Ticker update (runs every frame)
const updateCardPositions = () => {
  if (!isDragging) {
    targetX += velocityX;
    velocityX *= VELOCITY_DAMPING;
    if (Math.abs(velocityX) < VELOCITY_THRESHOLD) velocityX = 0;
  }
  currentX += (targetX - currentX) * LERP_FACTOR;

  cards.forEach((card, index) => {
    gsap.set(card, { x: wrapPosition(index * itemWidth + currentX) });
  });
};
gsap.ticker.add(updateCardPositions);

// Drag velocity tracking
velocityX = ((e.clientX - lastPointerX) / timeDelta) * 16;

// Button navigation
slideByRef.current = (direction) => {
  velocityX = 0;
  targetX += direction * itemWidth;
};
```

**Entrance:**
```javascript
gsap.set(navButtons, { scale: 0 });
gsap.to(navButtons, { scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1, delay: 0.4 });

gsap.set(cards, { scale: 0.85, autoAlpha: 0 });
gsap.to(cards, { scale: 1, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.3 });
```

**Mobile:** Drag disabled below 1000px, re-enabled on resize.

### SB-7d. "SVG Circle Stroke" — Draw-On Reveal

> An SVG circle path starts fully hidden via `strokeDashoffset` equal to its total length. On scroll, the offset animates to 0, drawing the circle. On hover, the circle "redraws" — dashes out then back in via a looping timeline.

```javascript
// Initial state
gsap.set(circlePath, {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength,
  rotation: -90,
  transformOrigin: "center center",
});

// Scroll reveal
gsap.to(circlePath, {
  strokeDashoffset: 0,
  duration: 1.2,
  delay: 0.6,
  ease: "power2.inOut",
  scrollTrigger: { trigger: section, start: "top 75%", once: true },
});

// Hover redraw loop
hoverTimeline = gsap.timeline();
hoverTimeline
  .to(circlePath, { strokeDashoffset: -pathLength, duration: 0.75, ease: "power2.inOut" })
  .set(circlePath, { strokeDashoffset: pathLength })
  .to(circlePath, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" });
```

### SB-7e. "Marquee Scroll" — Infinite Horizontal Text

> A repeated text string (12 copies) scrolls infinitely left. Uses GSAP `modifiers` to loop the x position seamlessly. `timeScale` is tweened to 0 on hover (pause) and back to 1 on leave, creating a smooth stop/start rather than an abrupt halt. Duration 30s for ambient speed.

```javascript
const MARQUEE_REPEAT_COUNT = 12;

const scrollTween = gsap.to(track, {
  x: -halfLoopWidth,
  duration: 30,
  ease: "none",
  repeat: -1,
  modifiers: {
    x: gsap.utils.unitize((x) => parseFloat(x) % halfLoopWidth),
  },
});

// Pause on hover
const handleMouseEnter = () =>
  gsap.to(scrollTween, { timeScale: 0, duration: 0.5 });
const handleMouseLeave = () =>
  gsap.to(scrollTween, { timeScale: 1, duration: 0.5 });
```

```css
.marquee-pill {
  max-width: 720px;
  padding: 0.75rem 0;
  overflow: hidden;
  border: 2px solid #c0472b;
  border-radius: 999px;
}
```

### SB-7f. "Avatar Name Swap" — Hover Expand + Letter Stagger

> Circular avatars expand from 70px to 120px on hover. When an individual avatar is hovered, the default heading text slides up and the chef's name slides in from below — letter by letter with stagger from center. On avatar leave, the chef name exits and on container leave, the default name restores.

```javascript
// Avatar expand
gsap.to(avatar, { width: 120, height: 120, duration: 0.5, ease: "power4.out" });
gsap.to(avatar, { width: 70, height: 70, duration: 0.5, ease: "power4.out" }); // on leave

// Default name out
gsap.to(defaultLetters, {
  y: "-110%",
  duration: 0.75,
  ease: "power4.out",
  stagger: { each: 0.025, from: "center" },
});

// Chef name in
gsap.to(nameLetters, {
  y: "0%",
  duration: 0.75,
  ease: "power4.out",
  stagger: { each: 0.025, from: "center" },
});

// Chef name out (on avatar leave)
gsap.to(nameLetters, {
  y: "110%",
  duration: 0.75,
  ease: "power4.out",
  stagger: { each: 0.025, from: "center" },
});

// Default name restore (on container leave)
gsap.to(defaultLetters, {
  y: "0%",
  duration: 0.75,
  ease: "power4.out",
  stagger: { each: 0.025, from: "center" },
});
```

```css
.chefs-name h1 .letter {
  display: inline-block;
  transform: translateY(110%);
  will-change: transform;
}
.chefs-name--default h1 .letter {
  transform: translateY(0%);
}
```

**Mobile:** Hover disabled. Avatars 60x60px, wrapped, no pointer cursor.

### SB-7g. "Postcard Stack" — Fan Hover Animation

> 5 postcard-sized images stack behind a button. On button hover, a paused timeline plays: each card fans out with rotation and horizontal offset (staggered at 0.07s intervals). Cards start at `yPercent: 250` (hidden below) and animate to `yPercent: 55` with unique rotation and xPercent values per card. On leave, the timeline reverses.

```javascript
const POSTCARDS = [
  { rotation: -8, x: "-25%" },
  { rotation: 6, x: "20%" },
  { rotation: -4, x: "-15%" },
  { rotation: 10, x: "25%" },
  { rotation: -12, x: "-10%" },
];

const postcardTimeline = gsap.timeline({ paused: true });

cards.forEach((card, index) => {
  postcardTimeline.fromTo(
    card,
    { yPercent: 250, xPercent: 0, rotation: 0 },
    {
      yPercent: 55,
      xPercent: parseFloat(POSTCARDS[index].x),
      rotation: POSTCARDS[index].rotation,
      duration: 0.8,
      ease: "power3.out",
    },
    index * 0.07,
  );
});

button.addEventListener("mouseenter", () => postcardTimeline.play());
button.addEventListener("mouseleave", () => postcardTimeline.reverse());
```

```css
.footer-postcard {
  position: absolute;
  width: clamp(360px, 40vw, 620px);
  aspect-ratio: 5/7;
  border-radius: 0.35rem;
  will-change: transform;
}
```

**Mobile:** Postcards container `display: none`.

### SB-7h. "Hero Parallax" — Multi-Layer Scroll Zoom

> The about page hero uses a 250vh tall container with a sticky inner pin. As the user scrolls, heading lines 1 & 3 scale to 2x and fly left while heading line 2 flies right (mirror). The hero image stretches vertically via `scaleY: 2.5` and slides down via `yPercent: 300`, while the inner image stretches horizontally via `scaleX: 2.5`. Creates a dramatic explosion-zoom effect.

```javascript
scrollTrigger: {
  trigger: ".about-hero",
  start: "top top",
  end: "bottom +=1200%",
  scrub: true,
}

// Heading lines 1 & 3 (fly left)
.to([".heading-line-1", ".heading-line-3"], {
  scale: 2,
  y: "175vh",     // desktop; "200vh" on mobile
  xPercent: -150,  // desktop; -100 on mobile
}, "scroll")

// Heading line 2 (fly right)
.to(".heading-line-2", {
  scale: 2,
  y: "175vh",
  xPercent: 150,   // opposite direction
}, "scroll")

// Hero image zoom + slide
.to(".hero-image", { scaleY: 2.5, yPercent: 300 }, "scroll")
.to(".hero-image img", { scaleX: 2.5 }, "scroll")
```

### SB-7i. "Card Grid Stagger" — Menu Grid Entrance

> Grid cards start at `opacity: 0, y: 30, scale: 0.75` and stagger into view on scroll. Quick and subtle — 0.6s duration with 0.08s stagger creates a rapid cascade that feels responsive rather than dramatic.

```javascript
gsap.utils.toArray(".menu-grid").forEach((grid) => {
  const cards = grid.querySelectorAll(".menu-grid-card");

  gsap.set(cards, { opacity: 0, y: 30, scale: 0.75 });

  ScrollTrigger.create({
    trigger: grid,
    start: "top 70%",
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
      });
    },
  });
});
```

### SB-7j. "Info Panel Slide" — Scroll-Driven Panel Rise

> Info panels slide up from `y: 125%` to `y: 0%` based on scroll progress (scrub). Each panel has staggered timing (0.15s offset). Icons inside panels scale from 0 to 1 after the panel is 40% revealed. Creates a cascading vertical entrance.

```javascript
// ScrollTrigger: trigger: infoSection, start: "top bottom", end: "top top", scrub: 1

panels.forEach((panel, index) => {
  const staggerDelay = 0.15;
  const duration = 0.7;
  const start = index * staggerDelay;
  const end = start + duration;

  // Normalized progress for this panel
  gsap.set(panel, { y: `${125 - normalised * 125}%` });

  // Icon scales from 0 to 1 after 40% of panel reveal
  const iconThreshold = 0.4;
  gsap.set(icon, { scale: iconProgress });
});
```

### SB-7k. "Card Fan-In" — Stacked Card Fly-In

> Cards start off-screen to the right with 20deg rotation, then fly in and stack at center. After flying in (first 40% of scroll), they scale up from 0.75 to 1.0 in sequence (each card starts scaling at a staggered offset). The section is pinned for 3x viewport height.

```javascript
// ScrollTrigger: trigger: infoSection, start: "top top", end: "+=${vh * 3}", pin: true, scrub: 1

// Each card starts at:
const initialX = 350 - index * 100; // %
const targetX = -50; // %
const initialRotation = 20; // deg

// As scroll progresses:
const currentX = initialX + normalised * (targetX - initialX);
const currentRotation = 20 - normalised * 20;

// Scale phase (starts at 40% + index * 12%):
const scaleStart = 0.4 + index * 0.12;
gsap.set(card, { scale: 0.75 + normalised * 0.25 });
```

```css
/* Initial positions */
.info-panel:nth-child(1) .info-card { transform: translate(350%, -50%) scale(0.75) rotate(20deg); }
.info-panel:nth-child(2) .info-card { transform: translate(250%, -50%) scale(0.75) rotate(20deg); }
.info-panel:nth-child(3) .info-card { transform: translate(150%, -50%) scale(0.75) rotate(20deg); }
```

**Mobile:** All transforms reset, panels stack vertically with `position: relative`.

---

## SB-8 — Scroll & Transition Patterns

### SB-8a. "Butter Scroll" — Lenis Configuration

> Custom exponential easing function creates a smooth, decelerating scroll feel. Desktop uses longer duration (1.2s) for cinematic weight, mobile uses snappier duration (0.8s). Synced to GSAP ticker for animation-scroll coordination.

```javascript
const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const desktopOpts = {
  easing: LENIS_EASING,
  duration: 1.2,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: true,
  smoothTouch: false,
  touchMultiplier: 2,
};

const mobileOpts = {
  easing: LENIS_EASING,
  duration: 0.8,
  lerp: 0.09,
  smoothTouch: true,
  touchMultiplier: 1.5,
};
```

**Initialization:**
```jsx
<ReactLenis root options={narrow ? mobileOpts : desktopOpts}>
  {children}
</ReactLenis>
```

### SB-8b. "View Transition" — Page Navigation Effect

> Uses the View Transitions API via `next-view-transitions`. The outgoing page fades to `opacity: 0.2` and slides up by 35%. The incoming page reveals via a clip-path from bottom to top. Duration 1500ms with a custom cubic-bezier easing. A 1600ms settle delay dispatches a `viewTransitionComplete` event for downstream components to rebuild ScrollTriggers.

```javascript
const DURATION = 1500;
const EASING = "cubic-bezier(0.87, 0, 0.13, 1)";

// Outgoing page
document.documentElement.animate(
  [
    { opacity: 1, transform: "translateY(0)" },
    { opacity: 0.2, transform: "translateY(-35%)" },
  ],
  { duration: DURATION, easing: EASING, fill: "forwards", pseudoElement: "::view-transition-old(root)" }
);

// Incoming page
document.documentElement.animate(
  [
    { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", transform: "translateY(25%)" },
    { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", transform: "translateY(0%)" },
  ],
  { duration: DURATION, easing: EASING, fill: "forwards", pseudoElement: "::view-transition-new(root)" }
);
```

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none !important;
}

::view-transition-group(root) { z-index: auto !important; }
::view-transition-image-pair(root) { z-index: 1; isolation: isolate; will-change: transform, opacity, clip-path; }
::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 10000; }
```

**Settle delay:** `1600ms` after navigation. Dispatches `viewTransitionComplete` custom event. Sets `window.__viewTransitioning = false`.

### SB-8c. "Scroll Lock" — Lenis Freeze

> During overlays (preloader, menu), Lenis is stopped and body overflow is set to hidden. On dismiss, Lenis restarts and overflow is cleared. Prevents background scrolling during modal states.

```javascript
// Lock
lenis.stop();
document.body.style.overflow = "hidden";

// Unlock
lenis.start();
document.body.style.overflow = "";
```

---

## Quick Reference: Salle-Blanche Easing Functions

| Easing | Feels Like | Used For |
|---|---|---|
| `power4.out` | Very fast start, long deceleration — dramatic entrance | Curtain Rise text reveals, Avatar name letter stagger, Nav text stagger |
| `power4.inOut` | Cinematic symmetric — smooth and grand | Nav menu overlay clip-path, nav content transform, page rotation |
| `power3.out` | Fast start, gentle stop — natural motion | Button char hover-enter, Dining/CTA entrance, Testimonials cards, Footer button, Menu card stagger, Postcard fan |
| `power3.inOut` | Smooth symmetric — deliberate | Button char hover-leave |
| `power2.out` | Medium deceleration — responsive | Nav toggle label, Preloader bg settle, Nav preview image, Chef avatar size, CTA circle stroke |
| `power2.inOut` | Punchy symmetric | CTA circle stroke reveal, CTA circle hover loop |
| `power1.out` | Barely noticeable ease — near-linear | About header fade scrub |
| `back.out(1.7)` | Overshoots then settles — bouncy | Testimonials nav button entrance |
| `sine.inOut` | Gentle oscillation — organic | Hero ambient glow pulse, hero background drift |
| `none` (linear) | Constant speed — mechanical | Image scale scrub, Marquee scroll, Sticky card yPercent, Horizontal slider scrub |
| `cubic-bezier(0.87, 0, 0.13, 1)` | Dramatic ease-in-out | View Transitions page animation |
| `cubic-bezier(0.6, 0, 0.4, 1)` | Smooth directional | Nav link underline hover |

---

## Quick Reference: Salle-Blanche Duration Cheat Sheet

| Duration | Speed Feel | Used For |
|---|---|---|
| `0.3s` | Responsive | Button char hover-enter, Nav toggle label (each), Underline hover, Dining nav active press |
| `0.4s` | Smooth | Button char hover-leave, Drop panel close, Accordion collapse |
| `0.5s` | Comfortable | Avatar expand/shrink, Drop panel open, Nav toggle label delay |
| `0.6s` | Relaxed | Testimonials nav button pop (back.out), Card grid stagger entry |
| `0.7s` | Deliberate | Preloader exit (CSS transition), Testimonials card entrance, Info panel slide duration |
| `0.75s` | Cinematic | Nav preview image pop, SVG circle hover loop (each phase), Carousel slide transition, Avatar name letter stagger |
| `0.8s` | Deliberate | Card stagger reveal, Footer button entrance, Postcard fan duration |
| `1s` | Dramatic | Curtain Rise text reveals, Dining nav/preview/minimap entrance, Nav menu text slide |
| `1.2s` | Grand | SVG circle stroke reveal, Lenis desktop duration |
| `1.25s` | Sweeping | Nav menu overlay clip-path, page rotation, menu content transform |
| `1.5s` | Epic | Hero image settle (scale + brightness), View transition duration |
| `2s` | Ambient | Hero warm glow pulse cycle |
| `2.6s` | Slow build | Preloader progress rAF duration |
| `8s` | Glacial | Hero background drift yoyo |
| `30s` | Infinite ambient | Marquee scroll loop |

---

## Quick Reference: Salle-Blanche ScrollTrigger Map

| Component | Trigger | Start | End | Scrub | Pin | Once |
|---|---|---|---|---|---|---|
| About images scale | each `.about-img` | top bottom | bottom top | true | no | no |
| About header fade | `.about-imgs` | bottom bottom | bottom 30% | true | no | no |
| Copy (default) | container/trigger | top 80% | — | — | no | true |
| DiningMenu entrance | section | top 30% | — | — | no | true |
| Testimonials entrance | section | top 75% | — | — | no | true |
| CTA stroke + image | section | top 75% | — | — | no | true |
| Footer button | `.footer-heading` | top 50% | — | — | no | true |
| Menu grid cards | each `.menu-grid` | top 70% | — | — | no | true |
| Sticky cards scroll | each `.sticky-card` | bottom top | +=100% | true | no | no |
| Horizontal slider | `.routine` | top top | +=5×vh | 1 | true | no |
| About hero parallax | `.about-hero` | top top | bottom +=1200% | true | no | no |
| Reservation panels | infoSection | top bottom | top top | 1 | no | no |
| Reservation cards fan | infoSection | top top | +=3×vh | 1 | true | no |

---

## Quick Reference: Salle-Blanche will-change Declarations

| Element | will-change |
|---|---|
| `.about-header h3` | opacity |
| `.about-img` | transform |
| `.nav-toggle p` | transform, opacity |
| `.nav-menu-content` | opacity, transform |
| `.nav-preview-img img` | transform, opacity |
| `.nav-link a, .nav-social a` | transform |
| `.nav-menu-footer p span` | transform |
| `.marquee-track` | transform |
| `.sticky-card` | transform |
| `.testimonials-carousel` | transform |
| `.testimonials-track` | transform, opacity |
| `.testimonial-card` | transform |
| `.dining-preview-card` | transform, opacity |
| `.dining-minimap-item` | transform, opacity |
| `.footer-postcard` | transform |
| `.chefs-avatar` | width, height |
| `.chefs-name h1 .letter` | transform |
| `.char-default, .char-hover` | transform |
| `.hero-image` | transform, opacity |
| `.hero-image img` | transform |
| `::view-transition-image-pair` | transform, opacity, clip-path |
| `.info-panel` | transform |
| `.info-card` | transform |
| `.reservation-info` | transform |
| `.preloader-title-fill` | width |
| `.landing__bg` | transform, filter |
| `.landing__warmth` | opacity |
