import { useState } from 'react';
import { Phone, PhoneCall, Loader2 } from 'lucide-react';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import api from '../services/api';

const TIME_OPTIONS = [
  { value: 'anytime', label: 'Anytime' },
  { value: 'morning', label: 'Morning (8am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm–4pm)' },
  { value: 'evening', label: 'Evening (4pm–6pm)' },
];

export default function CallbackFloat() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', preferredTime: 'anytime', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Name and phone are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/callbacks', form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setDone(false);
    setForm({ name: '', phone: '', preferredTime: 'anytime', message: '' });
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Request a call back"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-dark-lavender text-white px-4 py-3 rounded-xl shadow-lg hover:bg-dark-lavender/80 transition-colors"
      >
        <Phone size={20} />
        <span className="text-sm font-medium">Request Callback</span>
      </button>

      <Modal isOpen={open} onClose={reset} title="Request a Callback" size="md">
        {done ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <PhoneCall className="text-green-600" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-sm text-gray-600 mb-6">Our team will call you back at your preferred time.</p>
            <Button onClick={reset} className="w-full">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="John Doe"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              placeholder="+2348012345678"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <select
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine"
              >
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Message (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine"
                placeholder="Tell us a bit about what you need..."
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
              {submitting ? 'Submitting...' : 'Request Callback'}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
