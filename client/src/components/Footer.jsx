import { Link } from "react-router-dom";
import { Droplet, Heart, Github, Twitter, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Find Donors", to: "/find-donors" },
    { label: "Become Donor", to: "/become-donor" },
    { label: "Blood Requests", to: "/blood-requests" },
    { label: "Emergency Board", to: "/emergency-board" },
    { label: "Hospitals", to: "/hospitals" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Admin", to: "/admin" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                <Droplet size={20} />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                Lifeline<span className="text-ink-soft">XK</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              Connecting Heroes. Saving Lives. LifelineXK helps people find verified
              blood donors instantly and makes blood donation simple, rewarding, and
              accessible to everyone.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:hello@lifelinexk.com"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-ink">{heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-sm text-ink-soft">
            © {new Date().getFullYear()} LifelineXK. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            Built with <Heart size={14} className="text-danger" fill="currentColor" /> to save lives
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

