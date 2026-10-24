
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Clinics from "./pages/Clinics";
import DataQuality from "./pages/DataQuality";
import Duplicates from "./pages/Duplicates";
import AIInsights from "./pages/AIInsights";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="app-main">
          <Header />

          <main className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/quality" element={<DataQuality />} />
              <Route path="/duplicates" element={<Duplicates />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
