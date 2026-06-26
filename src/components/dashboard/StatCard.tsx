import { StatCardProps } from '../../types';

export const StatCard = ({ icon, color, label, value, unit }: StatCardProps) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-1.5 text-slate-500 mb-2">
            <i className={`ph-fill ${icon} ${color}`}></i>
            <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800">{value}</span>
            <span className="text-sm font-medium text-slate-500">{unit}</span>
        </div>
    </div>
);
