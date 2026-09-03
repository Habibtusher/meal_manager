'use client';

import { useState } from 'react';
import { sendLowBalanceAlert } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface LowBalanceAlertButtonProps {
  userId: string;
  userName: string;
}

export function LowBalanceAlertButton({ userId, userName }: LowBalanceAlertButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async () => {
    if (isSending || isSent) return;
    
    setIsSending(true);
    try {
      const result = await sendLowBalanceAlert(userId);
      if (result.success) {
        toast.success(`Alert email sent to ${userName}`);
        setIsSent(true);
        // Re-enable button after 60 seconds
        setTimeout(() => setIsSent(false), 60000);
      } else {
        toast.error(result.error || 'Failed to send alert email');
      }
    } catch {
      toast.error('Failed to send alert email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      disabled={isSending || isSent}
      className="inline-flex items-center gap-1 text-[10px] font-medium transition-colors disabled:opacity-50"
      style={{
        color: isSent ? '#16a34a' : '#2563eb',
        cursor: isSending || isSent ? 'default' : 'pointer',
      }}
      title={isSent ? 'Email sent' : `Send low balance alert to ${userName}`}
    >
      {isSending ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Sending...
        </>
      ) : isSent ? (
        <>
          <CheckCircle className="w-3 h-3" />
          Sent
        </>
      ) : (
        <>
          <Mail className="w-3 h-3" />
          Inform User
        </>
      )}
    </button>
  );
}
