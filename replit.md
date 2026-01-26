# T-GUARDIAN - Transaction Guardian Dashboard

## Overview
T-GUARDIAN is a fraud detection and risk monitoring dashboard application by TMA Innovation. The dashboard provides real-time transaction monitoring, fraud detection (rule-based and AI-based), duplicate payment detection, and LLM-assisted human review capabilities.

## Recent Changes
- January 2026: Converted landing page to full dashboard application
- Implemented sidebar navigation with Dashboard, Transactions, Alerts, Reviews, Settings pages
- Built detection pipeline visualization matching architecture diagram
- Added TMA Innovation branding with logo on all pages

## User Preferences
- Uses TMA Innovation branding (blue color scheme #1EA0FF)
- Products use "T-" prefix naming convention
- Poppins font family for typography
- Blue as primary color per brand guidelines
- Error red: #DE0000, Success green: #00A307

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── AppSidebar.tsx   # Dashboard sidebar navigation
│   └── TMALogo.tsx      # TMA Innovation branded logo component
├── lib/
│   └── mockData.ts      # Mock transaction, alert, and review data
├── pages/
│   ├── Dashboard.tsx    # Main dashboard with KPIs and pipeline
│   ├── Transactions.tsx # Transaction history table
│   ├── Alerts.tsx       # Active alerts list with severity
│   ├── Reviews.tsx      # LLM-assisted human review queue
│   ├── Settings.tsx     # Configuration settings
│   └── not-found.tsx    # 404 page
├── App.tsx              # Main app with sidebar layout and routing
└── index.css            # TMA brand colors and styling
```

### Design Tokens
- Primary: hsl(203, 100%, 56%) - TMA Blue (#1EA0FF)
- Gradient: #0573FD to #1EB2FF
- Destructive: hsl(0, 100%, 44%) - Error red (#DE0000)
- Success: hsl(122, 100%, 32%) - Success green (#00A307)
- Font: Poppins

### Dashboard Features
1. **Dashboard Page**: KPI cards, detection pipeline visualization, recent alerts
2. **Transactions Page**: Searchable data table with risk scores and alert types
3. **Alerts Page**: Alerts by severity (critical, high, medium, low) with status
4. **Reviews Page**: LLM-assisted review queue with AI recommendations and confidence scores
5. **Settings Page**: Detection thresholds, notification settings, AI model configuration

### Detection Pipeline (per architecture diagram)
1. Database/Data Stream (input)
2. Data Normalization
3. Deduplication Checking Service
4. Rule-based Fraud Check Service
5. AI-based Fraud Check Service
6. Flagging Service
7. User Dashboard / LLM-assist Human Review

### Tech Stack
- React + TypeScript
- Vite for bundling
- TailwindCSS for styling
- Shadcn/UI components (including Sidebar)
- Wouter for routing
- TanStack Query for data fetching
- Mock data for demonstration (no backend integration required)

### Key Data Types
- Transaction: id, transactionId, amount, sender, receiver, status, riskScore, alertType
- Alert: id, transactionId, type (duplicate/fraud/anomaly), severity, message, status
- ReviewItem: id, transactionId, alertId, priority, llmSuggestion, confidence, status
