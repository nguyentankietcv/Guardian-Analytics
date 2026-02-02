export interface Transaction {
  Transaction_ID: string;
  User_ID: string;
  Transaction_Amount: number;
  Transaction_Type: string;
  Timestamp: string;
  Account_Balance: number;
  Device_Type: string;
  Location: string;
  Merchant_Category: string;
  IP_Address_Flag: number;
  Previous_Fraudulent_Activity: number;
  Daily_Transaction_Count: number;
  Avg_Transaction_Amount_7d: number;
  Failed_Transaction_Count_7d: number;
  Card_Type: string;
  Card_Age: number;
  Transaction_Distance: number;
  Authentication_Method: string;
  Risk_Score: number;
  Is_Weekend: number;
  Fraud_Label: number;
}

export interface Verdict {
  id: number;
  Transaction_ID: string;
  ensemble_score: number;
  model_scores: Record<string, number>;
  rule_fraud_score: number;
  flag: number;
  rule_flagged: number;
  ai_flagged: number;
  status: "pending" | "reviewing" | "approved" | "rejected";
  reason_trail: string;
  created_at: string;
}

export interface LLMReview {
  Transaction_ID: string;
  User_ID: string;
  ensemble_score: number;
  llm_analysis: string;
  reviewed_at: string;
  status: "pending" | "in_review" | "completed";
}

export const mockTransactions: Transaction[] = [
  {
    Transaction_ID: "TXN_33553",
    User_ID: "USER_1834",
    Transaction_Amount: 39.79,
    Transaction_Type: "POS",
    Timestamp: "2023-08-14 19:30:00",
    Account_Balance: 93213.17,
    Device_Type: "Laptop",
    Location: "Sydney",
    Merchant_Category: "Travel",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 7,
    Avg_Transaction_Amount_7d: 437.63,
    Failed_Transaction_Count_7d: 3,
    Card_Type: "Amex",
    Card_Age: 65,
    Transaction_Distance: 883.17,
    Authentication_Method: "Biometric",
    Risk_Score: 0.8494,
    Is_Weekend: 0,
    Fraud_Label: 0
  },
  {
    Transaction_ID: "TXN_9427",
    User_ID: "USER_7875",
    Transaction_Amount: 1.19,
    Transaction_Type: "Bank Transfer",
    Timestamp: "2023-06-07 04:01:00",
    Account_Balance: 75725.25,
    Device_Type: "Mobile",
    Location: "New York",
    Merchant_Category: "Clothing",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 13,
    Avg_Transaction_Amount_7d: 478.76,
    Failed_Transaction_Count_7d: 4,
    Card_Type: "Mastercard",
    Card_Age: 186,
    Transaction_Distance: 2203.36,
    Authentication_Method: "Password",
    Risk_Score: 0.0959,
    Is_Weekend: 0,
    Fraud_Label: 1
  },
  {
    Transaction_ID: "TXN_199",
    User_ID: "USER_2734",
    Transaction_Amount: 28.96,
    Transaction_Type: "Online",
    Timestamp: "2023-06-20 15:25:00",
    Account_Balance: 1588.96,
    Device_Type: "Tablet",
    Location: "Mumbai",
    Merchant_Category: "Restaurants",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 14,
    Avg_Transaction_Amount_7d: 50.01,
    Failed_Transaction_Count_7d: 4,
    Card_Type: "Visa",
    Card_Age: 226,
    Transaction_Distance: 1909.29,
    Authentication_Method: "Biometric",
    Risk_Score: 0.84,
    Is_Weekend: 0,
    Fraud_Label: 1
  },
  {
    Transaction_ID: "TXN_12447",
    User_ID: "USER_2617",
    Transaction_Amount: 254.32,
    Transaction_Type: "ATM Withdrawal",
    Timestamp: "2023-12-07 00:31:00",
    Account_Balance: 76807.2,
    Device_Type: "Tablet",
    Location: "New York",
    Merchant_Category: "Clothing",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 8,
    Avg_Transaction_Amount_7d: 182.48,
    Failed_Transaction_Count_7d: 4,
    Card_Type: "Visa",
    Card_Age: 76,
    Transaction_Distance: 1311.86,
    Authentication_Method: "OTP",
    Risk_Score: 0.7935,
    Is_Weekend: 0,
    Fraud_Label: 1
  },
  {
    Transaction_ID: "TXN_39489",
    User_ID: "USER_2014",
    Transaction_Amount: 31.28,
    Transaction_Type: "POS",
    Timestamp: "2023-11-11 23:44:00",
    Account_Balance: 92354.66,
    Device_Type: "Mobile",
    Location: "Mumbai",
    Merchant_Category: "Electronics",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 1,
    Daily_Transaction_Count: 14,
    Avg_Transaction_Amount_7d: 328.69,
    Failed_Transaction_Count_7d: 4,
    Card_Type: "Mastercard",
    Card_Age: 140,
    Transaction_Distance: 966.98,
    Authentication_Method: "Password",
    Risk_Score: 0.3819,
    Is_Weekend: 1,
    Fraud_Label: 1
  },
  {
    Transaction_ID: "TXN_42724",
    User_ID: "USER_6852",
    Transaction_Amount: 168.55,
    Transaction_Type: "Online",
    Timestamp: "2023-06-05 20:55:00",
    Account_Balance: 33236.94,
    Device_Type: "Laptop",
    Location: "Tokyo",
    Merchant_Category: "Restaurants",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 3,
    Avg_Transaction_Amount_7d: 226.85,
    Failed_Transaction_Count_7d: 2,
    Card_Type: "Discover",
    Card_Age: 51,
    Transaction_Distance: 1725.64,
    Authentication_Method: "OTP",
    Risk_Score: 0.0504,
    Is_Weekend: 0,
    Fraud_Label: 0
  },
  {
    Transaction_ID: "TXN_15823",
    User_ID: "USER_4521",
    Transaction_Amount: 1250.00,
    Transaction_Type: "Online",
    Timestamp: "2023-12-15 14:22:00",
    Account_Balance: 45678.90,
    Device_Type: "Mobile",
    Location: "London",
    Merchant_Category: "Electronics",
    IP_Address_Flag: 1,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 5,
    Avg_Transaction_Amount_7d: 320.45,
    Failed_Transaction_Count_7d: 1,
    Card_Type: "Visa",
    Card_Age: 120,
    Transaction_Distance: 450.23,
    Authentication_Method: "Biometric",
    Risk_Score: 0.72,
    Is_Weekend: 0,
    Fraud_Label: 0
  },
  {
    Transaction_ID: "TXN_28934",
    User_ID: "USER_9012",
    Transaction_Amount: 4999.99,
    Transaction_Type: "Bank Transfer",
    Timestamp: "2023-12-18 02:15:00",
    Account_Balance: 12500.00,
    Device_Type: "Laptop",
    Location: "Singapore",
    Merchant_Category: "Travel",
    IP_Address_Flag: 1,
    Previous_Fraudulent_Activity: 1,
    Daily_Transaction_Count: 12,
    Avg_Transaction_Amount_7d: 890.12,
    Failed_Transaction_Count_7d: 6,
    Card_Type: "Mastercard",
    Card_Age: 45,
    Transaction_Distance: 3200.50,
    Authentication_Method: "Password",
    Risk_Score: 0.95,
    Is_Weekend: 0,
    Fraud_Label: 1
  },
  {
    Transaction_ID: "TXN_77234",
    User_ID: "USER_3345",
    Transaction_Amount: 89.50,
    Transaction_Type: "POS",
    Timestamp: "2023-12-20 11:30:00",
    Account_Balance: 8234.56,
    Device_Type: "Mobile",
    Location: "Paris",
    Merchant_Category: "Groceries",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 2,
    Avg_Transaction_Amount_7d: 75.30,
    Failed_Transaction_Count_7d: 0,
    Card_Type: "Visa",
    Card_Age: 890,
    Transaction_Distance: 12.50,
    Authentication_Method: "Biometric",
    Risk_Score: 0.05,
    Is_Weekend: 0,
    Fraud_Label: 0
  },
  {
    Transaction_ID: "TXN_88456",
    User_ID: "USER_5567",
    Transaction_Amount: 2500.00,
    Transaction_Type: "ATM Withdrawal",
    Timestamp: "2023-12-21 23:45:00",
    Account_Balance: 3200.00,
    Device_Type: "Tablet",
    Location: "Dubai",
    Merchant_Category: "Cash",
    IP_Address_Flag: 0,
    Previous_Fraudulent_Activity: 0,
    Daily_Transaction_Count: 8,
    Avg_Transaction_Amount_7d: 150.00,
    Failed_Transaction_Count_7d: 2,
    Card_Type: "Amex",
    Card_Age: 30,
    Transaction_Distance: 5500.00,
    Authentication_Method: "OTP",
    Risk_Score: 0.88,
    Is_Weekend: 0,
    Fraud_Label: 1
  }
];

export const mockVerdicts: Verdict[] = [
  {
    id: 1,
    Transaction_ID: "TXN_9427",
    ensemble_score: 0.92,
    model_scores: { xgboost: 0.89, random_forest: 0.94, neural_net: 0.93 },
    rule_fraud_score: 0.85,
    flag: 1,
    rule_flagged: 1,
    ai_flagged: 1,
    status: "reviewing",
    reason_trail: "High daily transaction count (13), unusual transaction time (4:01 AM), high transaction distance (2203km)",
    created_at: "2023-06-07 04:02:00"
  },
  {
    id: 2,
    Transaction_ID: "TXN_199",
    ensemble_score: 0.87,
    model_scores: { xgboost: 0.85, random_forest: 0.88, neural_net: 0.88 },
    rule_fraud_score: 0.72,
    flag: 1,
    rule_flagged: 1,
    ai_flagged: 1,
    status: "pending",
    reason_trail: "Low account balance relative to 7d avg, high transaction count (14), significant distance from usual location",
    created_at: "2023-06-20 15:26:00"
  },
  {
    id: 3,
    Transaction_ID: "TXN_12447",
    ensemble_score: 0.79,
    model_scores: { xgboost: 0.78, random_forest: 0.80, neural_net: 0.79 },
    rule_fraud_score: 0.65,
    flag: 1,
    rule_flagged: 0,
    ai_flagged: 1,
    status: "pending",
    reason_trail: "Late night ATM withdrawal (00:31), amount exceeds 7d average, high failed transaction count",
    created_at: "2023-12-07 00:32:00"
  },
  {
    id: 4,
    Transaction_ID: "TXN_39489",
    ensemble_score: 0.68,
    model_scores: { xgboost: 0.65, random_forest: 0.70, neural_net: 0.69 },
    rule_fraud_score: 0.78,
    flag: 1,
    rule_flagged: 1,
    ai_flagged: 0,
    status: "reviewing",
    reason_trail: "Previous fraudulent activity detected, weekend transaction, high daily count (14)",
    created_at: "2023-11-11 23:45:00"
  },
  {
    id: 5,
    Transaction_ID: "TXN_28934",
    ensemble_score: 0.96,
    model_scores: { xgboost: 0.95, random_forest: 0.97, neural_net: 0.96 },
    rule_fraud_score: 0.92,
    flag: 1,
    rule_flagged: 1,
    ai_flagged: 1,
    status: "rejected",
    reason_trail: "IP flagged, previous fraud history, unusual hour (2:15 AM), amount near $5000 threshold, 6 failed transactions in 7d",
    created_at: "2023-12-18 02:16:00"
  },
  {
    id: 6,
    Transaction_ID: "TXN_88456",
    ensemble_score: 0.82,
    model_scores: { xgboost: 0.80, random_forest: 0.83, neural_net: 0.83 },
    rule_fraud_score: 0.75,
    flag: 1,
    rule_flagged: 1,
    ai_flagged: 1,
    status: "pending",
    reason_trail: "Large ATM withdrawal (78% of balance), late night (23:45), extreme distance (5500km), new card (30 days)",
    created_at: "2023-12-21 23:46:00"
  }
];

export const mockLLMReviews: LLMReview[] = [
  {
    Transaction_ID: "TXN_9427",
    User_ID: "USER_7875",
    ensemble_score: 0.92,
    llm_analysis: "HIGH RISK ASSESSMENT: This transaction exhibits multiple fraud indicators. The $1.19 bank transfer at 4:01 AM is characteristic of card testing behavior - small amounts used to verify stolen card validity before larger fraudulent purchases. The high daily transaction count (13) combined with the extreme transaction distance (2203km from usual location) suggests account compromise. The password-only authentication without biometric verification is concerning. RECOMMENDATION: Block transaction, freeze account, and initiate customer verification via registered phone number.",
    reviewed_at: "2023-06-07 04:05:00",
    status: "pending"
  },
  {
    Transaction_ID: "TXN_199",
    User_ID: "USER_2734",
    ensemble_score: 0.87,
    llm_analysis: "ELEVATED RISK: Transaction shows concerning patterns. The user's account balance ($1,588.96) is unusually low compared to their 7-day average transaction amount ($50.01), indicating potential account draining. High transaction frequency (14/day) is abnormal for this merchant category (Restaurants). The 1909km transaction distance from baseline location warrants attention. However, biometric authentication was used which provides some assurance. RECOMMENDATION: Allow with enhanced monitoring, flag for follow-up customer contact within 24 hours.",
    reviewed_at: "2023-06-20 15:30:00",
    status: "in_review"
  },
  {
    Transaction_ID: "TXN_28934",
    User_ID: "USER_9012",
    ensemble_score: 0.96,
    llm_analysis: "CRITICAL FRAUD ALERT: Multiple severe risk factors present. (1) IP address flagged from known fraud network, (2) Previous fraudulent activity on this account, (3) Transaction time 2:15 AM highly unusual, (4) Amount $4,999.99 just below $5,000 reporting threshold - classic structuring behavior, (5) Six failed transactions in past 7 days indicates brute force attempts, (6) Transaction distance 3200km from home location. This transaction has 96% probability of fraud. RECOMMENDATION: Immediately reject, lock account, escalate to fraud investigation team, file SAR report.",
    reviewed_at: "2023-12-18 02:20:00",
    status: "completed"
  },
  {
    Transaction_ID: "TXN_88456",
    User_ID: "USER_5567",
    ensemble_score: 0.82,
    llm_analysis: "HIGH RISK WITHDRAWAL: Large ATM cash withdrawal ($2,500) represents 78% of available balance ($3,200) - potential account liquidation pattern. Transaction at 23:45 in Dubai represents extreme distance (5500km) from user's baseline. Card is relatively new (30 days old) which increases risk profile. OTP authentication was used. Pattern consistent with either: (a) legitimate travel with urgent cash need, or (b) compromised card being drained. RECOMMENDATION: Hold transaction, send real-time push notification to user's registered device for confirmation before release.",
    reviewed_at: "2023-12-21 23:50:00",
    status: "pending"
  }
];

export const dashboardStats = {
  totalTransactions: 10847,
  flaggedTransactions: 156,
  activeAlerts: 6,
  pendingReviews: 4,
  fraudDetected: 42,
  ruleFlagged: 89,
  aiFlagged: 112,
  approvalRate: 98.5,
  avgEnsembleScore: 0.34,
  avgRiskScore: 0.42,
  transactionsByType: {
    "Online": 4231,
    "POS": 3542,
    "ATM Withdrawal": 1876,
    "Bank Transfer": 1198
  },
  transactionsByLocation: {
    "New York": 2341,
    "London": 1876,
    "Tokyo": 1543,
    "Mumbai": 1234,
    "Sydney": 987,
    "Singapore": 876,
    "Paris": 654,
    "Dubai": 543,
    "Other": 793
  }
};
