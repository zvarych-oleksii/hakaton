import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";
import { Startup } from "../lib/types/startups";
import useApi from "../lib/axiosClient";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ALL_CATEGORIES = ["Education", "Enjoy", "Interesting"];
const ITEMS_PER_PAGE = 2;

const PickLocationPage = () => {
  const navigate = useNavigate();
  const { getStartups } = useApi();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);

        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const field =
          selectedCategories.length === 1 ? selectedCategories[0] : undefined;
        const search = debouncedSearchQuery || undefined;

        const data = await getStartups({
          skip,
          limit: ITEMS_PER_PAGE,
          field,
          search,
        });

        setStartups(data);
      } catch (err) {
        console.error("Failed to fetch startups", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, [debouncedSearchQuery, selectedCategories, currentPage]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [category], // Allow only one for API filter
    );
    setCurrentPage(1);
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => setCurrentPage((p) => p + 1); // We’d need to know total count for full pagination

  return (
    <div className="min-h-screen px-4 py-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          EXPLORE LOCATIONS
        </h1>
        <button
          onClick={() => navigate(RoutesMain.LocationCreate)}
          className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-semibold transition"
        >
          + Create Location
        </button>
      </div>

      {/* Search & Filters */}
      <div className="max-w-3xl mx-auto mb-10 space-y-6">
        <input
          type="text"
          placeholder="Search locations"
          className="w-full px-4 py-3 rounded-lg bg-gray-800/40 backdrop-blur-md border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-wrap justify-center gap-3">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-5 py-2 rounded-3xl border text-sm transition font-medium
                  ${isSelected
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-gray-800/40 border-gray-600 hover:bg-gray-700 text-white"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-dashed border-gray-500 my-10 max-w-3xl mx-auto" />

      {/* Startups List */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">FEATURED Location</h2>

        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : startups.length === 0 ? (
          <p className="text-gray-400">No locations found for your selection.</p>
        ) : (
          <div className="space-y-6">
            {startups.map((startup, index) => (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between md:items-center transition"
              >
                <div className="mb-4 md:mb-0 md:mr-4 max-w-2xl">
                  <h3 className="text-xl font-bold mb-1">{startup.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {startup.description}
                  </p>
                  <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">
                    {startup.field}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      RoutesMain.LocationProfile.replace(":id", startup.id),
                    )
                  }
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm font-medium transition"
                >
                  VIEW
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40 transition"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={startups.length < ITEMS_PER_PAGE}
            className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickLocationPage;
