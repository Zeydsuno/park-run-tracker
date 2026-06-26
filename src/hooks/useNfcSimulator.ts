import { useState, useEffect, useRef, useMemo } from 'react';
import { Lap, WsPayload } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export function useNfcSimulator() {
    const { settings } = useSettings();
    const TARGET_USER_ID = settings.runnerId;
    const [laps, setLaps] = useState<Lap[]>([]);
    const [isAutoScanning, setIsAutoScanning] = useState(false);
    const [wsLogs, setWsLogs] = useState<string[]>([]);
    const [isOffline, setIsOffline] = useState(false);
    const lastScanTimeRef = useRef<number>(0);
    const offlineQueueRef = useRef<WsPayload[]>([]);

    const currentPb = useMemo(() => laps.length > 0 ? Math.min(...laps.map(l => l.duration)) : Infinity, [laps]);

    const channelRef = useRef<BroadcastChannel | null>(null);
    const ignoreNextSyncRef = useRef(false);

    useEffect(() => {
        const channel = new BroadcastChannel('parkrun-sync');
        channelRef.current = channel;
        channel.onmessage = (event) => {
            if (event.data.type === 'SYNC_STATE') {
                ignoreNextSyncRef.current = true;
                setLaps(event.data.laps);
                setWsLogs(event.data.wsLogs);
                setIsAutoScanning(event.data.isAutoScanning);
                setIsOffline(event.data.isOffline);
            }
        };
        return () => channel.close();
    }, []);

    useEffect(() => {
        if (ignoreNextSyncRef.current) {
            ignoreNextSyncRef.current = false;
            return;
        }
        channelRef.current?.postMessage({ type: 'SYNC_STATE', laps, wsLogs, isAutoScanning, isOffline });
    }, [laps, wsLogs, isAutoScanning, isOffline]);

    const triggerNfcScan = (isCheat = false, isCrowd = false) => {
        const now = Date.now();
        const timeSinceLastScan = now - lastScanTimeRef.current;

        if (timeSinceLastScan < 2000 && !isCheat && !isCrowd) {
            setWsLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [WARN] WSS DROP: Rate limit exceeded`]);
            return;
        }
        if (!isCrowd) lastScanTimeRef.current = now;

        const runner_id = isCrowd ? `U-${Math.floor(Math.random() * 900) + 100}` : TARGET_USER_ID;
        let duration_sec = Math.floor(Math.random() * 90) + 270; 
        if (isCheat) duration_sec = 12; // 12 seconds = scooter fraud

        const timestamp = new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        if (duration_sec < 120 && !isCrowd) {
            setWsLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [ERROR] ANOMALY DROP: Invalid lap duration ${duration_sec}s`]);
            return;
        }

        const is_pb = duration_sec < currentPb;
        const mockPayload: WsPayload = { event: "LAP_COMPLETED", data: { runner_id, lap_count: laps.length + 1, duration_sec, is_pb, timestamp } };
        
        if (isOffline) {
            offlineQueueRef.current.push(mockPayload);
            setWsLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [OFFLINE] Saved to local queue: ${runner_id}`]);
        } else {
            setWsLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [INFO] WSS: ${JSON.stringify(mockPayload)}`]);
            
            if (runner_id === TARGET_USER_ID) {
                const lap_no = laps.length + 1;
                setLaps(prev => [{ id: lap_no, duration: duration_sec, isPb: is_pb, timestamp }, ...prev]);
            }
        }
    };

    // Toggle Network Status
    const toggleOffline = () => {
        setIsOffline(prev => {
            const willBeOffline = !prev;
            if (!willBeOffline) {
                if (offlineQueueRef.current.length > 0) {
                    const queue = [...offlineQueueRef.current];
                    setWsLogs(ws => [...ws, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [INFO] RECONNECT: Flushing ${queue.length} items from queue...`]);
                    
                    const myLaps = queue
                        .filter(p => p.data.runner_id === TARGET_USER_ID)
                        .map((p: WsPayload, index: number) => ({
                            id: laps.length + index + 1,
                            duration: p.data.duration_sec,
                            isPb: p.data.is_pb,
                            timestamp: p.data.timestamp
                        }));

                    if (myLaps.length > 0) {
                        setLaps(currentLaps => [...myLaps.reverse(), ...currentLaps]);
                    }
                    offlineQueueRef.current = [];
                } else {
                    setWsLogs(ws => [...ws, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [INFO] SYSTEM ONLINE`]);
                }
            } else {
                setWsLogs(ws => [...ws, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [INFO] SYSTEM OFFLINE: Queue enabled`]);
            }
            return willBeOffline;
        });
    };

    const triggerGhostPayload = () => {
        setWsLogs(prev => [
            ...prev, 
            `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [INFO] WSS: {"event":"LAP_COMPLETED","data":{"corrupted":true}}`,
            `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [ERROR] SCHEMA VALIDATION: Missing required fields. Payload dropped.`
        ]);
    };

    const triggerOutOfOrderSync = () => {
        const lap_no_6 = laps.length + 1;
        const lap_no_5 = laps.length + 2; 
        
        const timestamp6 = new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        const timestamp5 = new Date(Date.now() - 5000).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        const lap6 = { id: lap_no_6, duration: 300, isPb: false, timestamp: timestamp6 };
        const lap5 = { id: lap_no_5, duration: 310, isPb: false, timestamp: timestamp5 };

        setWsLogs(prev => [
            ...prev, 
            `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] [WARN] OUT OF ORDER SYNC: Received Lap ${lap_no_5} after Lap ${lap_no_6}`
        ]);

        setLaps(prev => [lap5, lap6, ...prev]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isAutoScanning) return;
        const timer = setInterval(() => triggerNfcScan(false, true), 1500); 
        return () => clearInterval(timer);
    }, [isAutoScanning, isOffline, TARGET_USER_ID]);

    const resetSimulator = () => {
        setLaps([]);
        setWsLogs([]);
        offlineQueueRef.current = [];
    };

    return { laps, isAutoScanning, setIsAutoScanning, wsLogs, setWsLogs, triggerNfcScan, isOffline, toggleOffline, triggerGhostPayload, triggerOutOfOrderSync, resetSimulator };
}
