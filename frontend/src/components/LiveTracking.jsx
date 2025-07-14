import { useState, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";



const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting location:", error)
      );
      
    };

    updatePosition();
    const watchId = navigator.geolocation.watchPosition(updatePosition);

    console.log("API key =", import.meta.env.VITE_GOOGLE_MAPS_API);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!currentPosition) {
    return <div>Loading map...</div>;
  }

  return (
    <iframe

      className="w-full h-full"
      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API}
      &q=${currentPosition?.latitude},${currentPosition?.longitude}`}
    ></iframe>
  );
};

export default LiveTracking;
