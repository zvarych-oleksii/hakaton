import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../lib/axiosClient";
import { Location } from "../lib/types/location";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

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

type MiniMapProps = {
    coordinates: { lat: number; lng: number };
};

const MiniMap = ({ coordinates }: MiniMapProps) => {
    return (
        <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lng]} />
        </MapContainer>
    );
};

const LocationProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { getLocation } = useApi();
    const navigate = useNavigate();

    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                if (id) {
                    const data = await getLocation(id);
                    setLocation(data);
                }
            } catch (error) {
                console.error("Failed to fetch location:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [id, getLocation]);

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
            {/* Navigation Back Button */}
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

                {location.factors?.list && location.factors.list.length > 0 && (
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
                    <MiniMap coordinates={location.coordinates} />
                </div>
            </div>
        </div>
    );
};

export default LocationProfilePage;
