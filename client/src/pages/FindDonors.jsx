import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import DonorCard from "../components/DonorCard";
import Pagination from "../components/ui/Pagination";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import useDebounce from "../hooks/useDebounce";
import API from "../api";
import { BLOOD_GROUPS, INDIAN_STATES } from "../constants";

function FindDonors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get("bloodGroup") || "",
    state: searchParams.get("state") || "",
    district: searchParams.get("district") || "",
    city: searchParams.get("city") || "",
    available: searchParams.get("available") === "true" ? "true" : "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState({ donors: [], total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup);
    if (filters.state) params.set("state", filters.state);
    if (filters.district) params.set("district", filters.district);
    if (filters.city) params.set("city", filters.city);
    if (filters.available) params.set("available", filters.available);
    params.set("page", page);
    params.set("limit", 9);
    return params.toString();
  }, [debouncedQuery, filters, page]);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/donors?${buildParams()}`);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load donors");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // Keep URL in sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup);
    if (filters.state) params.set("state", filters.state);
    if (filters.district) params.set("district", filters.district);
    if (filters.city) params.set("city", filters.city);
    if (filters.available) params.set("available", filters.available);
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ bloodGroup: "", state: "", district: "", city: "", available: "" });
    setQuery("");
    setPage(1);
  };

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-line bg-surface/60 py-14 sm:py-16">
        <div className="container-x text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Find Donors
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Search verified blood donors near you. Filter by location, blood
              group and availability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-16 z-30 border-b border-line bg-white/90 py-5 backdrop-blur-lg sm:top-[72px]">
        <div className="container-x">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar
              value={query}
              onChange={(e) => {
                setQuery(e);
                setPage(1);
              }}
              placeholder="Search by name, city, blood group..."
              className="flex-1"
            />
            <Button
              variant="light"
              onClick={() => setShowFilters((v) => !v)}
              className="relative shrink-0"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
                  <Select
                    value={filters.bloodGroup}
                    onChange={(e) => handleFilterChange("bloodGroup", e.target.value)}
                  >
                    <option value="">All Blood Groups</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={filters.state}
                    onChange={(e) => handleFilterChange("state", e.target.value)}
                  >
                    <option value="">All States</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={filters.district}
                    onChange={(e) => handleFilterChange("district", e.target.value)}
                  >
                    <option value="">All Districts</option>
                  </Select>
                  <input
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
                  />
                  <Select
                    value={filters.available}
                    onChange={(e) => handleFilterChange("available", e.target.value)}
                  >
                    <option value="">Any Availability</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </Select>
                  <div className="sm:col-span-2 lg:col-span-5">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-danger"
                    >
                      <X size={14} /> Clear all filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 sm:py-14">
        <div className="container-x">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-ink-soft">
              Showing <span className="font-semibold text-ink">{data.donors.length}</span> of{" "}
              <span className="font-semibold text-ink">{data.total}</span> donors
            </p>
            {loading && (
              <span className="text-xs font-medium text-ink-soft">Loading...</span>
            )}
          </div>

          {error ? (
            <ErrorState message={error} onRetry={fetchDonors} />
          ) : loading ? (
            <SkeletonGrid count={6} />
          ) : data.donors.length === 0 ? (
            <EmptyState
              title="No donors found"
              description="Try adjusting your filters or search query. Donors are added regularly."
              action={
                <Button variant="dark" to="/become-donor">
                  Become a Donor
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.donors.map((donor) => (
                  <DonorCard key={donor._id} donor={donor} />
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

export default FindDonors;

