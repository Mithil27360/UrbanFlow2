# 🇮🇳 UrbanFlow2 - AI Logistics Optimization Platform : FRONTEND SIMULATION 



UrbanFlow2 is a functional prototype of an AI-powered logistics platform, designed for the Smart India Hackathon. It transforms India's complex supply chains from a reactive cost center into a predictive, strategic advantage using a hybrid AI approach.

This platform is designed to tackle severe bottlenecks in heavy industries (like steel) by optimizing vessel scheduling, port allocation, and inland routing, resulting in massive cost savings, reduced delays, and lower emissions.

**[Live Demo Link](https://urbanflow2supplychains.onrender.com/)** 

### 📺 Watch Our Full Demo Video

**[https://www.youtube.com/watch?v=HS-PkDaD7a4)**
---

## ✨ Key Features

This prototype demonstrates a complete, end-to-end user workflow:

* **Smart Data Validation:** A robust uploader that validates 6 required CSV files (ports, plants, vessels, etc.) for correct columns and data types before enabling optimization.
* **Interactive Map Visualization:** Automatically renders validated port (⚓) and plant (🏭) locations on an interactive Leaflet.js map for a clear geographical overview.
* **Multi-Stage AI Processing (Simulated):** A detailed loading animation that simulates the multi-algorithm workflow:
    1.  🧠 **GNN Predictions:** Forecasting delays.
    2.  🧬 **Genetic Algorithm:** Generating initial solutions.
    3.  🔧 **ALNS Refinement:** Improving solution quality.
    4.  🎯 **Tabu Search:** Final optimization polish.
* **Dynamic Results Dashboard:** Displays the final, optimized vessel schedule and quantifies the benefits with a live KPI dashboard (Total Cost, Capacity Utilization, etc.).
* **"What-If" Scenario Simulator:** Allows planners to adjust variables like port delays and fuel costs in real-time to see the impact on cost and efficiency.
* **Seamless Demo Mode:** A one-click "Demo Mode" that instantly populates the app with sample data, allowing judges to test the full workflow seamlessly.
* **Compliance & Reporting:** Features for generating reports, viewing a full audit trail, and exporting results to CSV.
* **Bilingual & Accessible:** Designed for accessibility with bilingual (English/Hindi) support.
* **Responsive Design:** A professional, government-themed UI that works on all devices, with light and dark mode support.

## 💡 Core Technical Concept: Why a Hybrid AI Model is Compulsory

A logistics problem of this scale, involving billions of possible routes and schedules, cannot be solved by a single algorithm.

* **The Problem with MILP:** A standard **Mixed-Integer Linear Programming (MILP)** model would face a 'combinatorial explosion'. Trying to calculate every possibility would take weeks, making it useless for real-time decisions. It also struggles with real-world uncertainty like sudden port congestion.

* **Our Hybrid Solution (Simulated):** A multi-algorithm approach is compulsory. Our system is designed to work like a team of specialists:
    1.  **GNN (The Forecaster):** A **Graph Neural Network** (e.g., using *PyTorch Geometric*) analyzes historical data to predict future port congestion and delays.
    2.  **GA (The Explorer):** A **Genetic Algorithm** quickly generates a wide range of good, feasible solutions as strong starting points.
    3.  **ALNS (The Refiner):** An **Adaptive Large Neighborhood Search (ALNS)** takes the best solutions and intelligently refines them, guided by the GNN's predictions to efficiently find the optimal path.
    4.  **MILP (The Enforcer):** Finally, **MILP** is used for what it's best at: enforcing hard business rules and fine-tuning the final shipment volumes, improving the solution by an extra 5-15%.

This hybrid approach provides the predictive power of neural networks, the speed of heuristics, and the precision of linear programming.

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+ Classes)
* **Libraries:** [Leaflet.js](https://leafletjs.com/) (Interactive Maps), [PapaParse](https://www.papaparse.com/) (CSV Parsing), [Chart.js](https://www.chartjs.org/) (for KPI charts - planned)
* **Simulated Backend (Design):**
    * **Data:** Pandas
    * **AI/ML:** PyTorch Geometric (GNN)
    * **Optimization:** DEAP/PyGAD (Genetic Algorithm), SciPy (ALNS), PuLP/CPLEX (MILP)

## 🇮🇳 Alignment with National Priorities

UrbanFlow2 is explicitly designed to support India's national and global goals.

* **UN Sustainable Development Goals (SDG):**
    * **SDG 9:** Industry, Innovation, and Infrastructure
    * **SDG 12:** Responsible Consumption and Production
    * **SDG 13:** Climate Action
* **National Priorities:**
    * **Environmental & Sustainability:** Aligns with the National Logistics Policy 2025.
    * **Industrial Safety:** Follows ISO 45001 standards.
    * **Cybersecurity:** Adheres to DPDP Rules 2025.
    * **National Logistics Policy:** Drives multimodal integration and cost optimization.
    * **PM GatiShakti:** Provides a digital ecosystem for infrastructure integration.
    * **Make in India:** An indigenously developed solution for Indian industry.


### How to Use the Dashboard

#### Method 1: Demo Mode (Recommended)

1.  On the `dashboard.html` page, click the **"🎮 Demo Mode"** button.
2.  The application will instantly load with sample data.
3.  Click the **"Run Optimization"** button to see the full workflow.
4.  Explore the generated schedule, KPIs, and scenario simulator.

#### Method 2: Use Your Own Data

1.  On the dashboard, click the **"📋 Download Templates"** button to get the 6 required CSV files.
2.  Fill them with your own data (ensuring latitude/longitude are included for ports and plants).
3.  Upload all 6 files to their respective dropzones. The system will validate them in real-time.
4.  Once all 6 files are validated, the **"Run Optimization"** button will activate. Click it to run the process.

]
