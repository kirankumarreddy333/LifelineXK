import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Droplets,
  BadgeCheck,
} from "lucide-react";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/ui/Pagination";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import useDebounce from "../hooks/useDebounce";
import API from "../api";
import { INDIAN_STATES } from "../constants";

function Hospitals() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [bloodBank, setBloodBank] = useState("");
  const [data, setData] = useState({ hospitals: [], total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 400);

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
      if (stateFilter) params.set("state", stateFilter);
      if (bloodBank) params.set("bloodBank", bloodBank);
      params.set("page", page);
      params.set("limit", 9);
      const res = await API.get(`/hospitals?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, stateFilter, bloodBank, page]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  return (
    <Layout>
      <section className="border-b border-line bg-surface/60 py-14 sm:py-16">
        <div className="container-x text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Hospital Directory
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Find hospitals with blood banks near you, along with their contact
              and emergency numbers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search hospitals..."
              size="md"
              className="sm:col-span-2"
            />
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Select value={bloodBank} onChange={(e) => setBloodBank(e.target.value)}>
              <option value="">All Hospitals</option>
              <option value="true">Has Blood Bank</option>
            </Select>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          {error ? (
            <ErrorState message={error} onRetry={fetchHospitals} />
          ) : loading ? (
            <SkeletonGrid count={6} />
          ) : data.hospitals.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No hospitals found"
              description="Try a different search or check back later."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.hospitals.map((h) => (
                  <motion.div
                    key={h._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl2 border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-ink">
                        <Building2 size={22} />
                      </span>
                      {h.verified ? (
                        <Badge tone="success" dot>
                          <span className="flex items-center gap-1">
                            <BadgeCheck size={12} /> Verified
                          </span>
                        </Badge>
                      ) : (
                        <Badge tone="neutral">Unverified</Badge>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-ink">
                      {h.name}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-ink-soft">
                      {h.address && (
                        <p className="flex items-start gap-2">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <span>
                            {h.address}
                            {h.city ? `, ${h.city}` : ""}
                            {h.state ? `, ${h.state}` : ""}
                          </span>
                        </p>
                      )}
                      {h.phone && (
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="shrink-0" />
                          {h.phone}
                        </p>
                      )}
                      {h.website && (
                        <p className="flex items-center gap-2">
                          <Globe size={14} className="shrink-0" />
                          {h.website}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      {h.bloodBankAvailable ? (
                        <Badge tone="success" dot>
                          <span className="flex items-center gap-1">
                            <Droplets size={12} /> Blood Bank
                          </span>
                        </Badge>
                      ) : (
                        <Badge tone="neutral">No Blood Bank</Badge>
                      )}

                      {h.emergencyPhone && (
                        <a
                          href={`tel:${h.emergencyPhone}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                        >
                          <Phone size={12} /> Emergency
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Hospitals;

