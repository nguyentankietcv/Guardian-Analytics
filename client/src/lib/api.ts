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
  User_ID: string;
  ensemble_score: number;
  rule_fraud_score: number;
  model_scores: Record<string, number> | null;
  status: string;
  reason_trail: string;
  Transaction_Amount: number;
  Location: string;
  Transaction_Type: string;
  Timestamp: string;
  Card_Type: string;
  Device_Type: string;
  Merchant_Category: string;
  Risk_Score: number;
  Daily_Transaction_Count: number;
  Transaction_Distance: number;
  Authentication_Method: string;
  llm_analysis?: string | null;
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
  Device_Type?: string;
  Merchant_Category?: string;
  Risk_Score?: number;
  Daily_Transaction_Count?: number;
  Transaction_Distance?: number;
  Authentication_Method?: string;
  rule_fraud_score?: number;
  model_scores?: Record<string, number> | null;
  reason_trail?: string;
  llm_analysis?: string | null;
}

export interface TrendDataPoint {
  hour: string;
  transactions: number;
  fraud: number;
}

export interface TrendData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
  }>;
}

export interface SystemHealth {
  system_state: "HEALTHY" | "DEGRADED";
  modules: Record<string, "ONLINE" | "OFFLINE">;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  per_page?: number;
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

export async function fetchTrends(): Promise<TrendDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/dashboard/trends`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json.data || [];
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  const response = await fetch(`${API_BASE_URL}/system/health`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return { system_state: json.system_state, modules: json.modules };
}

export interface AlertsQueryParams {
  minScore?: number;
  status?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchAlerts(params: AlertsQueryParams = {}): Promise<PaginatedResponse<Alert>> {
  const { minScore = 0, status, page = 1, perPage = 20, sortBy = "ensemble_score", sortOrder = "desc" } = params;
  const urlParams = new URLSearchParams({
    min_score: minScore.toString(),
    page: page.toString(),
    per_page: perPage.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  if (status) urlParams.append("status", status);
  
  const response = await fetch(`${API_BASE_URL}/alerts?${urlParams}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return {
    data: json.data || [],
    count: json.count || 0,
    total: json.total || 0,
    page: json.page || 1,
    per_page: json.per_page || perPage,
    sort_by: json.sort_by,
    sort_order: json.sort_order,
  };
}

export interface ReviewsQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchReviews(params: ReviewsQueryParams = {}): Promise<PaginatedResponse<Review>> {
  const { page = 1, perPage = 20, sortBy = "reviewed_at", sortOrder = "desc" } = params;
  const urlParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  
  const response = await fetch(`${API_BASE_URL}/reviews?${urlParams}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return {
    data: json.data || [],
    count: json.count || 0,
    total: json.total || 0,
    page: json.page || 1,
    per_page: json.per_page || perPage,
    sort_by: json.sort_by,
    sort_order: json.sort_order,
  };
}

export interface TransactionsQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchTransactions(params: TransactionsQueryParams = {}): Promise<PaginatedResponse<TransactionRecord>> {
  const { page = 1, perPage = 20, search, status, sortBy = "Timestamp", sortOrder = "desc" } = params;
  const urlParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  if (search) urlParams.append("search", search);
  if (status) urlParams.append("status", status);
  
  const response = await fetch(`${API_BASE_URL}/transactions?${urlParams}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return {
    data: json.data || [],
    count: json.count || 0,
    total: json.total || json.count || 0,
    page: json.page || 1,
    per_page: perPage,
    sort_by: json.sort_by,
    sort_order: json.sort_order,
  };
}

export async function fetchTransactionDetails(transactionId: string): Promise<TransactionRecord | null> {
  const response = await fetch(`${API_BASE_URL}/transactions?search=${encodeURIComponent(transactionId)}&per_page=1`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  const data = json.data || [];
  return data.length > 0 ? data[0] : null;
}

export async function updateVerdict(
  transactionId: string,
  action: "SAFE" | "FRAUD" | "APPROVE" | "BLOCK",
  reason?: string
): Promise<void> {
  const mappedAction = action === "APPROVE" ? "SAFE" : action === "BLOCK" ? "FRAUD" : action;
  const response = await fetch(`${API_BASE_URL}/verdict/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      action: mappedAction,
      reason,
    }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function approveReview(
  transactionId: string,
  approved: boolean,
  reviewerNotes?: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reviews/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      approved,
      verdict_action: approved ? "SAFE" : "FRAUD",
      reviewer_notes: reviewerNotes || null,
    }),
  });
  if (!response.ok) {
    const fallbackResponse = await fetch(`${API_BASE_URL}/verdict/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_id: transactionId,
        action: approved ? "SAFE" : "FRAUD",
        reason: reviewerNotes || (approved ? "Approved by reviewer" : "Rejected by reviewer"),
      }),
    });
    if (!fallbackResponse.ok) {
      throw new Error(`API error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
    }
  }
}

export async function sendToLLM(
  transactionId: string,
  reason?: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/llm/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction_id: transactionId,
      reason: reason || null,
    }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export interface NotificationSettings {
  id: number | null;
  critical_alert_emails_enabled: boolean;
  high_priority_notifications_enabled: boolean;
  alert_email_address: string | null;
  daily_summary_report_enabled: boolean;
  slack_webhook_url: string | null;
  sms_phone_number: string | null;
  risk_score_threshold_for_critical: number;
  risk_score_threshold_for_high: number;
}

export interface DetectionSettings {
  id: number | null;
  risk_score_threshold: number;
  duplicate_detection_window_hours: number;
  ai_enhanced_detection_enabled: boolean;
}

export interface DataIntegrationStatus {
  database_connection: {
    name: string;
    status: string;
    last_check: string | null;
  };
  data_stream: {
    name: string;
    status: string;
    last_check: string | null;
  };
  external_api: {
    name: string;
    status: string;
    url: string | null;
    last_check: string | null;
  };
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  return fetchApi<NotificationSettings>("/settings/notifications");
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function fetchDetectionSettings(): Promise<DetectionSettings> {
  return fetchApi<DetectionSettings>("/settings/detection");
}

export async function updateDetectionSettings(settings: Partial<DetectionSettings>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/settings/detection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function fetchDataIntegrationStatus(): Promise<DataIntegrationStatus> {
  return fetchApi<DataIntegrationStatus>("/settings/data-integration");
}
