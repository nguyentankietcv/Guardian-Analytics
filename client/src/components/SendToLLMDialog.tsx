import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Send } from "lucide-react";

interface SendToLLMDialogProps {
  transactionId: string | null;
  open: boolean;
  onClose: () => void;
  onSend: (transactionId: string, reason?: string) => void;
  isPending?: boolean;
}

export default function SendToLLMDialog({ 
  transactionId, 
  open, 
  onClose, 
  onSend,
  isPending = false 
}: SendToLLMDialogProps) {
  const [reason, setReason] = useState("");

  const handleSend = () => {
    if (transactionId) {
      onSend(transactionId, reason || undefined);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Send to LLM Analysis
          </DialogTitle>
          <DialogDescription>
            Request AI analysis for transaction {transactionId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Analysis (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Add any notes or specific concerns for the LLM to consider..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-llm-reason"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isPending} data-testid="button-send-to-llm-confirm">
            <Send className="w-4 h-4 mr-2" />
            {isPending ? "Sending..." : "Send to LLM"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
