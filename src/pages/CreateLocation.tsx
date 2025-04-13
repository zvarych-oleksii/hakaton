import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMapMarkerAlt, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";
import useApi from "../lib/axiosClient";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FC, useState } from "react";
import { locationSchema, LocationData } from "../common/schemas/schemas.ts";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type LocationPickerProps = {
    value: { lat: number; lng: number };
    onChange: (coords: { lat: number; lng: number }) => void;
};

const LocationPicker: FC<LocationPickerProps> = ({ value, onChange }) => {
    const [position, setPosition] = useState(value);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onChange(e.latlng);
            }
        });
        return <Marker position={[position.lat, position.lng]} />;
    }

    return (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
};

const CreateLocation: FC = () => {
    const navigate = useNavigate();
    const { createLocation } = useApi();

    // @ts-ignore
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<LocationData>({
        // @ts-ignore
        resolver: zodResolver(locationSchema),
        defaultValues: {
            lat: 50.4501,
            lng: 30.5234,
            factors: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "factors"
    });

    const onSubmit = async (data: LocationData) => {
        try {
            const factorsArray = data.factors ? data.factors.map((item) => item.value) : [];
            const factorsObj = factorsArray.length > 0 ? { list: factorsArray } : null;

            const locationData = {
                name: data.name,
                coordinates: { lat: data.lat, lng: data.lng },
                type: data.type,
                description: data.description || null,
                factors: factorsObj
            };

            await createLocation(locationData);
            navigate(RoutesMain.Location);
        } catch (error) {
            console.error("Location creation failed:", error);
        }
    };

    return (
        <form
            // @ts-ignore
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen text-white px-6 py-10 max-w-2xl mx-auto space-y-12"
        >
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                    <FaMapMarkerAlt className="inline mr-2" /> Create Your Location
                </h1>
                <p className="text-gray-400">
                    Fill in the form to add a new location to the platform.
                </p>
            </div>

            {/* Basic Info */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Info</h2>
                {/* Location Name */}
                <div>
                    <label className="block mb-1">Location Name</label>
                    <input
                        {...register("name")}
                        placeholder="Enter location name"
                        className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${
                            errors.name ? "border-red-500" : "border-gray-600"
                        }`}
                    />
                    {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Location Picker */}
                <div>
                    <label className="block mb-1">Pick Location on Map</label>
                    <LocationPicker
                        value={{ lat: 50.4501, lng: 30.5234 }}
                        onChange={(coords) => {
                            setValue("lat", coords.lat);
                            setValue("lng", coords.lng);
                        }}
                    />
                    {(errors.lat || errors.lng) && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.lat?.message || errors.lng?.message}
                        </p>
                    )}
                </div>

                {/* Location Type */}
                <div>
                    <label className="block mb-1">Location Type</label>
                    <select
                        {...register("type")}
                        className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${
                            errors.type ? "border-red-500" : "border-gray-600"
                        }`}
                    >
                        <option value="" disabled>
                            Select a type
                        </option>
                        <option value="education">Education</option>
                        <option value="enjoy">Enjoy</option>
                        <option value="interesting">Interesting</option>
                    </select>
                    {errors.type && (
                        <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        placeholder="Enter a brief description"
                        className={`w-full px-4 py-2 h-24 rounded bg-gray-800 text-white border ${
                            errors.description ? "border-red-500" : "border-gray-600"
                        } resize-none`}
                    />
                    {errors.description && (
                        <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>
            </section>

            {/* Factors */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Factors (Optional)</h2>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-center">
                        <div className="flex-1">
                            <input
                                {...register(`factors.${index}.value` as const)}
                                placeholder="Enter factor"
                                className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${
                                    errors.factors && errors.factors[index]
                                        ? "border-red-500"
                                        : "border-gray-600"
                                }`}
                            />
                            {errors.factors && errors.factors[index] && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.factors[index]?.value?.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-400 transition"
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
                >
                    <FaPlus /> Add Factor
                </button>
            </section>

            {/* Submit Button */}
            <div className="text-center">
                <button
                    type="submit"
                    className="px-10 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-semibold text-lg shadow-md transition"
                >
                    Create Location
                </button>
            </div>
        </form>
    );
};

export default CreateLocation;
