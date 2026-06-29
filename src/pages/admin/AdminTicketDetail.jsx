import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, User, Shield } from "lucide-react";
import { adminTicketApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";
import toast from "react-hot-toast";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "--";

const statusVariant = (status) => {
  switch (status) {
    case "open": return "warning";
    case "in_progress": return "info";
    case "resolved": return "success";
    case "closed": return "default";
    default: return "default";
  }
};

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminTicketApi.getTicketDetail(id);
      setTicket(data?.data || data);
    } catch (err) {
      setTicket(null);
      toast.error("Failed to load ticket");
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await adminTicketApi.addReply(id, reply);
      if (ticket.status === "open") await adminTicketApi.updateTicket(id, { status: "in_progress" });
      setReply("");
      fetch();
    } catch (err) {
      toast.error("Failed to send reply");
    }
    finally { setSending(false); }
  };

  const handleStatusChange = async (status) => {
    try {
      await adminTicketApi.updateTicket(id, { status });
      fetch();
    } catch (err) {
      toast.error("Failed to update ticket status");
    }
  };

  if (loading) {
    return <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Card /><Skeleton.Card /></div>;
  }

  if (!ticket) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => navigate("/admin/support")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to Tickets</span>
        </button>
        <Card><p className="text-lg font-semibold text-gray-900">Ticket not found</p></Card>
      </div>
    );
  }

  const replies = ticket.replies || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate("/admin/support")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to Tickets</span>
      </button>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{ticket.subject}</h2>
            <Badge variant={statusVariant(ticket.status)}>{ticket.status?.replace("_", " ")}</Badge>
          </div>
          {ticket.status !== "closed" && (
            <div className="flex gap-2">
              {ticket.status === "open" && <Button size="sm" variant="outline" onClick={() => handleStatusChange("in_progress")}>Accept</Button>}
              <Button size="sm" variant="outline" onClick={() => handleStatusChange("resolved")}>Resolve</Button>
              <Button size="sm" variant="outline" onClick={() => handleStatusChange("closed")}>Close</Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>By: {ticket.ticketUser?.firstName} {ticket.ticketUser?.lastName}</span>
          <span>{ticket.ticketUser?.email}</span>
          <span>Category: {ticket.category}</span>
          <span>Priority: <Badge variant={ticket.priority === "urgent" ? "danger" : ticket.priority === "high" ? "warning" : "default"}>{ticket.priority}</Badge></span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
        </div>
      </Card>

      <div className="space-y-4">
        {replies.map((r) => (
          <div key={r.id} className={`flex gap-3 ${r.adminId ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-xl p-4 max-w-[80%] ${r.adminId ? "bg-brand-50 border border-brand-100" : "bg-gray-50 border border-gray-100"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-700">{r.adminId ? "You (Support)" : ticket.ticketUser?.firstName || "User"}</span>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.message}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${r.adminId ? "bg-brand-500" : "bg-gray-400"}`}>
              {r.adminId ? <Shield size={14} /> : <User size={14} />}
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== "closed" && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Reply as Support</h3>
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Type your response..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none" />
          <div className="flex justify-end mt-3">
            <Button onClick={handleReply} disabled={sending || !reply.trim()} size="sm">
              <Send size={14} /> {sending ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
