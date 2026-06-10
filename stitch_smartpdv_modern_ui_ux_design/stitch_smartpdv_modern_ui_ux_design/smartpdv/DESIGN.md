---
name: SmartPDV
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#3130c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b4dd8'
  on-tertiary-container: '#d9d8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-label:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system for this POS platform is built on the pillars of **precision, reliability, and modern efficiency**. It targets business owners and retail staff who require a tool that feels as fast as a developer environment but as intuitive as a consumer app. 

The style blends **Minimalism** with **Corporate Modern** aesthetics. It utilizes heavy whitespace to reduce cognitive load during high-frequency transactions and employs a sophisticated layering system. In dark mode, the interface shifts toward a "Technical Glass" look, using backdrop blurs to maintain context and depth, while light mode remains crisp and high-contrast to ensure maximum legibility under harsh retail lighting.

## Colors
The palette is rooted in **Indigo** (Primary) and **Slate** (Secondary/Neutral).
- **Primary Indigo (#4F46E5)**: Used for primary actions, focus states, and key brand moments. It signals interactivity and modern SaaS sophistication.
- **Slate Palette**: Used for the interface structure. Slate 950 (#0F172A) provides the deep "professional" foundation for text and dark-mode surfaces.
- **Functional High-Contrast**: Backgrounds use pure whites or deep slates to ensure that status colors (Emerald, Amber, Rose, Sky) pop immediately for instant error or success recognition at a glance.
- **Glassmorphism (Dark Mode)**: For dark mode, use an 80% opacity on Slate 900 backgrounds with a 12px backdrop blur to create a premium, translucent depth.

## Typography
This design system utilizes **Geist** for its technical precision and readability. The typeface selection ensures that numeric data (essential for POS) remains clear and distinct.
- **Headlines**: Use SemiBold weights with tighter letter-spacing for a modern, high-impact "FinTech" look.
- **Body Text**: Standardized on 16px for desktop to ensure accessibility during fast-paced operations.
- **Mono-labels**: Used for transaction IDs, SKU numbers, and receipt previews to provide a distinct visual "coding" feel.

## Layout & Spacing
The system employs a **Fluid Grid** model with an 8px base unit rhythm. 
- **Desktop**: A 12-column grid with a maximum content width of 1440px. Gutters are fixed at 20px to maintain a compact, "dashboard" feel.
- **Tablet (POS Terminal)**: A 2-column layout (Sidebar navigation + Main content area) is prioritized. Main content uses an 8-column internal grid.
- **Mobile**: A single-column layout with 16px side margins.
- **Density**: Use "Compact" spacing (8px-12px) for data tables and item lists, and "Spacious" spacing (24px+) for marketing or setup screens.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and **Tonal Layers**.
- **Level 0 (Base)**: Background color (#F8FAFC in Light, #0F172A in Dark).
- **Level 1 (Cards)**: White background with a 1px border (#E2E8F0) and a subtle shadow (Y: 2px, Blur: 4px, Opacity: 5%).
- **Level 2 (Dropdowns/Modals)**: White background with a more pronounced elevation (Y: 10px, Blur: 20px, Opacity: 10%).
- **Indigo Glow**: Active or focused primary elements should have a 4px soft outer glow in the primary indigo color (20% opacity) instead of a harsh black outline.

## Shapes
The design system uses a **Rounded** aesthetic (8px - 16px) to soften the professional tone and make the UI feel approachable.
- **Buttons & Inputs**: 8px (standard) to 12px (large).
- **Cards & Modals**: 16px (rounded-xl) for a premium, containerized appearance.
- **Search Bars**: Fully rounded (pill-shaped) to distinguish them from data entry fields.

## Components
- **Buttons**: Primary buttons are solid Indigo with white text. Secondary buttons use a Slate 100 background with Slate 900 text. All buttons have a 2px transition on hover and 12px horizontal padding.
- **Input Fields**: High-contrast borders (Slate 300). On focus, the border shifts to Primary Indigo with a soft outer glow. Labels are always Geist SemiBold 14px.
- **Cards**: Used for product items in the POS grid. They feature a 1px border and 16px corner radius. Image containers inside cards should have a 12px radius.
- **Status Chips**: Small, pill-shaped indicators with a 10% opacity background of the status color and 100% opacity text (e.g., Emerald text on light emerald background).
- **Data Tables**: Zebra-striping is avoided; instead, use thin 1px horizontal dividers (#F1F5F9). Row hover states shift to a 2% Slate tint.
- **Focus States**: High-visibility 2px Indigo rings with 2px offset for keyboard navigation.