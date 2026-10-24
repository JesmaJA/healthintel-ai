
import { NavLink } from "react-router-dom";
import {
    Activity,
    BrainCircuit,
    Building2,
    ClipboardCheck,
    CopyCheck,
    X,
    Menu,
} from "lucide-react";
import { useState } from "react";
import "./Sidebar.css";

const navigation = [
    { label: "Dashboard", path: "/", icon: Building2 },
    { label: "Clinic Directory", path: "/clinics", icon: Activity },
    { label: "Data Quality", path: "/quality", icon: ClipboardCheck },
    { label: "Duplicate Detection", path: "/duplicates", icon: CopyCheck },
    { label: "AI Intelligence", path: "/ai-insights", icon: BrainCircuit },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="mobile-menu-button"
                onClick={() => setOpen(!open)}
                aria-label="Toggle navigation"
                aria-expanded={open}
            >
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {open && (
                <button
                    className="sidebar-backdrop"
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
                <div className="sidebar-brand">
                    <div className="brand-symbol">
                        <Activity size={25} />
                    </div>
                    <div>
                        <h2>HealthIntel</h2>
                        <span>DATA INTELLIGENCE</span>
                    </div>
                </div>

                <p className="sidebar-label">WORKSPACE</p>

                <nav className="sidebar-navigation">
                    {navigation.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === "/"}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                            }
                            onClick={() => setOpen(false)}
                        >
                            <Icon size={19} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <span className="connection-dot" />
                    <div>
                        <strong>Development mode</strong>
                        <small>Django API integration</small>
                    </div>
                </div>
            </aside>
        </>
    );
}
