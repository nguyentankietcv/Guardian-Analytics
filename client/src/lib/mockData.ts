const LOCATIONS = ["London", "New York", "Mumbai", "Tokyo", "Sydney"];
const TYPES = ["POS", "Online", "Bank Transfer", "ATM Withdrawal"];
const CARD_TYPES = ["Visa", "Mastercard", "Amex", "Discover"];
const DEVICES = ["Mobile", "Laptop", "Tablet"];
const CATEGORIES = ["Electronics", "Restaurants", "Travel", "Clothing", "Groceries"];
const AUTH_METHODS = ["Biometric", "Password", "OTP", "PIN"];

const REASON_TEMPLATES = [
  "Failed transaction >= 4 times. ; Multiple failed attempts in the last week (DNN, GRAPHSAGE, TRANSFORMER, XGBOOST). Suspicious or blacklisted IP address (ISO_FOREST)",
  "Failed transaction >= 4 times. ; Multiple failed attempts in the last week (DNN, GRAPHSAGE, TRANSFORMER, XGBOOST). Transaction would significantly deplete account (ISO_FOREST)",
  "Unusual transaction pattern detected. ; High-value transaction from new device (DNN, TRANSFORMER). Location mismatch with user profile (GRAPHSAGE)",
  "Multiple rapid transactions detected. ; Velocity check triggered (RULE_CHECK). Abnormal spending pattern (DNN, XGBOOST)",
  "Transaction from high-risk merchant. ; Category risk elevated (RULE_CHECK). Amount exceeds typical range (ISO_FOREST, XGBOOST)",
];

const LLM_TEMPLATES = [
  (txnId: string, userId: string, amount: number, location: string, cardType: string, authMethod: string) =>
    `The flagged transaction (${txnId}) by ${userId} for $${amount.toFixed(2)} at a restaurant in ${location} using a ${cardType} and ${authMethod.toLowerCase()} authentication does not exhibit significant anomalies compared to the user's historical data. The transaction amount is within the user's average, and the location, device, and IP address are consistent with past behavior. The transaction should be monitored for any potential changes in behavior, but based on the available data, it does not raise immediate red flags for fraud.`,
  (txnId: string, userId: string, amount: number, location: string, cardType: string) =>
    `Analysis of transaction ${txnId} by ${userId} for $${amount.toFixed(2)} in ${location} indicates moderate risk. The ${cardType} card has been used consistently in this region. While the transaction amount is slightly above the 7-day average, the authentication method and device fingerprint match previous patterns. Recommend monitoring but no immediate action required.`,
  (txnId: string, userId: string, amount: number, location: string) =>
    `Transaction ${txnId} from ${userId} for $${amount.toFixed(2)} in ${location} shows elevated risk indicators. The transaction distance from the user's typical location is significant, and the amount is notably higher than recent averages. Multiple models flagged this transaction. However, the user has occasionally made similar transactions in the past. Recommend human review before final decision.`,
  (txnId: string, userId: string, amount: number, location: string) =>
    `The transaction ${txnId} by ${userId} worth $${amount.toFixed(2)} from ${location} appears to be legitimate based on the user's spending history. The card age, device consistency, and authentication method all align with established patterns. The ensemble score is low, suggesting minimal fraud risk. This transaction can be safely approved.`,
  (txnId: string, userId: string, amount: number, location: string) =>
    `High-risk assessment for ${txnId} from ${userId} ($${amount.toFixed(2)}, ${location}). Multiple detection models have flagged this transaction with high confidence scores. The combination of unusual location, elevated amount, and recent failed transactions suggests potential fraudulent activity. Recommend blocking this transaction pending further investigation.`,
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateModelScores(ensembleScore: number, rand: () => number) {
  const variance = 0.15;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return {
    dnn: clamp(ensembleScore + (rand() - 0.5) * variance),
    xgboost: clamp(ensembleScore + (rand() - 0.5) * variance),
    graphsage: clamp(ensembleScore + (rand() - 0.5) * variance),
    iso_forest: clamp(ensembleScore + (rand() - 0.5) * variance * 2),
    rule_check: clamp(ensembleScore + (rand() - 0.5) * variance),
    transformer: clamp(ensembleScore + (rand() - 0.5) * variance),
  };
}

export interface FullTransaction {
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
  ensemble_score: number;
  rule_fraud_score: number;
  model_scores: Record<string, number>;
  status: string;
  reason_trail: string;
  llm_analysis: string | null;
  flag: string;
  rule_flagged: boolean;
  ai_flagged: boolean;
}

const SEED_DATA: Partial<FullTransaction>[] = [
  { Transaction_ID: "TXN_33553", User_ID: "USER_1834", Transaction_Amount: 39.79, Transaction_Type: "POS", Timestamp: "2023-08-14 19:30:00", Account_Balance: 93213.17, Device_Type: "Laptop", Location: "Sydney", Merchant_Category: "Travel", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 7, Avg_Transaction_Amount_7d: 437.63, Failed_Transaction_Count_7d: 3, Card_Type: "Amex", Card_Age: 65, Transaction_Distance: 883.17, Authentication_Method: "Biometric", Risk_Score: 0.8494, Is_Weekend: 0, Fraud_Label: 0 },
  { Transaction_ID: "TXN_9427", User_ID: "USER_7875", Transaction_Amount: 1.19, Transaction_Type: "Bank Transfer", Timestamp: "2023-06-07 04:01:00", Account_Balance: 75725.25, Device_Type: "Mobile", Location: "New York", Merchant_Category: "Clothing", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 13, Avg_Transaction_Amount_7d: 478.76, Failed_Transaction_Count_7d: 4, Card_Type: "Mastercard", Card_Age: 186, Transaction_Distance: 2203.36, Authentication_Method: "Password", Risk_Score: 0.0959, Is_Weekend: 0, Fraud_Label: 1 },
  { Transaction_ID: "TXN_199", User_ID: "USER_2734", Transaction_Amount: 28.96, Transaction_Type: "Online", Timestamp: "2023-06-20 15:25:00", Account_Balance: 1588.96, Device_Type: "Tablet", Location: "Mumbai", Merchant_Category: "Restaurants", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 14, Avg_Transaction_Amount_7d: 50.01, Failed_Transaction_Count_7d: 4, Card_Type: "Visa", Card_Age: 226, Transaction_Distance: 1909.29, Authentication_Method: "Biometric", Risk_Score: 0.84, Is_Weekend: 0, Fraud_Label: 1 },
  { Transaction_ID: "TXN_12447", User_ID: "USER_2617", Transaction_Amount: 254.32, Transaction_Type: "ATM Withdrawal", Timestamp: "2023-12-07 00:31:00", Account_Balance: 76807.2, Device_Type: "Tablet", Location: "New York", Merchant_Category: "Clothing", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 8, Avg_Transaction_Amount_7d: 182.48, Failed_Transaction_Count_7d: 4, Card_Type: "Visa", Card_Age: 76, Transaction_Distance: 1311.86, Authentication_Method: "OTP", Risk_Score: 0.7935, Is_Weekend: 0, Fraud_Label: 1 },
  { Transaction_ID: "TXN_39489", User_ID: "USER_2014", Transaction_Amount: 31.28, Transaction_Type: "POS", Timestamp: "2023-11-11 23:44:00", Account_Balance: 92354.66, Device_Type: "Mobile", Location: "Mumbai", Merchant_Category: "Electronics", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 1, Daily_Transaction_Count: 14, Avg_Transaction_Amount_7d: 328.69, Failed_Transaction_Count_7d: 4, Card_Type: "Mastercard", Card_Age: 140, Transaction_Distance: 966.98, Authentication_Method: "Password", Risk_Score: 0.3819, Is_Weekend: 1, Fraud_Label: 1 },
  { Transaction_ID: "TXN_42724", User_ID: "USER_6852", Transaction_Amount: 168.55, Transaction_Type: "Online", Timestamp: "2023-06-05 20:55:00", Account_Balance: 33236.94, Device_Type: "Laptop", Location: "Tokyo", Merchant_Category: "Restaurants", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 3, Avg_Transaction_Amount_7d: 226.85, Failed_Transaction_Count_7d: 2, Card_Type: "Discover", Card_Age: 51, Transaction_Distance: 1725.64, Authentication_Method: "OTP", Risk_Score: 0.0504, Is_Weekend: 0, Fraud_Label: 0 },
  { Transaction_ID: "TXN_10822", User_ID: "USER_5052", Transaction_Amount: 3.79, Transaction_Type: "POS", Timestamp: "2023-11-07 01:18:00", Account_Balance: 86834.18, Device_Type: "Tablet", Location: "London", Merchant_Category: "Restaurants", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 2, Avg_Transaction_Amount_7d: 298.35, Failed_Transaction_Count_7d: 2, Card_Type: "Mastercard", Card_Age: 168, Transaction_Distance: 3757.19, Authentication_Method: "Password", Risk_Score: 0.0875, Is_Weekend: 0, Fraud_Label: 0 },
  { Transaction_ID: "TXN_49498", User_ID: "USER_4660", Transaction_Amount: 7.08, Transaction_Type: "ATM Withdrawal", Timestamp: "2023-02-25 03:43:00", Account_Balance: 45826.27, Device_Type: "Tablet", Location: "London", Merchant_Category: "Restaurants", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 3, Avg_Transaction_Amount_7d: 164.38, Failed_Transaction_Count_7d: 4, Card_Type: "Discover", Card_Age: 182, Transaction_Distance: 1764.66, Authentication_Method: "Biometric", Risk_Score: 0.5326, Is_Weekend: 0, Fraud_Label: 1 },
  { Transaction_ID: "TXN_4144", User_ID: "USER_1584", Transaction_Amount: 34.25, Transaction_Type: "ATM Withdrawal", Timestamp: "2023-03-09 22:51:00", Account_Balance: 94392.35, Device_Type: "Tablet", Location: "Tokyo", Merchant_Category: "Clothing", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 7, Avg_Transaction_Amount_7d: 90.02, Failed_Transaction_Count_7d: 3, Card_Type: "Visa", Card_Age: 24, Transaction_Distance: 550.38, Authentication_Method: "Biometric", Risk_Score: 0.1347, Is_Weekend: 1, Fraud_Label: 0 },
  { Transaction_ID: "TXN_36958", User_ID: "USER_9498", Transaction_Amount: 16.24, Transaction_Type: "POS", Timestamp: "2023-09-20 17:27:00", Account_Balance: 91859.97, Device_Type: "Mobile", Location: "Mumbai", Merchant_Category: "Travel", IP_Address_Flag: 0, Previous_Fraudulent_Activity: 0, Daily_Transaction_Count: 6, Avg_Transaction_Amount_7d: 474.42, Failed_Transaction_Count_7d: 1, Card_Type: "Mastercard", Card_Age: 124, Transaction_Distance: 720.91, Authentication_Method: "PIN", Risk_Score: 0.3394, Is_Weekend: 0, Fraud_Label: 0 },
];

function generateTransaction(id: number, rand: () => number): FullTransaction {
  const txnId = `TXN_${Math.floor(rand() * 49999 + 1)}`;
  const userId = `USER_${Math.floor(rand() * 9999 + 1)}`;
  const amount = Math.round((rand() * 490 + 0.5) * 100) / 100;
  const type = pick(TYPES, rand);
  const location = pick(LOCATIONS, rand);
  const cardType = pick(CARD_TYPES, rand);
  const device = pick(DEVICES, rand);
  const category = pick(CATEGORIES, rand);
  const auth = pick(AUTH_METHODS, rand);
  const cardAge = Math.floor(rand() * 300 + 1);
  const distance = Math.round(rand() * 5000 * 100) / 100;
  const dailyCount = Math.floor(rand() * 15 + 1);
  const avgAmount7d = Math.round(rand() * 500 * 100) / 100;
  const failedCount = Math.floor(rand() * 5);
  const balance = Math.round(rand() * 99000 * 100) / 100 + 1000;
  const ipFlag = rand() < 0.05 ? 1 : 0;
  const priorFraud = rand() < 0.08 ? 1 : 0;
  const isWeekend = rand() < 0.28 ? 1 : 0;
  const riskScore = Math.round(rand() * 100) / 100;

  const ensembleScore = Math.round(rand() * 0.35 * 100) / 100;
  const ruleFraudScore = 0;
  const modelScores = generateModelScores(ensembleScore, rand);

  const baseYear = 2023;
  const month = Math.floor(rand() * 12) + 1;
  const day = Math.floor(rand() * 28) + 1;
  const hour = Math.floor(rand() * 24);
  const minute = Math.floor(rand() * 60);
  const timestamp = `${baseYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;

  return {
    Transaction_ID: txnId,
    User_ID: userId,
    Transaction_Amount: amount,
    Transaction_Type: type,
    Timestamp: timestamp,
    Account_Balance: balance,
    Device_Type: device,
    Location: location,
    Merchant_Category: category,
    IP_Address_Flag: ipFlag,
    Previous_Fraudulent_Activity: priorFraud,
    Daily_Transaction_Count: dailyCount,
    Avg_Transaction_Amount_7d: avgAmount7d,
    Failed_Transaction_Count_7d: failedCount,
    Card_Type: cardType,
    Card_Age: cardAge,
    Transaction_Distance: distance,
    Authentication_Method: auth,
    Risk_Score: riskScore,
    Is_Weekend: isWeekend,
    Fraud_Label: 0,
    ensemble_score: ensembleScore,
    rule_fraud_score: ruleFraudScore,
    model_scores: modelScores,
    status: "PASS",
    reason_trail: "",
    llm_analysis: null,
    flag: "PASS",
    rule_flagged: false,
    ai_flagged: false,
  };
}

function buildFromSeed(seed: Partial<FullTransaction>, rand: () => number): FullTransaction {
  const isFraud = seed.Fraud_Label ?? 0;
  const riskScore = seed.Risk_Score ?? 0;
  const ensembleScore = isFraud ? Math.round((0.85 + rand() * 0.15) * 100) / 100 : Math.round(riskScore * 100) / 100;
  const ruleFraudScore = isFraud ? Math.round((0.8 + rand() * 0.2) * 100) / 100 : 0;
  const modelScores = isFraud
    ? { dnn: 1.0, xgboost: 1.0, graphsage: 1.0, iso_forest: 0.90 + rand() * 0.10, rule_check: 1.0, transformer: 1.0 }
    : generateModelScores(ensembleScore, rand);

  let status: string;
  if (isFraud) status = "FRAUD";
  else if (ensembleScore > 0.5) status = "WARN";
  else status = "PASS";

  return {
    Transaction_ID: seed.Transaction_ID || "TXN_0",
    User_ID: seed.User_ID || "USER_0",
    Transaction_Amount: seed.Transaction_Amount || 0,
    Transaction_Type: seed.Transaction_Type || "POS",
    Timestamp: seed.Timestamp || "2023-01-01 00:00:00",
    Account_Balance: seed.Account_Balance || 0,
    Device_Type: seed.Device_Type || "Mobile",
    Location: seed.Location || "London",
    Merchant_Category: seed.Merchant_Category || "Electronics",
    IP_Address_Flag: seed.IP_Address_Flag || 0,
    Previous_Fraudulent_Activity: seed.Previous_Fraudulent_Activity || 0,
    Daily_Transaction_Count: seed.Daily_Transaction_Count || 1,
    Avg_Transaction_Amount_7d: seed.Avg_Transaction_Amount_7d || 0,
    Failed_Transaction_Count_7d: seed.Failed_Transaction_Count_7d || 0,
    Card_Type: seed.Card_Type || "Visa",
    Card_Age: seed.Card_Age || 30,
    Transaction_Distance: seed.Transaction_Distance || 0,
    Authentication_Method: seed.Authentication_Method || "PIN",
    Risk_Score: riskScore,
    Is_Weekend: seed.Is_Weekend || 0,
    Fraud_Label: isFraud,
    ensemble_score: ensembleScore,
    rule_fraud_score: ruleFraudScore,
    model_scores: modelScores,
    status,
    reason_trail: isFraud ? pick(REASON_TEMPLATES, rand) : "",
    llm_analysis: null,
    flag: status,
    rule_flagged: ruleFraudScore > 0.5,
    ai_flagged: ensembleScore > 0.5,
  };
}

function generateAllTransactions(): FullTransaction[] {
  const rand = seededRandom(42);
  const transactions: FullTransaction[] = [];

  for (const seed of SEED_DATA) {
    transactions.push(buildFromSeed(seed, rand));
  }

  const totalTarget = 1000;
  let fraudCount = transactions.filter(t => t.status === "FRAUD").length;
  const fraudTarget = 200;
  const warnTarget = 4;
  let warnCount = 0;

  for (let i = transactions.length; i < totalTarget; i++) {
    const txn = generateTransaction(i, rand);

    if (fraudCount < fraudTarget) {
      txn.Fraud_Label = 1;
      txn.ensemble_score = Math.round((0.9 + rand() * 0.1) * 100) / 100;
      txn.rule_fraud_score = Math.round((0.8 + rand() * 0.2) * 100) / 100;
      txn.model_scores = { dnn: 0.95 + rand() * 0.05, xgboost: 0.95 + rand() * 0.05, graphsage: 0.95 + rand() * 0.05, iso_forest: 0.90 + rand() * 0.10, rule_check: 0.95 + rand() * 0.05, transformer: 0.95 + rand() * 0.05 };
      txn.status = "FRAUD";
      txn.flag = "FRAUD";
      txn.reason_trail = pick(REASON_TEMPLATES, rand);
      txn.rule_flagged = true;
      txn.ai_flagged = true;
      txn.Failed_Transaction_Count_7d = Math.floor(rand() * 3) + 3;
      fraudCount++;
    } else if (warnCount < warnTarget) {
      txn.ensemble_score = Math.round((0.5 + rand() * 0.3) * 100) / 100;
      txn.rule_fraud_score = Math.round(rand() * 0.3 * 100) / 100;
      txn.status = "WARN";
      txn.flag = "WARN";
      txn.Fraud_Label = 0;
      txn.model_scores = generateModelScores(txn.ensemble_score, rand);
      txn.reason_trail = pick(REASON_TEMPLATES, rand);
      txn.ai_flagged = true;
      warnCount++;
    }

    transactions.push(txn);
  }

  return transactions;
}

let ALL_TRANSACTIONS = generateAllTransactions();

export function getAllTransactions(): FullTransaction[] {
  return ALL_TRANSACTIONS;
}

export function getAlerts(): FullTransaction[] {
  return ALL_TRANSACTIONS.filter(t => t.status === "FRAUD" || t.status === "WARN")
    .sort((a, b) => b.ensemble_score - a.ensemble_score);
}

export function getReviews(): (FullTransaction & { reviewed_at: string })[] {
  const rand = seededRandom(999);
  const pending = ALL_TRANSACTIONS
    .filter(t => t.status === "WARN" || (t.status === "FRAUD" && t.ensemble_score < 0.95))
    .sort((a, b) => a.ensemble_score - b.ensemble_score)
    .slice(0, 10);

  return pending.map(t => {
    const templateFn = pick(LLM_TEMPLATES, rand);
    const analysis = templateFn(t.Transaction_ID, t.User_ID, t.Transaction_Amount, t.Location, t.Card_Type, t.Authentication_Method);
    const reviewDate = new Date();
    reviewDate.setMinutes(reviewDate.getMinutes() - Math.floor(rand() * 60));

    return {
      ...t,
      status: "WARN",
      llm_analysis: analysis,
      reviewed_at: reviewDate.toISOString(),
    };
  });
}

export function getDashboardStats() {
  const all = ALL_TRANSACTIONS;
  const flagged = all.filter(t => t.status === "FRAUD" || t.status === "WARN");
  const fraudConfirmed = all.filter(t => t.status === "FRAUD");
  const activeVerdicts = all.filter(t => t.status === "WARN");
  const approved = all.filter(t => t.status === "SAFE");
  const avgEnsemble = all.reduce((sum, t) => sum + t.ensemble_score, 0) / all.length;

  return {
    total_transactions: all.length,
    flagged_transactions: flagged.length,
    active_verdicts: activeVerdicts.length,
    confirmed_fraud: fraudConfirmed.length,
    fraud_detection_rate: flagged.length / all.length,
    approval_rate: approved.length > 0 ? (approved.length / flagged.length) * 100 : 0,
    avg_ensemble_score: avgEnsemble,
  };
}

export function getRecentVerdicts(limit: number = 5) {
  return ALL_TRANSACTIONS
    .filter(t => t.status !== "PASS")
    .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
    .slice(0, limit)
    .map(t => ({
      Transaction_ID: t.Transaction_ID,
      status: t.status,
      ensemble_score: t.ensemble_score,
      rule_fraud_score: t.rule_fraud_score,
      created_at: t.Timestamp,
      Transaction_Amount: t.Transaction_Amount,
      Location: t.Location,
      Transaction_Type: t.Transaction_Type,
    }));
}

export function getTrends() {
  const hours: { hour: string; transactions: number; fraud: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const rand = seededRandom(i * 77 + 42);
    hours.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      transactions: Math.floor(rand() * 80 + 20),
      fraud: Math.floor(rand() * 15 + 2),
    });
  }
  return hours;
}

export function getSystemHealth() {
  return {
    system_state: "HEALTHY" as const,
    modules: {
      module_ingestion: "ONLINE" as const,
      module_preprocessing: "ONLINE" as const,
      module_deduplication: "ONLINE" as const,
      module_rule_check: "ONLINE" as const,
      module_ai_check: "ONLINE" as const,
      module_flagger: "ONLINE" as const,
      module_query: "ONLINE" as const,
      module_logging: "ONLINE" as const,
    },
  };
}

export function updateTransactionStatus(transactionId: string, newStatus: string): boolean {
  const idx = ALL_TRANSACTIONS.findIndex(t => t.Transaction_ID === transactionId);
  if (idx === -1) return false;
  ALL_TRANSACTIONS[idx] = { ...ALL_TRANSACTIONS[idx], status: newStatus };
  return true;
}

export function getNotificationSettings() {
  return {
    id: 1,
    critical_alert_emails_enabled: true,
    high_priority_notifications_enabled: true,
    alert_email_address: "security@tma-innovation.com",
    daily_summary_report_enabled: true,
    slack_webhook_url: "",
    sms_phone_number: "",
    risk_score_threshold_for_critical: 0.90,
    risk_score_threshold_for_high: 0.70,
  };
}

export function getDetectionSettings() {
  return {
    id: 1,
    risk_score_threshold: 0.80,
    duplicate_detection_window_hours: 24,
    ai_enhanced_detection_enabled: true,
  };
}

export function getDataIntegrationStatus() {
  return {
    database_connection: { name: "PostgreSQL - Transaction DB", status: "CONNECTED", last_check: new Date().toISOString() },
    data_stream: { name: "Kafka - Real-time Stream", status: "ACTIVE", last_check: new Date().toISOString() },
    external_api: { name: "TMA Fraud API v2", status: "ONLINE", url: "https://api.tma-innovation.com/v2", last_check: new Date().toISOString() },
  };
}
