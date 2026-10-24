
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    CopyCheck,
    Search,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Building2,
    XCircle,
    GitCompareArrows,
    Info,
} from "lucide-react";

import { getQualityReport } from "../services/api";
import "./Duplicates.css";

export default function Duplicates() {
    const [report, setReport] = useState(null);
    const [search, setSearch] = useState("");
    const [minimumSimilarity, setMinimumSimilarity] = useState("all");
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
            console.error("Duplicate detection error:", err);
            setError(
                "Unable to load duplicate candidates. Check that Django is running and try again."
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

    const duplicates = report?.duplicates ?? [];

    const filteredDuplicates = useMemo(() => {
        const query = search.trim().toLowerCase();

        return duplicates.filter((item) => {
            const searchableText = [
                item.clinic_1_name,
                item.clinic_2_name,
                item.clinic_1_id,
                item.clinic_2_id,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(query);

            const similarity = Number(item.similarity || 0);
            const matchesSimilarity =
                minimumSimilarity === "all" ||
                similarity >= Number(minimumSimilarity);

            return matchesSearch && matchesSimilarity;
        });
    }, [duplicates, search, minimumSimilarity]);

    const highSimilarityCount = duplicates.filter(
        (item) => Number(item.similarity || 0) >= 0.95
    ).length;

    if (loading) {
        return (
            <div className="duplicates-state">
                <RefreshCw className="duplicates-spin" size={25} />
                <h2>Checking duplicate candidates</h2>
                <p>Loading results from the clinic matching engine...</p>
            </div>
        );
    }

    return (
        <div className="duplicates-page">
            <section className="duplicates-intro">
                <div>
                    <div className="duplicates-eyebrow">
                        <GitCompareArrows size={16} />
                        RECORD MATCHING CENTER
                    </div>

                    <h2>Duplicate Detection</h2>

                    <p>
                        Review potentially matching clinic records and inspect their
                        similarity scores before making corrections.
                    </p>
                </div>

                <button
                    className="duplicates-refresh"
                    onClick={() => loadReport(true)}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={16}
                        className={refreshing ? "duplicates-spin" : ""}
                    />
                    {refreshing ? "Checking..." : "Refresh results"}
                </button>
            </section>

            {error && (
                <div className="duplicates-error" role="alert">
                    <XCircle size={19} />
                    <span>{error}</span>
                    <button onClick={() => loadReport(true)}>Retry</button>
                </div>
            )}

            {report && (
                <>
                    <section className="duplicates-stats">
                        <article className="duplicates-stat-card">
                            <span className="duplicates-stat-icon purple">
                                <CopyCheck size={21} />
                            </span>
                            <p>Duplicate candidates</p>
                            <strong>{duplicates.length}</strong>
                            <small>Pairs flagged by the matching engine</small>
                        </article>

                        <article className="duplicates-stat-card">
                            <span className="duplicates-stat-icon orange">
                                <AlertTriangle size={21} />
                            </span>
                            <p>High name similarity</p>
                            <strong>{highSimilarityCount}</strong>
                            <small>Pairs with name similarity of 95% or higher</small>
                        </article>

                        <article className="duplicates-stat-card">
                            <span className="duplicates-stat-icon green">
                                <CheckCircle2 size={21} />
                            </span>
                            <p>Records checked</p>
                            <strong>{report.total_clinics}</strong>
                            <small>Clinic records analyzed</small>
                        </article>
                    </section>

                    <section className="duplicates-info-banner">
                        <Info size={19} />
                        <div>
                            <strong>Review candidates before taking action</strong>
                            <p>
                                Similar names do not prove that records refer to the same
                                clinic. Confirm the details before editing or deleting any
                                record.
                            </p>
                        </div>
                    </section>

                    <section className="duplicates-panel">
                        <div className="duplicates-panel-heading">
                            <div>
                                <h3>Potential matches</h3>
                                <p>Compare the records flagged by the current rules.</p>
                            </div>

                            <span className="duplicates-count">
                                {filteredDuplicates.length}{" "}
                                {filteredDuplicates.length === 1 ? "pair" : "pairs"}
                            </span>
                        </div>

                        <div className="duplicates-toolbar">
                            <label className="duplicates-search">
                                <Search size={17} />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search clinic names or record IDs..."
                                    aria-label="Search duplicate candidates"
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

                            <select
                                value={minimumSimilarity}
                                onChange={(event) => setMinimumSimilarity(event.target.value)}
                                aria-label="Filter by minimum name similarity"
                            >
                                <option value="all">All similarity scores</option>
                                <option value="0.9">90% and above</option>
                                <option value="0.95">95% and above</option>
                                <option value="0.98">98% and above</option>
                            </select>
                        </div>

                        {filteredDuplicates.length > 0 ? (
                            <div className="duplicate-cards">
                                {filteredDuplicates.map((item, index) => {
                                    const similarity = Math.round(
                                        Number(item.similarity || 0) * 100
                                    );

                                    return (
                                        <article
                                            className="duplicate-match-card"
                                            key={`${item.clinic_1_id}-${item.clinic_2_id}`}
                                        >
                                            <div className="duplicate-card-heading">
                                                <div className="duplicate-match-number">
                                                    <CopyCheck size={17} />
                                                    <span>Potential match #{index + 1}</span>
                                                </div>

                                                <span className="duplicate-review-badge">
                                                    <AlertTriangle size={13} />
                                                    Needs review
                                                </span>
                                            </div>

                                            <div className="duplicate-comparison">
                                                <div className="duplicate-record">
                                                    <span className="duplicate-record-label">
                                                        RECORD A
                                                    </span>
                                                    <div className="duplicate-record-title">
                                                        <span className="duplicate-building-icon">
                                                            <Building2 size={19} />
                                                        </span>
                                                        <div>
                                                            <h4>{item.clinic_1_name}</h4>
                                                            <p>ID: {item.clinic_1_id}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="duplicate-versus">
                                                    <GitCompareArrows size={20} />
                                                    <span>VS</span>
                                                </div>

                                                <div className="duplicate-record">
                                                    <span className="duplicate-record-label">
                                                        RECORD B
                                                    </span>
                                                    <div className="duplicate-record-title">
                                                        <span className="duplicate-building-icon">
                                                            <Building2 size={19} />
                                                        </span>
                                                        <div>
                                                            <h4>{item.clinic_2_name}</h4>
                                                            <p>ID: {item.clinic_2_id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="duplicate-similarity">
                                                <div className="duplicate-similarity-heading">
                                                    <span>Name similarity</span>
                                                    <strong>{similarity}%</strong>
                                                </div>

                                                <div
                                                    className="duplicate-similarity-track"
                                                    role="progressbar"
                                                    aria-label="Clinic name similarity"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={similarity}
                                                >
                                                    <div
                                                        className="duplicate-similarity-fill"
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, similarity))}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="duplicate-card-footer">
                                                <span>
                                                    Matching rule: similar names and identical addresses
                                                </span>

                                                <Link
                                                    to="/clinics"
                                                    className="duplicate-review-link"
                                                >
                                                    Open directory <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="duplicates-empty">
                                <span className="duplicates-empty-icon">
                                    <CheckCircle2 size={29} />
                                </span>

                                <h3>
                                    {duplicates.length === 0
                                        ? "No duplicate candidates found"
                                        : "No matching results"}
                                </h3>

                                <p>
                                    {duplicates.length === 0
                                        ? "The current matching rules did not flag any clinic pairs. This does not guarantee that every record is unique."
                                        : "Try changing your search or similarity filter."}
                                </p>

                                {(search || minimumSimilarity !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setMinimumSimilarity("all");
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    <footer className="duplicates-footer">
                        HealthIntel AI · Duplicate matching uses the current Python
                        similarity rules. All candidates require human verification.
                    </footer>
                </>
            )}
        </div>
    );
}
