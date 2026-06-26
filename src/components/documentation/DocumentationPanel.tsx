import { useState } from 'react';
import { ActivityDiagram } from './ActivityDiagram';
import { UseCaseDiagram } from './UseCaseDiagram';
import { DatabaseSchema } from './DatabaseSchema';

type NodeId = 'ui' | 'react' | 'ws' | 'mqtt' | 'lambda' | 'nfc' | 'redis' | 'pg' | 'edge' | null;

interface ArchNode {
    id: NodeId;
    layer: 'presentation' | 'application' | 'data';
    icon: string;
    title: string;
    subtitle: string;
    desc: string;
    techStack: string;
    dataIn: string;
    dataOut: string;
    color: string;
    iconColor: string;
}

const nodes: ArchNode[] = [
    // === PRESENTATION TIER (Frontend) ===
    {
        id: 'ui', layer: 'presentation',
        icon: 'ph-device-mobile', title: 'Mobile UI',
        subtitle: '3 แท็บ: Dashboard / Live / History',
        desc: 'หน้าจอมือถือของนักวิ่ง แบ่งเป็น 3 แท็บ: Dashboard (ภาพรวม + กราฟ), Live (วงกลมรอสแกน + ฉลอง PB), History (ประวัติ + เวลาเฉลี่ย) ใช้ Phosphor Icons + สีแบรนด์ Care Digital (#e44c70)',
        techStack: 'Tailwind CSS + Recharts + Phosphor Icons',
        dataIn: 'React State (laps, settings)',
        dataOut: 'Pixel บนหน้าจอ!',
        color: 'border-brand-400 bg-brand-50', iconColor: 'text-brand-600'
    },
    {
        id: 'react', layer: 'presentation',
        icon: 'ph-atom', title: 'React State',
        subtitle: 'Optimistic UI Engine',
        desc: 'รับข้อมูลจาก WebSocket มาอัปเดต State ทันที (Optimistic Update) โดยไม่ต้องรอ Confirm จาก Server จัดเรียง Lap ตาม ID อัตโนมัติ (Out-of-order sorting) และเทียบ Personal Best เพื่อสั่งกระพริบหน้าจอฉลอง',
        techStack: 'React 19 + useMemo + useEffect',
        dataIn: 'WebSocket Lap Event',
        dataOut: 'sortedLaps, personalBest, flashId',
        color: 'border-cyan-400 bg-cyan-50', iconColor: 'text-cyan-500'
    },
    {
        id: 'ws', layer: 'presentation',
        icon: 'ph-broadcast', title: 'WebSocket Client',
        subtitle: 'Real-time Push Receiver',
        desc: 'ช่องทางรับข้อมูลแบบ "ดันเข้ามา (Push)" ไม่ใช่แบบ "ถาม (Poll)" ทำให้แอปมือถือได้รับข้อมูลรอบวิ่งใหม่ทันทีภายใน < 1 วินาที โดยไม่ต้องกดรีเฟรช',
        techStack: 'Socket.io Client (Production) / BroadcastChannel (Prototype)',
        dataIn: 'Push Event จาก Backend',
        dataOut: 'Lap Data → React State',
        color: 'border-emerald-400 bg-emerald-50', iconColor: 'text-emerald-500'
    },
    // === APPLICATION TIER (Backend) ===
    {
        id: 'mqtt', layer: 'application',
        icon: 'ph-queue', title: 'Message Queue',
        subtitle: 'MQTT / Apache Kafka',
        desc: 'ทำหน้าที่เป็น "บัฟเฟอร์" กันเซิร์ฟเวอร์ล่ม รับ Payload จากเสา NFC ทุกต้นมาเข้าคิว แล้วค่อยๆ ปล่อยทีละตัวให้ Backend ประมวลผล ป้องกัน Data Flood ช่วงเช้าวันอาทิตย์ที่มีคนสแกน 500+ คนพร้อมกัน',
        techStack: 'Apache Kafka (Production) / BroadcastChannel (Prototype)',
        dataIn: 'JSON { runner_id, timestamp }',
        dataOut: 'Ordered Event Stream',
        color: 'border-blue-400 bg-blue-50', iconColor: 'text-blue-500'
    },
    {
        id: 'lambda', layer: 'application',
        icon: 'ph-lightning', title: 'Lap Engine',
        subtitle: 'Node.js / AWS Lambda',
        desc: 'หัวใจของระบบ! รับข้อมูลจากคิวมาทำ 3 อย่าง: (1) Validate ข้อมูลขยะ — ดักสแกนรัว, ขี่สกู๊ตเตอร์, Payload เน่า (2) คำนวณ Lap Duration = timestamp ปัจจุบัน − timestamp รอบก่อนหน้า (3) เช็คว่าเร็วกว่าสถิติเดิมไหม → ถ้าใช่ ตั้ง is_pb = true',
        techStack: 'Node.js + AWS Lambda (Production) / useNfcSimulator Hook (Prototype)',
        dataIn: 'Raw Event จาก Queue',
        dataOut: '{ runner_id, lap_count, duration_sec, is_pb }',
        color: 'border-amber-400 bg-amber-50', iconColor: 'text-amber-500'
    },
    {
        id: 'nfc', layer: 'application',
        icon: 'ph-contactless-payment', title: 'NFC Gateway',
        subtitle: 'IoT Ingestion API',
        desc: 'จุดรับข้อมูลจากเสาสแกน NFC (ESP32) ในสนาม ทำหน้าที่แปลง Hardware Signal เป็น JSON Payload แล้วส่งเข้า Message Queue พร้อมจัดการ Offline Fallback เก็บข้อมูลลง SD Card เมื่อเน็ตหลุด',
        techStack: 'ESP32 + PN532 NFC + MQTT Client',
        dataIn: 'RFID UID (จากริสแบนด์)',
        dataOut: 'JSON { runner_id, timestamp }',
        color: 'border-orange-400 bg-orange-50', iconColor: 'text-orange-500'
    },
    // === DATA TIER (Database) ===
    {
        id: 'redis', layer: 'data',
        icon: 'ph-rocket-launch', title: 'Redis Cache',
        subtitle: 'Live State / Leaderboard',
        desc: 'เก็บ "สถานะล่าสุด" ของนักวิ่งแต่ละคน เช่น Timestamp สแกนรอบก่อนหน้า และ Personal Best ปัจจุบัน เพื่อให้ Lap Engine คำนวณเวลาได้ทันทีโดยไม่ต้องไปดึง Database (Sub-millisecond read)',
        techStack: 'Redis Sorted Set (Production) / React useState (Prototype)',
        dataIn: 'Lap result จาก Engine',
        dataOut: 'Last timestamp + PB record',
        color: 'border-purple-400 bg-purple-50', iconColor: 'text-purple-500'
    },
    {
        id: 'pg', layer: 'data',
        icon: 'ph-hard-drives', title: 'PostgreSQL',
        subtitle: 'Master Database',
        desc: 'บันทึกถาวร (Persistent Storage) สำหรับประวัติการวิ่งทั้งหมด ใช้สำหรับสร้างรายงานย้อนหลัง, ดูสถิติรายเดือน, และ Export ข้อมูลให้ผู้จัดงาน Event',
        techStack: 'PostgreSQL + Async Write (Production) / In-memory Array (Prototype)',
        dataIn: 'Processed Lap Record',
        dataOut: 'Historical queries / Reports',
        color: 'border-blue-400 bg-blue-50', iconColor: 'text-blue-600'
    },
    {
        id: 'edge', layer: 'data',
        icon: 'ph-hard-drive', title: 'Edge Storage',
        subtitle: 'SD Card / Offline Queue',
        desc: 'เมื่ออินเทอร์เน็ตหลุด ข้อมูลจะถูกเก็บไว้ในตัวเครื่อง (SD Card) เป็นคิวสำรอง เมื่อเน็ตกลับมาจะ Flush ส่งข้อมูลทั้งหมดออกไปอัตโนมัติ (Zero Data Loss)',
        techStack: 'MicroSD + Auto-Retry Logic',
        dataIn: 'JSON Payload (ถ้าส่งไม่ได้)',
        dataOut: 'Batch Flush เมื่อออนไลน์',
        color: 'border-orange-400 bg-orange-50', iconColor: 'text-orange-500'
    },
];

// Define connections between nodes with labels
const connections: { from: NodeId; to: NodeId; label: string; protocol: string }[] = [
    { from: 'ws', to: 'react', label: 'Push ข้อมูลรอบวิ่งใหม่', protocol: 'onMessage' },
    { from: 'react', to: 'ui', label: 'Re-render UI อัตโนมัติ', protocol: 'setState → JSX' },
    { from: 'lambda', to: 'ws', label: 'ส่งผลลัพธ์ไปยังมือถือ', protocol: 'WS Emit' },
    { from: 'nfc', to: 'mqtt', label: 'ส่ง JSON ผ่าน WiFi/4G', protocol: 'MQTT Publish' },
    { from: 'mqtt', to: 'lambda', label: 'Deliver Event ทีละตัว', protocol: 'Consumer Group' },
    { from: 'nfc', to: 'edge', label: 'Fallback เมื่อเน็ตหลุด', protocol: 'Serial/SPI' },
    { from: 'lambda', to: 'redis', label: 'อ่าน/เขียน State ล่าสุด', protocol: 'GET/SET' },
    { from: 'lambda', to: 'pg', label: 'บันทึกถาวร (Async)', protocol: 'INSERT' },
    { from: 'edge', to: 'mqtt', label: 'Batch Flush เมื่อออนไลน์', protocol: 'MQTT Publish' },
];

export const DocumentationPanel = () => {
    const [activeNode, setActiveNode] = useState<NodeId>(null);
    const [activeLayer, setActiveLayer] = useState<'presentation' | 'application' | 'data' | null>(null);
    const [diagramTab, setDiagramTab] = useState<'activity' | 'usecase' | 'db'>('activity');

    const activeNodeData = nodes.find(n => n.id === activeNode);
    const activeConnections = connections.filter(c => c.from === activeNode || c.to === activeNode);

    const layerMeta = {
        presentation: { label: 'Tier 1 — Presentation (Frontend)', color: 'border-brand-300 bg-gradient-to-r from-brand-50 to-cyan-50', labelColor: 'text-brand-700 bg-brand-100 border-brand-200', desc: 'Mobile App — UI Components + React State + WebSocket Client' },
        application: { label: 'Tier 2 — Application (Backend)', color: 'border-blue-300 bg-gradient-to-r from-blue-50 to-amber-50', labelColor: 'text-blue-700 bg-blue-100 border-blue-200', desc: 'Business Logic — Message Queue + Lap Engine + NFC Gateway' },
        data: { label: 'Tier 3 — Data (Database)', color: 'border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50', labelColor: 'text-purple-700 bg-purple-100 border-purple-200', desc: 'Persistence — Redis Cache + PostgreSQL + Edge Storage (Offline)' },
    };

    const renderNode = (node: ArchNode) => {
        const isActive = activeNode === node.id;
        const isDimmed = activeNode && activeNode !== node.id && !activeConnections.some(c => c.from === node.id || c.to === node.id);
        
        return (
            <div
                key={node.id}
                onMouseEnter={() => { setActiveNode(node.id); setActiveLayer(node.layer); }}
                className={`relative p-4 rounded-2xl border-2 shadow-sm cursor-pointer transition-all duration-300 min-w-[140px]
                    ${isActive ? `${node.color} scale-105 ring-4 ring-offset-2 ring-offset-white shadow-lg` : ''}
                    ${isDimmed ? 'opacity-25 scale-95 bg-white border-slate-100' : ''}
                    ${!isActive && !isDimmed ? `bg-white border-slate-200 hover:${node.color} hover:shadow-md` : ''}
                `}
                style={isActive ? { ringColor: node.color } : {}}
            >
                {activeNode && activeConnections.some(c => c.to === node.id) && !isActive && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-500 animate-ping"></div>
                )}
                <div className="text-center">
                    <i className={`ph-fill ${node.icon} text-3xl mb-2 ${isActive ? node.iconColor : isDimmed ? 'text-slate-300' : 'text-slate-500'} transition-colors`}></i>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider leading-tight">{node.title}</h4>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5 leading-tight">{node.subtitle}</p>
                </div>
            </div>
        );
    };

    const renderArrow = (direction: 'right' | 'down' = 'right', highlight: boolean = false) => (
        <div className={`flex items-center justify-center shrink-0 transition-all duration-300 ${highlight ? 'opacity-100 scale-110' : activeNode ? 'opacity-20' : 'opacity-40'}`}>
            <i className={`ph-bold ${direction === 'right' ? 'ph-arrow-right' : 'ph-arrow-down'} text-xl ${highlight ? 'text-brand-500' : 'text-slate-300'}`}></i>
        </div>
    );

    const presentationNodes = nodes.filter(n => n.layer === 'presentation');
    const applicationNodes = nodes.filter(n => n.layer === 'application');
    const dataNodes = nodes.filter(n => n.layer === 'data');

    return (
        <div className="flex h-full" onMouseLeave={() => { setActiveNode(null); setActiveLayer(null); }}>
            {/* LEFT: Scrollable Diagram */}
            <div className="flex-1 overflow-y-auto p-10 space-y-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-1">3-Tier System Architecture</h2>
                    <p className="text-slate-500 text-sm mb-6">ชี้เมาส์ที่แต่ละ Node เพื่อดู Data Flow และ Tech Stack ทางด้านขวา (ตาม SRS Section 5)</p>
                </div>

                {/* === TIER 1: PRESENTATION (FE) === */}
                <div className={`rounded-3xl border-2 p-5 transition-all duration-300 ${activeLayer === 'presentation' ? layerMeta.presentation.color : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${activeLayer === 'presentation' ? layerMeta.presentation.labelColor : 'text-slate-400 bg-white border-slate-200'} transition-colors`}>
                            <i className="ph-bold ph-device-mobile mr-1"></i> Tier 1 — Presentation (FE)
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden xl:inline">{layerMeta.presentation.desc}</span>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        {renderNode(presentationNodes[2])}
                        {renderArrow('right', activeNode === 'ws' || activeNode === 'react', activeNode)}
                        {renderNode(presentationNodes[1])}
                        {renderArrow('right', activeNode === 'react' || activeNode === 'ui', activeNode)}
                        {renderNode(presentationNodes[0])}
                    </div>
                </div>

                {/* Up arrow: BE pushes to FE */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-0.5">
                        <i className={`ph-bold ph-arrow-up text-xl transition-colors ${activeNode === 'lambda' || activeNode === 'ws' ? 'text-brand-500' : activeNode ? 'opacity-20 text-slate-300' : 'opacity-40 text-slate-300'}`}></i>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'lambda' || activeNode === 'ws' ? 'text-emerald-600 bg-emerald-100' : 'text-slate-300'}`}>WebSocket Push</span>
                    </div>
                </div>

                {/* === TIER 2: APPLICATION (BE) === */}
                <div className={`rounded-3xl border-2 p-5 transition-all duration-300 ${activeLayer === 'application' ? layerMeta.application.color : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${activeLayer === 'application' ? layerMeta.application.labelColor : 'text-slate-400 bg-white border-slate-200'} transition-colors`}>
                            <i className="ph-bold ph-cloud mr-1"></i> Tier 2 — Application (BE)
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden xl:inline">{layerMeta.application.desc}</span>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        {renderNode(applicationNodes[2])}
                        {renderArrow('right', activeNode === 'nfc' || activeNode === 'mqtt', activeNode)}
                        {renderNode(applicationNodes[0])}
                        {renderArrow('right', activeNode === 'mqtt' || activeNode === 'lambda', activeNode)}
                        {renderNode(applicationNodes[1])}
                    </div>
                </div>

                {/* Down arrow: BE reads/writes to DB */}
                <div className="flex justify-center gap-24">
                    <div className="flex flex-col items-center gap-0.5">
                        {renderArrow('down', activeNode === 'lambda' || activeNode === 'redis')}
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'lambda' || activeNode === 'redis' ? 'text-purple-600 bg-purple-100' : 'text-slate-300'}`}>GET/SET</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        {renderArrow('down', activeNode === 'lambda' || activeNode === 'pg')}
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'lambda' || activeNode === 'pg' ? 'text-blue-600 bg-blue-100' : 'text-slate-300'}`}>INSERT</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        {renderArrow('down', activeNode === 'nfc' || activeNode === 'edge')}
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'nfc' || activeNode === 'edge' ? 'text-orange-600 bg-orange-100' : 'text-slate-300'}`}>Offline</span>
                    </div>
                </div>

                {/* === TIER 3: DATA (DB) === */}
                <div className={`rounded-3xl border-2 p-5 transition-all duration-300 ${activeLayer === 'data' ? layerMeta.data.color : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${activeLayer === 'data' ? layerMeta.data.labelColor : 'text-slate-400 bg-white border-slate-200'} transition-colors`}>
                            <i className="ph-bold ph-database mr-1"></i> Tier 3 — Data (DB)
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden xl:inline">{layerMeta.data.desc}</span>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                        {renderNode(dataNodes[0])}
                        {renderNode(dataNodes[1])}
                        {renderNode(dataNodes[2])}
                    </div>
                </div>

                {/* TAB NAVIGATION FOR SUB-DIAGRAMS */}
                <div className="mt-12 flex justify-center">
                    <div className="bg-slate-200/70 p-1 rounded-2xl inline-flex gap-1">
                        <button 
                            onClick={() => setDiagramTab('activity')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${diagramTab === 'activity' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <i className="ph-bold ph-git-branch text-base"></i> Activity Diagram (Data Flow)
                        </button>
                        <button 
                            onClick={() => setDiagramTab('usecase')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${diagramTab === 'usecase' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <i className="ph-bold ph-users text-base"></i> Use Case Diagram
                        </button>
                        <button 
                            onClick={() => setDiagramTab('db')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${diagramTab === 'db' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <i className="ph-bold ph-database text-base"></i> Database Schema
                        </button>
                    </div>
                </div>

                {/* === CONDITIONAL RENDERING OF TABS === */}

                {/* 1. ACTIVITY DIAGRAM */}
                {diagramTab === 'activity' && <ActivityDiagram />}

                {/* 2. USE CASE DIAGRAM */}
                {diagramTab === 'usecase' && <UseCaseDiagram />}

                {/* 3. DATABASE SCHEMA */}
                {diagramTab === 'db' && <DatabaseSchema />}
            </div>

            {/* RIGHT: Sticky Detail Panel (Only for Activity Diagram) */}
            {diagramTab === 'activity' && (
                <div className="w-[400px] shrink-0 border-l border-slate-200 bg-slate-50 sticky top-0 h-full overflow-y-auto z-30">
                    <div className="p-6 h-full flex flex-col">
                    {activeNodeData ? (
                        <div className="animate-slide-up flex-1">
                            {/* Node Header */}
                            <div className={`p-5 rounded-2xl border-2 ${activeNodeData.color} mb-5`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-12 h-12 rounded-xl border-2 ${activeNodeData.color} flex items-center justify-center shrink-0 shadow-sm bg-white/50`}>
                                        <i className={`ph-fill ${activeNodeData.icon} text-2xl ${activeNodeData.iconColor}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-lg text-slate-800 leading-tight">{activeNodeData.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{activeNodeData.subtitle}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{activeNodeData.desc}</p>
                            </div>

                            {/* Tech Details */}
                            <div className="space-y-3">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5"><i className="ph-bold ph-wrench mr-1"></i>Tech Stack</p>
                                    <p className="text-xs font-bold text-slate-700">{activeNodeData.techStack}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5"><i className="ph-bold ph-sign-in mr-1"></i>Data In</p>
                                    <p className="text-xs font-mono text-slate-700">{activeNodeData.dataIn}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5"><i className="ph-bold ph-sign-out mr-1"></i>Data Out</p>
                                    <p className="text-xs font-mono text-slate-700">{activeNodeData.dataOut}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2"><i className="ph-bold ph-plugs-connected mr-1"></i>Connections</p>
                                    <div className="space-y-2">
                                        {activeConnections.map((c, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs">
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${c.from === activeNode ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                                    <i className={`ph-bold ${c.from === activeNode ? 'ph-arrow-right text-emerald-600' : 'ph-arrow-left text-blue-600'} text-[10px]`}></i>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-700">{c.label}</span>
                                                    <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({c.protocol})</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center">
                                <i className="ph-bold ph-cursor-click text-3xl animate-bounce"></i>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-500 mb-1">Node Detail Panel</p>
                                <p className="text-xs font-medium opacity-70 leading-relaxed">ชี้เมาส์ที่ Node ทางซ้าย<br/>เพื่อดู Tech Stack, Data Flow<br/>และ Connections ของแต่ละจุด</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

