import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { currencySymbol } from '../../utils/currency';

function InvestmentPerformanceChart({ data = [], currency = "NGN" }) {
  const sym = currencySymbol(currency);
  const formatVal = (v) => `${sym}${(v / 1000000).toFixed(1)}M`;

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No performance data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatVal} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [`${sym}${v.toLocaleString()}`, '']} />
        <Legend />
        <Bar dataKey="invested" name="Invested" fill="#1C3A8A" radius={[4, 4, 0, 0]} />
        <Bar dataKey="returns" name="Returns" fill="#00B8DB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default InvestmentPerformanceChart;
