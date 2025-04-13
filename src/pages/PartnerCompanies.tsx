import React, { useState, useEffect } from "react";
import { FaBuilding } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../lib/axiosClient";
import { Company } from "../lib/types/company";
import { RoutesMain } from "../common/enums/routes";
import Loader from "../components/Loader";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback,
  ...imgProps
}) => {
  const [hasError, setHasError] = useState(false);

  return !hasError ? (
    <img
      {...imgProps}
      onError={(e) => {
        setHasError(true);
        if (imgProps.onError) imgProps.onError(e);
      }}
    />
  ) : (
    <>{fallback}</>
  );
};

const truncateText = (text: string, maxLength = 120): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
};

const PartnerCompaniesPage: React.FC = () => {
  const { getCompanies } = useApi();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 9;
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error("Error loading companies:", err);
        setError("Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          PARTNER COMPANIES
        </h1>
      </header>

      <main className="flex-1">
        {companies.length === 0 ? (
          <p className="text-white">No companies available.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4 transition"
                >
                  {/* Logo or Fallback Icon */}
                  <ImageWithFallback
                    src={company.photo || ""}
                    alt={`${company.title} Logo`}
                    className="w-16 h-16 object-cover rounded"
                    fallback={
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                        <FaBuilding size={32} className="text-gray-300" />
                      </div>
                    }
                  />

                  {/* Company Name */}
                  <h2 className="text-xl font-bold text-center">
                    {company.title}
                  </h2>

                  {/* Average Rate */}
                  <p className="text-sm uppercase tracking-wide text-purple-400">
                    Average Rate: {company.average_rating} / 5
                  </p>

                  {/* Truncated Description */}
                  <p className="text-center text-gray-300 text-sm break-all">
                    {company.description && truncateText(company.description)}
                  </p>

                  {/* Explore Button */}
                  <button
                    onClick={() =>
                      navigate(
                        RoutesMain.CompanyProfile.replace(":id", company.id),
                      )
                    }
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-sm font-semibold transition"
                  >
                    Explore
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-1 rounded transition text-white ${currentPage === page
                        ? "bg-purple-600"
                        : "bg-gray-700 hover:bg-gray-600"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PartnerCompaniesPage;
