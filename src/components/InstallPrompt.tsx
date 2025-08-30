import React, { useEffect, useState } from 'react';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../theme/theme';
import { analytics } from '../services/analytics';

type BeforeInstallPromptEvent = any;

const STORAGE_KEY = 'kooka_install_prompt_dismissed';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const alreadyInstalled = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (alreadyInstalled || dismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsVisible(true);
      analytics.trackEvent('pwa_install_prompt_available');
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      analytics.trackEvent('pwa_app_installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!isVisible || !deferredPrompt) return null;

  const handleInstall = async () => {
    try {
      analytics.trackEvent('pwa_install_prompt_shown');
      const choice = await deferredPrompt.prompt?.();
      const outcome = (choice && (choice as any).outcome) || 'unknown';
      if (outcome === 'accepted') {
        analytics.trackEvent('pwa_install_accepted');
        setIsVisible(false);
      } else {
        analytics.trackEvent('pwa_install_dismissed');
      }
      setDeferredPrompt(null);
    } catch (error) {
      analytics.trackEvent('pwa_install_prompt_error', { message: String(error) });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    analytics.trackEvent('pwa_install_dismissed_permanent');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
        zIndex: 2000,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.lg,
        padding: spacing.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <img src="/img/kooka-burra-waiving.png" alt="Kooka" style={{ width: 40, height: 40 }} />
        <div>
          <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text }}>Install Kooka Sing?</div>
          <div style={{ fontSize: fontSize.sm, color: colors.textLight }}>Get quick access and offline support</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: spacing.sm }}>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: 'transparent',
            color: colors.textLight,
            border: 'none',
            padding: `${spacing.sm} ${spacing.md}`,
            cursor: 'pointer',
          }}
        >
          Not now
        </button>
        <button
          onClick={handleInstall}
          style={{
            backgroundColor: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.md,
            padding: `${spacing.sm} ${spacing.lg}`,
            cursor: 'pointer',
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
};

