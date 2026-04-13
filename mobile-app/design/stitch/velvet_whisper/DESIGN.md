# Design System: Editorial Intimacy

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Keepsake"**

This design system rejects the clinical, "app-like" structures of traditional tech. Instead, it draws inspiration from high-end editorial layouts and physical scrapbooks. We are not building a utility; we are building a sanctuary for memories. 

To achieve this, the system breaks the "standard template" look through **intentional asymmetry** and **tonal layering**. We prioritize breathing room over information density. By utilizing overlapping elements—such as a serif headline partially masking a soft-focus image—and extreme typography scales, we create a sense of poetic rhythm. This is a "living diary" that feels as warm and tactile as a hand-written letter.

---

## 2. Colors
Our palette is a sophisticated spectrum of romantic warmth, moving from the ethereal creams of a blank page to the deep, passionate reds of a shared life.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. 
Structure must be achieved through **background color shifts**. For example, a `surface-container-low` section should sit directly against a `surface` background. The eye should perceive the change in "weight" rather than a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
- Use `surface-container-lowest` for the most prominent foreground elements (like a featured diary entry).
- Use `surface-container-high` for recessed areas like search bars or navigation drawers.
- **Nesting:** Place a `surface-container-lowest` card on top of a `surface-container-low` background to create natural, soft depth without artificial ornamentation.

### The "Glass & Gradient" Rule
To evoke a premium, "dream-like" quality:
- **Glassmorphism:** For floating headers or action sheets, use semi-transparent `surface` colors with a `backdrop-filter: blur(20px)`. This allows the "blush" of the content below to bleed through.
- **Signature Textures:** Use subtle linear gradients for primary CTAs (e.g., `primary` to `primary-container`). This adds a "glow" that feels alive, moving beyond static flat design.

---

## 3. Typography
The interplay between the clean, modern **Plus Jakarta Sans** and the timeless **Noto Serif** creates a dialogue between the present moment and lasting memories.

- **Display & Headlines (Noto Serif):** These are the "soul" of the brand. Use `display-lg` for high-impact emotional moments. Large, serif type should be used with generous letter spacing and occasionally placed with slight asymmetrical offsets.
- **Body & Labels (Plus Jakarta Sans):** These provide the "clarity." The sans-serif choice ensures that even long-form diary entries remain highly legible on mobile screens.
- **Hierarchy as Identity:** By pairing a massive `display-md` headline with a tiny, uppercase `label-md` date, we create an editorial "high-low" contrast that feels curated and expensive.

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** rather than structural scaffolding.

- **The Layering Principle:** Depth is "stacked." Avoid shadows on every card. A card is distinguished by being `surface-container-lowest` against a `surface` background.
- **Ambient Shadows:** When an element must float (like a Floating Action Button), use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(188, 0, 79, 0.08)`. Note the tint: we use a fraction of the `on-surface` or `primary` color to mimic natural light, never pure black/grey.
- **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline-variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.
- **Glassmorphism:** Use it to "lift" elements while maintaining a connection to the layers below. This prevents the UI from feeling claustrophobic.

---

## 5. Components

### Buttons
- **Primary:** High roundness (`full`). Gradient fill from `primary` to `primary-container`. `on-primary` text. Minimum height 48px to ensure a 44px+ touch target.
- **Tertiary:** No background. Use `notoSerif` for the label to make it feel like a poetic invitation rather than a command.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid 1px dividers. Separate list items using `1.5rem (md)` vertical spacing or by alternating background tones (`surface` vs `surface-container-low`).
- **Cards:** Use `lg (2rem)` or `xl (3rem)` corner radius. Content should have generous internal padding (at least `2rem`).

### Input Fields
- **Styling:** Use a "pill" shape (`full`) or high-roundness (`lg`). 
- **States:** The "Active" state should not be a thick border, but a subtle glow using a low-opacity `primary` shadow.

### Signature Components for '布布与一二的恋爱日记'
- **The "Memory Polaroid":** A custom card component using `surface-container-lowest`, a high `xl` corner radius, and a `notoSerif` caption at the bottom.
- **The "Floating Heart" FAB:** A primary action button that uses glassmorphism and a `primary` tint to float over the diary feed.

---

## 6. Do’s and Don’ts

### Do
- **Do** lean into white space. If a screen feels "empty," it’s likely working.
- **Do** use asymmetrical image placements to break the "grid" feel.
- **Do** ensure every interactive element has a minimum touch target of 44x44px for thumb-friendly mobile use.
- **Do** use `notoSerif` for dates and emotional pull-quotes.

### Don't
- **Don't** use pure black `#000000`. Use `on-surface` (`#1d1b19`) for a softer, more organic look.
- **Don't** use 1px solid lines. They break the "intimate" and "soft" aesthetic.
- **Don't** crowd the screen. This is a diary, not a dashboard. 
- **Don't** use standard "system" shadows. Always tint shadows with the primary brand color at very low opacity.