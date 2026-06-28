import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, MessageSquare, ChevronRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ticketApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";

const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "--";

const statusIcon = (status) => {
  switch (status) {
    case "resolved": return <CheckCircle size={16} className="text-green-500" />;
    case "closed": return <CheckCircle size={16} className="text-gray-400" />;
    case "in_progress": return <Clock size={16} className="text-blue-500" />;
    default: return <AlertCircle size={16} className="text-yellow-500" />;
  }
};

const statusVariant = (status) => {
  switch (status) {
    case "open": return "warning";
    case "in_progress": return "info";
    case "resolved": return "success";
    case "closed": return "default";
    default: return "default";
  }
};

export default function SupportTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ticketApi.getMyTickets();
        setTickets(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        setTickets([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><Skeleton className="h-8 w-48" /><Skeleton.Table rows={5} /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Get help and track your requests</p>
        </div>
        <Button onClick={() => navigate("/support/new")}><Plus size={16} /> New Ticket</Button>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Yet</h3>
            <p className="text-gray-500 mb-6">Have a question or issue? Create a support ticket and we'll help you out.</p>
            <Button onClick={() => navigate("/support/new")}>Create Ticket</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/support/${ticket.id}`)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{statusIcon(ticket.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ticket.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={statusVariant(ticket.status)}>{ticket.status?.replace("_", " ")}</Badge>
                      <span className="text-xs text-gray-400">{ticket.category}</span>
                      <span className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
