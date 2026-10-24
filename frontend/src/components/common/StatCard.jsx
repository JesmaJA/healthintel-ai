
import "./StatCard.css";

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color = "green",
}) {
    return (
        <article className="stat-card">
            <div className={`stat-card-icon ${color}`}>
                <Icon size={21} strokeWidth={2} />
            </div>

            <p className="stat-card-title">{title}</p>

            <div className="stat-card-value">{value ?? "—"}</div>

            <p className="stat-card-description">{description}</p>
        </article>
    );
}
