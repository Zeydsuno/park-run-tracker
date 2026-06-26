import { useRef, useEffect } from 'react';

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
}

export const SimulatorPanel = ({ triggerNfcScan, isAutoScanning, setIsAutoScanning, wsLogs, setWsLogs, isOffline, toggleOffline, triggerGhostPayload, triggerOutOfOrderSync, resetSimulator }: SimulatorPanelProps) => {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [wsLogs]);

    return (
        <div className="flex flex-col bg-white z-10 relative">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-20 flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                        <i className="ph-fill ph-cpu text-lg text-brand-600"></i> Chaos Engineering
                    </h2>
                    <p className="text-[11px] text-slate-500">แผงจำลองสถานการณ์สุดวิสัยและบั๊ก</p>
                </div>
                <button 
                    onClick={resetSimulator}
                    className="p-1.5 bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                    title="Reset Simulator"
                >
                    <i className="ph-bold ph-arrow-counter-clockwise"></i>
                </button>
            </div>
            
            <div className="p-5 flex flex-wrap lg:flex-nowrap gap-5">
                {/* Standard Controls */}
                <div className="w-full lg:w-1/4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">1. Standard Controls (Happy Path)</h3>
                    <div className="space-y-2">
                        <button 
                            onClick={() => triggerNfcScan(false)}
                            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] text-xs transition-all"
                        >
                            <div className="flex items-center gap-2"><i className="ph-bold ph-hand-pointing text-base"></i> จำลองการสแกนปกติ</div>
                            <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">Tap 2x for Spammer</span>
                        </button>
                        <button 
                            onClick={() => setIsAutoScanning(!isAutoScanning)}
                            className={`w-full py-2.5 px-4 font-semibold rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] text-xs transition-all
                                ${isAutoScanning ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-800 text-white shadow-md'}`}
                        >
                            <div className="flex items-center gap-2"><i className={`ph-bold ${isAutoScanning ? 'ph-stop-circle' : 'ph-users'} text-base`}></i> {isAutoScanning ? "หยุด Simulate Crowd" : "Simulate Crowd (นักวิ่งคนอื่น)"}</div>
                        </button>
                    </div>
                </div>

                {/* Edge Case Controls */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 h-full">
                        <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><i className="ph-fill ph-warning-circle text-sm"></i> 2. Edge Case Injectors</h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => triggerNfcScan(true)}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all"
                            >
                                <i className="ph-bold ph-scooter text-lg"></i>
                                จำลอง Fraud (วิ่ง 12 วิ / Anomaly)
                            </button>

                            <button 
                                onClick={triggerGhostPayload}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all"
                            >
                                <i className="ph-bold ph-ghost text-lg"></i>
                                จำลอง Ghost Payload (ข้อมูลแหว่ง)
                            </button>
                            
                            <button 
                                onClick={triggerOutOfOrderSync}
                                className="w-full py-2 px-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium rounded-lg flex items-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all"
                            >
                                <i className="ph-bold ph-arrows-split text-lg"></i>
                                จำลอง Out-of-Order Sync (สลับลำดับ)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offline & Queue Simulation */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 h-full">
                        <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><i className="ph-fill ph-wifi-slash text-sm"></i> 3. Network Chaos (Offline)</h3>
                        <button 
                            onClick={toggleOffline}
                            className={`w-full py-2.5 px-4 font-bold rounded-xl flex justify-center items-center gap-2 shadow-sm active:scale-[0.98] text-xs transition-all ${
                                isOffline ? 'bg-amber-500 text-white shadow-amber-500/30' : 'bg-white border border-amber-300 text-amber-600 hover:bg-amber-100'
                            }`}
                        >
                            <i className={`ph-bold ${isOffline ? 'ph-plugs-connected' : 'ph-wifi-slash'} text-base`}></i>
                            {isOffline ? "Reconnect & Flush Data" : "Disconnect Network (Drop Signal)"}
                        </button>
                    </div>
                </div>

                {/* Console Log output */}
                <div className="w-full lg:w-1/4 flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800 h-[250px]">
                    <div className="bg-slate-800 px-3 py-1.5 flex justify-between items-center shrink-0 border-b border-slate-700">
                        <span className="text-[10px] font-mono text-slate-400">Terminal Output</span>
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
                                log.includes('🔄') ? 'text-brand-400 font-bold' :
                                'text-emerald-400'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
