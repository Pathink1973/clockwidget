import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock as ClockIcon, Timer as TimerIcon, Globe2, Utensils, Shield, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { Clock } from './components/Clock';
import { Alarm } from './components/Alarm';
import { Timer } from './components/Timer';
import { Stopwatch } from './components/Stopwatch';
import { WorldClock } from './components/WorldClock';
import { CookingTimer } from './components/CookingTimer';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './contexts/SettingsContext';
import { CookieConsent } from './components/CookieConsent';

type Tab = 'clock' | 'alarm' | 'timer' | 'stopwatch' | 'worldclock' | 'cooking';

function App() {
  const [time, setTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(false);
  const [alarms, setAlarms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('clock');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);  // Update every 100ms instead of 1000ms for smoother updates
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clock':
        return (
          <>
            <Clock 
              time={time} 
              is24Hour={!settings.use12Hour} 
              showSeconds={true} 
            />
          </>
        );
      case 'alarm':
        return <Alarm alarms={alarms} setAlarms={setAlarms} isMuted={isMuted} currentTime={time} />;
      case 'timer':
        return <Timer isMuted={isMuted} />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'worldclock':
        return <WorldClock />;
      case 'cooking':
        return <CookingTimer isMuted={isMuted} />;
      default:
        return null;
    }
  };

  const fontColorClass = `text-${settings.fontColor}-500`;
  const fontClass = settings.useDigitalFont ? 'font-digital' : settings.useDotoFont ? 'font-doto' : '';

  return (
    <div className={`min-h-screen ${settings.isDarkMode ? 'bg-black' : 'bg-white'} ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className={`${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-2 px-4 flex justify-between items-center`}>
        <div className="text-gray-400">
          {time.toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-indigo-600 text-white transition-colors bg-indigo-500"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            onClick={() => updateSettings({ isDarkMode: !settings.isDarkMode })}
            className="p-2 rounded-full hover:bg-indigo-600 text-white transition-colors bg-indigo-500"
          >
            {settings.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full hover:bg-indigo-600 text-white transition-colors bg-indigo-500"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      <main className={`container mx-auto px-4 py-8 ${fontColorClass} ${fontClass}`}>
        <div className="max-w-4xl mx-auto">
          {/* Navigation Tabs */}
          <nav className={`flex flex-wrap justify-center mb-8 md:mb-12 gap-1.5 sm:gap-2 ${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-1.5 sm:p-2 rounded-full`}>
            {[
              { id: 'clock', icon: <ClockIcon size={16} className="sm:w-5 sm:h-5" />, label: 'Clock' },
              { id: 'alarm', icon: <Volume2 size={16} className="sm:w-5 sm:h-5" />, label: 'Alarm' },
              { id: 'timer', icon: <TimerIcon size={16} className="sm:w-5 sm:h-5" />, label: 'Timer' },
              { id: 'stopwatch', icon: <TimerIcon size={16} className="sm:w-5 sm:h-5" />, label: 'Stopwatch' },
              { id: 'worldclock', icon: <Globe2 size={16} className="sm:w-5 sm:h-5" />, label: 'World Clock' },
              { id: 'cooking', icon: <Utensils size={16} className="sm:w-5 sm:h-5" />, label: 'Cooking' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full transition-all text-white text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } ${settings.useSlideEffect ? 'hover:scale-105' : ''}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div className={`${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-3xl p-8 shadow-2xl backdrop-blur-lg ${settings.isDarkMode ? 'bg-opacity-50' : ''}`}>
            {renderTabContent()}
          </div>

          {/* Presentation Section */}
          <section className={`py-20 ${settings.isDarkMode ? 'bg-black' : 'bg-white'} relative overflow-hidden`}>
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Main Headline */}
              <div className={`text-center mb-16 ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
                <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Digital Clock
                </h2>
                <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto">
                  Transform your time management with our elegant digital clock suite. Precision meets design in a seamless experience crafted for modern productivity.
                </p>
              </div>

              {/* Feature Description */}
              <div className={`grid md:grid-cols-2 gap-12 mb-20 ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Precision in Every Moment
                  </h3>
                  <p className={`text-lg leading-relaxed ${settings.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Experience time management reimagined. Our digital clock suite combines elegant design with powerful functionality, offering you a full-screen clock, intelligent alarms, precision countdown timer, and professional stopwatch – all unified in one seamless interface.
                  </p>
                </div>
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Crafted for Performance
                  </h3>
                  <p className={`text-lg leading-relaxed ${settings.isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    More than just a clock – it's your personal time companion. With customizable settings, intuitive controls, and smooth animations, staying on schedule becomes effortless. Perfect for professionals, creatives, and anyone who values their time.
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className={`grid md:grid-cols-3 gap-8 mb-16 ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
                <div className={`p-6 rounded-xl ${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <h4 className={`text-xl font-semibold mb-3 ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Smart Alarms
                  </h4>
                  <p className="text-gray-500">
                    Intelligent wake-up system with customizable sound profiles and gradual volume increase.
                  </p>
                </div>
                <div className={`p-6 rounded-xl ${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <h4 className={`text-xl font-semibold mb-3 ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Precision Timer
                  </h4>
                  <p className="text-gray-500">
                    Accurate countdown with visual and audio feedback for perfect timing every time.
                  </p>
                </div>
                <div className={`p-6 rounded-xl ${settings.isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <h4 className={`text-xl font-semibold mb-3 ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pro Stopwatch
                  </h4>
                  <p className="text-gray-500">
                    Professional-grade stopwatch with lap timing and detailed analytics.
                  </p>
                </div>
              </div>

              {/* Taglines with Visual Enhancement */}
              <div className={`text-center space-y-8 mb-16 ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
                <div className="relative">
                  <div className={`text-3xl md:text-4xl font-bold ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Track. Focus. Achieve.
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 blur rounded-lg"></div>
                </div>
                <div className="relative">
                  <div className={`text-3xl md:text-4xl font-bold ${settings.isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Time, Elevated.
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10 blur rounded-lg"></div>
                </div>
              </div>

              {/* Final Statement */}
              <div className={`text-center ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
                <p className={`text-2xl md:text-3xl font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text`}>
                  Digital Clock - Mastering Time with Elegance
                </p>
              </div>

              {/* Enhanced Decorative Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-20 left-10 w-64 h-64 rounded-full ${settings.isDarkMode ? 'bg-blue-500' : 'bg-blue-200'} opacity-5 blur-3xl animate-pulse`}></div>
                <div className={`absolute bottom-20 right-10 w-64 h-64 rounded-full ${settings.isDarkMode ? 'bg-purple-500' : 'bg-purple-200'} opacity-5 blur-3xl animate-pulse`}></div>
                <div className={`absolute top-40 right-20 w-32 h-32 rounded-full ${settings.isDarkMode ? 'bg-pink-500' : 'bg-pink-200'} opacity-5 blur-3xl animate-pulse`}></div>
              </div>
            </div>
          </section>

          {/* Main Content End */}
        </div>
      </main>
      <CookieConsent />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}

export default App;