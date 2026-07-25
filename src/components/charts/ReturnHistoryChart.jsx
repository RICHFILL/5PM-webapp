import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { currencySymbol } from '../../utils/currency';

function ReturnHistoryChart({ data = [], currency = "NGN" }) {
  const sym = currencySymbol(currency);
  const formatVal = (v) => `${sym}${v.toLocaleString()}`;

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No return history available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatVal} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [`${sym}${v.toLocaleString()}`, 'Returns']} />
        <Area type="monotone" dataKey="return" stroke="#10B981" strokeWidth={2} fill="#10B981" fillOpacity={0.1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ReturnHistoryChart;
