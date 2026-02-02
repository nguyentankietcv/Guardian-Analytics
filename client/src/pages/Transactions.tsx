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
import { Search, Filter, Eye, MoreHorizontal, MapPin, CreditCard, Smartphone } from "lucide-react";
import { mockTransactions, mockVerdicts, type Transaction } from "@/lib/mockData";
import { useState } from "react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockTransactions.filter(
    (t) =>
      t.Transaction_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.User_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.Merchant_Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerdict = (transactionId: string) => {
    return mockVerdicts.find(v => v.Transaction_ID === transactionId);
  };

  const getFraudBadge = (fraudLabel: number, transactionId: string) => {
    const verdict = getVerdict(transactionId);
    if (verdict && verdict.flag === 1) {
      return <Badge className="bg-destructive text-destructive-foreground">Flagged</Badge>;
    }
    if (fraudLabel === 1) {
      return <Badge className="bg-orange-500 text-white">Fraud</Badge>;
    }
    return <Badge variant="outline" className="text-[#00A307] border-[#00A307]">Clean</Badge>;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.8) return "text-destructive font-bold";
    if (score >= 0.5) return "text-orange-500 font-semibold";
    if (score >= 0.3) return "text-yellow-600";
    return "text-[#00A307]";
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
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
                <TableRow className="bg-[#F6F6F6]">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.Transaction_ID} data-testid={`row-transaction-${transaction.Transaction_ID}`}>
                    <TableCell className="font-medium font-mono text-sm" data-testid={`text-txn-id-${transaction.Transaction_ID}`}>
                      {transaction.Transaction_ID}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {transaction.User_ID}
                    </TableCell>
                    <TableCell data-testid={`text-amount-${transaction.Transaction_ID}`}>
                      <span className="font-semibold">
                        ${transaction.Transaction_Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {getDeviceIcon(transaction.Device_Type)}
                        {transaction.Transaction_Type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {transaction.Location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{transaction.Card_Type}</span>
                    </TableCell>
                    <TableCell>
                      <span className={getRiskScoreColor(transaction.Risk_Score)} data-testid={`text-risk-${transaction.Transaction_ID}`}>
                        {(transaction.Risk_Score * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell data-testid={`badge-status-${transaction.Transaction_ID}`}>
                      {getFraudBadge(transaction.Fraud_Label, transaction.Transaction_ID)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(transaction.Timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-view-${transaction.Transaction_ID}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-more-${transaction.Transaction_ID}`}>
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
