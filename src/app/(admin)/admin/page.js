"use client";
import {
  createResult,
  deleteResult,
  getAllResultsWithMeta,
  updateResult,
  validateResultData,
} from "@/services/result";
import { GAME_OPTIONS } from "@/utils/gameConfig";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  LogOut,
  MapPin,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

function getISTDateForForm() {
  const date = new Date();
  date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const AdminDashboard = () => {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search and filter states
  const [searchDate, setSearchDate] = useState("");
  const [searchGame, setSearchGame] = useState("");
  const [searchResultNumber, setSearchResultNumber] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showCurrentMonthOnly, setShowCurrentMonthOnly] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const router = useRouter();

  // Filter waiting game options (exclude currently selected game)
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
  }, [router]);

  // Helper function to get current month's date range
  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay)
    };
  };

  // Filter results based on search criteria
  useEffect(() => {
    let filtered = [...results];

    // Apply current month filter if enabled and no date search
    if (showCurrentMonthOnly && !searchDate) {
      const { start, end } = getCurrentMonthRange();
      filtered = filtered.filter(item => item.date >= start && item.date <= end);
    }

    if (searchDate) {
      filtered = filtered.filter(item => item.date === searchDate);
    }

    if (searchGame) {
      filtered = filtered.filter(item => item.game === searchGame);
    }

    if (searchResultNumber) {
      filtered = filtered.filter(item =>
        item.resultNumber.toString().includes(searchResultNumber)
      );
    }

    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [results, searchDate, searchGame, searchResultNumber, showCurrentMonthOnly]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Calculate pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateResultData(formData);
    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateResult(editingId, formData);
      } else {
        // Check if a result already exists for this game and date
        const existingResult = results.find(
          (item) => item.game === formData.game && item.date === formData.date
        );

        if (existingResult) {
          if (confirm(`A result already exists for ${getGameTitle(formData.game)} on ${formData.date}. Do you want to update it?`)) {
            await updateResult(existingResult._id, formData);
          } else {
            setLoading(false);
            return;
          }
        } else {
          await createResult(formData);
        }
      }

      await loadResults();

      // Reset form
      setFormData({
        game: "",
        resultNumber: "",
        waitingGame: "",
        date: getISTDateForForm(),
      });
      setEditingId(null);

      // Clear search filters to show the new/updated result
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

    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
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

  const hasActiveFilters = searchDate || searchGame || searchResultNumber || showCurrentMonthOnly;

  // Pagination handlers
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-lg border-b border-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center min-w-0 flex-1">
              <div className="bg-gradient2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                <div className="text-black font-bold text-sm sm:text-base">A</div>
              </div>
              <div className="min-w-0">
                <h1 className="roboto text-black text-sm sm:text-base lg:text-xl truncate">
                  Admin Panel
                </h1>
                <p className="text-black/60 text-xs sm:text-sm truncate">
                  Welcome back, {user.username}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
              <Link
                href="/admin/payment-proofs"
                className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base"
              >
                <span className="mr-1 lg:mr-2">💳</span>
                <span>Payment Proofs</span>
              </Link>
              <Link
                href="/admin/site-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base"
              >
                <Settings size={16} className="mr-1 lg:mr-2" />
                Satta Disawer Config
              </Link>
              <Link
                href="/admin/goodluck-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base"
              >
                <Settings size={16} className="mr-1 lg:mr-2" />
                Good Luck Config
              </Link>
              <Link
                href="/admin/t1-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base"
              >
                <Settings size={16} className="mr-1 lg:mr-2" />
                T1 Config
              </Link>
              <button
                onClick={logout}
                className="flex items-center text-black/80 hover:text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors text-sm lg:text-base"
              >
                <LogOut size={16} className="mr-1 lg:mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 flex flex-col items-center justify-center">
                  <span className={`w-4 h-0.5 bg-black transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
                  <span className={`w-4 h-0.5 bg-black transition-all duration-300 mt-1 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
                  <span className={`w-4 h-0.5 bg-black transition-all duration-300 mt-1 ${mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`sm:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="py-2 space-y-1 border-t border-black/10">
              <Link
                href="/admin/payment-proofs"
                className="flex items-center text-black/80 hover:text-black px-3 py-3 rounded-lg hover:bg-black/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">💳</span>
                <span>Payment Proofs</span>
              </Link>
              <Link
                href="/admin/site-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-3 rounded-lg hover:bg-black/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                Satta Disawer Config
              </Link>
              <Link
                href="/admin/goodluck-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-3 rounded-lg hover:bg-black/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                Good Luck Config
              </Link>
              <Link
                href="/admin/t1-config"
                className="flex items-center text-black/80 hover:text-black px-3 py-3 rounded-lg hover:bg-black/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} className="mr-3" />
                T1 Config
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full text-left text-black/80 hover:text-black px-3 py-3 rounded-lg hover:bg-black/10 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Form */}
          <div className="bg-black/10 backdrop-blur-lg border border-black/10 rounded-2xl sm:p-6 p-4">
            <h2 className="roboto text-black text-xl mb-6 flex items-center">
              <Plus size={20} className="mr-2" />
              {editingId ? "Edit Result" : "Add New Result"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">
                  Game *
                </label>
                <div className="relative">
                  <select
                    value={formData.game}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        game: e.target.value,
                        waitingGame:
                          e.target.value === formData.waitingGame
                            ? ""
                            : formData.waitingGame,
                      })
                    }
                    className="w-full px-4 py-3 pr-10 bg-black/10 border border-black/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 appearance-none cursor-pointer"
                    required
                    disabled={loading}
                  >
                    <option value="" className="text-black bg-white">
                      Select Game
                    </option>
                    {GAME_OPTIONS.map((game) => (
                      <option
                        key={game.value}
                        value={game.value}
                        className="text-black bg-white"
                      >
                        {game.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-black/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">
                  Result Number *
                </label>
                <input
                  type="number"
                  value={formData.resultNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, resultNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/5 border border-black/20 rounded-lg text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200"
                  placeholder="Enter result number (e.g., 45)"
                  required
                  disabled={loading}
                  pattern="\d+"
                  title="Please enter numbers only"
                />
              </div>

              <div>
                <label className="block text-black/80 text-sm font-medium mb-2">
                  Waiting Game *
                </label>
                <div className="relative">
                  <select
                    value={formData.waitingGame}
                    onChange={(e) =>
                      setFormData({ ...formData, waitingGame: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 bg-black/5 border border-black/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200 appearance-none cursor-pointer"
                    required
                    disabled={loading || !formData.game}
                  >
                    <option value="" className="text-black bg-white">
                      Select Waiting Game
                    </option>
                    {waitingGameOptions.map((game) => (
                      <option
                        key={game.value}
                        value={game.value}
                        className="text-black bg-white"
                      >
                        {game.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-black/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-black/80 text-sm font-medium mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#CECECE] border border-black/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-200"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.game ||
                    !formData.resultNumber ||
                    !formData.waitingGame ||
                    !formData.date
                  }
                  className="flex-1 bg-gradient2 text-black py-3 px-4 rounded-lg roboto hover:opacity-90 transform hover:scale-105 transition-all duration-200 disabled:opacity-80 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {editingId ? "Updating..." : "Adding..."}
                    </div>
                  ) : editingId ? (
                    "Update Result"
                  ) : (
                    "Add Result"
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-black/20 text-black rounded-lg hover:bg-black/30 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results List with Search */}
          <div className="bg-black/10 backdrop-blur-lg border border-black/20 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="roboto text-black text-xl">
                Results ({filteredResults.length} total)
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-black/60 hover:text-black text-sm flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Search Filters */}
            <div className="space-y-3 mb-4">
              {/* Current Month Toggle */}
              <div className="flex items-center justify-between p-3 bg-orange-600/20 rounded-lg border border-orange-600/30">
                <label className="text-black/90 text-sm font-medium">
                  Show current month only
                </label>
                <button
                  onClick={() => setShowCurrentMonthOnly(!showCurrentMonthOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showCurrentMonthOnly ? 'bg-orange-600' : 'bg-black/20'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCurrentMonthOnly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => {
                    setSearchDate(e.target.value);
                    if (e.target.value) {
                      setShowCurrentMonthOnly(false);
                    }
                  }}
                  className="px-3 py-2 bg-[#CECECE] w-full max-sm:max-w-[170px] border border-black/20 rounded-lg text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Search by date"
                />
                <div className="relative">
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><svg class="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>
                  <select
                    value={searchGame}
                    onChange={(e) => setSearchGame(e.target.value)}
                    className="ps-3 pr-8 py-2 bg-black/10 w-full border border-black/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none"
                  >
                    <option value="" className="text-black bg-white">All Games</option>
                    {GAME_OPTIONS.map((game) => (
                      <option key={game.value} value={game.value} className="text-black bg-white">
                        {game.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchResultNumber}
                  onChange={(e) => setSearchResultNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/10 border border-black/20 rounded-lg text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  placeholder="Search by result number..."
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" />
              </div>

              {/* Results per page selector */}
              <div className="flex justify-between items-center flex-wrap gap-1">
                <span className="text-black/60 text-sm">
                  {showCurrentMonthOnly && !searchDate ? (
                    <span className="text-orange-400">Current month: </span>
                  ) : null}
                  Showing {filteredResults.length > 0 ? indexOfFirstResult + 1 : 0}-{Math.min(indexOfLastResult, filteredResults.length)} of {filteredResults.length}
                </span>
                <select
                  value={resultsPerPage}
                  onChange={(e) => {
                    setResultsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 bg-black/10 border border-black/20 rounded text-black text-sm"
                >
                  <option value="5" className="text-black">5 per page</option>
                  <option value="10" className="text-black">10 per page</option>
                  <option value="20" className="text-black">20 per page</option>
                  <option value="50" className="text-black">50 per page</option>
                </select>
              </div>
            </div>

            {fetchLoading ? (
              <div className="text-center text-black/60 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading results...</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto p-1">
                  {currentResults.length === 0 ? (
                    <div className="text-center text-black/60 py-8">
                      {hasActiveFilters ? (
                        <>
                          <Search size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No results found matching your filters</p>
                          <button
                            onClick={clearAllFilters}
                            className="text-orange-400 hover:text-orange-300 text-sm mt-2"
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        <>
                          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No results added yet</p>
                          <p className="text-sm mt-2">
                            Add your first result using the form
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    currentResults.map((item) => (
                      <div
                        key={item._id}
                        className={`bg-black/10 rounded-lg p-3 hover:bg-black/15 transition-colors ${editingId === item._id ? "ring-2 ring-orange-600" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <MapPin
                                size={16}
                                className="text-orange-600 mr-2"
                              />
                              <span className="text-black font-medium text-sm sm:text-base">
                                {getGameTitle(item.game)}
                              </span>
                              <span className="ml-2 px-2 py-1 bg-gradient text-black text-sm font-bold rounded-full">
                                {item.resultNumber}
                              </span>
                            </div>
                            {item.waitingGame && (
                              <div className="text-black/70 text-sm mb-2">
                                Waiting:{" "}
                                <span className="text-black/90">
                                  {getGameTitle(item.waitingGame)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar
                                size={14}
                                className="text-black/50 mr-1"
                              />
                              <span className="text-black/60 text-sm">
                                {item.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-orange-600 hover:bg-orange-800/20 rounded-lg transition-colors"
                              disabled={loading}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 text-orange-600 hover:bg-orange-800/20 rounded-lg transition-colors"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="p-2 bg-black/10 text-black rounded-lg hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page numbers */}
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 rounded-lg transition-colors ${currentPage === pageNumber
                              ? "bg-orange-600 text-black"
                              : "bg-black/10 text-black hover:bg-black/20"
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-black/10 text-black rounded-lg hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    </div>
  );
};

export default AdminDashboard;