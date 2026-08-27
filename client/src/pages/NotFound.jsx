import { motion } from "framer-motion";
import { Droplet, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <Layout>
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface/60 py-20">
        <div className="container-x text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-ink text-white shadow-lift"
            >
              <Droplet size={44} />
            </motion.div>

            <h1 className="mt-8 font-display text-7xl font-bold tracking-tight text-ink sm:text-8xl">
              404
            </h1>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              Page not found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back to saving lives.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="dark" size="lg" to="/">
                <Home size={18} />
                Back to Home
              </Button>
              <Button variant="light" size="lg" to="/find-donors">
                <Search size={18} />
                Find Donors
              </Button>
            </div>

            <div className="mt-12">
              <Link
                to="/"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                © {new Date().getFullYear()} LifelineXK — Connecting Heroes. Saving Lives.
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export default NotFound;

