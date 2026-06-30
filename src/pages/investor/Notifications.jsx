import { useState, useEffect } from "react";
import { Bell, CheckCheck, Mail, MailOpen, ArrowRight, Info, AlertTriangle, CheckCircle, X } from "lucide-react";
import { notificationApi } from "../../services/api";
import useNotificationStore from "../../store/notificationStore";
import { Card, Skeleton, Badge, Button } from "../../components/common";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
};

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: X,
};

const colorMap = {
  info: "text-blue-500 bg-blue-50",
  warning: "text-yellow-500 bg-yellow-50",
  success: "text-green-500 bg-green-50",
  error: "text-red-500 bg-red-50",
};

export default function Notifications() {
  const { notifications, unreadCount, setNotifications, markAsRead } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await notificationApi.getNotifications();
        const items = Array.isArray(data) ? data : data?.data ?? data?.notifications ?? [];
        setNotifications(items);
      } catch (err) {
        setNotifications([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const ids = notifications.filter(n => !n.read).map(n => n.id || n._id);
      await notificationApi.markAllAsRead(ids);
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) { /* silent */ }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      markAsRead(id);
    } catch (err) { /* silent */ }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="ghost" size="sm">
            <CheckCheck size={16} /> Mark All Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Info;
            return (
              <div key={n.id || n._id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  n.read ? "bg-white border border-gray-100" : "bg-neon-tangerine/10 border border-neon-tangerine/20"
                }`}
                onClick={() => !n.read && handleMarkRead(n.id || n._id)}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[n.type] || colorMap.info}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>
                      {n.title || n.message}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
                      {n.read ? <MailOpen size={14} className="text-gray-300" /> : <Mail size={14} className="text-neon-tangerine" />}
                    </div>
                  </div>
                  {n.message && n.title && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Bell size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
