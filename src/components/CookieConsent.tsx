import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true, // Always required
    analytics: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookieSettings({
      necessary: true,
      analytics: true,
      preferences: true,
    });
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...cookieSettings,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    setCookieSettings({
      necessary: true,
      analytics: false,
      preferences: false,
    });
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {!showSettings ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Cookie Settings
              </button>
              <button
                onClick={handleRejectAll}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cookie Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Necessary Cookies</h4>
                  <p className="text-sm text-gray-500">Required for the website to function properly.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.necessary}
                  disabled
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-gray-500">Help us improve our website by collecting anonymous usage data.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.analytics}
                  onChange={(e) => setCookieSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Preference Cookies</h4>
                  <p className="text-sm text-gray-500">Allow the website to remember your preferences and settings.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.preferences}
                  onChange={(e) => setCookieSettings(prev => ({ ...prev, preferences: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleRejectAll}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Reject All
              </button>
              <button
                onClick={handleSaveSettings}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
