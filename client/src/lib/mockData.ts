export interface Transaction {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  timestamp: string;
  status: "pending" | "approved" | "flagged" | "rejected";
  riskScore: number;
  alertType: "duplicate" | "fraud" | "anomaly" | "none";
  description: string;
}

export interface Alert {
  id: string;
  transactionId: string;
  type: "duplicate" | "fraud" | "anomaly";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  assignee?: string;
}

export interface ReviewItem {
  id: string;
  transactionId: string;
  alertId: string;
  priority: "low" | "medium" | "high";
  llmSuggestion: string;
  confidence: number;
  status: "pending" | "in_review" | "completed";
  assignee?: string;
  createdAt: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "TXN-2026-001234",
    amount: 15000.00,
    currency: "USD",
    sender: "ABC Corporation",
    receiver: "XYZ Suppliers Ltd",
    timestamp: "2026-01-26T08:30:00Z",
    status: "flagged",
    riskScore: 85,
    alertType: "duplicate",
    description: "Potential duplicate payment detected"
  },
  {
    id: "2",
    transactionId: "TXN-2026-001235",
    amount: 250000.00,
    currency: "USD",
    sender: "Global Imports Inc",
    receiver: "Offshore Holdings",
    timestamp: "2026-01-26T09:15:00Z",
    status: "flagged",
    riskScore: 92,
    alertType: "fraud",
    description: "Unusual transaction pattern detected"
  },
  {
    id: "3",
    transactionId: "TXN-2026-001236",
    amount: 5000.00,
    currency: "EUR",
    sender: "Tech Solutions GmbH",
    receiver: "Cloud Services Ltd",
    timestamp: "2026-01-26T10:00:00Z",
    status: "approved",
    riskScore: 12,
    alertType: "none",
    description: "Regular monthly subscription"
  },
  {
    id: "4",
    transactionId: "TXN-2026-001237",
    amount: 78500.00,
    currency: "USD",
    sender: "Manufacturing Co",
    receiver: "Raw Materials Inc",
    timestamp: "2026-01-26T10:45:00Z",
    status: "pending",
    riskScore: 45,
    alertType: "anomaly",
    description: "Transaction amount exceeds typical range"
  },
  {
    id: "5",
    transactionId: "TXN-2026-001238",
    amount: 15000.00,
    currency: "USD",
    sender: "ABC Corporation",
    receiver: "XYZ Suppliers Ltd",
    timestamp: "2026-01-26T11:30:00Z",
    status: "flagged",
    riskScore: 88,
    alertType: "duplicate",
    description: "Exact duplicate of TXN-2026-001234"
  },
  {
    id: "6",
    transactionId: "TXN-2026-001239",
    amount: 3200.00,
    currency: "GBP",
    sender: "London Finance Ltd",
    receiver: "European Partners",
    timestamp: "2026-01-26T12:00:00Z",
    status: "approved",
    riskScore: 8,
    alertType: "none",
    description: "Quarterly consulting fee"
  },
  {
    id: "7",
    transactionId: "TXN-2026-001240",
    amount: 125000.00,
    currency: "USD",
    sender: "Investment Group",
    receiver: "Unknown Entity LLC",
    timestamp: "2026-01-26T13:15:00Z",
    status: "flagged",
    riskScore: 95,
    alertType: "fraud",
    description: "First-time receiver with high amount"
  },
  {
    id: "8",
    transactionId: "TXN-2026-001241",
    amount: 45000.00,
    currency: "USD",
    sender: "Retail Corp",
    receiver: "Logistics Partner",
    timestamp: "2026-01-26T14:00:00Z",
    status: "approved",
    riskScore: 22,
    alertType: "none",
    description: "Regular shipping payment"
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    transactionId: "TXN-2026-001234",
    type: "duplicate",
    severity: "high",
    message: "Duplicate payment detected: Same amount, sender, and receiver within 24 hours",
    timestamp: "2026-01-26T08:31:00Z",
    status: "open",
    assignee: "John Analyst"
  },
  {
    id: "ALT-002",
    transactionId: "TXN-2026-001235",
    type: "fraud",
    severity: "critical",
    message: "High-risk fraud pattern: Large transfer to offshore entity with no prior relationship",
    timestamp: "2026-01-26T09:16:00Z",
    status: "investigating",
    assignee: "Sarah Reviewer"
  },
  {
    id: "ALT-003",
    transactionId: "TXN-2026-001237",
    type: "anomaly",
    severity: "medium",
    message: "Transaction amount 3x higher than historical average for this sender",
    timestamp: "2026-01-26T10:46:00Z",
    status: "open"
  },
  {
    id: "ALT-004",
    transactionId: "TXN-2026-001238",
    type: "duplicate",
    severity: "high",
    message: "Exact duplicate of transaction TXN-2026-001234 from same day",
    timestamp: "2026-01-26T11:31:00Z",
    status: "open",
    assignee: "John Analyst"
  },
  {
    id: "ALT-005",
    transactionId: "TXN-2026-001240",
    type: "fraud",
    severity: "critical",
    message: "First-time receiver combined with unusually high transaction amount",
    timestamp: "2026-01-26T13:16:00Z",
    status: "open"
  }
];

export const mockReviews: ReviewItem[] = [
  {
    id: "REV-001",
    transactionId: "TXN-2026-001235",
    alertId: "ALT-002",
    priority: "high",
    llmSuggestion: "This transaction shows multiple fraud indicators: (1) First-time receiver, (2) Offshore jurisdiction, (3) Amount significantly exceeds typical patterns. Recommend blocking and requesting additional verification from sender.",
    confidence: 94,
    status: "pending",
    createdAt: "2026-01-26T09:20:00Z"
  },
  {
    id: "REV-002",
    transactionId: "TXN-2026-001234",
    alertId: "ALT-001",
    priority: "medium",
    llmSuggestion: "Duplicate payment detected. The sender has made an identical payment earlier today. Recommend contacting sender to confirm if this is intentional before processing.",
    confidence: 89,
    status: "in_review",
    assignee: "John Analyst",
    createdAt: "2026-01-26T08:35:00Z"
  },
  {
    id: "REV-003",
    transactionId: "TXN-2026-001240",
    alertId: "ALT-005",
    priority: "high",
    llmSuggestion: "Unknown entity receiving large transfer. No historical relationship found. Shell company indicators present. Recommend enhanced due diligence before approval.",
    confidence: 91,
    status: "pending",
    createdAt: "2026-01-26T13:20:00Z"
  },
  {
    id: "REV-004",
    transactionId: "TXN-2026-001237",
    alertId: "ALT-003",
    priority: "low",
    llmSuggestion: "Amount exceeds typical range but sender has good payment history. This could be a legitimate bulk order. Suggest reviewing against recent purchase orders.",
    confidence: 72,
    status: "pending",
    createdAt: "2026-01-26T10:50:00Z"
  }
];

export const dashboardStats = {
  totalTransactions: 1247,
  flaggedTransactions: 23,
  activeAlerts: 12,
  pendingReviews: 8,
  fraudDetected: 5,
  duplicatesFound: 7,
  anomaliesDetected: 11,
  approvalRate: 97.2,
  avgProcessingTime: 0.8,
  riskScoreAvg: 24
};
