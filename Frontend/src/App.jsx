import "./App.css";
import "./AppShell.jsx";
import AppShell from "./AppShell.jsx";
import Dashboard from "./Dashboard.jsx";
import {useState} from "react";

function App() {
  const [dateRange, setDateRange] = useState("all");

  return (
    <>
      <AppShell dateRange={dateRange} setDateRange={setDateRange}>
        <Dashboard dateRange={dateRange}/>
      </AppShell>
    </>
  );
}

export default App;
