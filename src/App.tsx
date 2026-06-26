import { useState, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import { useSettings } from './contexts/SettingsContext';
import { useNfcSimulator } from './hooks/useNfcSimulator';
import { LiveTab } from './components/dashboard/LiveTab';
import { LogTab } from './components/dashboard/LogTab';
import { SettingsModal } from './components/shared/SettingsModal';

const SimulatorPanel = lazy(() => import('./components/simulator/SimulatorPanel').then(module => ({ default: module.SimulatorPanel })));
const DashboardTab = lazy(() => import('./components/dashboard/DashboardTab').then(module => ({ default: module.DashboardTab })));
const DocumentationPanel = lazy(() => import('./components/documentation/DocumentationPanel').then(module => ({ default: module.DocumentationPanel })));

export default function App() {
    const { 
        laps, 
        isAutoScanning, 
        setIsAutoScanning, 
        wsLogs, 
        setWsLogs, 
        triggerNfcScan, 
        isOffline, 
        toggleOffline, 
        triggerGhostPayload,
        triggerOutOfOrderSync,
        resetSimulator,
        lastLatency,
        triggerPeakSpike,
        offlineQueue
    } = useNfcSimulator();
    
    const { settings } = useSettings();

    const sortedLaps = useMemo(() => {
        return [...laps].sort((a, b) => b.id - a.id);
    }, [laps]);

    const [activeTab, setActiveTab] = useState<'dashboard' | 'live' | 'log'>('dashboard');
    const [adminTab, setAdminTab] = useState<'simulator' | 'docs'>('simulator');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [flashId, setFlashId] = useState<number | null>(null);
    const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const personalBest = useMemo(() => sortedLaps.length > 0 ? Math.min(...sortedLaps.map(l => l.duration)) : null, [sortedLaps]);

    useEffect(() => {
        if (sortedLaps.length === 0) return;
        const latestLap = sortedLaps[0]; // Guaranteed to be the highest ID now
        
        if (settings.pushEnabled && (latestLap.isPb || sortedLaps.length === 1)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFlashId(latestLap.id);
            if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
            flashTimeoutRef.current = setTimeout(() => setFlashId(null), 2500);
        }

        return () => {
            if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        };
    }, [sortedLaps, settings.pushEnabled]);

    const handleManualScan = (isCheat = false) => {
        triggerNfcScan(isCheat);
        if (activeTab !== 'live' && !isCheat && !isOffline) setActiveTab('live');
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 overflow-hidden font-sans">
            <header className="bg-white border-b border-slate-200 px-6 py-4 hidden lg:flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                        <i className="ph ph-cpu text-slate-700 text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none mb-0.5">Admin Console</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner mr-4">
                    <button 
                        onClick={() => setAdminTab('simulator')}
                        className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${adminTab === 'simulator' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <i className="ph-bold ph-sliders"></i> Simulator
                    </button>
                    <button 
                        onClick={() => setAdminTab('docs')}
                        className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${adminTab === 'docs' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <i className="ph-bold ph-file-text"></i> Documentation
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Role</p>
                        <p className="text-xs font-bold text-slate-700">System Admin</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=ffffff&rounded=true" alt="Admin" className="w-9 h-9 rounded-full border border-slate-200 shadow-sm" />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden bg-slate-200/50">
                {adminTab === 'simulator' ? (
                    <div className="w-full flex flex-col bg-white border-t border-slate-200 overflow-y-auto">
                        <div className="hidden lg:flex w-full bg-slate-50 border-b border-slate-200 shrink-0 z-10 shadow-[0_5px_15px_rgba(0,0,0,0.03)] flex-col">
                            <Suspense fallback={<div className="h-[250px] flex items-center justify-center text-slate-400 text-sm font-bold animate-pulse"><i className="ph-bold ph-spinner animate-spin mr-2"></i>Loading Simulator Engine...</div>}>
                                <SimulatorPanel 
                                    triggerNfcScan={handleManualScan} 
                                    isAutoScanning={isAutoScanning} 
                                    setIsAutoScanning={setIsAutoScanning} 
                                    wsLogs={wsLogs} 
                                    setWsLogs={setWsLogs}
                                    isOffline={isOffline}
                                    toggleOffline={toggleOffline}
                                    triggerGhostPayload={triggerGhostPayload}
                                    triggerOutOfOrderSync={triggerOutOfOrderSync}
                                    resetSimulator={resetSimulator}
                                    lastLatency={lastLatency}
                                    triggerPeakSpike={triggerPeakSpike}
                                    offlineQueue={offlineQueue}
                                />
                            </Suspense>
                        </div>

                        <div className="flex-1 flex justify-center relative lg:bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] lg:[background-size:20px_20px] bg-white lg:bg-slate-50 lg:py-12 shrink-0 min-h-[900px]">
                            <div className="w-full h-[100dvh] lg:max-w-[390px] lg:h-[844px] bg-white lg:shadow-[0_20px_50px_rgba(0,0,0,0.15)] lg:rounded-[48px] overflow-hidden lg:border-[12px] lg:border-slate-900 relative flex flex-col shrink-0 lg:ring-4 lg:ring-slate-200">

                        <div className="hidden lg:block w-32 h-7 bg-slate-900 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-3xl z-50"></div>
                        
                        {/* Offline App Banner */}
                        {isOffline && (
                            <div className="absolute top-12 left-0 w-full bg-amber-500 text-white text-[10px] font-bold text-center py-1 z-40 flex items-center justify-center gap-1">
                                <i className="ph-bold ph-wifi-slash"></i> Offline - Syncing Paused
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar transition-opacity duration-300">
                            <div className="px-6 pt-14 pb-4 flex justify-between items-center bg-slate-50 sticky top-0 z-40 bg-opacity-90 backdrop-blur-md border-b border-slate-200/50">
                                <div className="flex items-center gap-3">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(settings.runnerName)}&background=e44c70&color=ffffff&rounded=true`} alt="User" className="w-10 h-10 rounded-full shadow-sm border-2 border-white" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Park Run</p>
                                        <h1 className="text-sm font-bold text-slate-800 tracking-tight">{settings.runnerName}</h1>
                                    </div>
                                </div>
                                <div onClick={() => setIsSettingsOpen(true)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 active:scale-95 transition-all">
                                    <i className="ph-fill ph-gear text-lg"></i>
                                </div>
                            </div>

                            {activeTab === 'dashboard' && (
                                <Suspense fallback={<div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs font-bold mt-20"><i className="ph-bold ph-spinner animate-spin text-2xl mb-2 text-brand-400"></i>Rendering Analytics...</div>}>
                                    <DashboardTab laps={sortedLaps} personalBest={personalBest} />
                                </Suspense>
                            )}
                            {activeTab === 'live' && <LiveTab laps={sortedLaps} isOffline={isOffline} flashId={flashId} />}
                            {activeTab === 'log' && <LogTab laps={sortedLaps} flashId={flashId} />}
                        </div>

                        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 pb-6 pt-3 px-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50 rounded-b-[36px]">
                            <div className="flex justify-between items-center relative">
                                <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'dashboard' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <i className={`${activeTab === 'dashboard' ? 'ph-fill' : 'ph'} ph-house text-2xl`}></i>
                                    <span className="text-[10px] font-semibold tracking-wide">{settings.language === 'TH' ? 'ภาพรวม' : 'Overview'}</span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('live')}
                                    className="relative -top-6 w-16 h-16 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 shadow-lg shadow-brand-500/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                                >
                                    <i className={`${activeTab === 'live' ? 'ph-fill' : 'ph'} ph-crosshair text-3xl relative z-10`}></i>
                                    {!isOffline && <div className="absolute inset-0 rounded-full border-[3px] border-white/30 border-t-white opacity-50"></div>}
                                </button>
                                <button onClick={() => setActiveTab('log')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'log' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <i className={`${activeTab === 'log' ? 'ph-fill' : 'ph'} ph-list-dashes text-2xl`}></i>
                                    <span className="text-[10px] font-semibold tracking-wide">{settings.language === 'TH' ? 'ประวัติ' : 'History'}</span>
                                </button>
                            </div>
                        </div>

                        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-12">
                        <div className="w-full max-w-[1200px] bg-white shadow-xl rounded-[40px] border border-slate-200 overflow-hidden flex flex-col h-fit min-h-[800px]">
                            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold bg-white"><i className="ph-bold ph-spinner animate-spin mr-2"></i>Loading Documentation...</div>}>
                                <DocumentationPanel />
                            </Suspense>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
