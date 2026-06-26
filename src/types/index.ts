export interface Lap {
    id: number;
    duration: number; // in seconds
    isPb: boolean;
    timestamp: string;
}

export interface WsPayload {
    event: string;
    data: {
        runner_id: string;
        lap_count: number;
        duration_sec: number;
        is_pb: boolean;
        timestamp: string;
    };
}

export interface StatCardProps {
    icon: string;
    color: string;
    label: string;
    value: string | number;
    unit?: string;
}
