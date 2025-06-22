import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// npm install react-leaflet leaflet

type GpsProps = {
  initialPosition?: [number, number];
  zoom?: number;
};

const LocateUser: React.FC<{ onLocate: (pos: [number, number]) => void }> = ({ onLocate }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', (e: L.LocationEvent) => {
      onLocate([e.latitude, e.longitude]);
    });
    return () => map.off('locationfound');
  }, [map, onLocate]);

  return null;
};

const Gps: React.FC<GpsProps> = ({ initialPosition = [51.505, -0.09], zoom = 13 }) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [targets, setTargets] = useState<[number, number][]>([]);
  const mapRef = useRef<L.Map | null>(null);

  const addTarget = () => {
    const lat = parseFloat(prompt('Enter latitude:') || '');
    const lng = parseFloat(prompt('Enter longitude:') || '');
    if (!isNaN(lat) && !isNaN(lng)) {
      const newTarget: [number, number] = [lat, lng];
      setTargets(prev => [...prev, newTarget]);
      mapRef.current?.flyTo(newTarget, mapRef.current.getZoom());
    }
  };

  const removeTarget = (index: number) => {
    setTargets(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <button onClick={addTarget} style={{ margin: '10px' }}>Add Target</button>
      <h2>GPS Tracker</h2>
      <p>Current Position: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
      <ul>
        {targets.map((tgt, i) => (
          <li key={i}>
            ({tgt[0].toFixed(4)}, {tgt[1].toFixed(4)})
            <button onClick={() => removeTarget(i)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>
        {targets.map((tgt, i) => (
          <Marker
            key={i}
            position={tgt}
          >
            <Popup>
              Target {i + 1}<br />
              ({tgt[0].toFixed(4)}, {tgt[1].toFixed(4)})
              <br />
              <button onClick={() => removeTarget(i)}>Remove</button>
            </Popup>
          </Marker>
        ))}
        <LocateUser onLocate={setPosition} />
      </MapContainer>
    </>
  );
};

export default Gps;
