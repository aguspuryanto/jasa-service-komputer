
import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../types';

interface TrackingProps {
  request: ServiceRequest;
}

const TechnicianTracking: React.FC<TrackingProps> = ({ request }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (request.status === 'on_way') {
      const timer = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 500);
      return () => clearInterval(timer);
    }
  }, [request.status]);

  return (
    <div className="p-4 bg-white rounded-2xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">
            {request.status === 'on_way' ? 'Teknisi dalam perjalanan' : 'Pesanan Aktif'}
          </h3>
          <p className="text-sm text-slate-500">Estimasi tiba: 12 Menit</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {request.status.replace('_', ' ')}
        </span>
      </div>

      {/* Map Simulation */}
      <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden border">
        {/* Simple SVG Map Path */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
          <path d="M10,50 Q40,10 90,80" stroke="#3b82f6" strokeWidth="2" fill="none" />
        </svg>
        
        {/* User House */}
        <div className="absolute top-10 right-10">
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-400 animate-ping rounded-full opacity-75"></div>
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-md relative z-10">
               <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 whitespace-nowrap">Rumah</span>
          </div>
        </div>

        {/* Technician Bike */}
        <div 
          className="absolute transition-all duration-500 ease-linear"
          style={{ 
            left: `${progress}%`,
            top: `${50 - (progress / 2)}%`,
            transform: `translate(-50%, -50%)`
          }}
        >
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5,5.5L11,9.4L8.5,7L10,5.5L15.5,5.5M19.3,6.2C19.2,6 19,5.8 18.7,5.7L15.9,4.3C15.5,4.1 15.1,4 14.7,4H9.3C8.9,4 8.5,4.1 8.1,4.3L5.3,5.7C5,5.8 4.8,6 4.7,6.2C4.5,6.4 4.5,6.7 4.5,7V14H6.5V12H17.5V14H19.5V7C19.5,6.7 19.5,6.4 19.3,6.2Z" />
                </svg>
             </div>
          </div>
        </div>
      </div>

      {request.technician && (
        <div className="flex items-center gap-3 border-t pt-4">
          <img src={request.technician.photo} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" alt="Tech" />
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">{request.technician.name}</h4>
            <div className="flex items-center text-xs text-yellow-500 font-bold">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
              <span className="ml-1">{request.technician.rating} • Teknisi Ahli</span>
            </div>
          </div>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianTracking;
