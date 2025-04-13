import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiStar, FiUser } from "react-icons/fi";
import { FaStar, FaBuilding } from "react-icons/fa";
import useApi from "../lib/axiosClient";
import { Company, ReviewWithAuthor, Vacancy } from "../lib/types/company";
import ModalWindow from "../components/ModalWindow";
import { User } from "../lib/types/user";
import Loader from "../components/Loader";

const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getCompany,
    getCompanyVacancies,
    getCompanyReviews,
    createCompanyReview,
    getCurrentUser,
    applyForVacancy,
  } = useApi();

  const [company, setCompany] = useState<Company | null>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logoError, setLogoError] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const companyData = await getCompany(id);
        setCompany(companyData);
        const vacancyData = await getCompanyVacancies(id);
        setVacancies(vacancyData);
        const reviewData = await getCompanyReviews(id);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (applicationSuccess) {
      const timeout = setTimeout(() => {
        setApplicationSuccess(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [applicationSuccess]);

  const alreadyReviewed =
    currentUser &&
    reviews.some((review) => review.author_id === currentUser.id);

  const handleSubmitReview = async () => {
    if (!id) return;
    try {
      await createCompanyReview(id, {
        rating: reviewRating,
        review_text: reviewText,
      });
      const updatedReviews = await getCompanyReviews(id);
      setReviews(updatedReviews);
      setReviewRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const ReviewAvatar: React.FC<{
    src?: string;
    alt: string;
    className?: string;
  }> = ({ src, alt, className }) => {
    const [hasError, setHasError] = useState(false);
    if (src && !hasError) {
      return (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={className}
        />
      );
    }
    return <FiUser size={24} className={className || "text-gray-500"} />;
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} size={20} className="text-white" />
      ) : (
        <FiStar key={i} size={20} className="text-gray-500" />
      ),
    );

  const handleStarClick = (starValue: number) => {
    setReviewRating(starValue);
  };

  const handleApplyClick = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVacancy(null);
  };

  const handleApplySubmit = async () => {
    if (!selectedVacancy?.id) return;

    try {
      await applyForVacancy(selectedVacancy.id);
      setApplicationSuccess(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to apply for vacancy", error);
      alert("Failed to apply for this vacancy. Please try again later.");
    }
  };

  if (loading) return <Loader />;
  if (!company) return <div>Company not found</div>;

  return (
    <div className="min-h-screen flex flex-col text-white">
      <main className="flex-1 px-4 w-full sm:px-8 py-8 max-w-6xl mx-auto">
        {/* Company Header */}
        <section className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-start md:items-center">
          <div className="flex items-center justify-center w-28 h-28 bg-gray-700 rounded mb-4 md:mb-0 md:mr-8">
            {company.photo && !logoError ? (
              <img
                src={company.photo}
                alt={company.title}
                className="object-cover w-full h-full rounded"
                onError={() => setLogoError(true)}
              />
            ) : (
              <FaBuilding size={64} className="text-gray-300" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">{company.title}</h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold uppercase text-sm">
                Average Rating:
              </span>
              <span className="text-xl font-semibold">
                {company.average_rating} / 5.0
              </span>
            </div>
            <p className="max-w-3xl text-gray-200 text-sm leading-relaxed break-all">
              {company.description}
            </p>
          </div>
        </section>

        {/* Success Banner */}
        {applicationSuccess && (
          <div className="mb-6 p-4 bg-green-600/30 border border-green-500 text-green-300 rounded text-sm font-medium">
            🎉 You have successfully applied for the vacancy!
          </div>
        )}

        {/* Vacancies */}
        {vacancies.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Open Vacancies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-gray-700">
                    {["Level", "Technology", "Salary", "Location", ""].map(
                      (header) => (
                        <th
                          key={header}
                          className="p-3 font-semibold uppercase border-r border-gray-700"
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {vacancies.map((vacancy) => (
                    <tr
                      key={vacancy.id}
                      className="border-b border-gray-700 last:border-0"
                    >
                      <td className="p-3 border-r border-gray-700">
                        {vacancy.level}
                      </td>
                      <td className="p-3 border-r border-gray-700">
                        {vacancy.technology}
                      </td>
                      <td className="p-3 border-r border-gray-700">
                        {vacancy.salary ? `$${vacancy.salary}` : "N/A"}
                      </td>
                      <td className="p-3 border-r border-gray-700">
                        {vacancy.location}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleApplyClick(vacancy)}
                          className="w-full bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded text-xs font-semibold"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow p-4 space-y-2 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ReviewAvatar
                        src={""}
                        alt={review.author_name || "Anonymous"}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="font-semibold">
                        {review.author_name || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-200">{review.review_text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leave a Review */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">
            Leave Your Review On This Company
          </h3>
          {alreadyReviewed ? (
            <p className="text-gray-400">
              You have already submitted a review for this company.
            </p>
          ) : (
            <>
              <div className="flex space-x-1 mb-4">
                {Array.from({ length: 5 }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handleStarClick(idx + 1)}
                    type="button"
                  >
                    {idx + 1 <= reviewRating ? (
                      <FaStar size={24} className="text-white" />
                    ) : (
                      <FiStar size={24} className="text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full p-3 bg-gray-800/40 backdrop-blur-md border border-gray-600 text-sm text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type your review here..."
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
              <button
                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded font-semibold mt-4"
                onClick={handleSubmitReview}
              >
                SUBMIT
              </button>
            </>
          )}
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && selectedVacancy && (
        <ModalWindow onClose={handleCloseModal}>
          <div className="text-white flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2">Apply for this Vacancy</h2>
            <p className="mb-4">
              <strong>Company:</strong> {company.title}
            </p>
            <p className="mb-4">
              <strong>Vacancy:</strong> {selectedVacancy.level} -{" "}
              {selectedVacancy.technology}
            </p>
            <p className="mb-4">
              <strong>Salary:</strong>{" "}
              {selectedVacancy.salary ? `$${selectedVacancy.salary}` : "N/A"}
            </p>
            <p className="mb-4">
              <strong>Description:</strong> We are looking for a talented and
              motivated {selectedVacancy.level} {selectedVacancy.technology}{" "}
              Developer...
            </p>
            <p className="mb-4">
              <strong>Resume:</strong>
              {currentUser?.pdf_resume_url ||
                currentUser?.latex_resume_url ||
                "Not uploaded"}
            </p>
            <button
              onClick={handleApplySubmit}
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-semibold transition"
            >
              Submit Application
            </button>
            <button
              onClick={handleCloseModal}
              className="mt-6 self-end bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </ModalWindow>
      )}
    </div>
  );
};

export default CompanyProfilePage;
