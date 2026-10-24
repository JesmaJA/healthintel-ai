
import { useLocation } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import "./Header.css";

const pageInfo = {
    "/": ["HEALTHCARE DATA PLATFORM", "Data Intelligence Dashboard"],
    "/clinics": ["RECORD MANAGEMENT", "Clinic Directory"],
    "/quality": ["DATA VALIDATION", "Data Quality Report"],
    "/duplicates": ["RECORD MATCHING", "Duplicate Detection"],
    "/ai-insights": ["AI-POWERED ANALYSIS", "AI Intelligence"],
};

export default function Header() {
    const { pathname } = useLocation();
    const [eyebrow, title] = pageInfo[pathname] || pageInfo["/"];

    return (
        <header className="app-header">
            <div className="header-title">
                <p>{eyebrow}</p>
                <h1>{title}</h1>
                <span>Monitor clinic information and healthcare data quality.</span>
            </div>

            <button
                className="header-refresh"
                onClick={() => window.location.reload()}
                title="Reload current page"
            >
                <RefreshCw size={16} />
                <span>Refresh</span>
            </button>
        </header>
    );
}
