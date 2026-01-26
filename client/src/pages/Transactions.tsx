import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import { mockTransactions, type Transaction } from "@/lib/mockData";
import { useState } from "react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockTransactions.filter(
    (t) =>
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case "flagged":
        return <Badge className="bg-orange-500 text-white">Flagged</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertTypeBadge = (alertType: Transaction["alertType"]) => {
    switch (alertType) {
      case "duplicate":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Duplicate</Badge>;
      case "fraud":
        return <Badge variant="outline" className="border-destructive text-destructive">Fraud</Badge>;
      case "anomaly":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Anomaly</Badge>;
      case "none":
        return <Badge variant="outline" className="text-muted-foreground">None</Badge>;
      default:
        return null;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-destructive font-bold";
    if (score >= 50) return "text-orange-500 font-semibold";
    if (score >= 30) return "text-yellow-600";
    return "text-green-500";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-[#090909]" data-testid="text-page-title">Transactions</h1>
        <p className="text-base text-[#9F9F9F]">Monitor and review all financial transactions</p>
      </div>

      <Card data-testid="card-transactions-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>{mockTransactions.length} total transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button variant="outline" size="icon" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                    <TableCell className="font-medium" data-testid={`text-txn-id-${transaction.id}`}>
                      {transaction.transactionId}
                    </TableCell>
                    <TableCell data-testid={`text-amount-${transaction.id}`}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: transaction.currency,
                      }).format(transaction.amount)}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={transaction.sender}>
                      {transaction.sender}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={transaction.receiver}>
                      {transaction.receiver}
                    </TableCell>
                    <TableCell data-testid={`badge-status-${transaction.id}`}>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      <span className={getRiskScoreColor(transaction.riskScore)} data-testid={`text-risk-${transaction.id}`}>
                        {transaction.riskScore}
                      </span>
                    </TableCell>
                    <TableCell data-testid={`badge-alert-${transaction.id}`}>
                      {getAlertTypeBadge(transaction.alertType)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-view-${transaction.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-more-${transaction.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
