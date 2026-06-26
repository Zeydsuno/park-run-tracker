import { useRef, useEffect } from 'react';
import { WsPayload } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

interface SimulatorPanelProps {
    triggerNfcScan: (isCheat?: boolean, isCrowd?: boolean) => void;
    isAutoScanning: boolean;
    setIsAutoScanning: (value: boolean) => void;
    wsLogs: string[];
    setWsLogs: React.Dispatch<React.SetStateAction<string[]>>;
    isOffline: boolean;
    toggleOffline: () => void;
    triggerGhostPayload: () => void;
    triggerOutOfOrderSync: () => void;
    resetSimulator: () => void;
    lastLatency: number | null;
    triggerPeakSpike: () => void;
    offlineQueue: WsPayload[];
}

export const SimulatorPanel = ({ 
    triggerNfcScan, 
    isAutoScanning, 
    setIsAutoScanning, 
    wsLogs, 
    isOffline, 
    toggleOffline, 
    triggerGhostPayload, 
    triggerOutOfOrderSync, 
    resetSimulator,
    lastLatency,
    triggerPeakSpike,
    offlineQueue
}: SimulatorPanelProps) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const { settings, updateSettings } = useSettings();

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [wsLogs]);

    return (
        <div className="flex flex-col bg-white z-10 relative">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-20 flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                        <i className="ph-fill ph-cpu text-lg text-brand-600"></i> Chaos Engineering & NFR Validation
                    </h2>
                    <p className="text-[11px] text-slate-500">แผงจำลองสถานการณ์สุดวิสัยและทดสอบประสิทธิภาพระบบ</p>
                </div>
                <button 
                    onClick={resetSimulator}
                    className="p-1.5 bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                    title="Reset Simulator"
                >
                    <i className="ph-bold ph-arrow-counter-clockwise"></i>
                </button>
            </div>
            
            <div className="p-5 flex flex-col gap-5">
                {/* TOP ROW: NFR & Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    
                    {/* 1. Standard Controls */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">1. Standard Flow</h3>
                        <div className="space-y-2">
                            <select 
                                value={settings.eventId}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val === 101) updateSettings({ eventId: 101, eventDistance: 2.5 });
                                    if (val === 102) updateSettings({ eventId: 102, eventDistance: 1.8 });
                                }}
                                className="w-full bg-white border border-slate-300 text-slate-700 text-[11px] font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
                            >
                                <option value={101}>📍 Lumpini Park (2.5 km/lap)</option>
                                <option value={102}>📍 Benjakitti Park (1.8 km/lap)</option>
                            </select>
                            <button 
                                onClick={() => triggerNfcScan(false)}
                                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] text-xs transition-all"
                            >
                                <div className="flex items-center gap-2"><i className="ph-bold ph-hand-pointing text-base"></i> แตะ NFC ปกติ</div>
                            </button>
                            <button 
                                onClick={() => setIsAutoScanning(!isAutoScanning)}
                                className={`w-full py-2.5 px-4 font-semibold rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] text-xs transition-all
                                    ${isAutoScanning ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-800 text-white shadow-md'}`}
                            >
                                <div className="flex items-center gap-2"><i className={`ph-bold ${isAutoScanning ? 'ph-stop-circle' : 'ph-users'} text-base`}></i> {isAutoScanning ? "Stop Crowd" : "Simulate Crowd"}</div>
                            </button>
                        </div>
                    </div>

                    {/* 2. NFR-01 Offline / Zero Data Loss */}
                    <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span><i className="ph-fill ph-wifi-slash"></i> NFR-01: Zero Data Loss</span>
                            {offlineQueue.length > 0 && (
                                <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] animate-pulse">Queue: {offlineQueue.length}</span>
                            )}
                        </h3>
                        <button 
                            onClick={toggleOffline}
                            className={`w-full py-3 px-4 font-bold rounded-xl flex justify-center items-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all ${
                                isOffline ? 'bg-amber-500 text-white shadow-amber-500/30' : 'bg-white border border-amber-300 text-amber-600 hover:bg-amber-100'
                            }`}
                        >
                            <i className={`ph-bold ${isOffline ? 'ph-plugs-connected' : 'ph-wifi-slash'} text-base`}></i>
                            {isOffline ? "Reconnect & Flush" : "Drop Network (Offline)"}
                        </button>
                    </div>

                    {/* 3. NFR-02 Latency Tracker */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <i className="ph-fill ph-stopwatch"></i> NFR-02: Latency &lt; 1s
                        </h3>
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-emerald-200 shadow-sm py-2">
                            {lastLatency ? (
                                <>
                                    <div className="text-2xl font-black text-slate-800 tracking-tighter">
                                        {lastLatency}<span className="text-sm font-bold text-slate-400 ml-1">ms</span>
                                    </div>
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${lastLatency < 1000 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {lastLatency < 1000 ? 'PASSED' : 'FAILED'}
                                    </div>
                                </>
                            ) : (
                                <div className="text-xs font-semibold text-slate-400">Waiting for scan...</div>
                            )}
                        </div>
                    </div>

                    {/* 4. NFR-03 Peak Spike */}
                    <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <i className="ph-fill ph-rocket-launch"></i> NFR-03: Scalability
                        </h3>
                        <p className="text-[9px] text-purple-600/80 mb-2 leading-tight">Simulate 100 concurrent scans instantly to test DB/Queue bottlenecks.</p>
                        <button 
                            onClick={triggerPeakSpike}
                            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all"
                        >
                            <i className="ph-bold ph-lightning text-base"></i>
                            Spike 100 Scans
                        </button>
                    </div>
                </div>

                {/* BOTTOM ROW: Edge Cases & Terminal */}
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Edge Case Controls */}
                    <div className="w-full lg:w-1/3 bg-rose-50/30 p-4 rounded-2xl border border-rose-100">
                        <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><i className="ph-fill ph-warning-circle text-sm"></i> Bad Actors & Edge Cases</h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => triggerNfcScan(true)}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-[11px] transition-all"
                            >
                                <i className="ph-bold ph-scooter text-sm"></i>
                                จำลอง Fraud (วิ่งเร็วผิดปกติ)
                            </button>
                            <button 
                                onClick={triggerGhostPayload}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-[11px] transition-all"
                            >
                                <i className="ph-bold ph-ghost text-sm"></i>
                                จำลอง Ghost Payload (ข้อมูลเสีย)
                            </button>
                            <button 
                                onClick={triggerOutOfOrderSync}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-[11px] transition-all"
                            >
                                <i className="ph-bold ph-arrows-split text-sm"></i>
                                จำลอง Out-of-Order Sync
                            </button>
                        </div>
                    </div>

                    {/* Console Log output */}
                    <div className="w-full lg:w-2/3 flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800 h-[220px]">
                        <div className="bg-slate-800 px-3 py-1.5 flex justify-between items-center shrink-0 border-b border-slate-700">
                            <span className="text-[10px] font-mono text-slate-400">System Terminal</span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                        <div ref={terminalRef} className="p-3 flex-1 overflow-y-auto font-mono text-[10px] leading-relaxed break-all space-y-1.5">
                            {wsLogs.length === 0 && <p className="text-slate-500 animate-pulse">&gt; Waiting for payload...</p>}
                            {wsLogs.map((log, i) => (
                                <div key={i} className={`opacity-90 ${
                                    log.includes('⚠️') || log.includes('📴') || log.includes('🔀') ? 'text-yellow-400' : 
                                    log.includes('🚨') || log.includes('❌') || log.includes('🔌') ? 'text-rose-400 font-bold' : 
                                    log.includes('🔄') || log.includes('🚀') ? 'text-brand-400 font-bold' :
                                    log.includes('SUCCESS') ? 'text-emerald-300 font-bold' :
                                    'text-emerald-500'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
