import { formatTime, formatTimeVerbose } from '../../utils/timeFormatters';
import { Lap } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

export const LogTab = ({ laps, flashId }: { laps: Lap[], flashId: number | null }) => {
    const { settings } = useSettings();
    const isEn = settings.language === 'EN';

    if (laps.length === 0) {
        return (
            <div className="px-6 py-6 transition-all">
                <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">{isEn ? 'Run History' : 'ประวัติการวิ่ง'}</h2>
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="flex justify-center mb-3 text-slate-300">
                        <i className="ph ph-wind text-4xl"></i>
                    </div>
                    <h4 className="text-slate-700 font-bold text-sm mb-1">{isEn ? 'No run history yet' : 'ยังไม่มีประวัติการวิ่งครับ'}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{isEn ? 'Go for a run to record your first lap' : 'ออกไปวิ่งเพื่อบันทึกรอบแรกของคุณกันเลย'}</p>
                </div>
            </div>
        );
    }

    const totalDuration = laps.reduce((acc, curr) => acc + curr.duration, 0);
    const avgDuration = Math.round(totalDuration / laps.length);

    return (
        <div className="px-6 py-6 transition-all">
            <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">{isEn ? 'Run History' : 'ประวัติการวิ่ง'}</h2>
            
            {/* Session Summary Board */}
            <div className="bg-slate-800 rounded-2xl p-5 mb-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                    <i className="ph-fill ph-sneaker text-7xl"></i>
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isEn ? 'Total Time' : 'เวลารวม (Total Time)'}</p>
                    <p className="text-2xl font-extrabold tracking-tight">{formatTime(totalDuration)}</p>
                </div>
                <div className="h-10 w-px bg-slate-600 relative z-10"></div>
                <div className="text-right relative z-10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{isEn ? 'Avg Pace' : 'เฉลี่ย/รอบ (Avg Pace)'}</p>
                    <p className="text-2xl font-extrabold tracking-tight text-emerald-400">{formatTime(avgDuration)}</p>
                </div>
            </div>

            <div className="space-y-3">
                {laps.slice(0, 50).map((lap) => {
                    const prevLap = laps.find(l => l.id === lap.id - 1);
                    const diff = prevLap ? lap.duration - prevLap.duration : 0;

                    return (
                        <div key={lap.id} className={`bg-white p-4 rounded-2xl border ${flashId === lap.id ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'border-slate-200 shadow-sm hover:border-slate-300'} flex justify-between items-center transition-all`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[9px] text-slate-400 font-bold leading-none mb-1 uppercase tracking-wider">Lap</span>
                                    <span className="text-lg text-slate-800 font-extrabold leading-none">{lap.id}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg tracking-tight leading-none mb-1.5">{formatTimeVerbose(lap.duration, isEn)}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-slate-500 font-medium">{isEn ? `At ${lap.timestamp}` : `เมื่อ ${lap.timestamp} น.`}</p>
                                        {prevLap && (
                                            <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${diff < 0 ? 'bg-emerald-50 text-emerald-600' : diff > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <i className={`ph-bold ${diff < 0 ? 'ph-trend-down' : diff > 0 ? 'ph-trend-up' : 'ph-minus'}`}></i>
                                                {diff === 0 ? '-' : `${Math.abs(diff)}s`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {lap.isPb && (
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-200 shadow-sm shrink-0 uppercase tracking-wide">
                                    <i className="ph-fill ph-medal text-sm"></i> PB
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
