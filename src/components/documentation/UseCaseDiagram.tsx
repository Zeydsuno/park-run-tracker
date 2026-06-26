export const UseCaseDiagram = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden font-sans mb-8 animate-fade-in p-8">
            <div className="text-center mb-6">
                <h3 className="font-extrabold text-slate-800 text-2xl flex items-center justify-center gap-2">
                    <i className="ph-bold ph-check-circle text-emerald-500"></i> Use Case Diagram
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Strict UML 2.0 Standard (Mapped to FR / NFR)</p>
            </div>

            {/* SVG Container for Strict UML */}
            <div className="w-full overflow-x-auto flex justify-center">
                <svg viewBox="0 0 800 600" className="w-full max-w-[800px] h-auto drop-shadow-sm font-sans" style={{ minWidth: '600px' }}>
                    <defs>
                        {/* Open Arrow for UML Dependencies (Include/Extend) */}
                        <marker id="open-arrow" viewBox="0 0 14 14" refX="14" refY="7" markerWidth="8" markerHeight="8" orient="auto">
                            <path d="M 0 0 L 14 7 L 0 14" fill="none" stroke="#64748b" strokeWidth="1.5" />
                        </marker>
                    </defs>

                    {/* SYSTEM BOUNDARY */}
                    <rect x="220" y="20" width="460" height="560" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" rx="4" />
                    <text x="235" y="45" fontSize="14" fontWeight="bold" fill="#475569">The Park Run Tracker System</text>

                    {/* ==== ACTORS ==== */}
                    
                    {/* Secondary Actor: NFC Reader (Hardware) - MOVED TO RIGHT SIDE */}
                    <g transform="translate(730, 150)">
                        <text x="0" y="-45" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">&lt;&lt;device&gt;&gt;</text>
                        <circle cx="0" cy="-20" r="12" fill="none" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="-8" x2="0" y2="25" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="-20" y1="5" x2="20" y2="5" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="25" x2="-15" y2="50" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="25" x2="15" y2="50" stroke="#0f172a" strokeWidth="2"/>
                        <text x="0" y="70" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">NFC Reader</text>
                    </g>

                    {/* Primary Actor: Runner - LEFT SIDE */}
                    <g transform="translate(100, 460)">
                        <circle cx="0" cy="-20" r="12" fill="none" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="-8" x2="0" y2="25" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="-20" y1="5" x2="20" y2="5" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="25" x2="-15" y2="50" stroke="#0f172a" strokeWidth="2"/>
                        <line x1="0" y1="25" x2="15" y2="50" stroke="#0f172a" strokeWidth="2"/>
                        <text x="0" y="70" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">Runner</text>
                        <text x="0" y="86" textAnchor="middle" fontSize="11" fill="#64748b">(นักวิ่ง)</text>
                    </g>

                    {/* ==== USE CASES ==== */}

                    {/* UC1: สแกนริสแบนด์ */}
                    <g transform="translate(450, 100)">
                        <ellipse cx="0" cy="0" rx="100" ry="35" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0369a1">UC1: สแกนริสแบนด์</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[FR-01]</text>
                    </g>

                    {/* UC6: สำรองข้อมูล Offline */}
                    <g transform="translate(560, 240)">
                        <ellipse cx="0" cy="0" rx="110" ry="35" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b45309">UC6: สำรองข้อมูล Offline</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[NFR-01]</text>
                    </g>

                    {/* UC2: คำนวณเวลาวิ่ง */}
                    <g transform="translate(330, 260)">
                        <ellipse cx="0" cy="0" rx="100" ry="35" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0369a1">UC2: คำนวณเวลาวิ่ง</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[FR-02]</text>
                    </g>

                    {/* UC3: อัปเดตสถิติ PB */}
                    <g transform="translate(330, 400)">
                        <ellipse cx="0" cy="0" rx="100" ry="35" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0369a1">UC3: อัปเดตสถิติ PB</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[FR-02]</text>
                    </g>

                    {/* UC4: ดูประวัติการวิ่ง */}
                    <g transform="translate(330, 520)">
                        <ellipse cx="0" cy="0" rx="90" ry="35" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4338ca">UC4: ดูประวัติ</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[FR-04]</text>
                    </g>

                    {/* UC5: ดูเวลาวิ่ง */}
                    <g transform="translate(540, 520)">
                        <ellipse cx="0" cy="0" rx="90" ry="35" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                        <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4338ca">UC5: ดูเวลา Live</text>
                        <text x="0" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">[FR-03]</text>
                    </g>

                    {/* ==== ASSOCIATIONS (Solid Lines) ==== */}
                    {/* NFC (Right) -> UC1 */}
                    <line x1="700" y1="150" x2="550" y2="100" stroke="#0f172a" strokeWidth="1.5" />
                    {/* NFC (Right) -> UC6 */}
                    <line x1="700" y1="150" x2="630" y2="210" stroke="#0f172a" strokeWidth="1.5" />
                    {/* Runner (Left) -> UC4 */}
                    <line x1="130" y1="460" x2="240" y2="520" stroke="#0f172a" strokeWidth="1.5" />
                    {/* Runner (Left) -> UC5 */}
                    <line x1="130" y1="460" x2="460" y2="495" stroke="#0f172a" strokeWidth="1.5" />

                    {/* ==== DEPENDENCIES (Dashed Arrows) ==== */}
                    
                    {/* UC1 includes UC2 */}
                    {/* Arrow points FROM base (UC1) TO included (UC2) */}
                    <path d="M 410 132 L 350 225" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,6" markerEnd="url(#open-arrow)" />
                    <rect x="330" y="165" width="90" height="20" fill="#f8fafc" />
                    <text x="375" y="179" textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">&lt;&lt;include&gt;&gt;</text>

                    {/* UC3 extends UC2 */}
                    {/* Arrow points FROM extending (UC3) TO base (UC2) */}
                    <path d="M 330 365 L 330 295" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,6" markerEnd="url(#open-arrow)" />
                    <rect x="285" y="320" width="90" height="20" fill="#f8fafc" />
                    <text x="330" y="334" textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">&lt;&lt;extend&gt;&gt;</text>

                </svg>
            </div>
        </div>
    );
};
