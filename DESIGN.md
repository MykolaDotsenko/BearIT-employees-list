# PeopleLens visual direction

PeopleLens uses a **focused signal-board** visual language. The interface stays futuristic, but the identity comes from lens, scan, capacity, and people-discovery metaphors rather than generic cyberpunk decoration.

## Design signature

- deep midnight canvas with restrained mint, cyan, coral, violet, and gold used as semantic signals
- the PeopleLens mark behaves like an optical lens and remains the primary visual motif
- a subtle concentric scan field replaces generic full-screen aurora decoration
- neon is concentrated in status, focus, team identity, and scanning cues instead of coating every surface
- people cards retain pointer-aware perspective depth, but use quieter solid surfaces
- capacity, shortlist, team, and directory actions remain visually distinct without turning every element into a glowing card
- profile management follows conventional company-product hierarchy: one primary Add action plus per-profile action menus

## Motion system

- hero copy enters with depth resolving into focus
- the current-signal module uses a restrained scan line and low-amplitude 3D float
- metric blocks and people cards reveal with short staggered transitions
- pointer-aware cards react subtly to cursor position
- hover motion runs only on devices with hover capability
- all decorative animation and 3D transforms collapse when `prefers-reduced-motion` is enabled

## Interaction principles

- one persistent primary CTA per task
- destructive actions live behind a clearly named profile menu and explicit confirmation
- animation reinforces hierarchy and spatial relationships rather than delaying tasks
- neon is signal, status, focus, and identity—not decoration everywhere
- keyboard focus remains explicit and high contrast
- status never relies on color alone
- form controls retain familiar shapes and readable labels
- mobile intentionally disables pointer tilt and reduces visual motion

## Anti-sameness rules

Avoid:

- blue-purple gradient text as the default visual signature
- universal glassmorphism
- full-screen aurora blobs
- glow around every card and button
- duplicate primary CTAs
- floating decorative cards with no product meaning
- sparkles, “AI magic” iconography, or vague futuristic ornaments
- 3D effects that do not map to focus, scan, signal, or directory interaction

## Product character

PeopleLens should feel like a compact operations instrument: focused, modern, responsive, and specific to people discovery. Visual novelty comes from the lens/scan system and interaction model rather than from generic AI-generated SaaS aesthetics.
