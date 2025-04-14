import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";
import { Location } from "../lib/types/location.ts";
import useApi from "../lib/axiosClient";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
const ITEMS_PER_PAGE = 4;

type MiniMapProps = {
  coordinates: { lat: number; lng: number };
};

const MiniMap = ({ coordinates }: MiniMapProps) => {
  return (
      <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "200px", width: "100%" }}
      >
        <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]} />
      </MapContainer>
  );
};

const PickLocationPage = () => {
  const navigate = useNavigate();
  const { listLocations } = useApi();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const search = debouncedSearchQuery || undefined;
        const types =
            selectedCategories.length > 0
                ? selectedCategories.map((cat) => cat.toLowerCase())
                : undefined;

        const data = await listLocations({ skip, limit: ITEMS_PER_PAGE, search, types });
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchQuery, selectedCategories, currentPage]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => setCurrentPage((p) => p + 1);

  return (
      <div className="min-h-screen px-4 py-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center sm:text-left">EXPLORE LOCATIONS</h1>
          <button
              onClick={() => navigate(RoutesMain.LocationCreate)}
              className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-semibold transition"
          >
            + Create Location
          </button>
        </div>

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
                      className={`px-5 py-2 rounded-3xl border text-sm transition font-medium ${
                          isSelected
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

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">FEATURED LOCATIONS</h2>

          {isLoading ? (
              <p className="text-gray-400">Loading...</p>
          ) : locations.length === 0 ? (
              <p className="text-gray-400">No locations found for your selection.</p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl p-8 shadow-xl flex flex-col gap-6 transition"
                    >
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{location.name}</h3>
                        <p className="text-gray-300 text-base mb-2">
                          {location.description || "No description available"}
                        </p>
                        <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">
                    {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                  </span>
                        {location.factors?.list && location.factors.list.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {location.factors.list.map((fact, index) => (
                                  <span
                                      key={index}
                                      className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                                  >
                          {fact}
                        </span>
                              ))}
                            </div>
                        )}
                      </div>
                      <div className="w-full flex items-center align-center justify-center">
                        <MiniMap coordinates={location.coordinates} />
                      </div>
                      <button
                          onClick={() =>
                              navigate(RoutesMain.LocationProfile.replace(":id", location.id))
                          }
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm font-medium transition"
                      >
                        VIEW
                      </button>
                    </div>
                ))}
              </div>
          )}

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
                disabled={locations.length < ITEMS_PER_PAGE}
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
