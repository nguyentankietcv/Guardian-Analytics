# T-GUARDIAN - Transaction Guardian

## Overview
T-GUARDIAN is a landing page website for TMA Innovation's transaction fraud detection and risk monitoring product. The site showcases the key features of the T-GUARDIAN platform including automated data ingestion, duplicate payment detection, fraud & anomaly detection, and risk monitoring dashboard.

## Recent Changes
- January 2026: Initial landing page created with TMA brand colors and Poppins font

## User Preferences
- Uses TMA Innovation branding (blue color scheme #1EA0FF)
- Products use "T-" prefix naming convention
- Poppins font family for typography
- Green-themed layout (blue as primary color per brand guidelines)

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── ui/          # Shadcn UI components
│   ├── Header.tsx   # Navigation header with TMA logo
│   ├── Hero.tsx     # Hero section with product intro
│   ├── Features.tsx # Key features showcase
│   ├── Architecture.tsx # How it works section
│   └── Footer.tsx   # Footer with contact info
├── pages/
│   ├── Home.tsx     # Main landing page
│   └── not-found.tsx
├── App.tsx          # Main app with routing
└── index.css        # TMA brand colors and styling
```

### Design Tokens
- Primary: hsl(203, 100%, 56%) - TMA Blue (#1EA0FF)
- Gradient: #0573FD to #1EB2FF
- Font: Poppins
- Destructive: hsl(0, 100%, 44%) - Error red (#DE0000)
- Success: hsl(122, 100%, 32%) - Success green (#00A307)

### Key Components
1. **Header**: Sticky navigation with TMA logo and nav links
2. **Hero**: Gradient background with product intro and stats
3. **Features**: 4 key features + 4 capabilities cards
4. **Architecture**: Visual flow diagram showing detection pipeline
5. **Footer**: Contact info, product links, social media

### Tech Stack
- React + TypeScript
- Vite for bundling
- TailwindCSS for styling
- Shadcn/UI components
- Wouter for routing
- TanStack Query for data fetching
