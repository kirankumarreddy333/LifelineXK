import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Menu, X, ChevronDown, LayoutDashboard, LogOut, UserCircle, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import Button from "./ui/Button";
import { Bell } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/find-donors", label: "Find Donors" },
  { to: "/become-donor", label: "Become Donor" },
  { to: "/blood-requests", label: "Blood Requests" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenu(false);
  };

  const navItemCls = ({ isActive }) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-ink" : "text-ink-soft hover:text-ink"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-white/90 shadow-soft backdrop-blur-lg"
          : "bg-white"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-soft">
            <Droplet size={20} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Lifeline<span className="text-ink-soft">XK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navItemCls}>
              {({ isActive }) => (
                <span>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-ink"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative rounded-xl p-2.5 text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
                    >
                      <div className="border-b border-line px-4 py-3">
                        <p className="text-sm font-semibold">Notifications</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-8 text-center text-sm text-ink-soft">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <button
                              key={n._id}
                              onClick={() => {
                                setNotifOpen(false);
                                if (n.link) navigate(n.link);
                              }}
                              className="block w-full border-b border-line/60 px-4 py-3 text-left transition-colors hover:bg-surface"
                            >
                              <p className="text-sm font-medium text-ink">{n.title}</p>
                              <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
                                {n.message}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/dashboard");
                        }}
                        className="w-full px-4 py-2.5 text-center text-xs font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                      >
                        View all in dashboard
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User menu */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors hover:bg-surface"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "U"
                      )}&background=111111&color=fff`
                    }
                    alt={user?.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <ChevronDown size={16} className="text-ink-soft" />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift"
                    >
                      <div className="border-b border-line px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-ink-soft">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setUserMenu(false);
                        }}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                      >
                        <UserCircle size={16} /> Profile
                      </button>
                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setUserMenu(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                        >
                          <Shield size={16} /> Admin Panel
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login" className="hidden sm:inline-flex">
                Login
              </Button>
              <Button variant="light" size="sm" to="/register" className="hidden sm:inline-flex">
                Sign Up
              </Button>
            </>
          )}

          <Button variant="dark" size="md" to="/become-donor" className="hidden md:inline-flex">
            <Droplet size={16} />
            Donate Blood
          </Button>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl p-2.5 text-ink transition-colors hover:bg-surface lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface text-ink"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2 border-t border-line pt-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="light"
                      size="sm"
                      to="/dashboard"
                      fullWidth
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Button>
                    <Button variant="dark" size="sm" onClick={handleLogout} fullWidth>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="light"
                      size="sm"
                      to="/login"
                      fullWidth
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      variant="dark"
                      size="sm"
                      to="/register"
                      fullWidth
                      onClick={() => setOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

