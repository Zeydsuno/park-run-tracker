import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatTime } from '../../utils/timeFormatters';
import { StatCard } from './StatCard';
import { Lap } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 font-normal mb-1">{payload[0].payload.timestamp}</div>
                {`Lap ${payload[0].payload.id}: ${formatTime(payload[0].value as number)}`}
            </div>
        );
    }
    return null;
};

export const DashboardTab = ({ laps, personalBest }: { laps: Lap[], personalBest: number | null }) => {
    const { settings } = useSettings();
    const isEn = settings.language === 'EN';

    const totalDistance = (laps.length * 2.5).toFixed(1);
    const calories = laps.length * 150;
    
    // Format chartData for Recharts (Get the latest 7 laps)
    const chartData = laps.slice(-7).map(lap => ({
        ...lap,
        name: `L${lap.id}`,
        isBest: lap.duration === personalBest
    }));

    return (
        <div className="px-6 py-6 transition-all">
            <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">{isEn ? 'Progress Overview' : 'ภาพรวมความก้าวหน้า'}</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
                <StatCard icon="ph-map-pin" color="text-brand-500" label={isEn ? "Distance" : "ระยะทาง"} value={totalDistance} unit="km" />
                <StatCard icon="ph-trophy" color="text-emerald-500" label={isEn ? "Best Time" : "สถิติดีสุด"} value={formatTime(personalBest)} unit="/lap" />
                <StatCard icon="ph-fire" color="text-orange-500" label={isEn ? "Calories" : "แคลอรี่"} value={calories} unit="kcal" />
                <StatCard icon="ph-arrows-clockwise" color="text-slate-500" label={isEn ? "Total Laps" : "รอบวิ่ง"} value={laps.length} unit="laps" />
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/60 mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{isEn ? 'Recent Pace (7 Laps)' : 'สถิติความเร็วล่าสุด (7 รอบ)'}</h3>
                {laps.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                        <i className="ph ph-chart-bar text-3xl mb-2"></i>
                        <p className="text-xs font-medium">{isEn ? 'No data available' : 'ยังไม่มีข้อมูลให้แสดงผล'}</p>
                    </div>
                ) : (
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 15, right: 0, left: -20, bottom: 0 }}>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                                    tickFormatter={(val) => formatTime(val)}
                                />
                                <Tooltip cursor={{ fill: '#f1f5f9', radius: 6 }} content={<CustomTooltip />} />
                                <Bar dataKey="duration" radius={[6, 6, 6, 6]} barSize={32}>
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.isBest ? '#e44c70' : '#e2e8f0'} 
                                        />
                                    ))}
                                </Bar>
                                <Line 
                                    type="monotone" 
                                    dataKey="duration" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2} 
                                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                                    activeDot={{ r: 5 }} 
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};
