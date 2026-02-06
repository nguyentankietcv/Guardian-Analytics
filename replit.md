# T-GUARDIAN - Transaction Guardian Dashboard

## Overview
T-GUARDIAN is a standalone fraud detection and risk monitoring dashboard demo/POC by TMA Innovation. The dashboard showcases real-time transaction monitoring, fraud detection (rule-based and AI-based), duplicate payment detection, and LLM-assisted human review capabilities. Uses comprehensive mock data for fully functional demo without any backend dependency.

## Recent Changes
- February 2026: **Converted to standalone demo POC** - replaced all backend API calls with client-side mock data
- February 2026: Mock data module generates 1000 transactions (200 fraud, 4 warn, 796 pass) with seeded randomness
- February 2026: 6-model ensemble scoring system: DNN, XGBoost, GraphSAGE, Isolation Forest, Rule Check, Transformer
- February 2026: TransactionDetailsModal shows all extended fields: Account Balance, Unusual IP, Prior Fraud, Card Age, Avg 7-Day Amount, Failed Txn, Weekend, and full 6-model breakdown
- February 2026: Transactions page has AI Score + Rule Score columns, PASS text for normal status, badges for fraud/flagged
- February 2026: Alerts page has Discard All Fraud/Warns buttons, model score breakdown (NN/XGB/GS/IF/Rule/TR)
- February 2026: Reviews page has search, Pending Only filter, expanded transaction detail grid, LLM analysis section
- February 2026: Dashboard has 7 KPIs including Fraud Detection Rate, detection pipeline, trends chart, recent verdicts
- February 2026: Complete pagination on all pages with first/last buttons, items per page selector (10/20/50/100)

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
│   ├── TransactionDetailsModal.tsx  # Full transaction details with 6-model breakdown
│   ├── SendToLLMDialog.tsx   # Send to LLM analysis dialog
│   ├── FilterDropdown.tsx    # Status filter dropdown
│   ├── SortableHeader.tsx    # Clickable table headers with sort
│   └── RefreshControls.tsx   # Auto-refresh interval selector
├── lib/
│   ├── api.ts           # Mock-data-backed API layer with simulated delays
│   └── mockData.ts      # Comprehensive mock data: 1000 txns, 6 models, LLM analysis
├── pages/
│   ├── Dashboard.tsx    # KPIs, detection pipeline, trends chart, recent verdicts
│   ├── Transactions.tsx # Transaction table with AI/Rule scores, search, filter
│   ├── Alerts.tsx       # Flagged transactions with model breakdown, bulk actions
│   ├── Reviews.tsx      # LLM-assisted review queue with search, approve/block
│   ├── Settings.tsx     # Detection, notification, integration settings
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
1. **Dashboard Page**: 7 KPI cards (Total Transactions, Flagged, Active Verdicts, Confirmed Fraud, Detection Rate, Approval Rate, Avg Ensemble Score), detection pipeline with live status, 24h trends chart, recent verdicts
2. **Transactions Page**: Searchable table with AI Score + Rule Score columns, PASS/Fraud/Flagged status, pagination, sorting, view details modal, send to LLM
3. **Alerts Page**: WARN/FRAUD alerts with model breakdown (NN/XGB/GS/IF/Rule/TR), Discard All Fraud/Warns bulk actions, 3 KPI cards (Critical/High/Under Review)
4. **Reviews Page**: LLM-assisted review queue with search, Pending Only filter, expanded transaction detail grid, LLM analysis section, reviewer notes, Approve (SAFE) / Block (FRAUD)
5. **Settings Page**: Detection thresholds, notification settings, data integration status, AI/ML model info

### Data Architecture (Standalone Mock)
- **No backend required** - all data generated client-side
- Mock data uses seeded random number generator for consistency across refreshes
- 1000 transactions: 200 FRAUD, 4 WARN, 796 PASS
- Simulated API delays (100ms) for realistic demo feel
- Full pagination, filtering, sorting work client-side
- Actions (approve/block/send to LLM) update in-memory state

### Detection Models (6-Model Ensemble)
1. DNN (Deep Neural Network)
2. XGBoost
3. GraphSAGE
4. Isolation Forest
5. Rule Check
6. Transformer

### Key Data Types
- FullTransaction: Transaction_ID, User_ID, Transaction_Amount, Transaction_Type, Timestamp, Account_Balance, Device_Type, Location, Merchant_Category, IP_Address_Flag, Previous_Fraudulent_Activity, Daily_Transaction_Count, Avg_Transaction_Amount_7d, Failed_Transaction_Count_7d, Card_Type, Card_Age, Transaction_Distance, Authentication_Method, Risk_Score, Is_Weekend, Fraud_Label, ensemble_score, rule_fraud_score, model_scores (6 models), status, reason_trail, llm_analysis, flag, rule_flagged, ai_flagged

### Tech Stack
- React + TypeScript
- Vite for bundling
- TailwindCSS for styling
- Shadcn/UI components (including Sidebar)
- Wouter for routing
- TanStack Query for data fetching
- Recharts for trends visualization
- Client-side mock data (no external backend)
