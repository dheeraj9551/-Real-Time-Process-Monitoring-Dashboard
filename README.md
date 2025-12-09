Real-Time Process Monitoring Dashboard
A Modern OS-Level Analytics & Process Management Tool

This project is a professional real-time system monitoring dashboard built using Python, CustomTkinter, psutil, and Matplotlib.
It provides live analytics of CPU, memory, disk, network usage, and full process management — all inside a beautifully designed premium UI.

This tool was developed as part of Operating Systems (CSE316) at Lovely Professional University.

🌐 Live Project Demo

🔗 https://realtimeprocessmonitoringdashboard.netlify.app

🚀 Features
🖥️ Real-Time System Monitoring

Live CPU usage (per-second updates)

Dynamic memory statistics

Disk usage, read/write speed

Network upload & download rate

System uptime & battery status

Auto-refresh with smooth animations

⚙️ Advanced Process Management

View all active processes

Sort by CPU, Memory, PID, Threads, Status

Live search bar

Color-highlighted high-usage tasks

Kill/Terminate any process

View detailed metadata (command, RAM, threads, user, etc.)

📊 Performance Visualization

Real-time CPU usage graph

Real-time memory usage graph

Smooth, low-latency rendering

Auto-optimizing update cycle (prevents lag)

🔔 Smart Alert Engine

High CPU alert

Memory pressure alert

Low disk space alert

Swap usage alert

Visual + color-coded alert cards

📁 Export & Reporting

Export full system snapshot:

.csv

.json

Includes: system stats + top processes + alerts.

🎨 Premium UI / UX

Modern dark-mode dashboard

Sidebar navigation with icons

Elegant cards, spacing, typography

Clean layout for professional appearance

🛠️ Tech Stack
Layer	Technology
UI Framework	CustomTkinter
System Engine	psutil
Graph Rendering	Matplotlib
Language	Python 3.x
Threading	Python’s threading module
Deployment	Netlify (demo page)
📦 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/dheeraj9551/-Real-Time-Process-Monitoring-Dashboard.git
cd Real-Time-Process-Monitoring-Dashboard

2️⃣ Create Virtual Environment
python -m venv venv

3️⃣ Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1


If you get execution policy errors:

Set-ExecutionPolicy Unrestricted -Scope Process

4️⃣ Install Dependencies
pip install -r requirements.txt

▶️ Run the Application
python dashboard_polished_final.py

📸 Screenshots (Add your images here)

You can add:

Dashboard view

CPU & Memory graphs

Process manager

Alerts panel

Example:

![Dashboard Screenshot](images/dashboard.png)
![Process View](images/processes.png)

📂 Project Structure
📁 OS-Project/
│── dashboard_polished_final.py      # Main application
│── system_logs/                     # Exported logs
│── requirements.txt                 # Dependencies
│── README.md                        # (this file)

🎓 Academic Purpose

This project demonstrates real OS concepts:

CPU scheduling

Process control

Memory monitoring

File system usage

System resource visualization

Real-time event handling

Built for CSE316 – Operating Systems at LPU.

👨‍💻 Developer

Dheeraj Pothula
B.Tech CSE — Lovely Professional University
Passionate about OS tools, UI engineering, and real-time dashboards.

📜 License
MIT License
