export const DatabaseSchema = () => {
    return (
        <div className="animate-fade-in pb-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Database Schema</h2>
                <p className="text-sm text-slate-500 mt-2">โครงสร้างข้อมูลใน Data Tier (PostgreSQL, Redis, Edge Storage)</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: PostgreSQL */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="ph-fill ph-database text-brand-600 text-2xl"></i>
                        <h3 className="text-xl font-extrabold text-slate-800">PostgreSQL</h3>
                        <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Persistent</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
                        {/* Table: Runners */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-700 text-sm">runners</span>
                                <i className="ph-bold ph-users text-slate-400"></i>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
                                <table className="w-full text-xs text-left text-slate-600">
                                    <tbody>
                                        <tr className="border-b border-slate-100 bg-amber-50/30">
                                            <td className="px-3 py-2 font-bold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                                                <i className="ph-fill ph-key text-amber-500"></i> id
                                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold">PK</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-slate-500 text-[10px] sm:text-xs whitespace-nowrap">VARCHAR(50)</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">nfc_tag_id</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">VARCHAR(100)</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">name</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">VARCHAR(100)</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">weight_kg</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">DECIMAL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">created_at</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">TIMESTAMP</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Table: Events */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-700 text-sm">events</span>
                                <i className="ph-bold ph-map-pin text-slate-400"></i>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
                                <table className="w-full text-xs text-left text-slate-600">
                                    <tbody>
                                        <tr className="border-b border-slate-100 bg-amber-50/30">
                                            <td className="px-3 py-2 font-bold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                                                <i className="ph-fill ph-key text-amber-500"></i> id
                                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold">PK</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-slate-500 text-[10px] sm:text-xs whitespace-nowrap">SERIAL</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">name</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">VARCHAR(100)</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">dist_per_lap</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">DECIMAL</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">location</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">TEXT</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Table: Laps */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-700 text-sm">laps</span>
                                <i className="ph-bold ph-table text-slate-400"></i>
                            </div>
                            <div className="p-0 overflow-x-auto flex-1">
                                <table className="w-full text-xs text-left text-slate-600">
                                    <tbody>
                                        <tr className="border-b border-slate-100 bg-amber-50/30">
                                            <td className="px-3 py-2 font-bold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                                                <i className="ph-fill ph-key text-amber-500"></i> id
                                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 rounded font-bold">PK</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-slate-500 text-[10px] sm:text-xs whitespace-nowrap">SERIAL</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 bg-brand-50/30">
                                            <td className="px-3 py-2 font-bold text-brand-700 flex items-center gap-1.5 whitespace-nowrap">
                                                <i className="ph-bold ph-link text-brand-500"></i> runner_id
                                                <span className="text-[8px] bg-brand-100 text-brand-700 px-1 rounded font-bold">FK</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-brand-600 text-[10px] sm:text-xs whitespace-nowrap">VARCHAR</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 bg-brand-50/30">
                                            <td className="px-3 py-2 font-bold text-brand-700 flex items-center gap-1.5 whitespace-nowrap">
                                                <i className="ph-bold ph-link text-brand-500"></i> event_id
                                                <span className="text-[8px] bg-brand-100 text-brand-700 px-1 rounded font-bold">FK</span>
                                            </td>
                                            <td className="px-3 py-2 font-mono text-brand-600 text-[10px] sm:text-xs whitespace-nowrap">INT</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">duration_sec</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">INT</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-bold whitespace-nowrap">is_pb</td>
                                            <td className="px-3 py-2 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">BOOLEAN</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ER Relationship Definition */}
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Entity Relationship (ERD)</p>
                        <div className="flex flex-col xl:flex-row items-center justify-center gap-2 sm:gap-4 text-sm font-mono">
                            <div className="bg-white border border-slate-300 rounded px-3 py-1 font-bold text-slate-700 shadow-sm whitespace-nowrap">
                                runners
                            </div>
                            
                            <div className="flex items-center text-slate-400 flex-1 w-full sm:w-auto px-2">
                                <span className="font-bold text-slate-600 mr-2 text-xs">1</span>
                                <div className="flex-1 h-px bg-slate-300 relative min-w-[30px]">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3 bg-slate-400"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-slate-400 rotate-45 transform origin-right translate-x-[5px]"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-b-2 border-r-2 border-slate-400 -rotate-45 transform origin-right translate-x-[5px]"></div>
                                </div>
                                <span className="font-bold text-slate-600 ml-3 text-xs">N</span>
                            </div>

                            <div className="bg-white border border-slate-300 rounded px-3 py-1 font-bold text-slate-700 shadow-sm whitespace-nowrap">
                                laps
                            </div>

                            <div className="flex items-center text-slate-400 flex-1 w-full sm:w-auto px-2">
                                <span className="font-bold text-slate-600 mr-2 text-xs">N</span>
                                <div className="flex-1 h-px bg-slate-300 relative min-w-[30px]">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-l-2 border-slate-400 -rotate-45 transform origin-left -translate-x-[5px]"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 border-b-2 border-l-2 border-slate-400 rotate-45 transform origin-left -translate-x-[5px]"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3 bg-slate-400"></div>
                                </div>
                                <span className="font-bold text-slate-600 ml-3 text-xs">1</span>
                            </div>

                            <div className="bg-white border border-slate-300 rounded px-3 py-1 font-bold text-slate-700 shadow-sm whitespace-nowrap">
                                events
                            </div>
                        </div>
                        <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 break-all flex flex-col gap-1">
                            <span><strong className="text-brand-600">FK1:</strong> <code className="bg-white px-1 py-0.5 rounded border border-slate-100">laps.runner_id</code> references <code className="bg-white px-1 py-0.5 rounded border border-slate-100">runners.id</code></span>
                            <span><strong className="text-brand-600">FK2:</strong> <code className="bg-white px-1 py-0.5 rounded border border-slate-100">laps.event_id</code> references <code className="bg-white px-1 py-0.5 rounded border border-slate-100">events.id</code></span>
                        </p>
                    </div>
                </div>

                {/* Redis & Edge */}
                <div className="w-full lg:w-80 shrink-0 space-y-8">
                    {/* Redis */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <i className="ph-fill ph-rocket-launch text-purple-600 text-2xl"></i>
                            <h4 className="text-lg font-bold text-slate-800">Redis Cache</h4>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">In-Memory</span>
                        </div>
                        <div className="border border-purple-200 bg-purple-50 rounded-xl p-4 space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-purple-800 mb-1">Key: runner:&#123;id&#125;:last_scan</p>
                                <div className="bg-white border border-purple-100 rounded px-3 py-1.5 text-xs font-mono text-slate-600 shadow-sm break-all">
                                    1718245600000 <span className="text-slate-400 whitespace-nowrap">(Unix MS)</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-purple-800 mb-1">Key: runner:&#123;id&#125;:pb</p>
                                <div className="bg-white border border-purple-100 rounded px-3 py-1.5 text-xs font-mono text-slate-600 shadow-sm">
                                    142 <span className="text-slate-400 whitespace-nowrap">(Seconds)</span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-start justify-between gap-1 mb-1">
                                    <p className="text-[10px] font-bold text-purple-800 truncate">Key: runner:&#123;id&#125;:stats</p>
                                    <span className="bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap shrink-0 mt-0.5">FE Dashboard</span>
                                </div>
                                <div className="bg-slate-900 border border-purple-200 rounded px-3 py-2 text-[10px] sm:text-xs font-mono text-fuchsia-400 shadow-sm leading-relaxed overflow-x-auto">
                                    &#123;<br/>
                                    &nbsp;&nbsp;"distance": 7.5,<br/>
                                    &nbsp;&nbsp;"kcal": 504,<br/>
                                    &nbsp;&nbsp;"avg_pace": 326<br/>
                                    &#125;
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edge Storage */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <i className="ph-fill ph-sd-card text-amber-600 text-2xl"></i>
                            <h4 className="text-lg font-bold text-slate-800">Edge Storage</h4>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Offline</span>
                        </div>
                        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-amber-800 mb-1">Local Queue (JSON Array)</p>
                            <div className="bg-slate-900 rounded p-3 text-[10px] font-mono text-emerald-400 shadow-sm overflow-hidden">
                                [<br/>
                                &nbsp;&nbsp;&#123;"id": "U-123", "ts": 171...&#125;,<br/>
                                &nbsp;&nbsp;&#123;"id": "U-456", "ts": 171...&#125;<br/>
                                ]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
