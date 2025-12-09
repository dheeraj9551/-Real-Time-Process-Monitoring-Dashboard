
export enum ProcessState {
  RUNNING = 'Running',
  SLEEPING = 'Sleeping',
  STOPPED = 'Stopped',
  ZOMBIE = 'Zombie',
}

export enum ProcessPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  REALTIME = 'RealTime',
}

export interface Process {
  pid: number;
  name: string;
  user: string;
  state: ProcessState;
  cpuUsage: number; // Percentage 0-100
  memoryUsage: number; // MB
  priority: ProcessPriority;
  uptime: number; // Seconds
  command: string;
  isSystem: boolean; // Vital system process
  threads: number;
}

export interface NetworkStats {
  uploadSpeed: number; // KB/s
  downloadSpeed: number; // KB/s
}

export interface DiskStats {
  readSpeed: number; // MB/s
  writeSpeed: number; // MB/s
  totalSpace: number; // GB
  usedSpace: number; // GB
}

export interface BatteryStats {
  level: number; // %
  isCharging: boolean;
  timeLeft: number; // Minutes
}

export interface SystemAlert {
  id: string;
  type: 'Warning' | 'Critical' | 'Info';
  message: string;
  timestamp: string;
  component: 'CPU' | 'Memory' | 'Disk' | 'System';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'KERNEL';
  source: string;
  message: string;
}

export interface NetworkConnection {
  id: string;
  protocol: 'TCP' | 'UDP';
  localAddress: string;
  remoteAddress: string;
  state: 'LISTEN' | 'ESTABLISHED' | 'TIME_WAIT' | 'CLOSE_WAIT' | 'SYN_SENT';
  pid: number;
  processName: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'failed';
  subState: 'running' | 'dead' | 'exited';
  uptime: number;
  pid?: number;
}

export interface DiskNode {
  name: string;
  size: number; // MB
  color: string;
  percentage: number;
}

export interface ThermalStats {
  cpuTemp: number; // Celsius
  gpuTemp: number; // Celsius
  fanSpeed: number; // RPM
  voltage: number; // V
}

export interface SystemStats {
  totalCpuUsage: number;
  loadAverage: [number, number, number]; // 1m, 5m, 15m
  totalMemoryUsage: number; // MB
  totalMemoryAvailable: number; // MB
  totalProcesses: number;
  runningProcesses: number;
  sleepingProcesses: number;
  uptime: number; // System uptime in seconds
  timestamp: number;
  network: NetworkStats;
  disk: DiskStats;
  battery: BatteryStats;
  healthScore: number; // 0-100
  activeThreads: number;
  thermal: ThermalStats;
}

export interface SystemHistoryPoint {
  time: string;
  cpu: number;
  memory: number;
  netIn: number;
  netOut: number;
  diskRead: number;
  diskWrite: number;
  temp: number;
}

export interface AIAnalysisResult {
  status: 'Healthy' | 'Warning' | 'Critical';
  summary: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Added 'info' to type definition to support help messages in Terminal
export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
}
