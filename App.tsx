
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TechnicianTracking from './components/TechnicianTracking';
import { CATEGORIES, BRANDS, MOCK_PROMOS } from './constants';
import { DeviceCategory, Brand, ServiceRequest, AIAnalysis, Technician } from './types';
import { getSmartDiagnosis } from './services/gemini';

const MOCK_TECH: Technician = {
  id: 'tech-1',
  name: 'Budi Santoso',
  rating: 4.9,
  specialization: ['Laptop', 'Hardware'],
  photo: 'https://picsum.photos/seed/tech/200/200'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile'>('home');
  const [step, setStep] = useState<'home' | 'select_details' | 'scheduling' | 'confirm' | 'tracking'>('home');
  
  // State for the new request flow
  const [newRequest, setNewRequest] = useState<Partial<ServiceRequest>>({
    category: 'Laptop',
    brand: 'Asus',
    description: '',
    address: '',
    scheduleDate: '',
    scheduleTime: '',
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeOrders, setActiveOrders] = useState<ServiceRequest[]>([]);

  // Simulation of "Home" to "Booking"
  const startBooking = (category: DeviceCategory) => {
    setNewRequest({ ...newRequest, category });
    setStep('select_details');
  };

  const handleAiDiagnosis = async () => {
    if (!newRequest.description || !newRequest.category || !newRequest.brand) return;
    setIsAiLoading(true);
    try {
      const analysis = await getSmartDiagnosis(newRequest.category, newRequest.brand, newRequest.description);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const completeOrder = () => {
    const finalRequest: ServiceRequest = {
      ...(newRequest as ServiceRequest),
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      status: 'on_way',
      technician: MOCK_TECH,
      estimatedCost: 'Rp 150.000 - Rp 350.000'
    };
    setActiveOrders([finalRequest]);
    setStep('tracking');
    setActiveTab('orders');
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={step === 'home' ? 'ServiceComp' : 'Booking Service'}
      onBack={step !== 'home' ? () => setStep('home') : undefined}
    >
      {/* Home View */}
      {step === 'home' && activeTab === 'home' && (
        <div className="p-4 space-y-6">
          {/* Welcome & Promo Slider */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800">Halo, Jhon! 👋</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {MOCK_PROMOS.map(promo => (
                <div key={promo.id} className={`${promo.color} min-w-[280px] p-6 rounded-2xl text-white shadow-lg`}>
                  <p className="text-sm opacity-80">{promo.subtitle}</p>
                  <h3 className="text-2xl font-bold mt-1">{promo.title}</h3>
                  <button className="mt-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                    Ambil Promo
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Order Highlight */}
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Status Perbaikan</h3>
                <button onClick={() => setStep('tracking')} className="text-xs text-blue-600 font-bold">Detail</button>
              </div>
              <TechnicianTracking request={activeOrders[0]} />
            </div>
          )}

          {/* Main Services */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800">Pilih Layanan</h3>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => startBooking(cat.id as DeviceCategory)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:bg-blue-50 transition-all hover:border-blue-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{cat.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Banner */}
          <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="font-bold text-lg">Punya Masalah Mendesak?</h4>
                <p className="text-sm opacity-80 mt-1">Gunakan layanan Express, teknisi tiba dalam 30 menit.</p>
                <button className="mt-4 px-4 py-2 bg-indigo-500 rounded-lg text-xs font-bold">Panggil Sekarang</button>
             </div>
             <div className="absolute top-0 right-0 opacity-10 -mr-4">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm1,14H11V7h2Z"/></svg>
             </div>
          </div>
        </div>
      )}

      {/* Booking Step 1: Selection & Issue */}
      {step === 'select_details' && (
        <div className="p-4 space-y-6 animate-in slide-in-from-right duration-300">
           <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Merek Perangkat</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setNewRequest({...newRequest, brand: brand as Brand})}
                      className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all ${newRequest.brand === brand ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">Deskripsikan Kerusakan</span>
                <textarea 
                  className="w-full mt-2 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px]"
                  placeholder="Contoh: Laptop mati total setelah terkena air, atau Printer macet saat mencetak..."
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                />
              </label>

              <button 
                onClick={handleAiDiagnosis}
                disabled={!newRequest.description || isAiLoading}
                className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-100 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                Diagnosis Cerdas AI
              </button>

              {aiAnalysis && (
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-xl animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 112 0 1 1 0 01-2 0zm1-9a1 1 0 011 1v5a1 1 0 11-2 0V5a1 1 0 011-1z"/></svg>
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">Analisis Masalah</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Kemungkinan Penyebab</p>
                      <p className="font-medium">{aiAnalysis.possibleCause}</p>
                    </div>
                    <div className="flex justify-between gap-4">
                       <div>
                        <p className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Estimasi Waktu</p>
                        <p className="font-medium">{aiAnalysis.estimatedFixTime}</p>
                      </div>
                      <div>
                        <p className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Status</p>
                        <span className="bg-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold">DAPAT DIPERBAIKI</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <p className="opacity-70 text-[10px] uppercase font-bold tracking-wider">Saran Ahli</p>
                      <p className="italic">{aiAnalysis.advice}</p>
                    </div>
                  </div>
                </div>
              )}
           </div>

           <div className="sticky bottom-0 bg-slate-50 pt-4 pb-20">
              <button 
                onClick={() => setStep('scheduling')}
                disabled={!newRequest.description}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-95"
              >
                Lanjutkan
              </button>
           </div>
        </div>
      )}

      {/* Booking Step 2: Scheduling & Location */}
      {step === 'scheduling' && (
        <div className="p-4 space-y-6 animate-in slide-in-from-right duration-300">
          <div className="space-y-4">
             <label className="block">
                <span className="text-sm font-bold text-slate-700">Alamat Rumah</span>
                <div className="relative mt-2">
                  <textarea 
                    className="w-full p-4 pl-10 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                    placeholder="Jl. Merdeka No. 123, Jakarta Selatan..."
                    value={newRequest.address}
                    onChange={(e) => setNewRequest({...newRequest, address: e.target.value})}
                  />
                  <svg className="w-5 h-5 absolute top-4 left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
             </label>

             <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Tanggal Kunjungan</span>
                  <input 
                    type="date"
                    className="w-full mt-2 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newRequest.scheduleDate}
                    onChange={(e) => setNewRequest({...newRequest, scheduleDate: e.target.value})}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">Waktu</span>
                  <input 
                    type="time"
                    className="w-full mt-2 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newRequest.scheduleTime}
                    onChange={(e) => setNewRequest({...newRequest, scheduleTime: e.target.value})}
                  />
                </label>
             </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
             <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p className="text-xs text-blue-700 leading-relaxed">
               Biaya kunjungan teknisi adalah <strong>Rp 50.000</strong>. Biaya perbaikan akan dinegosiasikan setelah pemeriksaan fisik oleh teknisi.
             </p>
          </div>

          <div className="sticky bottom-0 bg-slate-50 pt-4 pb-20">
              <button 
                onClick={() => setStep('confirm')}
                disabled={!newRequest.address || !newRequest.scheduleDate || !newRequest.scheduleTime}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-95"
              >
                Tinjau Pesanan
              </button>
           </div>
        </div>
      )}

      {/* Booking Step 3: Confirmation */}
      {step === 'confirm' && (
        <div className="p-4 space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-4">Ringkasan Pesanan</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perangkat</p>
                  <p className="font-bold text-slate-700">{newRequest.category} {newRequest.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Waktu</p>
                  <p className="font-bold text-slate-700">{newRequest.scheduleDate}, {newRequest.scheduleTime}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Masalah</p>
                <p className="text-sm text-slate-600 italic">"{newRequest.description}"</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi</p>
                <p className="text-sm text-slate-600">{newRequest.address}</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Biaya Kunjungan</span>
                <span className="font-bold">Rp 50.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Estimasi Perbaikan</span>
                <span className="font-bold text-blue-600">Rp 150.000+</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
             </div>
             <div>
                <h4 className="font-bold text-slate-800 text-sm">Teknisi Berpengalaman</h4>
                <p className="text-xs text-slate-500">Budi Santoso akan datang melayani Anda.</p>
             </div>
          </div>

          <div className="sticky bottom-0 bg-slate-50 pt-4 pb-20">
              <button 
                onClick={completeOrder}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Konfirmasi & Panggil Teknisi
              </button>
           </div>
        </div>
      )}

      {/* Tracking / Orders View */}
      {step === 'tracking' && activeTab === 'orders' && activeOrders.length > 0 && (
        <div className="p-4 space-y-6">
           <div className="space-y-4">
              <TechnicianTracking request={activeOrders[0]} />

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                 <h4 className="font-bold text-slate-800">Timeline Pengerjaan</h4>
                 <div className="space-y-6 relative ml-4 border-l-2 border-slate-100 pl-6">
                    <div className="relative">
                       <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
                       <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sekarang</p>
                       <p className="text-sm font-bold text-slate-700">Teknisi sedang menuju lokasi Anda</p>
                       <p className="text-[10px] text-slate-400">14:20 WIB</p>
                    </div>
                    <div className="relative opacity-40">
                       <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mendatang</p>
                       <p className="text-sm font-bold text-slate-700">Pemeriksaan perangkat oleh teknisi</p>
                    </div>
                    <div className="relative opacity-40">
                       <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                       <p className="text-sm font-bold text-slate-700">Proses perbaikan & penggantian sparepart</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button className="py-3 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                    Batalkan Pesanan
                 </button>
                 <button className="py-3 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Hubungi CS
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'orders' && activeOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
           <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
           </div>
           <h3 className="text-lg font-bold text-slate-800">Belum Ada Pesanan</h3>
           <p className="text-sm text-slate-500 mt-2">Anda belum melakukan pemesanan servis. Klik tombol di bawah untuk memulai.</p>
           <button 
            onClick={() => { setActiveTab('home'); setStep('home'); }}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
          >
             Panggil Teknisi Sekarang
           </button>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="p-4 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-blue-50 flex items-center justify-center text-white text-2xl font-bold">
                 JS
              </div>
              <div>
                 <h3 className="font-bold text-lg text-slate-800">Jhon Smith</h3>
                 <p className="text-sm text-slate-500">jhonsmith@email.com</p>
                 <div className="flex items-center gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded">GOLD MEMBER</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {[
                { label: 'Edit Profil', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
                { label: 'Alamat Tersimpan', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
                { label: 'Riwayat Transaksi', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
                { label: 'Pusat Bantuan', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                   <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                   </div>
                   <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                </button>
              ))}
           </div>

           <button className="w-full py-4 bg-white border border-red-100 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
              Keluar Akun
           </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
