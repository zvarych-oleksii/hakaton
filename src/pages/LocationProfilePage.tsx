import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../lib/axiosClient";
import { Location } from "../lib/types/location";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaPlusCircle,
    FaUserCircle,
    FaReply,
    FaStar,
} from "react-icons/fa";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import CreateReviewForm from "../components/PostForm";
import { LocationReview as Review, LocationReviewCreate } from "../lib/types/comment";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const REVIEWS_PER_PAGE = 5;

//
// A helper component to display rating as stars
//
const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    color={star <= rating ? "gold" : "gray"}
                    className="text-xl"
                />
            ))}
        </div>
    );
};

const LocationProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Load location and reviews via API
    const { getLocation, getCommentsByLocationId, createComment } = useApi();
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State for location review discussion
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = reviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    // Helper to build a hierarchical review tree
    const buildReviewTree = (flatReviews: Review[]): Review[] => {
        const reviewMap: { [key: string]: Review & { replies: Review[] } } = {};
        const topReviews: Review[] = [];

        flatReviews.forEach((review) => {
            reviewMap[review.id] = { ...review, replies: [] };
        });
        flatReviews.forEach((review) => {
            if (review.reply_to_id) {
                if (reviewMap[review.reply_to_id]) {
                    reviewMap[review.reply_to_id].replies.push(reviewMap[review.id]);
                } else {
                    topReviews.push(reviewMap[review.id]);
                }
            } else {
                topReviews.push(reviewMap[review.id]);
            }
        });
        return topReviews;
    };

    useEffect(() => {
        const fetchLocationAndReviews = async () => {
            if (!id) return;
            try {
                const [locationData, allReviews] = await Promise.all([
                    getLocation(id),
                    getCommentsByLocationId(id),
                ]);
                setLocation(locationData);
                // Convert flat reviews to a hierarchical structure
                const reviewTree = buildReviewTree(allReviews);
                setReviews(reviewTree);
            } catch (error) {
                console.error("Failed to load location or reviews", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocationAndReviews();
    }, [id]);

    const handleCommentSubmit = async (
        data: { review: string },
        replyToId?: string
    ) => {
        if (!id) return;
        try {
            const payload: LocationReviewCreate = {
                review: data.review,
                rating: 5, // default rating for new reviews (this value is set on review creation)
                reply_to_id: replyToId,
                location_id: id,
            };

            const newReview = await createComment(payload);

            if (replyToId) {
                const insertReply = (reviews: Review[]): Review[] =>
                    reviews.map((r) => {
                        if (r.id === replyToId) {
                            return { ...r, replies: [newReview, ...(r.replies || [])] };
                        }
                        if (r.replies?.length) {
                            return { ...r, replies: insertReply(r.replies) };
                        }
                        return r;
                    });
                setReviews((prev) => insertReply(prev));
                setReplyingTo(null);
            } else {
                setReviews((prev) => [newReview, ...prev]);
                setShowForm(false);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error("Failed to create review", err);
        }
    };

    // Renders individual review with its details and reply form
    const renderReview = (review: Review) => (
        <div
            key={review.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4"
        >
            <div className="flex items-center gap-3">
                <FaUserCircle className="text-3xl text-gray-500" />
                <div>
                    <p className="font-semibold">{review.user.full_name}</p>
                    <span className="text-gray-400 text-sm">
            {new Date(review.created_at).toLocaleString()}
          </span>
                </div>
            </div>

            {/* Display the rating as stars */}
            <div className="mt-2">
                <StarRatingDisplay rating={review.rating} />
            </div>

            <p className="mt-2 text-gray-300 whitespace-pre-wrap">
                {review.review}
            </p>

            <div className="flex gap-4 mt-4 text-sm">
                <button
                    onClick={() => setReplyingTo(review.id)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition"
                >
                    <FaReply /> Reply
                </button>
            </div>

            {replyingTo === review.id && (
                <div className="mt-4 ml-6">
                    <CreateReviewForm
                        onCancel={() => setReplyingTo(null)}
                        onSubmit={(data) => handleCommentSubmit(data, review.id)}
                    />
                </div>
            )}

            {review.replies && review.replies.length > 0 && (
                <div className="mt-4 ml-6 border-l border-gray-600 pl-4">
                    {review.replies.map((r) => renderReview(r))}
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Loading location details...</p>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Location not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white py-10 px-4">
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    <FaMapMarkerAlt className="text-4xl" />
                    <h1 className="text-4xl font-bold">{location.name}</h1>
                </div>

                <div className="mb-4">
          <span className="bg-purple-600 text-white px-3 py-1 text-sm rounded">
            {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
          </span>
                </div>

                {location.description && (
                    <p className="mb-4 text-gray-300">{location.description}</p>
                )}

                {location.factors &&
                    location.factors.list &&
                    location.factors.list.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Features:</h2>
                            <div className="flex flex-wrap gap-2">
                                {location.factors.list.map((fact, index) => (
                                    <span
                                        key={index}
                                        className="bg-green-600 text-white px-3 py-1 text-xs rounded"
                                    >
                    {fact}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                <div className="mt-8">
                    <MapContainer
                        center={[
                            location.coordinates.lat,
                            location.coordinates.lng,
                        ]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "300px", width: "100%" }}
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                            position={[
                                location.coordinates.lat,
                                location.coordinates.lng,
                            ]}
                        />
                    </MapContainer>
                </div>

                {/* Discussion Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                        <span className="text-sm">Join the discussion:</span>
                        <button
                            onClick={() => {
                                setReplyingTo(null);
                                setShowForm(!showForm);
                            }}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 rounded px-3 py-1 transition"
                        >
                            <FaPlusCircle />
                            {showForm ? "Close Form" : "Add Comment"}
                        </button>
                    </div>

                    {showForm && (
                        <CreateReviewForm
                            onCancel={() => setShowForm(false)}
                            onSubmit={(data) => handleCommentSubmit(data)}
                        />
                    )}

                    <div className="space-y-6">
                        {paginatedReviews.map((review) => renderReview(review))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-10 flex justify-center items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === i + 1
                                            ? "bg-purple-600"
                                            : "bg-gray-700 hover:bg-gray-600"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationProfilePage;
