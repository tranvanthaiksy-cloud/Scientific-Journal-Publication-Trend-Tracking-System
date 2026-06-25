import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
    { to: "/dashboard",     icon: "dashboard",   label: "Dashboard" },
    { to: "/papers/search", icon: "search",       label: "Search Papers" },
    { to: "/trends",        icon: "trending_up",  label: "Trend Analysis" },
    { to: "/topics",        icon: "explore",      label: "Topic Explorer" },
    { to: "/following",     icon: "group",        label: "Following" },
    { to: "/reports",       icon: "assessment",   label: "Reports" },
    { to: "/bookmarks",     icon: "bookmark",     label: "Bookmarks" },
];

function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getPageTitle = () => {
        const item = navItems.find((n) => location.pathname === n.to);
        if (item) return item.label;
        if (location.pathname.startsWith("/papers/")) return "Paper Details";
        return "Academic Forum";
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    return (
        <div className="af-container">
            {/* ── Sidebar ── */}
            <aside className="af-sidebar">
                {/* Brand */}
                <div className="af-sidebar__brand">
                    <h1>Academic Forum</h1>
                    <p>Journal Trend Tracking</p>
                </div>

                {/* Navigation */}
                <nav className="af-sidebar__nav">
                    {navItems.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `af-nav-item${isActive ? " active" : ""}`
                            }
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontVariationSettings:
                                        location.pathname === to
                                            ? "'FILL' 1"
                                            : "'FILL' 0",
                                }}
                            >
                                {icon}
                            </span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="af-sidebar__bottom">
                    <button
                        className="af-sidebar__new-analysis"
                        onClick={() => navigate("/trends")}
                    >
                        New Analysis
                    </button>

                    <a
                        href="#profile"
                        className="af-nav-item"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/dashboard");
                        }}
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                        <span>{user?.name || user?.username || "Profile"}</span>
                    </a>

                    <a
                        href="#logout"
                        className="af-nav-item"
                        onClick={handleLogout}
                        style={{ color: "var(--color-error)" }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ color: "var(--color-error)" }}
                        >
                            logout
                        </span>
                        <span>Logout</span>
                    </a>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="af-main">
                {/* Topbar */}
                <header className="af-topbar">
                    <h2 className="af-topbar__title">{getPageTitle()}</h2>

                    <div className="af-topbar__right">
                        {/* Global search */}
                        <div className="af-topbar__search">
                            <span className="material-symbols-outlined search-icon">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search papers, keywords…"
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        e.target.value.trim()
                                    ) {
                                        navigate(
                                            `/papers/search?q=${encodeURIComponent(
                                                e.target.value.trim()
                                            )}`
                                        );
                                    }
                                }}
                            />
                        </div>

                        <div className="af-topbar__actions">
                            <button
                                className="material-symbols-outlined af-icon-btn"
                                title="Notifications"
                            >
                                notifications
                            </button>
                            <button
                                className="material-symbols-outlined af-icon-btn"
                                title="Settings"
                            >
                                settings
                            </button>
                            <button
                                className="af-topbar__publish-btn"
                                onClick={() => navigate("/papers/search")}
                            >
                                Publish Paper
                            </button>
                            <div className="af-topbar__avatar" title={user?.username}>
                                {user?.name
                                    ? user.name.charAt(0).toUpperCase()
                                    : user?.username
                                    ? user.username.charAt(0).toUpperCase()
                                    : "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="af-page-content">{children}</div>
            </main>
        </div>
    );
}

export default Layout;
