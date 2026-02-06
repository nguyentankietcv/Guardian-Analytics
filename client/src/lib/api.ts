import {
  getAllTransactions,
  getAlerts,
  getReviews,
  getDashboardStats,
  getRecentVerdicts,
  getTrends,
  getSystemHealth,
  updateTransactionStatus,
  getNotificationSettings,
  getDetectionSettings,
  getDataIntegrationStatus,
  type FullTransaction,
} from "./mockData";

export type TransactionRecord = FullTransaction;

export interface DashboardStats {
  total_transactions: number;
  flagged_transactions: number;
  active_verdicts: number;
  confirmed_fraud: number;
  fraud_detection_rate: number;
  approval_rate: number;
  avg_ensemble_score: number;
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
}

export type Alert = FullTransaction;

export interface Review extends FullTransaction {
  reviewed_at: string;
}

export interface TrendDataPoint {
  hour: string;
  transactions: number;
  fraud: number;
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

function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sortData<T>(data: T[], sortBy: string, sortOrder: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    let cmp = 0;
    if (typeof aVal === "number" && typeof bVal === "number") {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    return sortOrder === "desc" ? -cmp : cmp;
  });
}

function paginate<T>(data: T[], page: number, perPage: number): { items: T[]; total: number } {
  const start = (page - 1) * perPage;
  return { items: data.slice(start, start + perPage), total: data.length };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  return getDashboardStats();
}

export async function fetchRecentVerdicts(limit: number = 5): Promise<RecentVerdict[]> {
  await delay();
  return getRecentVerdicts(limit);
}

export async function fetchTrends(): Promise<TrendDataPoint[]> {
  await delay();
  return getTrends();
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  await delay();
  return getSystemHealth();
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
  await delay();
  const { status, page = 1, perPage = 20, sortBy = "ensemble_score", sortOrder = "desc" } = params;
  let data = getAlerts();
  if (status) data = data.filter(d => d.status === status);
  data = sortData(data, sortBy, sortOrder);
  const { items, total } = paginate(data, page, perPage);
  return { data: items, count: items.length, total, page, per_page: perPage, sort_by: sortBy, sort_order: sortOrder };
}

export interface ReviewsQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchReviews(params: ReviewsQueryParams = {}): Promise<PaginatedResponse<Review>> {
  await delay();
  const { page = 1, perPage = 20, search, status, sortBy = "ensemble_score", sortOrder = "desc" } = params;
  let data: Review[] = getReviews();
  if (status) data = data.filter(d => d.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(d =>
      d.Transaction_ID.toLowerCase().includes(q) ||
      d.User_ID.toLowerCase().includes(q) ||
      d.Transaction_Amount.toString().includes(q)
    );
  }
  data = sortData(data, sortBy, sortOrder);
  const { items, total } = paginate(data, page, perPage);
  return { data: items, count: items.length, total, page, per_page: perPage, sort_by: sortBy, sort_order: sortOrder };
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
  await delay();
  const { page = 1, perPage = 20, search, status, sortBy = "Timestamp", sortOrder = "desc" } = params;
  let data = getAllTransactions();
  if (status) data = data.filter(d => d.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(d =>
      d.Transaction_ID.toLowerCase().includes(q) ||
      d.User_ID.toLowerCase().includes(q)
    );
  }
  data = sortData(data, sortBy, sortOrder);
  const { items, total } = paginate(data, page, perPage);
  return { data: items, count: items.length, total, page, per_page: perPage, sort_by: sortBy, sort_order: sortOrder };
}

export async function updateVerdict(
  transactionId: string,
  action: "SAFE" | "FRAUD" | "APPROVE" | "BLOCK"
): Promise<void> {
  await delay(200);
  const mappedAction = action === "APPROVE" ? "SAFE" : action === "BLOCK" ? "FRAUD" : action;
  updateTransactionStatus(transactionId, mappedAction);
}

export async function approveReview(
  transactionId: string,
  approved: boolean,
  _reviewerNotes?: string
): Promise<void> {
  await delay(200);
  updateTransactionStatus(transactionId, approved ? "SAFE" : "FRAUD");
}

export async function sendToLLM(
  _transactionId: string,
  _reason?: string
): Promise<void> {
  await delay(500);
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
  database_connection: { name: string; status: string; last_check: string | null };
  data_stream: { name: string; status: string; last_check: string | null };
  external_api: { name: string; status: string; url: string | null; last_check: string | null };
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  await delay();
  return getNotificationSettings();
}

export async function updateNotificationSettings(_settings: Partial<NotificationSettings>): Promise<void> {
  await delay(200);
}

export async function fetchDetectionSettings(): Promise<DetectionSettings> {
  await delay();
  return getDetectionSettings();
}

export async function updateDetectionSettings(_settings: Partial<DetectionSettings>): Promise<void> {
  await delay(200);
}

export async function fetchDataIntegrationStatus(): Promise<DataIntegrationStatus> {
  await delay();
  return getDataIntegrationStatus();
}
