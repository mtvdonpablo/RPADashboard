# RPA Metrics Dashboard

A dashboard designed to highlight the impact of automations built using UiPath.

The **RPA Metrics Dashboard** provides leadership with a clear view of key performance indicators (KPIs) that reflect the impact and growth of the automation team. By visualizing performance trends, the dashboard helps leadership:

- Evaluate progress against organizational goals  
- Identify opportunities for improvement  
- Make informed decisions on resource allocation and scaling initiatives  

---

## 🧰 Tech Stack

### Frontend
- **React 19**
- **Vite** (blazing-fast dev/build tool)
- **Chakra UI** (UI components + design system)
- **Recharts** (charting library)
- **Framer Motion** (animations)
- **Axios** (API communication)

### Backend
- **Node.js**
- **Express.js**

### Database
- **Microsoft SQL Server**

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/mtvdonpablo/RPADashboard.git
cd RPADashboard
```
### 2. Install dependencies
npm install

### 3. Configure environment variables
Create a .env.development.local file in the project root:
# Example values
PORT=5000
SQL_SERVER=your_sql_server_address
SQL_DATABASE=your_database_name
SQL_SERVER_PORT=your_sql_server_port
PROJECT_IDS=comma_separated_list_of_project_ids
FTE_HOURS_PER_YEAR=your_fte_hours_per_year

### 4. Start the development environment
Frontend:
npm run dev
Backend:
npm run devStart