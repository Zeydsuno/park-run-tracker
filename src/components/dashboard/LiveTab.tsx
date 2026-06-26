import { formatTime } from '../../utils/timeFormatters';
import { Lap } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

export const LiveTab = ({ laps, isOffline, flashId }: { laps: Lap[], isOffline: boolean, flashId: number | null }) => {
    const { settings } = useSettings();
    const isEn = settings.language === 'EN';
    const isConnected = !isOffline;

    return (
        <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[60vh] transition-all">
            <div className="text-center w-full z-10">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-8 ${isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <i className={`ph-bold ${isConnected ? 'ph-wifi-high text-emerald-500' : 'ph-wifi-slash text-amber-500'} w-3 h-3`}></i>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'text-emerald-700' : 'text-amber-700'}`}>{isConnected ? "LIVE SYNC ACTIVE" : "OFFLINE"}</span>
                </div>

                <div className={`relative w-64 h-64 mx-auto rounded-full flex flex-col items-center justify-center transition-all duration-300
                    ${flashId ? 'bg-emerald-50 scale-105 border-4 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)]' : 'bg-white border-8 border-slate-100 shadow-xl shadow-slate-200/50'}
                `}>
                    {!flashId && isConnected && (
                        <>
                            <div className="absolute inset-0 rounded-full border-2 border-brand-400/20 animate-ping"></div>
                            <div className="absolute inset-2 rounded-full border-2 border-brand-400/20 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        </>
                    )}

                    {flashId ? (
                        <div className="text-center animate-bounce">
                            <i className="ph-fill ph-medal text-emerald-500 text-3xl mb-1"></i>
                            <p className="text-emerald-700 font-extrabold text-sm uppercase tracking-widest mb-1">New PB!</p>
                            <span className="text-4xl font-extrabold text-emerald-800 tracking-tighter block leading-none">{formatTime(laps[0]?.duration)}</span>
                        </div>
                    ) : laps.length > 0 ? (
                        <div className="text-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Lap {laps[0].id}</span>
                            <span className="text-5xl font-extrabold text-slate-800 tracking-tighter block">{formatTime(laps[0].duration)}</span>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <i className="ph ph-scan text-4xl mb-2 block"></i>
                            <span className="text-xs font-semibold uppercase tracking-wider">{isEn ? 'Ready to scan' : 'Ready to scan'}</span>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    {flashId ? (
                        <div className="flex items-center justify-center gap-2">
                            <i className="ph-fill ph-check-circle text-emerald-500 text-xl"></i>
                            <h2 className="text-lg font-bold text-slate-800">{isEn ? 'Excellent! Your new PB' : 'ยอดเยี่ยมมาก สถิติใหม่ของคุณ'}</h2>
                        </div>
                    ) : isConnected ? (
                        <p className="text-sm font-medium text-brand-600 animate-pulse">{isEn ? 'Waiting for NFC data...' : 'กำลังรอรับข้อมูลจากเสา NFC...'}</p>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-amber-600">
                            <p className="text-sm font-bold flex items-center gap-1.5"><i className="ph-fill ph-check-circle"></i> {isEn ? 'Keep scanning!' : 'สแกนต่อไปได้เลย!'}</p>
                            <p className="text-[10px] font-medium opacity-80">{isEn ? 'Data is saved automatically to device (SD Card)' : 'ระบบกำลังบันทึกข้อมูลลงในตัวเครื่องอัตโนมัติ (SD Card)'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
