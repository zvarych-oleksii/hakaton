import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import { useLocation } from "react-router-dom";
import useApi from "../lib/axiosClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "../lib/types/location";
import { FiX } from "react-icons/fi";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const RouteMapPage = () => {
    const { state } = useLocation();
    const initialSelected: Location[] = state?.selectedLocation ? [state.selectedLocation] : [];

    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>(initialSelected);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

    const { listLocations } = useApi();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await listLocations({ skip: 0, limit: 100 });
                setLocations(data);
            } catch (error) {
                console.error("Не вдалося отримати локації:", error);
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        const successCallback = (position: GeolocationPosition) => {
            const coords: [number, number] = [
                position.coords.latitude,
                position.coords.longitude,
            ];
            setUserLocation(coords);
        };

        const errorCallback = (error: GeolocationPositionError) => {
            console.error("Не вдалося отримати місцезнаходження користувача:", error.message);
            alert("Неможливо отримати доступ до Вашого місцезнаходження. Перевірте налаштування браузера.");
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            alert("Geolocation не підтримується цим браузером.");
        }
    }, []);

    useEffect(() => {
        const buildRoute = async () => {
            // @ts-ignore
            const points: [number, number][] = userLocation
                ? [userLocation, ...selectedLocations.map(loc => [loc.coordinates.lat, loc.coordinates.lng])]
                : selectedLocations.map(loc => [loc.coordinates.lat, loc.coordinates.lng]);

            if (points.length < 2) {
                setRouteCoords([]);
                return;
            }

            const coordinateString = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
            const url = `https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.routes && data.routes.length) {
                    const leafletCoords = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
                    setRouteCoords(leafletCoords);
                }
            } catch (error) {
                console.error("Не вдалося отримати маршрут з OSRM:", error);
            }
        };

        buildRoute();
    }, [userLocation, selectedLocations]);

    const initialCenter: [number, number] = userLocation
        ? userLocation
        : selectedLocations.length > 0
            ? [selectedLocations[0].coordinates.lat, selectedLocations[0].coordinates.lng]
            : [50.4501, 30.5234];

    const openInGoogleMaps = () => {
        if (routeCoords.length < 2) return;
        const origin = routeCoords[0];
        const destination = routeCoords[routeCoords.length - 1];
        const waypoints = routeCoords.slice(1, -1);
        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}`;
        if (waypoints.length) {
            const waypointsStr = waypoints.map(point => `${point[0]},${point[1]}`).join("|");
            url += `&waypoints=${encodeURIComponent(waypointsStr)}`;
        }
        window.open(url, "_blank");
    };

    const handleSelectLocation = (location: Location) => {
        const exists = selectedLocations.find(loc => loc.id === location.id);
        if (!exists) {
            setSelectedLocations(prev => [...prev, location]);
        }
    };

    const handleRemoveLocation = (locationId: string) => {
        setSelectedLocations(prev => prev.filter(loc => loc.id !== locationId));
    };

    const defaultMarkerIcon = new L.Icon({
        iconUrl: markerIconUrl,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const selectedMarkerIcon = L.divIcon({
        html: `<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        className: "",
    });

    return (
        <div className="min-h-screen flex">
            <aside className="bg-gray-800/40 p-4 border border-gray-700 rounded-xl shadow-lg w-72 backdrop-blur-md mr-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Вибрані локації</h2>
                </div>
                {selectedLocations.length === 0 ? (
                    <p className="text-gray-300">Немає обраних локацій.</p>
                ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedLocations.map(location => (
                            <li
                                key={location.id}
                                className="p-2 bg-gray-800 rounded-lg flex flex-col gap-2 hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-white">{location.name}</span>
                                    <button
                                        onClick={() => handleRemoveLocation(location.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center justify-center"
                                        title="Видалити локацію"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-300">
                  {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedLocations.length > 0 && (
                    <button
                        onClick={openInGoogleMaps}
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow"
                    >
                        Побудувати маршрут в Google Maps
                    </button>
                )}
            </aside>
            <div className="flex-1 relative">
                <MapContainer center={initialCenter} zoom={13} style={{ height: "100vh", width: "100%" }}>
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map(location => {
                        const isSelected = selectedLocations.some(loc => loc.id === location.id);
                        return (
                            <Marker
                                key={location.id}
                                position={[location.coordinates.lat, location.coordinates.lng]}
                                icon={isSelected ? selectedMarkerIcon : defaultMarkerIcon}
                                eventHandlers={{
                                    click: () => handleSelectLocation(location),
                                }}
                            >
                                <Tooltip
                                    direction="top"
                                    offset={[0, -10]}
                                    opacity={1}
                                    interactive
                                    sticky
                                    className="!bg-transparent !shadow-none"
                                >
                                    <div className="bg-white text-black px-4 py-2 rounded-md shadow-md">
                                        <div className="font-bold text-lg">{location.name}</div>
                                        <div className="text-sm mb-2">
                                            {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                                        </div>
                                        {location.factors?.list && (
                                            <div className="flex flex-wrap gap-1">
                                                {location.factors.list.map((factor, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                    >
                            {factor}
                          </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}
                    {routeCoords.length > 1 && (
                        <Polyline positions={routeCoords} color="blue" />
                    )}
                </MapContainer>
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                        onClick={() => {
                            console.log("Збережений маршрут:", routeCoords);
                            alert("Маршрут збережено!");
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Зберегти маршрут
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteMapPage;
