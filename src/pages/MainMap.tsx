import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import useApi from "../lib/axiosClient";
import { Location } from "../lib/types/location.ts";
import L from "leaflet";
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

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                // Retrieve all locations; adjust limit as needed.
                const data = await listLocations({ skip: 0, limit: 100 });
                setLocations(data);
            } catch (error) {
                console.error("Failed to fetch locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const defaultCenter: [number, number] = [50.4501, 30.5234];

    return (
        <div className="min-h-screen">
            <MapContainer center={defaultCenter} zoom={12} style={{ height: "100vh", width: "100%" }}>
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
                            <Tooltip
                                direction="top"
                                offset={[0, -10]}
                                opacity={1}
                                // We disable the default tooltip styling so our custom styling can take effect.
                                className="!bg-transparent !shadow-none"
                            >
                                <div className="bg-gray-900 bg-opacity-80 text-white px-4 py-2 rounded-md shadow-md">
                                    <div className="font-bold text-lg">
                                        {location.name}
                                    </div>
                                    <div className="text-sm">
                                        {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                                    </div>
                                    {location.factors?.list && location.factors.list.length > 0 && (
                                        <div className="mt-1 text-xs">
                                            {location.factors.list.join(", ")}
                                        </div>
                                    )}
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
};

export default MainMapPage;
