/* global google */
import React, { useState, useEffect, useRef } from 'react';
import markerImage from './assets/marker.png';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 31.462539,
  lng: 74.408593,
};

const loadScript = (url) => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  return new Promise((resolve) => {
    script.onload = () => resolve();
  });
};

const Map = ({ institutes }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center,
        zoom: 10,
      });
      setMap(mapInstance);
    };

    if (!window.google) {
      loadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyBeP9cSnT4f3BGAxWHYmRCZG8d55_vFItg&callback=initMap'
      ).then(() => {
        initMap();
      });

      window.initMap = initMap;
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (map) {
      institutes.forEach((institute) => {
        new window.google.maps.Marker({
          position: { lat: institute.coordinates.lat, lng: institute.coordinates.lng },
          map,
          icon: {
            url: markerImage,
            scaledSize: new google.maps.Size(40, 40),
          },
          label: {
            text: institute.name,
            color: 'rgb(2, 65, 54)',
            fontWeight: 'bold',
            fontSize: '10px',
            labelOrigin: new google.maps.Point(20, 0),
          },
        });
      });
    }
  }, [map, institutes]);

  return <div ref={mapRef} style={mapContainerStyle} />;
};

export default Map;
