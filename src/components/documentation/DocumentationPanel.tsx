import { useState } from 'react';

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

    const Arrow = ({ direction = 'right', highlight = false }: { direction?: 'right' | 'down'; highlight?: boolean }) => (
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
                        <Arrow direction="right" highlight={activeNode === 'ws' || activeNode === 'react'} />
                        {renderNode(presentationNodes[1])}
                        <Arrow direction="right" highlight={activeNode === 'react' || activeNode === 'ui'} />
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
                        <Arrow direction="right" highlight={activeNode === 'nfc' || activeNode === 'mqtt'} />
                        {renderNode(applicationNodes[0])}
                        <Arrow direction="right" highlight={activeNode === 'mqtt' || activeNode === 'lambda'} />
                        {renderNode(applicationNodes[1])}
                    </div>
                </div>

                {/* Down arrow: BE reads/writes to DB */}
                <div className="flex justify-center gap-24">
                    <div className="flex flex-col items-center gap-0.5">
                        <Arrow direction="down" highlight={activeNode === 'lambda' || activeNode === 'redis'} />
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'lambda' || activeNode === 'redis' ? 'text-purple-600 bg-purple-100' : 'text-slate-300'}`}>GET/SET</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Arrow direction="down" highlight={activeNode === 'lambda' || activeNode === 'pg'} />
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full transition-colors ${activeNode === 'lambda' || activeNode === 'pg' ? 'text-blue-600 bg-blue-100' : 'text-slate-300'}`}>INSERT</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Arrow direction="down" highlight={activeNode === 'nfc' || activeNode === 'edge'} />
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

                {/* === SEQUENCE SUMMARY === */}
                <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500 via-slate-900 to-slate-900"></div>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                                <i className="ph-fill ph-git-merge text-brand-400 text-lg"></i>
                            </div>
                            <h3 className="text-white font-black text-xl tracking-wide">Data Flow Sequence</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 font-medium pl-11">เส้นทางของข้อมูล 1 รอบวิ่ง ตั้งแต่แตะริสแบนด์จนถึงหน้าจอมือถือ (Full Journey)</p>
                        
                        <div className="space-y-0 pl-3">
                            {[
                                { num: 1, icon: 'ph-contactless-payment', title: 'NFC Scan', desc: 'นักวิ่งแตะริสแบนด์ที่เสาสแกน → สร้าง JSON Payload', layer: 'BE', layerColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                                { num: 2, icon: 'ph-queue', title: 'Message Queue', desc: 'เข้าคิว Kafka/MQTT ป้องกัน Server ล่มจาก Data Flood', layer: 'BE', layerColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                                { num: 3, icon: 'ph-funnel', title: 'Validate', desc: 'กรองข้อมูลขยะ — สแกนรัว? ขี่สกู๊ตเตอร์? Payload เน่า?', layer: 'BE', layerColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
                                { num: 4, icon: 'ph-calculator', title: 'Calculate Lap', desc: 'คำนวณ duration = timestamp นี้ − timestamp รอบก่อนหน้า', layer: 'BE', layerColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                                { num: 5, icon: 'ph-trophy', title: 'Check PB', desc: 'เทียบว่าเร็วกว่าสถิติเดิมไหม → ถ้าใช่ตั้ง is_pb = true', layer: 'BE + DB', layerColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                                { num: 6, icon: 'ph-hard-drives', title: 'Save to DB', desc: 'บันทึกถาวรลง PostgreSQL + อัปเดต Redis Cache', layer: 'DB', layerColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
                                { num: 7, icon: 'ph-broadcast', title: 'WebSocket Push', desc: 'ดันข้อมูลผลลัพธ์ไปยังแอปมือถือแบบ Real-time', layer: 'BE → FE', layerColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                                { num: 8, icon: 'ph-atom', title: 'React State', desc: 'รับข้อมูล → Optimistic Update → เรียงลำดับ → เช็ค PB', layer: 'FE', layerColor: 'text-brand-400 bg-brand-500/10 border-brand-500/30' },
                                { num: 9, icon: 'ph-device-mobile', title: 'UI Update', desc: 'อัปเดตกราฟ + ตัวเลข → ถ้า PB ก็กระพริบฉลอง!', layer: 'FE', layerColor: 'text-brand-400 bg-brand-500/10 border-brand-500/30' },
                            ].map((step, i) => (
                                <div key={i} className="flex items-stretch gap-6 group cursor-default">
                                    {/* Timeline line + dot */}
                                    <div className="flex flex-col items-center w-8 shrink-0">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 group-hover:scale-110 z-10 
                                            ${i === 0 ? 'border-amber-400 text-amber-400 bg-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                                            : i === 8 ? 'border-brand-400 text-brand-400 bg-brand-400/20 shadow-[0_0_15px_rgba(228,76,112,0.4)]' 
                                            : 'border-slate-700 text-slate-400 bg-slate-900 group-hover:border-slate-500 group-hover:text-slate-300'}`}>
                                            {step.num}
                                        </div>
                                        {i < 8 && <div className={`w-0.5 flex-1 min-h-[32px] transition-colors duration-500
                                            ${i < 4 ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/20 group-hover:from-blue-500/50 group-hover:to-blue-500/50' 
                                            : i === 4 ? 'bg-gradient-to-b from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/50 group-hover:to-purple-500/50' 
                                            : i === 5 ? 'bg-gradient-to-b from-purple-500/20 to-emerald-500/20 group-hover:from-purple-500/50 group-hover:to-emerald-500/50' 
                                            : i === 6 ? 'bg-gradient-to-b from-emerald-500/20 to-brand-500/20 group-hover:from-emerald-500/50 group-hover:to-brand-500/50' 
                                            : 'bg-brand-500/20 group-hover:bg-brand-500/50'}`}></div>}
                                    </div>
                                    {/* Content */}
                                    <div className={`flex-1 flex items-center gap-5 rounded-2xl px-5 py-4 mb-3 transition-all duration-300 group-hover:bg-slate-800/80 group-hover:translate-x-2 border border-transparent group-hover:border-slate-700/50 group-hover:shadow-lg ${i === 8 ? 'mb-0' : ''}`}>
                                        <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${step.layerColor}`}>
                                            <i className={`ph-fill ${step.icon} text-2xl`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="text-white font-bold text-sm tracking-wide">{step.title}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${step.layerColor}`}>{step.layer}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-5 bg-slate-800/40 p-5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative z-10">
                                <i className="ph-bold ph-lightning text-emerald-400 text-2xl animate-pulse"></i>
                            </div>
                            <div className="relative z-10">
                                <p className="text-emerald-400 text-sm font-black tracking-wider uppercase mb-0.5">Total Latency: &lt; 1 วินาที</p>
                                <p className="text-slate-400 text-xs font-medium">Sub-second end-to-end ตาม NFR-02 ของเอกสาร SRS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Sticky Detail Panel */}
            <div className="w-[400px] shrink-0 border-l border-slate-200 bg-slate-50 sticky top-0 h-full overflow-y-auto">
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
        </div>
    );
};

