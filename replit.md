# T-GUARDIAN - Transaction Guardian Dashboard

## Overview
T-GUARDIAN is a fraud detection and risk monitoring dashboard application by TMA Innovation. The dashboard provides real-time transaction monitoring, fraud detection (rule-based and AI-based), duplicate payment detection, and LLM-assisted human review capabilities.

## Recent Changes
- February 2026: Complete pagination overhaul - all pages now have first/last page buttons, items per page selector (10/20/50/100)
- February 2026: Added TransactionDetailsModal for viewing full transaction details (eye button)
- February 2026: Added SendToLLMDialog for sending transactions to LLM analysis (3-dot menu)
- February 2026: Added SortableHeader component for column sorting on all data tables
- February 2026: Added FilterDropdown for status filtering (All/Safe/Flagged/Fraud)
- February 2026: Reviews page now has reviewer notes textarea, approve=SAFE and block=FRAUD logic
- February 2026: Alerts page now shows WARN/FRAUD transactions sorted by priority (ensemble_score desc)
- February 2026: Default auto-refresh set to 30 seconds across all pages
- February 2026: Fixed trends chart to properly parse TrendDataPoint[] format from API
- February 2026: Updated API layer with proper pagination params (page, perPage, sortBy, sortOrder)
- February 2026: Updated Settings page to use new API routes (/settings/notifications, /settings/detection, /settings/data-integration)
- February 2026: Added 24h transaction/fraud trends line chart using /dashboard/trends endpoint
- February 2026: Integrated system health from /system/health into detection pipeline with live status
- February 2026: Integrated FastAPI backend at localhost:9000 for live data fetching
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
│   ├── TMALogo.tsx      # TMA Innovation branded logo component
│   ├── Pagination.tsx   # Reusable pagination with first/last, items per page
│   ├── TransactionDetailsModal.tsx  # Full transaction details dialog
│   ├── SendToLLMDialog.tsx   # Send to LLM analysis dialog
│   ├── FilterDropdown.tsx    # Status filter dropdown
│   ├── SortableHeader.tsx    # Clickable table headers with sort
│   └── RefreshControls.tsx   # Auto-refresh interval selector
├── lib/
│   ├── api.ts           # FastAPI backend API functions with pagination
│   └── mockData.ts      # Mock transaction, alert, and review data (legacy)
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
1. **Dashboard Page**: KPI cards, detection pipeline visualization, recent verdicts, 24h trends chart
2. **Transactions Page**: Searchable data table with pagination, sorting, filtering, view details modal, send to LLM
3. **Alerts Page**: WARN/FRAUD alerts sorted by priority, pagination, view details, send to LLM, approve/block actions
4. **Reviews Page**: LLM-assisted review queue with reviewer notes, approve (SAFE) / block (FRAUD) actions
5. **Settings Page**: Detection thresholds, notification settings, data integration status

### API Integration
- Backend: FastAPI at localhost:9000
- Default refresh: 30 seconds
- Pagination: page, per_page, sort_by, sort_order query params
- Endpoints: /transactions, /alerts, /reviews, /dashboard/stats, /dashboard/trends, /system/health, /verdict/update, /llm/analyze

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
- Recharts for trends visualization
- FastAPI backend at localhost:9000 for live data

### Key Data Types
- Transaction: Transaction_ID, User_ID, Transaction_Amount, Transaction_Type, Timestamp, Location, Card_Type, Device_Type, Merchant_Category, Risk_Score (0-1 decimal), Fraud_Label (0/1), Daily_Transaction_Count, Transaction_Distance, Authentication_Method
- Verdict: id, Transaction_ID, ensemble_score, model_scores (xgboost, random_forest, neural_net), rule_fraud_score, flag, rule_flagged, ai_flagged, status, reason_trail, created_at
- LLMReview: Transaction_ID, User_ID, ensemble_score, llm_analysis, reviewed_at, status
