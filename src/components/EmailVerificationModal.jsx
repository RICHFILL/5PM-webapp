import { useState, useRef } from 'react';
import { Mail, X, ArrowLeft, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authApi } from '../services/api';
import { Button } from './common';

function EmailVerificationModal({ isOpen, onClose }) {
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState('prompt');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const handleResend = async () => {
    setLoading(true); setError('');
    try {
      await authApi.resendVerification(user.email);
      setStep('otp');
    } catch (e) {
      setError(e.message || 'Failed to resend code');
    } finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true); setError('');
    try {
      await authApi.verifyEmail(user.email, otp);
      setUser({ ...user, isVerified: true });
      setStep('prompt');
      setOtp('');
      onClose();
    } catch (e) {
      setError(e.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const renderOtpInputs = () => (
    <div className="flex justify-center gap-2">
      {[0,1,2,3,4,5].map((i) => (
        <input
          key={i}
          ref={(el) => { otpRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i] || ''}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, '').slice(-1);
            if (!char) return;
            const arr = otp.split('');
            arr[i] = char;
            setOtp(arr.join(''));
            if (i < 5) otpRefs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !otp[i] && i > 0) {
              setOtp(otp.slice(0, -1));
              otpRefs.current[i - 1]?.focus();
            }
          }}
          className="w-11 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-colors"
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm" onClick={() => { if (step === 'prompt') { setError(''); onClose(); } }}>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Verify your email</h3>
          {step === 'prompt' && (
            <button onClick={() => { setError(''); onClose(); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="px-6 py-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          {step === 'prompt' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-brand-100 rounded-2xl flex items-center justify-center">
                <Mail className="text-brand-600" size={32} />
              </div>
              <p className="text-gray-600 text-sm">
                We sent a verification code to <strong className="text-gray-900">{user?.email}</strong>. Please verify your email to access all features.
              </p>
              <Button onClick={handleResend} disabled={loading} className="w-full">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Send Verification Code
              </Button>
              <p className="text-xs text-gray-500">Didn't receive it? Check your spam folder or try again.</p>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to <strong className="text-gray-900">{user?.email}</strong></p>
                {renderOtpInputs()}
              </div>
              <div className="flex gap-3 items-center">
                <button onClick={() => { setStep('prompt'); setError(''); }} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="flex-1" />
                <Button onClick={handleVerify} disabled={otp.length < 6 || loading} size="sm">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Verify
                </Button>
              </div>
              <div className="text-center pt-2">
                <button onClick={handleResend} disabled={loading} className="text-sm text-brand-500 hover:text-brand-600 transition-colors">
                  Resend Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationModal;
