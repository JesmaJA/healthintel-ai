
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    RefreshCw,
    Search,
    ArrowRight,
    XCircle,
    Info,
} from "lucide-react";

import { getQualityReport } from "../services/api";
import "./DataQuality.css";

const FILTERS = [
    { value: "all", label: "All records" },
    { value: "needs_review", label: "Needs review" },
    { value: "good", label: "Good records" },
];

export default function DataQuality() {
    const [report, setReport] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadReport = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const data = await getQualityReport();
            setReport(data);
        } catch (err) {
            console.error("Quality report error:", err);
            setError(
                "Unable to load the quality report. Check that Django is running and the API is accessible."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReport();
    }, [loadReport]);

    const records = report?.records ?? [];

    const filteredRecords = useMemo(() => {
        const query = search.trim().toLowerCase();

        return records.filter((record) => {
            const matchesStatus =
                statusFilter === "all" || record.status === statusFilter;

            const searchableText = [
                record.name,
                ...(record.issues || []),
                record.status,
                record.id,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesStatus && searchableText.includes(query);
        });
    }, [records, search, statusFilter]);

    const goodCount = records.filter(
        (record) => record.status === "good"
    ).length;

    // eslint-disable-next-line no-unused-vars
    const reviewCount = records.filter(
        (record) => record.status !== "good"
    ).length;

    const issueCount = records.reduce(
        (total, record) => total + (record.issues?.length || 0),
        0
    );

    const qualityRate =
        records.length > 0
            ? Math.round((goodCount / records.length) * 100)
            : 0;

    if (loading) {
        return (
            <div className="quality-page-state">
                <RefreshCw className="quality-spin" size={25} />
                <h2>Analyzing data quality</h2>
                <p>Loading clinic validation results...</p>
            </div>
        );
    }

    return (
        <div className="quality-page">
            <section className="quality-intro">
                <div>
                    <div className="quality-eyebrow">
                        <Activity size={15} />
                        DATA VALIDATION CENTER
                    </div>

                    <h2>Data Quality Report</h2>

                    <p>
                        Identify missing information, inspect validation issues, and
                        prioritize clinic records that need attention.
                    </p>
                </div>

                <button
                    className="quality-refresh-button"
                    onClick={() => loadReport(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "quality-spin" : ""}
                    />
                    {refreshing ? "Refreshing..." : "Refresh report"}
                </button>
            </section>

            {error && (
                <div className="quality-error" role="alert">
                    <XCircle size={19} />
                    <span>{error}</span>
                    <button onClick={() => loadReport(true)}>Retry</button>
                </div>
            )}

            {report && (
                <>
                    <section className="quality-stats">
                        <article className="quality-stat-card">
                            <span className="quality-stat-icon green">
                                <ClipboardCheck size={21} />
                            </span>
                            <p>Total records checked</p>
                            <strong>{report.total_clinics}</strong>
                            <small>Included in the latest report</small>
                        </article>

                        <article className="quality-stat-card">
                            <span className="quality-stat-icon orange">
                                <AlertTriangle size={21} />
                            </span>
                            <p>Records needing review</p>
                            <strong>{report.records_needing_review}</strong>
                            <small>Require further inspection</small>
                        </article>

                        <article className="quality-stat-card">
                            <span className="quality-stat-icon blue">
                                <CheckCircle2 size={21} />
                            </span>
                            <p>Records passing checks</p>
                            <strong>{goodCount}</strong>
                            <small>No issues detected by current rules</small>
                        </article>

                        <article className="quality-stat-card">
                            <span className="quality-stat-icon purple">
                                <Info size={21} />
                            </span>
                            <p>Total validation issues</p>
                            <strong>{issueCount}</strong>
                            <small>Across all reported records</small>
                        </article>
                    </section>

                    <section className="quality-overview-panel">
                        <div className="quality-overview-copy">
                            <span className="quality-overview-icon">
                                <Activity size={20} />
                            </span>
                            <div>
                                <h3>Overall data quality</h3>
                                <p>
                                    Percentage of records without detected validation issues.
                                </p>
                            </div>
                        </div>

                        <div className="quality-overview-result">
                            <strong>{qualityRate}%</strong>
                            <span>
                                {goodCount} of {records.length} records passed
                            </span>
                        </div>

                        <div
                            className="quality-progress-track"
                            role="progressbar"
                            aria-label="Records passing validation"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={qualityRate}
                        >
                            <div
                                className="quality-progress-fill"
                                style={{ width: `${qualityRate}%` }}
                            />
                        </div>
                    </section>

                    <section className="quality-records-panel">
                        <div className="quality-records-heading">
                            <div>
                                <h3>Validation results</h3>
                                <p>Inspect each clinic record and its detected issues.</p>
                            </div>

                            <span className="quality-results-count">
                                {filteredRecords.length} results
                            </span>
                        </div>

                        <div className="quality-toolbar">
                            <label className="quality-search">
                                <Search size={17} />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search clinics or validation issues..."
                                    aria-label="Search quality report"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                    >
                                        <XCircle size={15} />
                                    </button>
                                )}
                            </label>

                            <div
                                className="quality-filter-tabs"
                                aria-label="Filter records by status"
                            >
                                {FILTERS.map((filter) => (
                                    <button
                                        key={filter.value}
                                        className={
                                            statusFilter === filter.value ? "selected" : ""
                                        }
                                        onClick={() => setStatusFilter(filter.value)}
                                        aria-pressed={statusFilter === filter.value}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quality-table-wrap">
                            <table className="quality-table">
                                <thead>
                                    <tr>
                                        <th>CLINIC RECORD</th>
                                        <th>DETECTED ISSUES</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredRecords.map((record) => {
                                        const hasIssues = (record.issues || []).length > 0;

                                        return (
                                            <tr key={record.id}>
                                                <td>
                                                    <div className="quality-clinic-name">
                                                        <span
                                                            className={`quality-record-icon ${hasIssues ? "warning" : "success"
                                                                }`}
                                                        >
                                                            {hasIssues ? (
                                                                <AlertTriangle size={17} />
                                                            ) : (
                                                                <CheckCircle2 size={17} />
                                                            )}
                                                        </span>

                                                        <div>
                                                            <strong>{record.name}</strong>
                                                            <small>Record ID: {record.id}</small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {hasIssues ? (
                                                        <ul className="quality-issue-list">
                                                            {record.issues.map((issue, index) => (
                                                                <li key={`${record.id}-${index}`}>
                                                                    {issue}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="quality-no-issues">
                                                            No issues detected
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`quality-status-pill ${hasIssues ? "needs-review" : "passed"
                                                            }`}
                                                    >
                                                        {hasIssues ? (
                                                            <AlertTriangle size={13} />
                                                        ) : (
                                                            <CheckCircle2 size={13} />
                                                        )}
                                                        {hasIssues ? "Needs review" : "Good"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <Link
                                                        to="/clinics"
                                                        className="quality-action-link"
                                                        title="Open clinic directory to edit records"
                                                    >
                                                        Review <ArrowRight size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredRecords.length === 0 && (
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="quality-empty">
                                                    <Search size={27} />
                                                    <strong>No matching records</strong>
                                                    <p>
                                                        Try another search or choose a different status
                                                        filter.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setSearch("");
                                                            setStatusFilter("all");
                                                        }}
                                                    >
                                                        Clear filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="quality-table-footer">
                            <span>
                                Showing {filteredRecords.length} of {records.length} records
                            </span>
                            <span>Validation rules: current local engine</span>
                        </div>
                    </section>

                    <div className="quality-disclaimer">
                        <Info size={16} />
                        <p>
                            These results reflect the application's current validation
                            rules. A record marked “Good” has passed these checks only;
                            this does not independently verify the clinic's existence or
                            the clinical accuracy of its information.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
