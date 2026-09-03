'use client';

import { useState } from 'react';
import { sendLowBalanceAlert } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LowBalanceAlertButtonProps {
  userId: string;
  userName: string;
}

export function LowBalanceAlertButton({ userId, userName }: LowBalanceAlertButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const t = useTranslations('dashboard');

  const handleSend = async () => {
    if (isSending || isSent) return;
    
    setIsSending(true);
    try {
      const result = await sendLowBalanceAlert(userId);
      if (result.success) {
        toast.success(t('alertSentSuccess', { userName }));
        setIsSent(true);
        // Re-enable button after 60 seconds
        setTimeout(() => setIsSent(false), 60000);
      } else {
        toast.error(result.error || t('alertSentError'));
      }
    } catch {
      toast.error(t('alertSentError'));
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
      title={isSent ? t('sent') : t('informUser')}
    >
      {isSending ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('sending')}
        </>
      ) : isSent ? (
        <>
          <CheckCircle className="w-3 h-3" />
          {t('sent')}
        </>
      ) : (
        <>
          <Mail className="w-3 h-3" />
          {t('informUser')}
        </>
      )}
    </button>
  );
}
