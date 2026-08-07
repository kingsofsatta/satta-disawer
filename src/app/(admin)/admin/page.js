"use client";

import { useEffect, useState } from "react";
import { getAllResultsWithMeta, getVisitorCount } from "@/services/result";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Search } from "lucide-react";

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);
  const [visitorLabel, setVisitorLabel] = useState("Not tracked");
  const [user, setUser] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadResults();
    loadVisitorCount();
  }, [router]);

  const loadVisitorCount = async () => {
    try {
      const count = await getVisitorCount();
      if (typeof count === "number") {
        setVisitorCount(count);
        setVisitorLabel(null);
      } else {
        setVisitorCount(null);
        setVisitorLabel("Not tracked");
      }
    } catch (error) {
      setVisitorCount(null);
      setVisitorLabel("Not tracked");
    }
  };

  const loadResults = async () => {
    try {
      setFetchLoading(true);
      const data = await getAllResultsWithMeta();
      setResults(data || []);
    } catch (error) {
      console.error("Failed to load results:", error);
      setResults([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const latestResults = results.slice(0, 5);
  const totalResults = results.length;
  // Build admin cards; only include visitor card when real data is available
  const adminCards = [
    {
      label: "Total results",
      value: totalResults,
      description: "Saved result entries in the database.",
    },
  ];

  if (visitorCount !== null) {
    adminCards.push({
      label: "Visitor count",
      value: visitorCount,
      description: "Live visitor count from tracking source.",
    });
  }

  adminCards.push({
    label: "Update page",
    value: "Ready",
    description: "Manage results from a dedicated page.",
  });

  // Pagination helper: returns list with numbers and '...' tokens
  const getPageList = (total, current, siblingCount = 1) => {
    const totalPages = total;
    const pages = [];
    const left = Math.max(2, current - siblingCount);
    const right = Math.min(totalPages - 1, current + siblingCount);

    pages.push(1);
    if (left > 2) pages.push("left-ellipsis");

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages - 1) pages.push("right-ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pageItems = [
    { href: "/admin/update-data", label: "Update Data" },
    { href: "/admin/payment-proofs", label: "Payment Proofs" },
    { href: "/admin/site-config", label: "Site Config" },
    { href: "/admin/goodluck-config", label: "Good Luck Config" },
    { href: "/admin/t1-config", label: "T1 Config" },
  ];

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.max(1, Math.ceil(results.length / resultsPerPage));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/30">

        <div className="grid gap-4 md:grid-cols-3">
          {adminCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
              <p className="mt-4 text-4xl font-black text-white">{card.value}</p>
              <p className="mt-3 text-sm text-slate-400">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr] mt-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Recent results</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Latest saved entries</h2>
            </div>
            <Link
              href="/admin/update-data"
              className="inline-flex items-center justify-center rounded-full border border-orange-500 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 hover:bg-orange-500/20"
            >
              Manage results
            </Link>
          </div>

          {fetchLoading ? (
            <div className="mt-8 rounded-3xl bg-slate-950/70 p-8 text-center text-slate-400">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
              Loading results...
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {latestResults.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-slate-400">
                  No results have been added yet. Use the Update Data page to add new entries.
                </div>
              ) : (
                latestResults.map((item) => (
                  <div key={item._id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.game}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{item.resultNumber}</p>
                      </div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">{item.date}</span>
                    </div>
                    {item.waitingGame && (
                      <p className="mt-3 text-sm text-slate-400">Waiting game: {item.waitingGame}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <p>{results.length} total result{results.length === 1 ? "" : "s"} saved.</p>
            <div className="flex items-center gap-2">
              <span>Page</span>
              <select
                value={resultsPerPage}
                onChange={(e) => {
                  setResultsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-full bg-slate-950/70 px-3 py-2 text-slate-200 border border-white/10"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {getPageList(totalPages, currentPage, 1).map((p, i) =>
                p === "left-ellipsis" || p === "right-ellipsis" ? (
                  <span key={`e-${i}`} className="px-3 py-2 text-sm text-slate-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === p ? "bg-orange-500 text-black" : "bg-slate-950/70 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Quick actions</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Go to admin sections</h2>
          </div>

          <div className="grid gap-3">
            {pageItems.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-4 text-sm font-semibold text-slate-100 transition hover:border-orange-500 hover:bg-slate-900"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
