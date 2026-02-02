const API_BASE_URL = "http://localhost:9000";

export interface DashboardStats {
  total_transactions: number;
  flagged_transactions: number;
  active_verdicts: number;
  confirmed_fraud: number;
  approval_rate: number;
  avg_ensemble_score: number;
  avg_risk_score: number;
}

export interface RecentVerdict {
  Transaction_ID: string;
  status: string;
  ensemble_score: number;
  rule_fraud_score: number;
  created_at: string;
  Transaction_Amount: number;
  Location: string;
  Transaction_Type: string;
  llm_analysis: string | null;
}

export interface Alert {
  Transaction_ID: string;
  ensemble_score: number;
  rule_fraud_score: number;
  model_scores: Record<string, number> | null;
  status: string;
  reason_trail: string;
  Transaction_Amount: number;
  Location: string;
  Transaction_Type: string;
  Timestamp: string;
}

export interface Review {
  Transaction_ID: string;
  ensemble_score: number;
  status: string;
  User_ID: string;
  Transaction_Amount: number;
  Transaction_Type: string;
  Location: string;
  Card_Age: number;
  Transaction_Distance: number;
  Authentication_Method: string;
  Daily_Transaction_Count: number;
  llm_analysis: string;
  reviewed_at: string;
}

export interface TransactionRecord {
  Transaction_ID: string;
  User_ID: string;
  Transaction_Amount: number;
  Transaction_Type: string;
  Location: string;
  Card_Type: string;
  Timestamp: string;
  ensemble_score: number;
  status: string;
}

export interface TrendData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
  }>;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  count?: number;
  page?: number;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  return fetchApi<DashboardStats | null>("/dashboard/stats");
}

export async function fetchRecentVerdicts(limit: number = 5): Promise<RecentVerdict[]> {
  return fetchApi<RecentVerdict[]>(`/dashboard/recent?limit=${limit}`);
}

export async function fetchTrends(): Promise<TrendData> {
  return fetchApi<TrendData>("/dashboard/trends");
}

export async function fetchAlerts(minScore: number = 0.7, status?: string): Promise<Alert[]> {
  const params = new URLSearchParams({ min_score: minScore.toString() });
  if (status) params.append("status", status);
  return fetchApi<Alert[]>(`/alerts?${params}`);
}

export async function fetchReviews(): Promise<Review[]> {
  return fetchApi<Review[]>("/reviews");
}

export async function fetchTransactions(
  page: number = 1,
  perPage: number = 20,
  search?: string,
  status?: string
): Promise<{ data: TransactionRecord[]; count: number; page: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  
  const response = await fetch(`${API_BASE_URL}/transactions?${params}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return { data: json.data, count: json.count, page: json.page };
}

export async function updateVerdict(
  transactionId: string,
  action: "APPROVE" | "BLOCK",
  reason?: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/verdict/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      action,
      reason,
    }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}
