export const ActivityDiagram = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden font-sans mb-8 animate-fade-in">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-200 shadow-sm">
                        <i className="ph-fill ph-git-branch text-brand-500 text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-lg">Activity Diagram: Lap Data Flow</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Standard UML 2.0 Swimlane Diagram (Full Journey)</p>
                    </div>
                </div>
            </div>
            
            {/* Swimlane Headers */}
            <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-white text-xs font-black text-center shadow-sm relative z-20">
                <div className="py-4 text-brand-600 uppercase tracking-widest bg-brand-50/30">Frontend (FE)</div>
                <div className="py-4 text-blue-600 uppercase tracking-widest bg-blue-50/30">Edge & Backend (BE)</div>
                <div className="py-4 text-purple-600 uppercase tracking-widest bg-purple-50/30">Database (DB)</div>
            </div>

            {/* Swimlane Body */}
            <div className="relative pt-8 pb-12 bg-slate-50/40">
                {/* Vertical Swimlane Dividers */}
                <div className="absolute inset-y-0 left-1/3 w-px bg-slate-200 border-dashed"></div>
                <div className="absolute inset-y-0 left-2/3 w-px bg-slate-200 border-dashed"></div>

                <div className="grid grid-cols-3 gap-y-8 relative z-10">
                    
                    {/* START NODE */}
                    <div className="col-start-2 flex justify-center">
                        <div className="w-6 h-6 bg-slate-800 rounded-full border-4 border-white shadow-md relative">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Runner Taps NFC</span>
                            {/* Line down to Edge Save */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-800"></div>
                            <div className="absolute top-[36px] left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 1. Edge Storage (NFR-01) */}
                    <div className="col-start-2 flex flex-col items-center">
                        <div className="bg-white border-2 border-blue-600 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold text-blue-700">1. Save to Edge Storage</p>
                            <p className="text-[10px] text-blue-600/80 mt-0.5">กันข้อมูลหาย (NFR-01)</p>
                        </div>
                        <div className="w-0.5 h-8 bg-slate-800 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 2. Network Check (Decision Diamond) */}
                    <div className="col-start-2 flex flex-col items-center relative mt-4">
                        <div className="w-20 h-20 bg-amber-50 border-2 border-slate-800 rotate-45 flex items-center justify-center shadow-sm relative cursor-default z-10">
                            <span className="text-[10px] font-bold -rotate-45 absolute w-24 text-center leading-tight">2. Network<br/>Online?</span>
                        </div>
                        
                        {/* Offline Branch (Left Loop) */}
                        <div className="absolute top-10 -left-[84px] w-[84px] h-0.5 bg-rose-500 z-0">
                            <span className="absolute -top-4 right-4 text-[9px] font-bold text-rose-500">Offline</span>
                            {/* Arrow head pointing left */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 border-b-2 border-l-2 border-rose-500 rotate-45"></div>
                        </div>
                        {/* Auto-Retry Action */}
                        <div className="absolute top-7 -left-[150px] bg-rose-50 border border-rose-500 rounded-md px-2 py-1 shadow-sm flex items-center gap-1">
                            <i className="ph-bold ph-arrows-clockwise text-rose-500 text-[10px]"></i>
                            <span className="text-[9px] font-bold text-rose-700 whitespace-nowrap">Auto-Retry Loop</span>
                        </div>

                        {/* Online Flow (Down) */}
                        <div className="w-0.5 h-10 bg-slate-800 relative mt-4">
                            <span className="absolute left-3 top-2 text-[10px] font-bold text-emerald-600 bg-white/80 px-1 rounded">Online</span>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 3. Publish to Queue (BE) */}
                    <div className="col-start-2 flex flex-col items-center mt-2">
                        <div className="bg-white border-2 border-slate-800 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold">3. Publish to Queue</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">เข้าคิว Kafka/MQTT กันระบบล่ม</p>
                        </div>
                        <div className="w-0.5 h-8 bg-slate-800 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 4. Validate (Decision Diamond) */}
                    <div className="col-start-2 flex flex-col items-center relative mt-4">
                        <div className="w-20 h-20 bg-amber-50 border-2 border-slate-800 rotate-45 flex items-center justify-center shadow-sm relative cursor-default">
                            <span className="text-[10px] font-bold -rotate-45 absolute w-24 text-center leading-tight">4. Validate<br/>Payload?</span>
                        </div>
                        
                        {/* Invalid Branch (Right) */}
                        <div className="absolute top-10 -right-6 w-16 h-0.5 bg-rose-500 z-0">
                            <span className="absolute -top-4 left-4 text-[9px] font-bold text-rose-500">Invalid</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-rose-500 rotate-45"></div>
                        </div>
                        {/* Drop action (Flow Final) */}
                        <div className="absolute top-6 -right-[88px] flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-rose-500 flex items-center justify-center bg-white">
                                <i className="ph-bold ph-x text-rose-500 text-lg"></i>
                            </div>
                            <span className="absolute -bottom-5 text-[9px] font-bold text-rose-700 whitespace-nowrap">Drop Data</span>
                        </div>

                        {/* Valid Flow (Down) */}
                        <div className="w-0.5 h-10 bg-slate-800 relative mt-4">
                            <span className="absolute left-3 top-2 text-[10px] font-bold text-emerald-600 bg-white/80 px-1 rounded">Valid</span>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 5. Calculate Lap (BE) */}
                    <div className="col-start-2 flex flex-col items-center mt-2">
                        <div className="bg-white border-2 border-slate-800 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold">5. Calculate Lap</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">คำนวณ Duration</p>
                        </div>
                        <div className="w-0.5 h-8 bg-slate-800 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-slate-800 rotate-45"></div>
                        </div>
                    </div>

                    {/* 6. Check PB (BE) */}
                    <div className="col-start-2 flex flex-col items-center">
                        <div className="bg-white border-2 border-slate-800 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold">6. Check PB</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">เทียบสถิติเดิม (is_pb)</p>
                        </div>
                        <div className="w-0.5 h-8 bg-slate-800 relative"></div>
                    </div>

                    {/* FORK NODE (Heavy Black Line) */}
                    <div className="col-start-1 col-span-3 relative h-10 z-20 pointer-events-none">
                        {/* The Fork Bar */}
                        <div className="absolute top-0 left-[12%] right-[12%] h-3 bg-slate-800 rounded-full shadow-md z-10"></div>
                        
                        {/* Path to FE (Left) */}
                        <div className="absolute top-1.5 left-[16.66%] right-[50%] h-16 border-t-2 border-l-2 border-slate-800 rounded-tl-xl z-0"></div>
                        <div className="absolute top-[64px] left-[16.66%] -translate-x-[5px] w-3 h-3 border-b-2 border-r-2 border-slate-800 rotate-45 z-0"></div>

                        {/* Path to DB (Right) */}
                        <div className="absolute top-1.5 left-[50%] right-[16.66%] h-16 border-t-2 border-r-2 border-slate-800 rounded-tr-xl z-0"></div>
                        <div className="absolute top-[64px] right-[16.66%] translate-x-[5px] w-3 h-3 border-b-2 border-r-2 border-slate-800 rotate-45 z-0"></div>
                    </div>

                    {/* Row Parallel execution */}
                    
                    {/* FE Lane: WS Push -> React State */}
                    <div className="col-start-1 flex flex-col items-center mt-2">
                        <div className="bg-brand-50 border-2 border-brand-500 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold text-brand-700">7. Receive WS Event</p>
                            <p className="text-[10px] text-brand-600/70 mt-0.5">รับข้อมูลผ่าน WebSocket</p>
                        </div>
                        <div className="w-0.5 h-8 bg-brand-500 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-brand-500 rotate-45"></div>
                        </div>
                        <div className="bg-brand-50 border-2 border-brand-500 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold text-brand-700">8. Update React State</p>
                            <p className="text-[10px] text-brand-600/70 mt-0.5">Optimistic Update + เรียงลำดับ</p>
                        </div>
                        <div className="w-0.5 h-8 bg-brand-500 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-brand-500 rotate-45"></div>
                        </div>
                        <div className="bg-brand-50 border-2 border-brand-500 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold text-brand-700">9. Render UI</p>
                            <p className="text-[10px] text-brand-600/70 mt-0.5">อัปเดตกราฟ + ฉลอง PB!</p>
                        </div>
                        <div className="w-0.5 h-8 bg-brand-500 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-brand-500 rotate-45"></div>
                        </div>
                        {/* END NODE (FE) */}
                        <div className="w-8 h-8 bg-white rounded-full border-4 border-slate-800 flex items-center justify-center shadow-md relative mt-1">
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Activity Final</span>
                            <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
                        </div>
                    </div>

                    {/* DB Lane: Save to DB */}
                    <div className="col-start-3 flex flex-col items-center mt-2">
                        <div className="bg-purple-50 border-2 border-purple-500 rounded-full px-5 py-2.5 text-center shadow-sm w-[90%] max-w-[240px] cursor-default">
                            <p className="text-sm font-bold text-purple-700">7. Save to Database</p>
                            <p className="text-[10px] text-purple-600/70 mt-0.5">PostgreSQL + Redis</p>
                        </div>
                        {/* END NODE (DB branch ends async) */}
                        <div className="w-0.5 h-16 bg-purple-500 relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-purple-500 rotate-45"></div>
                        </div>
                        <div className="w-8 h-8 bg-white rounded-full border-4 border-slate-400 flex items-center justify-center shadow-md relative mt-1 opacity-60">
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">Flow Final</span>
                            <div className="w-4 h-4 bg-white border-2 border-slate-400 flex items-center justify-center rounded-full"><i className="ph-bold ph-x text-[8px] text-slate-400"></i></div>
                        </div>
                    </div>
                </div>
                
                {/* NFR Badge */}
                <div className="absolute bottom-6 right-6 bg-white border-2 border-emerald-500 rounded-xl p-3 shadow-lg flex items-center gap-3 z-30 transform hover:-translate-y-1 transition-transform">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <i className="ph-bold ph-lightning text-emerald-500 text-xl animate-pulse"></i>
                    </div>
                    <div>
                        <p className="text-emerald-600 text-sm font-black uppercase">Total Latency &lt; 1s</p>
                        <p className="text-slate-500 text-[10px] font-bold">Sub-second end-to-end (NFR-02)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
