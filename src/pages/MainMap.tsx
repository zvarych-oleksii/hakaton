import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useApi from "../lib/axiosClient";
import { Location } from "../lib/types/location";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

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

const MainMapPage = () => {
    const { listLocations } = useApi();
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const defaultCenter: [number, number] = [50.4501, 30.5234];

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                const data = await listLocations({ skip: 0, limit: 100 });
                setLocations(data);
            } catch (error) {
                console.error("Не вдалося отримати локації:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Не вдалося отримати місцезнаходження користувача:", error.message);
                }
            );
        } else {
            alert("Geolocation не підтримується цим браузером.");
        }
    }, []);

    const currentCenter = userLocation || defaultCenter;

    return (
        <div className="min-h-screen">
            <MapContainer center={currentCenter} zoom={12} style={{ height: "100vh", width: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {!isLoading &&
                    locations.map((location) => (
                        <Marker
                            key={location.id}
                            position={[location.coordinates.lat, location.coordinates.lng]}
                        >
                            <Popup>
                                <div className="bg-white text-black px-4 py-2 rounded-md">
                                    <div className="font-bold text-lg">{location.name}</div>
                                    <div className="text-sm mb-2">
                                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                                    </div>
                                    {location.factors?.list && (
                                        <div className="flex flex-wrap gap-1">
                                            {location.factors.list.map((factor, idx) => (
                                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                    {factor}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        onClick={() =>
                                            navigate("/route", { state: { selectedLocation: location } })
                                        }
                                    >
                                        Побудувати маршрут
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
};

export default MainMapPage;
