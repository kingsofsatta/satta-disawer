"use client";

import {
  createResult,
  deleteResult,
  getAllResultsWithMeta,
  getSettings,
  updateResult,
  validateResultData,
} from "@/services/result";
import { GAME_OPTIONS } from "@/utils/gameConfig";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

function getISTDateForForm() {
  const date = new Date();
  date.setTime(date.getTime() + 5.5 * 60 * 60 * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const UpdateDataPage = () => {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({
    game: "",
    resultNumber: "",
    waitingGame: "",
    date: getISTDateForForm(),
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [adminFormControls, setAdminFormControls] = useState({
    showWaitingGame: true,
  });

  const [searchDate, setSearchDate] = useState("");
  const [searchGame, setSearchGame] = useState("");
  const [searchResultNumber, setSearchResultNumber] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showCurrentMonthOnly, setShowCurrentMonthOnly] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const router = useRouter();

  const waitingGameOptions = GAME_OPTIONS.filter(
    (game) => game.value !== formData.game
  );

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
    loadAdminFormControls();
  }, [router]);

  useEffect(() => {
    if (!adminFormControls.showWaitingGame) {
      setFormData((current) => ({ ...current, waitingGame: "" }));
    }
  }, [adminFormControls.showWaitingGame]);

  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay),
    };
  };

  useEffect(() => {
    let filtered = [...results];

    if (showCurrentMonthOnly && !searchDate) {
      const { start, end } = getCurrentMonthRange();
      filtered = filtered.filter((item) => item.date >= start && item.date <= end);
    }

    if (searchDate) {
      filtered = filtered.filter((item) => item.date === searchDate);
    }

    if (searchGame) {
      filtered = filtered.filter((item) => item.game === searchGame);
    }

    if (searchResultNumber) {
      filtered = filtered.filter((item) =>
        item.resultNumber.toString().includes(searchResultNumber)
      );
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [results, searchDate, searchGame, searchResultNumber, showCurrentMonthOnly]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage) || 1;

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

  const loadResults = async () => {
    try {
      setFetchLoading(true);
      const data = await getAllResultsWithMeta();
      setResults(data);
      setFilteredResults(data);
    } catch (error) {
      console.error("Failed to load results:", error);
      setResults([]);
      setFilteredResults([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const loadAdminFormControls = async () => {
    try {
      const settings = await getSettings();
      setAdminFormControls({
        showWaitingGame: settings?.adminFormControls?.showWaitingGame !== false,
      });
    } catch (error) {
      console.error("Failed to load admin form controls:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      waitingGame: adminFormControls.showWaitingGame ? formData.waitingGame : "",
    };

    const validation = validateResultData(payload, {
      requireWaitingGame: adminFormControls.showWaitingGame,
    });

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateResult(editingId, payload);
      } else {
        const existingResult = results.find(
          (item) => item.game === payload.game && item.date === payload.date
        );

        if (existingResult) {
          if (
            confirm(`A result already exists for ${payload.game} on ${payload.date}. Do you want to update it?`)
          ) {
            await updateResult(existingResult._id, payload);
          } else {
            setLoading(false);
            return;
          }
        } else {
          await createResult(payload);
        }
      }

      await loadResults();

      setFormData({
        game: "",
        resultNumber: "",
        waitingGame: "",
        date: getISTDateForForm(),
      });
      setEditingId(null);
      clearAllFilters();
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Failed to save result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      game: item.game,
      resultNumber: item.resultNumber,
      waitingGame: item.waitingGame || "",
      date: item.date,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this result?")) {
      try {
        await deleteResult(id);
        await loadResults();
      } catch (error) {
        console.error("Error deleting result:", error);
        alert("Failed to delete result. Please try again.");
      }
    }
  };

  const getGameTitle = (value) => {
    return GAME_OPTIONS.find((game) => game.value === value)?.title || value;
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      game: "",
      resultNumber: "",
      waitingGame: "",
      date: getISTDateForForm(),
    });
  };

  const clearAllFilters = () => {
    setSearchDate("");
    setSearchGame("");
    setSearchResultNumber("");
    setShowCurrentMonthOnly(false);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/30 mb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Update Data</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">Manage result entries</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Add, edit, and delete results from a dedicated admin page while keeping the dashboard overview separate.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
              Return to Overview
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Data manager</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Add or update results</h2>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">{editingId ? "Editing result" : "New entry"}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Game *</label>
              <div className="relative">
                <select
                  value={formData.game}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      game: e.target.value,
                      waitingGame:
                        e.target.value === formData.waitingGame ? "" : formData.waitingGame,
                    })
                  }
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
                  required
                  disabled={loading}
                >
                  <option value="" className="text-slate-500 bg-slate-950">Select Game</option>
                  {GAME_OPTIONS.map((game) => (
                    <option key={game.value} value={game.value} className="text-slate-100 bg-slate-950">
                      {game.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Result Number *</label>
              <input
                type="number"
                value={formData.resultNumber}
                onChange={(e) => setFormData({ ...formData, resultNumber: e.target.value })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Enter result number"
                required
                disabled={loading}
                pattern="\d+"
                title="Please enter numbers only"
              />
            </div>

            {adminFormControls.showWaitingGame && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Waiting Game *</label>
                <div className="relative">
                  <select
                    value={formData.waitingGame}
                    onChange={(e) => setFormData({ ...formData, waitingGame: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                    required
                    disabled={loading || !formData.game}
                  >
                    <option value="" className="text-slate-500 bg-slate-950">Select Waiting Game</option>
                    {waitingGameOptions.map((game) => (
                      <option key={game.value} value={game.value} className="text-slate-100 bg-slate-950">
                        {game.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading || !formData.game || !formData.resultNumber || !formData.date}
                className="flex-1 rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? ( <span>Saving...</span> ) : editingId ? "Update Result" : "Add Result" }
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-3xl border border-white/10 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-400 font-semibold">Results</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Search and manage results</h2>
            </div>
            {searchDate || searchGame || searchResultNumber || showCurrentMonthOnly ? (
              <button
                onClick={clearAllFilters}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 transition"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <span className="text-sm text-slate-400">Show current month only</span>
              <button
                onClick={() => setShowCurrentMonthOnly(!showCurrentMonthOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  showCurrentMonthOnly ? "bg-orange-500" : "bg-slate-700"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${showCurrentMonthOnly ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  if (e.target.value) setShowCurrentMonthOnly(false);
                }}
                className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Search by date"
              />
              <div className="relative">
                <select
                  value={searchGame}
                  onChange={(e) => setSearchGame(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 appearance-none"
                >
                  <option value="">All Games</option>
                  {GAME_OPTIONS.map((game) => (
                    <option key={game.value} value={game.value} className="bg-slate-950 text-slate-100">
                      {game.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchResultNumber}
                onChange={(e) => setSearchResultNumber(e.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-12 py-3 text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="Search by result number"
              />
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
            <span>
              Showing {filteredResults.length > 0 ? indexOfFirstResult + 1 : 0}-{Math.min(indexOfLastResult, filteredResults.length)} of {filteredResults.length}
            </span>
            <select
              value={resultsPerPage}
              onChange={(e) => {
                setResultsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {fetchLoading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500"></div>
              Loading results...
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[28rem] overflow-y-auto p-1">
                {currentResults.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center text-slate-400">
                    {searchDate || searchGame || searchResultNumber || showCurrentMonthOnly ? (
                      <>
                        <Search size={44} className="mx-auto mb-4 text-slate-500" />
                        <p>No matching results found.</p>
                        <button onClick={clearAllFilters} className="mt-3 text-sm font-semibold text-orange-300 hover:text-orange-200">
                          Clear filters
                        </button>
                      </>
                    ) : (
                      <>
                        <Calendar size={44} className="mx-auto mb-4 text-slate-500" />
                        <p>No results added yet.</p>
                        <p className="mt-2 text-sm text-slate-400">Add your first entry using the form above.</p>
                      </>
                    )}
                  </div>
                ) : (
                  currentResults.map((item) => (
                    <div key={item._id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-orange-500/40">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-500">
                            <MapPin size={16} className="text-orange-400" />
                            {item.game}
                          </div>
                          <p className="mt-3 text-xl font-semibold text-white">{item.resultNumber}</p>
                          <p className="mt-2 text-sm text-slate-400">{item.date}</p>
                          {item.waitingGame && <p className="mt-2 text-sm text-slate-400">Waiting: {getGameTitle(item.waitingGame)}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-full bg-orange-500/10 p-2 text-orange-300 hover:bg-orange-500/20"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-full bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {getPageList(totalPages, currentPage, 1).map((p, i) =>
                    p === "left-ellipsis" || p === "right-ellipsis" ? (
                      <span key={`e-${i}`} className="px-3 py-2 text-sm text-slate-400">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          currentPage === p ? "bg-orange-500 text-black" : "bg-slate-950/70 text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateDataPage;
