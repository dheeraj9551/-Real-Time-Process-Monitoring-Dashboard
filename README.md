# ⚡ Real-Time Process Monitoring Dashboard  
### Advanced OS Simulation • Resource Visualization • Enterprise UI  
**Built with React + TypeScript + TailwindCSS**

This project is a **professional-grade Real-Time System Monitoring Dashboard** designed to simulate OS-level telemetry including **CPU, memory, disk, network, processes, services, logs, alerts, hardware sensors, thermal monitoring, GPU stats**, and more.

Designed with a futuristic, enterprise-style UI inspired by **Kali Linux, macOS Activity Monitor & Cloud DevOps Dashboards**, this project demonstrates deep understanding of:

- Operating Systems (CSE316)
- Process Scheduling & Management
- System Resource Monitoring
- Event Logging & Alert Handling
- Performance Visualization
- UI/UX Engineering in Web Development
- Real-time Simulation & Telemetry Pipelines

---

## 📸 Screenshots

### 🏠 Dashboard Overview
<img width="1919" height="909" alt="Screenshot 2025-12-09 142413" src="https://github.com/user-attachments/assets/ff9fc350-6323-49b8-8dbd-e4823b4f092e" />


### ⚙️ Process Manager
<img width="1919" height="909" alt="Screenshot 2025-12-09 142445" src="https://github.com/user-attachments/assets/e87ef74d-f934-4089-ad06-afbb0a034c3b" />


### 🧠 AI System Analysis
<img width="1919" height="911" alt="Screenshot 2025-12-09 170227" src="https://github.com/user-attachments/assets/76b68605-6d25-4c2f-a247-09d8f3bc1f94" />


### 🌐 Network Monitoring
<img width="1638" height="737" alt="Screenshot 2025-12-09 170350" src="https://github.com/user-attachments/assets/11b1a88d-81ee-4b84-9448-ffc221fd62ec" />


---

## 🚀 Live Demo  
🔗 **realtimeprocessmonitoringdashboard.netlify.app**

Explore the dashboard fully in the browser — no installation required.

---

## 🧩 Features

### 🖥️ **System Overview**
- Real-time CPU usage, memory usage, disk IO, network throughput  
- Health Score calculation using multi-factor OS metrics  
- Live telemetry stream with 40-point historical graph  

### ⚙️ **Process Manager**
- Simulated OS processes with:
  - CPU %, Memory %, Threads, State  
  - Renice (priority management)  
  - Start/Stop/Kill actions  
- Real-time updates every 1.5 seconds  

### 🌐 **Network Monitor**
- Upload / download rates  
- Active connection list  
- Automatic spike simulation  

### 💾 **Disk Analysis**
- Storage visualization  
- Real-time read/write speeds  
- Directory tree simulation  

### 🔧 **System Services**
- Start/Stop systemctl-style services  
- Service uptime & event logging  

### 🔥 **Hardware Sensors**
- CPU Temp, GPU Temp, fan speeds  
- Voltage monitor  
- Thermal history graph  

### 🧠 **AI System Analysis**
- Gemini-powered system health interpretation  
- Automatic diagnostics + recommendations  

### 🚨 **Alerts & Kernel Log Stream**
- Real-time critical warnings  
- System events, security logs, kernel messages  

### 🖥️ **Built-in Terminal**
- Toggle using `~`  
- Execute simulated commands:  
  - `kill`  
  - `top`  
  - `help`  
  - `inspect`  
  - `logs`  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| UI | TailwindCSS, Lucide Icons |
| Charts | Custom SVG charts |
| Simulation Engine | Custom CPU/memory/network/disk simulation pipeline |
| AI Engine | Gemini API |
| Deployment | Netlify |

---

## 📦 Installation (Local)

```bash
git clone https://github.com/dheeraj9551/-Real-Time-Process-Monitoring-Dashboard
cd Real-Time-Process-Monitoring-Dashboard

npm install
npm run dev
