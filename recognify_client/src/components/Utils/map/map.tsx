import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
  DirectionsRenderer,
} from "@react-google-maps/api";

import polyline from "@mapbox/polyline";
// Types for props and markers
type LatLng = {
  lat: number;
  lng: number;
};

type MarkerType = {
  lat: number;
  lng: number;
  iconUrl?: string; // Optional custom icon URL
};

type MapComponentProps = {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  routePolyline?: string;
  path?: LatLng[];
  markers?: MarkerType[];
  destination?: { from: LatLng; to: LatLng };
  onPickLocation?: (location: LatLng) => void;
};

const MapComponent: React.FC<MapComponentProps> = ({
  width = "100%",
  height = "400px",
  style = {},
  routePolyline = "",
  path = [],
  markers = [],
  destination,
  onPickLocation = () => {},
}) => {
  const [pickedMarkers, setPickedMarkers] = useState<LatLng[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [decodedPolyline, setDecodedPolyline] = useState<LatLng[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // Function to get current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (routePolyline) {
      const decodedPath = polyline.decode(routePolyline).map((point) => ({
        lat: point[0],
        lng: point[1],
      }));
      setDecodedPolyline(decodedPath);
    }
  }, [routePolyline]);

  useEffect(() => {
    const storedDirections = localStorage.getItem("route");
    if (storedDirections) {
      setDirections(JSON.parse(storedDirections));
    } else {
      if (destination && destination?.from && destination?.to) {
        fetchRoute(destination.from, destination.to);
      }
    }
  }, [destination]);

  // Event handler for picking location on the map
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      setPickedMarkers([...pickedMarkers, newMarker]);
      onPickLocation(newMarker);
    }
  };

  // Route polyline if two destinations are set
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
  });

  const fetchRoute = (from: LatLng, to: LatLng) => {
    const directionsService = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: from, // replace with your origin
      destination: to, // replace with your destination
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
        localStorage.setItem("route", JSON.stringify(result));
      } else {
        console.error("Error fetching directions:", status);
      }
    });
  };

  return (
    <div style={{ width, height, ...style }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={currentLocation || { lat: 51.505, lng: -0.09 }}
          zoom={13}
          onClick={handleMapClick}
        >
          {pickedMarkers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={marker.iconUrl}
            />
          ))}
          {path.length > 0 && (
            <Polyline
              path={path}
              options={{ strokeColor: "#0000FF", strokeWeight: 2 }}
            />
          )}

          {decodedPolyline.length > 0 && (
            <Polyline
              path={decodedPolyline}
              options={{ strokeColor: "#0000FF", strokeWeight: 2 }}
            />
          )}

          {currentLocation && (
            <Marker
              position={currentLocation}
              icon="https://leafletjs.com/examples/custom-icons/leaf-orange.png"
            />
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapComponent;
