
import { ProcessPriority } from "./types";

export const SYSTEM_PROCESS_NAMES = [
  'kernel_task', 'launchd', 'syslogd', 'UserEventAgent', 'kextd', 
  'systemstats', 'configd', 'powerd', 'logd', 'distnoted'
];

export const USER_PROCESS_NAMES = [
  'chrome', 'slack', 'code', 'node', 'spotify', 'docker', 
  'postgres', 'python', 'java', 'terminal', 'zoom', 'finder', 
  'electron', 'windowserver', 'mds_stores', 'teams', 'music', 'notion'
];

export const SERVICE_DEFINITIONS = [
  { name: 'docker.service', description: 'Docker Application Container Engine' },
  { name: 'postgresql.service', description: 'PostgreSQL RDBMS' },
  { name: 'nginx.service', description: 'A high performance web server' },
  { name: 'ssh.service', description: 'OpenBSD Secure Shell server' },
  { name: 'cron.service', description: 'Regular background program processing daemon' },
  { name: 'bluetooth.service', description: 'Bluetooth service' },
  { name: 'networking.service', description: 'Raise network interfaces' },
  { name: 'ufw.service', description: 'Uncomplicated firewall' },
  { name: 'rsyslog.service', description: 'System Logging Service' },
  { name: 'accounts-daemon.service', description: 'Accounts Service' }
];

export const DISK_DIRECTORIES = [
  { name: '/usr/lib', baseSize: 4500, color: '#6366f1' },
  { name: '/var/log', baseSize: 1200, color: '#ec4899' },
  { name: '/home/user', baseSize: 15000, color: '#10b981' },
  { name: '/opt/docker', baseSize: 8000, color: '#3b82f6' },
  { name: '/System', baseSize: 12000, color: '#f59e0b' },
  { name: '/tmp', baseSize: 500, color: '#64748b' }
];

export const TOTAL_MEMORY_MB = 32768; // 32GB for enterprise feel
export const MAX_PROCESSES = 80;
export const DISK_SIZE_GB = 1024; // 1TB

// Base presets for simulation realism
export const PROCESS_PRESETS: Record<string, { baseCpu: number; baseMem: number; priority: ProcessPriority; isSystem: boolean; baseThreads: number }> = {
  'kernel_task': { baseCpu: 5, baseMem: 800, priority: ProcessPriority.REALTIME, isSystem: true, baseThreads: 140 },
  'windowserver': { baseCpu: 15, baseMem: 1200, priority: ProcessPriority.HIGH, isSystem: true, baseThreads: 45 },
  'chrome': { baseCpu: 25, baseMem: 2500, priority: ProcessPriority.NORMAL, isSystem: false, baseThreads: 60 },
  'docker': { baseCpu: 10, baseMem: 4000, priority: ProcessPriority.NORMAL, isSystem: false, baseThreads: 120 },
  'code': { baseCpu: 5, baseMem: 1500, priority: ProcessPriority.NORMAL, isSystem: false, baseThreads: 30 },
  'slack': { baseCpu: 3, baseMem: 800, priority: ProcessPriority.LOW, isSystem: false, baseThreads: 15 },
  'node': { baseCpu: 30, baseMem: 600, priority: ProcessPriority.HIGH, isSystem: false, baseThreads: 12 },
  'java': { baseCpu: 15, baseMem: 3000, priority: ProcessPriority.NORMAL, isSystem: false, baseThreads: 45 },
  'postgres': { baseCpu: 8, baseMem: 1200, priority: ProcessPriority.HIGH, isSystem: false, baseThreads: 25 },
};
