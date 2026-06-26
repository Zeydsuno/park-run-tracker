export const formatTime = (s: number | null | undefined): string => !s ? '--:--' : `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
export const formatTimeVerbose = (s: number | null | undefined, isEn: boolean = false): string => !s ? '--' : `${Math.floor(s / 60)} ${isEn ? 'min' : 'นาที'} ${s % 60} ${isEn ? 'sec' : 'วินาที'}`;
