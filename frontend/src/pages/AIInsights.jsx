
import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    BrainCircuit,
    CheckCircle2,
    CircleAlert,
    ClipboardList,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { getQualityReport } from "../services/api";
import "./AIInsights.css";

function AIInsights() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadInsights = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getQualityReport();
            setReport(data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to load insights. Check that Django is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInsights();
    }, []);

    const insights = useMemo(() => {
        if (!report) return [];

        const records = report.records || [];
        const duplicates = report.duplicates || [];
        const total = report.total_clinics || 0;
        const needsReview = report.records_needing_review || 0;
        const goodRecords = Math.max(total - needsReview, 0);
        const qualityRate = total
            ? Math.round((goodRecords / total) * 100)
            : 0;

        const issueCounts = {};

        records.forEach((record) => {
            (record.issues || []).forEach((issue) => {
                issueCounts[issue] = (issueCounts[issue] || 0) + 1;
            });
        });

        const mostCommonIssue = Object.entries(issueCounts).sort(
            (a, b) => b[1] - a[1]
        )[0];

        const results = [];

        if (needsReview > 0) {
            results.push({
                type: "warning",
                title: "Records need attention",
                description: `${needsReview} of ${total} clinic records need a quality review. Check missing or invalid fields before using this data.`,
                icon: CircleAlert,
                metric: `${needsReview} records`,
            });
        } else {
            results.push({
                type: "success",
                title: "No records flagged for review",
                description:
                    "The current validation rules did not identify any records requiring review. This does not guarantee that all information is correct.",
                icon: CheckCircle2,
                metric: "0 flagged",
            });
        }

        if (mostCommonIssue) {
            results.push({
                type: "warning",
                title: "Most frequent data issue",
                description: `"${mostCommonIssue[0]}" appears in ${mostCommonIssue[1]} validation finding(s). Prioritise this field during data cleanup.`,
                icon: ClipboardList,
                metric: `${mostCommonIssue[1]} finding(s)`,
            });
        } else {
            results.push({
                type: "success",
                title: "No validation issues detected",
                description:
                    "The current validation rules found no missing or incorrectly formatted fields in the available records.",
                icon: ShieldCheck,
                metric: "0 issues",
            });
        }

        if (duplicates.length > 0) {
            results.push({
                type: "warning",
                title: "Possible duplicate clinics",
                description: `${duplicates.length} potential duplicate pair(s) were identified. Compare their names and addresses before deciding whether to merge them.`,
                icon: Activity,
                metric: `${duplicates.length} pair(s)`,
            });
        } else {
            results.push({
                type: "success",
                title: "No possible duplicates detected",
                description:
                    "The current matching rules did not find duplicate candidates. Similar records may still exist outside these matching rules.",
                icon: CheckCircle2,
                metric: "0 pairs",
            });
        }

        results.push({
            type: qualityRate >= 90 ? "success" : "info",
            title: "Overall data quality",
            description:
                "This estimate is based on the proportion of records not flagged for review. It is not an independent verification of clinic information.",
            icon: TrendingUp,
            metric: `${qualityRate}%`,
        });

        return results;
    }, [report]);

    const total = report?.total_clinics || 0;
    const needsReview = report?.records_needing_review || 0;
    const duplicates = report?.duplicate_candidates || 0;
    const qualityRate = total
        ? Math.round(((total - needsReview) / total) * 100)
        : 0;

    return (
        <section className="ai-insights-page">
            <div className="ai-page-heading">
                <div>
                    <span className="ai-eyebrow">
                        <Sparkles size={15} /> INTELLIGENCE CENTRE
                    </span>
                    <h1>AI Insights</h1>
                    <p>
                        Explore data-quality findings and actionable recommendations
                        from your clinic dataset.
                    </p>
                </div>

                <button
                    className="ai-refresh-button"
                    onClick={loadInsights}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? "ai-spinning" : ""} />
                    Refresh analysis
                </button>
            </div>

            <div className="ai-notice">
                <BrainCircuit size={22} />
                <div>
                    <strong>Explainable insights preview</strong>

                </div>
            </div>

            {loading && (
                <div className="ai-state-card">
                    <RefreshCw className="ai-spinning" size={25} />
                    <p>Analysing your clinic dataset...</p>
                </div>
            )}

            {!loading && error && (
                <div className="ai-error-card">
                    <CircleAlert size={22} />
                    <div>
                        <strong>Analysis unavailable</strong>
                        <p>{error}</p>
                        <button onClick={loadInsights}>Try again</button>
                    </div>
                </div>
            )}

            {!loading && !error && report && (
                <>
                    <div className="ai-metrics-grid">
                        <div className="ai-metric-card">
                            <span className="ai-metric-icon">
                                <ClipboardList size={20} />
                            </span>
                            <p>Total clinic records</p>
                            <h2>{total}</h2>
                            <span>Records analysed</span>
                        </div>

                        <div className="ai-metric-card">
                            <span className="ai-metric-icon warning">
                                <CircleAlert size={20} />
                            </span>
                            <p>Need review</p>
                            <h2>{needsReview}</h2>
                            <span>Require data-quality checks</span>
                        </div>

                        <div className="ai-metric-card">
                            <span className="ai-metric-icon success">
                                <ShieldCheck size={20} />
                            </span>
                            <p>Quality estimate</p>
                            <h2>{qualityRate}%</h2>
                            <span>Not flagged by current rules</span>
                        </div>

                        <div className="ai-metric-card">
                            <span className="ai-metric-icon purple">
                                <Activity size={20} />
                            </span>
                            <p>Duplicate candidates</p>
                            <h2>{duplicates}</h2>
                            <span>Pairs requiring verification</span>
                        </div>
                    </div>

                    <div className="ai-content-grid">
                        <div className="ai-panel ai-findings-panel">
                            <div className="ai-panel-heading">
                                <div>
                                    <h2>Key findings</h2>
                                    <p>Generated from the latest quality report</p>
                                </div>
                                <Activity size={20} />
                            </div>

                            <div className="ai-findings-list">
                                {insights.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <article
                                            className={`ai-finding-item ${item.type}`}
                                            key={`${item.title}-${index}`}
                                        >
                                            <div className="ai-finding-icon">
                                                <Icon size={19} />
                                            </div>

                                            <div className="ai-finding-content">
                                                <div className="ai-finding-title-row">
                                                    <h3>{item.title}</h3>
                                                    <span>{item.metric}</span>
                                                </div>
                                                <p>{item.description}</p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="ai-panel ai-recommendations-panel">
                            <div className="ai-panel-heading">
                                <div>
                                    <h2>Recommended actions</h2>
                                    <p>Suggested next steps</p>
                                </div>
                                <Sparkles size={20} />
                            </div>

                            <div className="ai-action-item">
                                <span>01</span>
                                <div>
                                    <h3>Review incomplete records</h3>
                                    <p>
                                        Fill in missing clinic details and correct invalid values.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-action-item">
                                <span>02</span>
                                <div>
                                    <h3>Verify duplicate candidates</h3>
                                    <p>
                                        Compare clinic names and addresses before merging records.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-action-item">
                                <span>03</span>
                                <div>
                                    <h3>Validate source information</h3>
                                    <p>
                                        Check clinic details against reliable, current source
                                        records.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-quality-summary">
                                <div className="ai-quality-summary-top">
                                    <span>Data quality estimate</span>
                                    <strong>{qualityRate}%</strong>
                                </div>
                                <div className="ai-progress-track">
                                    <div
                                        className="ai-progress-fill"
                                        style={{ width: `${qualityRate}%` }}
                                    />
                                </div>
                                <p>
                                    Based on records not flagged by current validation rules.
                                </p>
                            </div>
                        </aside>
                    </div>

                    <div className="ai-footer-note">
                        <ShieldCheck size={18} />
                        <p>
                            <strong>Human verification required.</strong> These results are
                            data-management suggestions, not medical advice. Verify records
                            before making operational decisions.
                        </p>
                    </div>
                </>
            )}
        </section>
    );
}

export default AIInsights;
