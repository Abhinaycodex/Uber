import  { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => console.error('Error getting location:', error)
      );
    };

    updatePosition();
    const watchId = navigator.geolocation.watchPosition(updatePosition);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!currentPosition) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={currentPosition} zoom={15}>
        <Marker position={currentPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;