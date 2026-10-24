
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Building2,
    CheckCircle2,
    Clock3,
    CopyCheck,
    RefreshCw,
    Search,
    XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getClinics, getQualityReport } from "../services/api";
import StatCard from "../components/common/StatCard";
import "./Dashboard.css";

export default function Dashboard() {
    const [clinics, setClinics] = useState([]);
    const [report, setReport] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const [clinicData, qualityData] = await Promise.all([
                getClinics(),
                getQualityReport(),
            ]);

            // Supports both standard DRF arrays and paginated responses.
            setClinics(
                Array.isArray(clinicData) ? clinicData : clinicData.results || []
            );
            setReport(qualityData);
        } catch (err) {
            console.error("Dashboard API error:", err);
            setError(
                "Unable to load dashboard data. Check that Django is running and the API is accessible."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();
    }, [loadDashboard]);

    const filteredClinics = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return clinics.slice(0, 5);

        return clinics
            .filter((clinic) =>
                [
                    clinic.name,
                    clinic.suburb,
                    clinic.state,
                    clinic.category,
                    clinic.email,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            )
            .slice(0, 10);
    }, [clinics, search]);

    const qualityById = useMemo(
        () => new Map((report?.records || []).map((record) => [record.id, record])),
        [report]
    );

    const lastUpdated = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (loading) {
        return (
            <div className="dashboard-state">
                <RefreshCw className="loading-spinner" size={25} />
                <h2>Loading your dashboard</h2>
                <p>Connecting to the HealthIntel data services...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <section className="dashboard-welcome">
                <div>
                    <div className="dashboard-live-label">
                        <span className="dashboard-live-dot" />
                        DATA SERVICES
                    </div>
                    <h2>Your healthcare data at a glance</h2>
                    <p>
                        Monitor clinic records, data quality, and potential duplicates
                        from one workspace.
                    </p>
                </div>

                <button
                    className="dashboard-refresh"
                    onClick={() => loadDashboard(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "loading-spinner" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh data"}
                </button>
            </section>

            {error && (
                <div className="dashboard-error" role="alert">
                    <XCircle size={20} />
                    <div>
                        <strong>Dashboard connection issue</strong>
                        <p>{error}</p>
                    </div>
                    <button onClick={() => loadDashboard(true)}>Retry</button>
                </div>
            )}

            {report && (
                <>
                    <section className="dashboard-stats">
                        <StatCard
                            title="Total Clinics"
                            value={report.total_clinics}
                            description="Clinic records in the database"
                            icon={Building2}
                            color="green"
                        />

                        <StatCard
                            title="Needs Review"
                            value={report.records_needing_review}
                            description="Records with validation issues"
                            icon={AlertTriangle}
                            color="orange"
                        />

                        <StatCard
                            title="Possible Duplicates"
                            value={report.duplicate_candidates}
                            description="Potential matching records"
                            icon={CopyCheck}
                            color="purple"
                        />

                        <StatCard
                            title="Records Checked"
                            value={report.records?.length ?? 0}
                            description="Records included in the report"
                            icon={CheckCircle2}
                            color="blue"
                        />
                    </section>

                    <section className="dashboard-content-grid">
                        <div className="dashboard-panel clinic-panel">
                            <div className="dashboard-panel-heading">
                                <div>
                                    <h3>Clinic Directory</h3>
                                    <p>
                                        {search
                                            ? "Search results from your clinic records"
                                            : "Recently listed clinic records"}
                                    </p>
                                </div>

                                <Link className="dashboard-text-link" to="/clinics">
                                    View all <ArrowRight size={15} />
                                </Link>
                            </div>

                            <div className="dashboard-search">
                                <Search size={17} />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search name, location or category..."
                                    aria-label="Search clinic records"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="dashboard-table-wrap">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>CLINIC</th>
                                            <th>LOCATION</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClinics.map((clinic) => {
                                            const record = qualityById.get(clinic.id);
                                            const isGood = record?.status === "good";

                                            return (
                                                <tr key={clinic.id}>
                                                    <td>
                                                        <strong>{clinic.name}</strong>
                                                        <span className="dashboard-table-secondary">
                                                            {clinic.email || "No email provided"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {[
                                                            clinic.suburb,
                                                            clinic.state,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ") || "Not provided"}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`dashboard-status ${isGood ? "status-good" : "status-review"
                                                                }`}
                                                        >
                                                            {isGood ? (
                                                                <CheckCircle2 size={13} />
                                                            ) : (
                                                                <AlertTriangle size={13} />
                                                            )}
                                                            {isGood ? "Good" : "Needs review"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {filteredClinics.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="dashboard-empty">
                                                    No clinics found. Try another search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="dashboard-panel-footer">
                                Showing {filteredClinics.length} clinic
                                {filteredClinics.length === 1 ? "" : "s"}
                                {search ? " matching your search" : " "}
                            </div>
                        </div>

                        <aside className="dashboard-side-column">
                            <div className="dashboard-panel quality-summary">
                                <div className="dashboard-panel-heading">
                                    <div>
                                        <h3>Data Quality</h3>
                                        <p>Latest validation results</p>
                                    </div>
                                    <Activity size={20} />
                                </div>

                                <div className="quality-summary-number">
                                    {Math.max(
                                        0,
                                        report.total_clinics - report.records_needing_review
                                    )}
                                    <span> / {report.total_clinics}</span>
                                </div>
                                <p className="quality-summary-caption">
                                    Records without detected issues
                                </p>

                                <div className="quality-progress-track">
                                    <div
                                        className="quality-progress-value"
                                        style={{
                                            width: `${report.total_clinics > 0
                                                ? Math.max(
                                                    0,
                                                    ((report.total_clinics -
                                                        report.records_needing_review) /
                                                        report.total_clinics) *
                                                    100
                                                )
                                                : 0
                                                }%`,
                                        }}
                                    />
                                </div>

                                <Link className="dashboard-action-link" to="/quality">
                                    Review data quality <ArrowRight size={15} />
                                </Link>
                            </div>

                            <div className="dashboard-panel system-summary">
                                <div className="system-summary-title">
                                    <span className="system-summary-icon">
                                        <Clock3 size={18} />
                                    </span>
                                    <div>
                                        <h3>System Overview</h3>
                                        <p>Local development environment</p>
                                    </div>
                                </div>

                                <div className="system-row">
                                    <span>Django API</span>
                                    <span className="system-online">
                                        <span /> Connected
                                    </span>
                                </div>
                                <div className="system-row">
                                    <span>Quality report</span>
                                    <strong>Available</strong>
                                </div>
                                <div className="system-row">
                                    <span>Last refreshed</span>
                                    <strong>{lastUpdated}</strong>
                                </div>
                            </div>
                        </aside>
                    </section>

                    <footer className="dashboard-footer">
                        <span>HealthIntel AI · Healthcare Data Intelligence</span>
                        <span>Use verified data for operational decisions.</span>
                    </footer>
                </>
            )}
        </div>
    );
}
