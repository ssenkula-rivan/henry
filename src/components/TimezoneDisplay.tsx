'use client';

import { useState, useEffect } from 'react';

export default function TimezoneDisplay() {
  const [localTime, setLocalTime] = useState('');
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const timezoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      setLocalTime(timeString);
      setTimezone(timezoneString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getWorkingHoursStatus = () => {
    const ugandaTime = new Date().toLocaleString('en-US', { timeZone: 'Africa/Kampala' });
    const ugandaHour = new Date(ugandaTime).getHours();
    
    if (ugandaHour >= 9 && ugandaHour <= 18) {
      return { status: 'Available', color: 'text-green-400' };
    } else {
      return { status: 'After Hours', color: 'text-yellow-400' };
    }
  };

  const workingStatus = getWorkingHoursStatus();

  return (
    <div className="text-center text-xs text-[#888] mb-4">
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${workingStatus.color === 'text-green-400' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
        <span className={workingStatus.color}>{workingStatus.status}</span>
      </div>
      <div>Your time: {localTime} ({timezone})</div>
      <div className="text-[#666]">Business hours: 9AM-6PM EAT</div>
    </div>
  );
}
