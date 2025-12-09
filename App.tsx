
import React, { useEffect, useState, useRef } from 'react';
import { initializeSimulation, updateSimulation, setStressTestMode } from './services/simulator';
import { Process, SystemStats, SystemHistoryPoint, ProcessPriority, ProcessState, AIAnalysisResult, SystemAlert, LogEntry, NetworkConnection, Service, DiskNode, ToastNotification } from './types';
import Dashboard from './components/Dashboard';
import ProcessTable from './components/ProcessTable';
import NetworkPanel from './components/NetworkPanel';
import ServicePanel from './components/ServicePanel';
import DiskPanel from './components/DiskPanel';
import HardwarePanel from './components/HardwarePanel';
import Terminal from './components/Terminal';
import ToastContainer from './components/ToastContainer';
import { LayoutDashboard, List, Server, Bell, Activity, FileText, AlertTriangle, Globe, Settings, HardDrive, Zap, Cpu, Terminal as TerminalIcon, Shield } from 'lucide-react';
import clsx from 'clsx';
import { analyzeSystemHealth } from './services/geminiService';

// Initial state for stats
const INITIAL_STATS: SystemStats = {
  totalCpuUsage: 0,
  loadAverage: [0,0,0],
  totalMemoryUsage: 0,
  totalMemoryAvailable: 32768,
  totalProcesses: 0,
  runningProcesses: 0,
  sleepingProcesses: 0,
  uptime: 0,
  timestamp: Date.now(),
  network: { uploadSpeed: 0, downloadSpeed: 0 },
  disk: { readSpeed: 0, writeSpeed: 0, totalSpace: 1024, usedSpace: 400 },
  battery: { level: 100, isCharging: false, timeLeft: 200 },
  healthScore: 100,
  activeThreads: 0,
  thermal: { cpuTemp: 40, gpuTemp: 38, fanSpeed: 1000, voltage: 1.1 }
};

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootLogs = [
    "BIOS Date 01/15/25 15:22:11 Ver: 08.00.15",
    "CPU: Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz",
    "Speed: 6000 MHz",
    "Memory Test: 32768M OK",
    "Detecting NVMe drives...",
    "   NVMe 0: Samsung SSD 990 PRO 2TB",
    "Initializing Boot Agent...",
    "Loading Kernel...",
    "[ OK ] Started Kernel Random Number Generator.",
    "[ OK ] Created slice User and Session Slice.",
    "[ OK ] Started Network Manager Script Dispatcher Service.",
    "[ OK ] Reached target System Time Synchronized.",
    "Mounting /dev/sda1 to /root...",
    "Scanning for peripherals...",
    "   Found: NVIDIA GeForce RTX 4090",
    "   Found: Network Controller Intel Wi-Fi 7",
    "Loading SysAdmin.AI Neural Engine...",
    "Calibrating heuristic sensors...",
    "Establishing secure connection to telemetry server...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let delay = 0;
    bootLogs.forEach((log, index) => {
      delay += Math.random() * 200 + 50; // Random delay between lines
      setTimeout(() => {
        setLines(prev => [...prev, log]);
        // Auto scroll to bottom
        const el = document.getElementById('boot-console');
        if (el) el.scrollTop = el.scrollHeight;
        
        if (index === bootLogs.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-emerald-500 font-tech p-10 z-[100] flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 pointer-events-none bg-cover"></div>
      <div id="boot-console" className="h-full overflow-hidden flex flex-col justify-end text-sm md:text-base leading-snug">
         {lines.map((line, i) => (
           <div key={i} className="animate-fade-in-up">{line}</div>
         ))}
         <div className="animate-pulse">_</div>
      </div>
      <div className="scanlines"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'processes' | 'network' | 'services' | 'disk' | 'hardware' | 'alerts'>('dashboard');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [diskNodes, setDiskNodes] = useState<DiskNode[]>([]);
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([]);
  
  const [stats, setStats] = useState<SystemStats>(INITIAL_STATS);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  const [history, setHistory] = useState<SystemHistoryPoint[]>([]);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [stressMenuOpen, setStressMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  
  // Refs
  const historyRef = useRef<SystemHistoryPoint[]>([]);
  const uptimeRef = useRef(0);

  // Initialize
  useEffect(() => {
    const initData = initializeSimulation();
    setProcesses(initData.processes);
    setServices(initData.services);
    setDiskNodes(initData.diskNodes);
  }, []);

  // Keyboard shortcut for Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulation Loop
  useEffect(() => {
    if (booting) return; // Don't run simulation while booting

    const interval = setInterval(() => {
      setProcesses(prev => {
        uptimeRef.current += 1.5; // Faster update for "Real-Time" feel
        
        const { processes: newProcesses, stats: newStats, newAlerts, newLogs, connections, updatedServices } = updateSimulation(
          prev, 
          services,
          diskNodes,
          uptimeRef.current, 
          stats.disk.usedSpace
        );
        
        setStats(newStats);
        setNetworkConnections(connections);
        setServices(updatedServices);

        if (newAlerts.length > 0) {
          setAlerts(prevAlerts => [...newAlerts, ...prevAlerts].slice(0, 50));
          // Show toast for critical alerts
          const critical = newAlerts.find(a => a.type === 'Critical');
          if (critical) {
            addToast('System Alert', critical.message, 'error');
          }
        }

        if (newLogs.length > 0) {
          setLogs(prevLogs => [...prevLogs, ...newLogs].slice(-100)); // Keep last 100 logs
        }

        const newPoint: SystemHistoryPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: Math.round(newStats.totalCpuUsage),
          memory: parseFloat((newStats.totalMemoryUsage / 1024).toFixed(1)),
          netIn: Math.round(newStats.network.downloadSpeed / 1024),
          netOut: Math.round(newStats.network.uploadSpeed / 1024),
          diskRead: newStats.disk.readSpeed,
          diskWrite: newStats.disk.writeSpeed,
          temp: newStats.thermal.cpuTemp
        };
        
        const newHistory = [...historyRef.current, newPoint].slice(-40); // Increased history retention
        historyRef.current = newHistory;
        setHistory(newHistory);
        
        return newProcesses;
      });
    }, 1500); // 1.5s refresh rate

    return () => clearInterval(interval);
  }, [booting, stats.disk.usedSpace, services]);

  // Actions
  const addToast = (title: string, message: string, type: ToastNotification['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleKillProcess = (pid: number) => {
    const proc = processes.find(p => p.pid === pid);
    if (!proc) return;

    if (proc.isSystem) {
      addToast('Access Denied', `Cannot kill system process '${proc.name}'. Root privileges required.`, 'error');
      return;
    }

    if (confirm(`Are you sure you want to kill '${proc.name}' (PID: ${pid})?`)) {
      setProcesses(prev => prev.filter(p => p.pid !== pid));
      addToast('Process Terminated', `${proc.name} (PID: ${pid}) was successfully terminated.`, 'success');
      setLogs(prev => [...prev, {
        id: `man-kill-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'WARN',
        source: 'user',
        message: `User manually terminated process ${proc.name} (PID: ${pid})`
      }]);
    }
  };

  const handleToggleState = (pid: number) => {
    setProcesses(prev => prev.map(p => {
      if (p.pid !== pid) return p;
      const newState = p.state === ProcessState.STOPPED ? ProcessState.RUNNING : ProcessState.STOPPED;
      return { ...p, state: newState };
    }));
  };

  const handleRenice = (pid: number, priority: ProcessPriority) => {
    setProcesses(prev => prev.map(p => {
      if (p.pid !== pid) return p;
      addToast('Priority Changed', `Priority set to ${priority} for PID ${pid}`, 'info');
      setLogs(prev => [...prev, {
        id: `nice-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        source: 'scheduler',
        message: `Changed priority of ${p.name} (PID: ${pid}) to ${priority}`
      }]);
      return { ...p, priority };
    }));
  };

  const handleToggleService = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      const isActive = s.status === 'active';
      addToast('Service Control', `${isActive ? 'Stopping' : 'Starting'} service ${s.name}...`, 'info');
      
      return {
        ...s,
        status: isActive ? 'inactive' : 'active',
        subState: isActive ? 'dead' : 'running',
        pid: isActive ? undefined : Math.floor(Math.random() * 10000),
        uptime: 0
      };
    }));
  };

  const runAiAnalysis = async () => {
    setIsAiLoading(true);
    addToast('AI Analysis', 'Gemini Engine analyzing system telemetry...', 'info');
    const result = await analyzeSystemHealth(processes, stats.totalCpuUsage, stats.totalMemoryUsage);
    setAiResult(result);
    setIsAiLoading(false);
    if (result) {
       addToast('Analysis Complete', `System status: ${result.status}`, result.status === 'Healthy' ? 'success' : 'warning');
    }
  };

  const SidebarItem = ({ id, icon, label, count }: { id: typeof activeTab, icon: React.ReactNode, label: string, count?: number }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={clsx(
        "w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all duration-200 border-l-2 group hover:pl-6 relative overflow-hidden",
        activeTab === id 
          ? "bg-indigo-500/10 border-indigo-500 text-white" 
          : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
      )}
    >
      <div className={clsx("transition-transform group-hover:scale-110", activeTab === id ? "text-indigo-400" : "text-slate-500")}>
        {icon}
      </div>
      <span className="flex-1 text-left relative z-10">{label}</span>
      {count !== undefined && count > 0 && (
         <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-900/50 animate-pulse">{count}</span>
      )}
      {activeTab === id && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>}
    </button>
  );

  if (booting) {
    return <BootScreen onComplete={() => setBooting(false)} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      <div className="scanlines"></div>
      <ToastContainer notifications={toasts} onDismiss={handleDismissToast} />
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} processes={processes} stats={stats} onKill={handleKillProcess} />
      
      {/* Background FX */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none animate-grid-move z-0"></div>
      
      {/* Professional Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col z-20 shadow-2xl relative">
         <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-900/50">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-md flex items-center justify-center shadow-lg shadow-indigo-900/50 ring-1 ring-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <Server size={18} className="text-white relative z-10" />
            </div>
            <div className="glitch-text cursor-default">
              <h1 className="font-bold text-xs tracking-tight text-white leading-tight">Real-Time Process <span className="text-indigo-400">Monitoring</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Dashboard</p>
            </div>
         </div>

         <div className="flex-1 py-6 space-y-1">
            <SidebarItem id="dashboard" icon={<LayoutDashboard size={18} />} label="Overview" />
            <SidebarItem id="processes" icon={<List size={18} />} label="Process Manager" />
            <SidebarItem id="hardware" icon={<Cpu size={18} />} label="Hardware Sensors" />
            <SidebarItem id="network" icon={<Globe size={18} />} label="Network Monitor" />
            <SidebarItem id="services" icon={<Settings size={18} />} label="System Services" />
            <SidebarItem id="disk" icon={<HardDrive size={18} />} label="Disk Analysis" />
            <SidebarItem id="alerts" icon={<Bell size={18} />} label="System Alerts" count={alerts.length} />
            
            <div className="mt-8 px-6 animate-fade-in-up delay-500">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Shield size={10} /> Resource Quotas
              </p>
              <div className="space-y-5">
                <div>
                   <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Uptime</span>
                      <span className="font-mono text-emerald-400">{new Date(stats.uptime * 1000).toISOString().substr(11, 8)}</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                      <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Storage (/dev/sda1)</span>
                      <span>{((stats.disk.usedSpace / stats.disk.totalSpace) * 100).toFixed(0)}%</span>
                   </div>
                   <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                      <div className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_#3b82f6]" style={{ width: `${(stats.disk.usedSpace / stats.disk.totalSpace) * 100}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
         </div>

         <div className="p-4 border-t border-slate-800 bg-slate-900/30">
            <button 
              onClick={() => setTerminalOpen(!terminalOpen)}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold border border-slate-700 transition-all hover:border-indigo-500/50"
            >
              <TerminalIcon size={14} /> Toggle Shell (~)
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative custom-scrollbar z-10">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 shadow-lg">
           <h2 className="text-lg font-medium text-white flex items-center gap-2 animate-fade-in-up">
              {activeTab === 'dashboard' && <><LayoutDashboard size={20} className="text-indigo-400"/> System Overview</>}
              {activeTab === 'processes' && <><List size={20} className="text-indigo-400"/> Process Management</>}
              {activeTab === 'hardware' && <><Cpu size={20} className="text-indigo-400"/> Hardware Sensors</>}
              {activeTab === 'network' && <><Globe size={20} className="text-indigo-400"/> Network Telemetry</>}
              {activeTab === 'services' && <><Settings size={20} className="text-indigo-400"/> Service Control</>}
              {activeTab === 'disk' && <><HardDrive size={20} className="text-indigo-400"/> Storage Visualization</>}
              {activeTab === 'alerts' && <><Bell size={20} className="text-indigo-400"/> System Event Logs</>}
           </h2>
           <div className="flex items-center gap-4">
              {/* Simulation Controls */}
              <div className="relative">
                 <button onClick={() => setStressMenuOpen(!stressMenuOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors hover:text-white" title="Simulation Controls">
                    <Activity size={18} />
                 </button>
                 {stressMenuOpen && (
                   <div className="absolute right-0 top-10 w-48 bg-slate-800 border border-slate-700 shadow-2xl rounded-lg py-1 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                     <div className="px-3 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-700 mb-1">Stress Tests</div>
                     <button onClick={() => { setStressTestMode('NONE'); setStressMenuOpen(false); addToast('System Normalized', 'Stress test disabled.', 'success'); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-xs text-slate-200">Normal Operation</button>
                     <button onClick={() => { setStressTestMode('CPU'); setStressMenuOpen(false); addToast('Stress Test Started', 'Simulating High CPU Load...', 'warning'); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-xs text-rose-400 flex items-center gap-2"><Cpu size={12}/> High CPU Load</button>
                     <button onClick={() => { setStressTestMode('MEMORY'); setStressMenuOpen(false); addToast('Stress Test Started', 'Simulating Memory Leak...', 'warning'); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-xs text-amber-400 flex items-center gap-2"><Zap size={12}/> Memory Leak</button>
                     <button onClick={() => { setStressTestMode('NETWORK'); setStressMenuOpen(false); addToast('Stress Test Started', 'Simulating Network Spike...', 'warning'); }} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-xs text-sky-400 flex items-center gap-2"><Globe size={12}/> Network Spike</button>
                   </div>
                 )}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-default group">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                <span className="text-xs text-slate-300 font-mono group-hover:text-emerald-300 transition-colors">host: production-server-01</span>
              </div>
           </div>
        </header>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                stats={stats} 
                history={history} 
                aiResult={aiResult} 
                onRunAI={runAiAnalysis}
                isAiLoading={isAiLoading}
                logs={logs}
              />
            )}
            
            {activeTab === 'processes' && (
              <div className="h-[calc(100vh-12rem)]">
                <ProcessTable 
                  processes={processes} 
                  systemStats={stats}
                  onKill={handleKillProcess}
                  onRenice={handleRenice}
                  onToggleState={handleToggleState}
                />
              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="h-[calc(100vh-12rem)]">
                <HardwarePanel 
                  thermal={stats.thermal}
                  history={history}
                />
              </div>
            )}

            {activeTab === 'network' && (
              <div className="h-[calc(100vh-12rem)]">
                <NetworkPanel 
                  connections={networkConnections}
                  uploadSpeed={stats.network.uploadSpeed}
                  downloadSpeed={stats.network.downloadSpeed}
                />
              </div>
            )}

            {activeTab === 'services' && (
              <div className="h-[calc(100vh-12rem)]">
                <ServicePanel 
                   services={services}
                   onToggleService={handleToggleService}
                />
              </div>
            )}

            {activeTab === 'disk' && (
              <div className="h-[calc(100vh-12rem)]">
                <DiskPanel 
                   nodes={diskNodes}
                   diskStats={stats.disk}
                />
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="glass-panel rounded-lg overflow-hidden shadow-lg animate-fade-in-up">
                <div className="p-4 bg-slate-900/40 border-b border-slate-700/50 flex justify-between items-center">
                   <h3 className="font-semibold text-white flex items-center gap-2">
                     <FileText size={18} className="text-slate-400" /> Security & Event Log
                   </h3>
                   <div className="flex gap-4">
                     <button onClick={() => setAlerts([])} className="text-xs text-slate-400 hover:text-white transition-colors">Clear Alerts</button>
                     <button onClick={() => setLogs([])} className="text-xs text-slate-400 hover:text-white transition-colors">Clear Logs</button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-700/50">
                  {/* Alerts Column */}
                  <div className="p-4">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Critical Alerts</h4>
                     <div className="space-y-2">
                      {alerts.length === 0 ? (
                          <div className="p-8 text-center text-slate-600 text-sm border border-dashed border-slate-700/50 rounded-lg">No critical alerts detected.</div>
                      ) : (
                          alerts.map((alert, idx) => (
                            <div key={idx} className="p-3 bg-slate-900/50 rounded border border-slate-700/50 flex items-start gap-3 hover:border-slate-600 transition-colors animate-fade-in-up">
                                <div className={clsx("p-1.5 rounded bg-slate-800", 
                                  alert.type === 'Critical' ? "text-rose-500" : 
                                  alert.type === 'Warning' ? "text-amber-500" : "text-blue-500"
                                )}>
                                  <AlertTriangle size={16} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                      <span className={clsx("text-xs font-bold", 
                                        alert.type === 'Critical' ? "text-rose-400" : "text-amber-400"
                                      )}>{alert.type}</span>
                                      <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                                  </div>
                                  <p className="text-slate-300 text-xs mt-1">{alert.message}</p>
                                </div>
                            </div>
                          ))
                      )}
                     </div>
                  </div>
                  
                  {/* Raw Logs Column */}
                  <div className="p-4 bg-slate-950/30">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Kernel Log Stream</h4>
                     <div className="space-y-1 font-mono text-[10px]">
                        {logs.slice().reverse().map((log) => (
                           <div key={log.id} className="flex gap-2 text-slate-400 hover:bg-slate-800/50 p-1 rounded transition-colors animate-fade-in-up">
                              <span className="text-slate-600 w-16">{log.timestamp}</span>
                              <span className={clsx("w-10 font-bold",
                                log.level === 'INFO' ? "text-blue-500" :
                                log.level === 'WARN' ? "text-amber-500" :
                                log.level === 'ERROR' ? "text-rose-500" : "text-emerald-500"
                              )}>{log.level}</span>
                              <span className="flex-1 text-slate-300 break-all">{log.message}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
