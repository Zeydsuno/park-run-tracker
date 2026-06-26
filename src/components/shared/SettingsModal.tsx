import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { settings, updateSettings } = useSettings();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState('ซิงค์ล่าสุดเมื่อ 1 นาทีที่แล้ว');

    // Local edit state for inputs
    const [editName, setEditName] = useState(settings.runnerName);
    const [editId, setEditId] = useState(settings.runnerId);

    if (!isOpen) return null;

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLastSyncTime('ซิงค์ล่าสุดเมื่อสักครู่นี้');
        }, 1500);
    };

    const saveProfile = () => {
        updateSettings({ runnerName: editName, runnerId: editId });
    };

    return (
        <div className="absolute inset-0 bg-slate-900/60 z-50 flex flex-col justify-end transition-opacity backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-t-[32px] max-h-[90%] w-full flex flex-col overflow-hidden animate-slide-up shadow-[0_-20px_40px_rgba(0,0,0,0.2)] border-t border-white/20" onClick={(e) => e.stopPropagation()}>
                <div className="w-full flex justify-center pt-3 pb-2 bg-white cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                </div>
                
                <div className="px-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="w-8"></div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight text-center flex-1">การตั้งค่า (Settings)</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0 active:scale-95">
                        <i className="ph-bold ph-x"></i>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Runner Profile</h4>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center gap-4 mb-2">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(settings.runnerName)}&background=e44c70&color=ffffff&rounded=true`} alt="User" className="w-14 h-14 rounded-full shadow-sm" />
                                <div className="flex-1 space-y-2">
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={saveProfile}
                                        className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all shadow-inner"
                                        placeholder="Full Name"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID:</span>
                                        <input 
                                            type="text" 
                                            value={editId}
                                            onChange={(e) => setEditId(e.target.value)}
                                            onBlur={saveProfile}
                                            className="flex-1 bg-white border border-slate-200 text-xs font-mono text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all shadow-inner"
                                            placeholder="U-001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Connection</h4>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><i className="ph-fill ph-wifi-high text-lg"></i></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">WSS Endpoint</p>
                                        <p className="text-[10px] text-slate-500 font-mono">wss://edge.caredigital.com</p>
                                    </div>
                                </div>
                                <div className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider border border-emerald-100">Connected</div>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><i className="ph-fill ph-watch text-lg"></i></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">NFC Wristband</p>
                                        <p className="text-[10px] text-slate-500 transition-all">{lastSyncTime}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider flex items-center gap-1.5
                                        ${isSyncing ? 'text-slate-400 bg-slate-100 border border-slate-200' : 'text-brand-600 bg-brand-50 border border-brand-100 hover:bg-brand-100 active:scale-95'}`}
                                >
                                    {isSyncing ? <i className="ph-bold ph-spinner animate-spin"></i> : <i className="ph-bold ph-arrows-clockwise"></i>}
                                    {isSyncing ? 'Syncing...' : 'Resync'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preferences</h4>
                        <div className="space-y-2">
                            <button 
                                onClick={() => updateSettings({ pushEnabled: !settings.pushEnabled })}
                                className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm hover:border-slate-300 transition-colors active:scale-[0.98]"
                            >
                                <span className="text-sm font-bold text-slate-700 flex items-center gap-3"><i className="ph-fill ph-bell text-slate-400 text-xl"></i> การแจ้งเตือน (Push)</span>
                                <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-all shadow-inner ${settings.pushEnabled ? 'bg-brand-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </button>
                            <button 
                                onClick={() => updateSettings({ language: settings.language === 'TH' ? 'EN' : 'TH' })}
                                className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm hover:border-slate-300 transition-colors active:scale-[0.98]"
                            >
                                <span className="text-sm font-bold text-slate-700 flex items-center gap-3"><i className="ph-fill ph-translate text-slate-400 text-xl"></i> ภาษา (Language)</span>
                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">{settings.language === 'TH' ? 'ไทย' : 'English'} <i className="ph-bold ph-caret-right text-slate-400"></i></span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button onClick={onClose} className="w-full py-3.5 bg-rose-50 border border-rose-100 text-rose-600 font-bold rounded-2xl flex justify-center items-center gap-2 shadow-sm hover:bg-rose-100 transition-colors active:scale-[0.98]">
                            <i className="ph-bold ph-sign-out text-lg"></i> ออกจากระบบ (Log Out)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

