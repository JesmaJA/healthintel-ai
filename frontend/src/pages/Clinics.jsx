
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    Building2,
    RefreshCw,
    Globe,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    AlertCircle,
} from "lucide-react";

import {
    getClinics,
    createClinic,
    updateClinic,
    deleteClinic,
} from "../services/api";

import "./Clinics.css";

const EMPTY_FORM = {
    name: "",
    address: "",
    suburb: "",
    state: "",
    phone: "",
    email: "",
    website: "",
    source_url: "",
    description: "",
    category: "general_practice",
};

const CATEGORIES = [
    { value: "general_practice", label: "General Practice" },
    { value: "specialist", label: "Specialist" },
    { value: "allied_health", label: "Allied Health" },
    { value: "unknown", label: "Unknown" },
];

const PAGE_SIZE = 6;

export default function Clinics() {
    const [clinics, setClinics] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stateFilter, setStateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingClinic, setEditingClinic] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");

    const loadClinics = useCallback(async () => {
        setLoading(true);
        setPageError("");

        try {
            const data = await getClinics();
            setClinics(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load clinics:", error);
            setPageError(
                "Could not load clinics. Check your Django server and API connection."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadClinics();
    }, [loadClinics]);

    const availableStates = useMemo(
        () =>
            [...new Set(clinics.map((clinic) => clinic.state).filter(Boolean))].sort(),
        [clinics]
    );

    const filteredClinics = useMemo(() => {
        const query = search.trim().toLowerCase();

        return clinics.filter((clinic) => {
            const matchesSearch = [
                clinic.name,
                clinic.address,
                clinic.suburb,
                clinic.state,
                clinic.phone,
                clinic.email,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query);

            const matchesCategory =
                categoryFilter === "all" || clinic.category === categoryFilter;

            const matchesState =
                stateFilter === "all" || clinic.state === stateFilter;

            return matchesSearch && matchesCategory && matchesState;
        });
    }, [clinics, search, categoryFilter, stateFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredClinics.length / PAGE_SIZE)
    );

    const visibleClinics = filteredClinics.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    function updateFilter(setter, value) {
        setter(value);
        setCurrentPage(1);
    }

    function openAddModal() {
        setEditingClinic(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setModalOpen(true);
    }

    function openEditModal(clinic) {
        setEditingClinic(clinic);
        setForm({
            ...EMPTY_FORM,
            ...clinic,
        });
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;
        setModalOpen(false);
        setEditingClinic(null);
        setFormError("");
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");
        setNotice("");

        const payload = Object.fromEntries(
            Object.entries(form).map(([key, value]) => [
                key,
                typeof value === "string" ? value.trim() : value,
            ])
        );

        if (!payload.name) {
            setFormError("Clinic name is required.");
            return;
        }

        if (
            payload.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
        ) {
            setFormError("Enter a valid email address.");
            return;
        }

        for (const field of ["website", "source_url"]) {
            if (payload[field] && !/^https?:\/\/.+/i.test(payload[field])) {
                setFormError(
                    `${field === "website" ? "Website" : "Source URL"} must start with http:// or https://.`
                );
                return;
            }
        }

        setSaving(true);

        try {
            if (editingClinic) {
                await updateClinic(editingClinic.id, payload);
                setNotice("Clinic updated successfully.");
            } else {
                await createClinic(payload);
                setNotice("Clinic added successfully.");
            }

            setModalOpen(false);
            setEditingClinic(null);
            setForm(EMPTY_FORM);
            await loadClinics();
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to save clinic:", error);

            const data = error.response?.data;
            const firstError =
                data && typeof data === "object"
                    ? Object.entries(data)
                        .map(([field, messages]) => {
                            const message = Array.isArray(messages)
                                ? messages.join(" ")
                                : String(messages);
                            return `${field}: ${message}`;
                        })
                        .join(" ")
                    : "";

            setFormError(
                firstError || "Could not save the clinic. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(clinic) {
        const confirmed = window.confirm(
            `Delete "${clinic.name}"? This will permanently remove the record from your database.`
        );

        if (!confirmed) return;

        setNotice("");
        setPageError("");

        try {
            await deleteClinic(clinic.id);
            setNotice(`"${clinic.name}" was deleted.`);
            await loadClinics();
            setCurrentPage((page) =>
                Math.min(page, Math.max(1, Math.ceil((filteredClinics.length - 1) / PAGE_SIZE)))
            );
        } catch (error) {
            console.error("Failed to delete clinic:", error);
            setPageError(
                "Could not delete the clinic. Check the backend permissions and try again."
            );
        }
    }

    return (
        <div className="clinics-page">
            <section className="clinics-intro">
                <div>
                    <div className="clinics-eyebrow">
                        <Building2 size={15} />
                        RECORD MANAGEMENT
                    </div>
                    <h2>Clinic Directory</h2>
                    <p>
                        Manage clinic records, update contact details, and maintain your
                        healthcare data.
                    </p>
                </div>

                <button className="clinic-primary-button" onClick={openAddModal}>
                    <Plus size={18} />
                    Add clinic
                </button>
            </section>

            {notice && (
                <div className="clinic-notice" role="status">
                    <span>{notice}</span>
                    <button onClick={() => setNotice("")} aria-label="Dismiss message">
                        <X size={16} />
                    </button>
                </div>
            )}

            {pageError && (
                <div className="clinic-error-banner" role="alert">
                    <AlertCircle size={18} />
                    <span>{pageError}</span>
                    <button onClick={loadClinics}>
                        <RefreshCw size={14} /> Retry
                    </button>
                </div>
            )}

            <section className="clinic-summary-grid">
                <div className="clinic-summary-card">
                    <span className="clinic-summary-icon green">
                        <Building2 size={19} />
                    </span>
                    <span>Total records</span>
                    <strong>{clinics.length}</strong>
                </div>

                <div className="clinic-summary-card">
                    <span className="clinic-summary-icon blue">
                        <Globe size={19} />
                    </span>
                    <span>States represented</span>
                    <strong>{availableStates.length}</strong>
                </div>

                <div className="clinic-summary-card">
                    <span className="clinic-summary-icon purple">
                        <MapPin size={19} />
                    </span>
                    <span>Filtered results</span>
                    <strong>{filteredClinics.length}</strong>
                </div>
            </section>

            <section className="clinic-directory-panel">
                <div className="clinic-toolbar">
                    <div>
                        <h3>All clinics</h3>
                        <p>Search, filter, and manage your records.</p>
                    </div>

                    <button
                        className="clinic-icon-button"
                        onClick={loadClinics}
                        disabled={loading}
                        title="Reload clinic records"
                        aria-label="Reload clinic records"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "clinic-spin" : ""}
                        />
                    </button>
                </div>

                <div className="clinic-filters">
                    <label className="clinic-search">
                        <Search size={17} />
                        <input
                            value={search}
                            onChange={(event) => updateFilter(setSearch, event.target.value)}
                            placeholder="Search clinics, contacts, locations..."
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => updateFilter(setSearch, "")}
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </label>

                    <select
                        aria-label="Filter by category"
                        value={categoryFilter}
                        onChange={(event) =>
                            updateFilter(setCategoryFilter, event.target.value)
                        }
                    >
                        <option value="all">All categories</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by state"
                        value={stateFilter}
                        onChange={(event) =>
                            updateFilter(setStateFilter, event.target.value)
                        }
                    >
                        <option value="all">All states</option>
                        {availableStates.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="clinic-page-state">
                        <RefreshCw className="clinic-spin" size={24} />
                        <p>Loading clinic records...</p>
                    </div>
                ) : (
                    <>
                        <div className="clinic-table-wrap">
                            <table className="clinic-table">
                                <thead>
                                    <tr>
                                        <th>CLINIC DETAILS</th>
                                        <th>LOCATION</th>
                                        <th>CONTACT</th>
                                        <th>CATEGORY</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleClinics.map((clinic) => (
                                        <tr key={clinic.id}>
                                            <td>
                                                <div className="clinic-name-cell">
                                                    <span className="clinic-avatar">
                                                        {(clinic.name || "C").charAt(0).toUpperCase()}
                                                    </span>
                                                    <div>
                                                        <strong>{clinic.name}</strong>
                                                        <small>Clinic ID: {clinic.id}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="clinic-location-cell">
                                                    <MapPin size={14} />
                                                    <span>
                                                        {[clinic.suburb, clinic.state]
                                                            .filter(Boolean)
                                                            .join(", ") || "Not provided"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="clinic-contact-cell">
                                                    {clinic.email && (
                                                        <span>
                                                            <Mail size={13} /> {clinic.email}
                                                        </span>
                                                    )}
                                                    {clinic.phone && (
                                                        <span>
                                                            <Phone size={13} /> {clinic.phone}
                                                        </span>
                                                    )}
                                                    {!clinic.email && !clinic.phone && (
                                                        <small>Contact unavailable</small>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="clinic-category-badge">
                                                    {CATEGORIES.find(
                                                        (item) => item.value === clinic.category
                                                    )?.label || "Unknown"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="clinic-row-actions">
                                                    {clinic.website && (
                                                        <a
                                                            className="clinic-row-button"
                                                            href={clinic.website}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={`Open website for ${clinic.name}`}
                                                            title="Open website"
                                                        >
                                                            <ExternalLink size={15} />
                                                        </a>
                                                    )}

                                                    <button
                                                        className="clinic-row-button"
                                                        onClick={() => openEditModal(clinic)}
                                                        aria-label={`Edit ${clinic.name}`}
                                                        title="Edit clinic"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>

                                                    <button
                                                        className="clinic-row-button danger"
                                                        onClick={() => handleDelete(clinic)}
                                                        aria-label={`Delete ${clinic.name}`}
                                                        title="Delete clinic"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {visibleClinics.length === 0 && (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="clinic-empty-state">
                                                    <Building2 size={30} />
                                                    <strong>No clinics found</strong>
                                                    <p>Try changing your filters or add a clinic.</p>
                                                    <button
                                                        className="clinic-primary-button"
                                                        onClick={openAddModal}
                                                    >
                                                        <Plus size={16} /> Add clinic
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="clinic-pagination">
                            <span>
                                Showing{" "}
                                {filteredClinics.length === 0
                                    ? 0
                                    : (currentPage - 1) * PAGE_SIZE + 1}
                                –{Math.min(currentPage * PAGE_SIZE, filteredClinics.length)} of{" "}
                                {filteredClinics.length} records
                            </span>

                            <div>
                                <button
                                    onClick={() =>
                                        setCurrentPage((page) => Math.max(1, page - 1))
                                    }
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <span>
                                    Page {Math.min(currentPage, totalPages)} of {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                                    }
                                    disabled={currentPage >= totalPages}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {modalOpen && (
                <div
                    className="clinic-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <section
                        className="clinic-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="clinic-modal-title"
                    >
                        <div className="clinic-modal-header">
                            <div>
                                <h3 id="clinic-modal-title">
                                    {editingClinic ? "Edit clinic" : "Add a new clinic"}
                                </h3>
                                <p>
                                    {editingClinic
                                        ? "Update the clinic's information."
                                        : "Enter the clinic details below."}
                                </p>
                            </div>

                            <button
                                className="clinic-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close form"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="clinic-modal-body">
                                {formError && (
                                    <div className="clinic-form-error" role="alert">
                                        <AlertCircle size={16} />
                                        {formError}
                                    </div>
                                )}

                                <div className="clinic-form-grid">
                                    <label className="clinic-form-field full">
                                        Clinic name *
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleFieldChange}
                                            required
                                            maxLength={200}
                                            placeholder="Enter clinic name"
                                        />
                                    </label>

                                    <label className="clinic-form-field full">
                                        Street address
                                        <input
                                            name="address"
                                            value={form.address}
                                            onChange={handleFieldChange}
                                            maxLength={255}
                                            placeholder="Street address"
                                        />
                                    </label>

                                    <label className="clinic-form-field">
                                        Suburb / city
                                        <input
                                            name="suburb"
                                            value={form.suburb}
                                            onChange={handleFieldChange}
                                            maxLength={100}
                                            placeholder="City or suburb"
                                        />
                                    </label>

                                    <label className="clinic-form-field">
                                        State / region
                                        <input
                                            name="state"
                                            value={form.state}
                                            onChange={handleFieldChange}
                                            maxLength={10}
                                            placeholder="e.g. NSW"
                                        />
                                    </label>

                                    <label className="clinic-form-field">
                                        Phone
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleFieldChange}
                                            maxLength={50}
                                            placeholder="Contact number"
                                        />
                                    </label>

                                    <label className="clinic-form-field">
                                        Email
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleFieldChange}
                                            placeholder="clinic@example.com"
                                        />
                                    </label>

                                    <label className="clinic-form-field">
                                        Category
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleFieldChange}
                                        >
                                            {CATEGORIES.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="clinic-form-field">
                                        Website
                                        <input
                                            name="website"
                                            type="url"
                                            value={form.website}
                                            onChange={handleFieldChange}
                                            placeholder="https://example.com"
                                        />
                                    </label>

                                    <label className="clinic-form-field full">
                                        Source URL
                                        <input
                                            name="source_url"
                                            type="url"
                                            value={form.source_url}
                                            onChange={handleFieldChange}
                                            placeholder="Where was this information obtained?"
                                        />
                                    </label>

                                    <label className="clinic-form-field full">
                                        Description
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleFieldChange}
                                            rows={3}
                                            placeholder="Brief description of the clinic"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="clinic-modal-footer">
                                <button
                                    type="button"
                                    className="clinic-secondary-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="clinic-primary-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw size={16} className="clinic-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={17} />
                                            {editingClinic ? "Save changes" : "Create clinic"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
