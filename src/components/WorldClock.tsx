import React from 'react';

interface TimeZone {
  city: string;
  timezone: string;
  region: string;
}

const timeZones: TimeZone[] = [
  // North America
  { city: 'New York', timezone: 'America/New_York', region: 'North America' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', region: 'North America' },
  { city: 'Chicago', timezone: 'America/Chicago', region: 'North America' },
  { city: 'Toronto', timezone: 'America/Toronto', region: 'North America' },
  
  // Europe
  { city: 'London', timezone: 'Europe/London', region: 'Europe' },
  { city: 'Paris', timezone: 'Europe/Paris', region: 'Europe' },
  { city: 'Berlin', timezone: 'Europe/Berlin', region: 'Europe' },
  { city: 'Lisbon', timezone: 'Europe/Lisbon', region: 'Europe' },
  { city: 'Rome', timezone: 'Europe/Rome', region: 'Europe' },
  
  // Asia
  { city: 'Tokyo', timezone: 'Asia/Tokyo', region: 'Asia' },
  { city: 'Singapore', timezone: 'Asia/Singapore', region: 'Asia' },
  { city: 'Dubai', timezone: 'Asia/Dubai', region: 'Asia' },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', region: 'Asia' },
  { city: 'Seoul', timezone: 'Asia/Seoul', region: 'Asia' },
  
  // Oceania
  { city: 'Sydney', timezone: 'Australia/Sydney', region: 'Oceania' },
  { city: 'Auckland', timezone: 'Pacific/Auckland', region: 'Oceania' },
];

export const WorldClock: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    return time.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timezone: string) => {
    return time.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const regions = Array.from(new Set(timeZones.map(tz => tz.region)));

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center">World Clock</h2>
      
      <div className="space-y-8">
        {regions.map(region => (
          <div key={region}>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{region}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeZones
                .filter(tz => tz.region === region)
                .map(({ city, timezone }) => (
                  <div
                    key={city}
                    className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-lg">{city}</h4>
                      <p className="text-gray-400 text-sm">{formatDate(timezone)}</p>
                    </div>
                    <div className="font-mono text-xl">{formatTime(timezone)}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};