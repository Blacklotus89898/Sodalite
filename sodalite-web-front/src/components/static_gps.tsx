import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, useMap, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Static_GPSProps = {
  initialPosition?: [number, number];
  zoom?: number;
};

const LocateUser: React.FC<{ onLocate: (pos: [number, number]) => void }> = ({ onLocate }) => {
  const map = useMap();

//   useEffect(() => {
//     map.locate({ setView: true, maxZoom: 16 });
//     map.on('locationfound', (e: L.LocationEvent) => {
//       onLocate([e.latitude, e.longitude]);
//     });
//     return () => map.off('locationfound');
//   }, [map, onLocate]);

  return null;
};

const Static_GPS: React.FC<Static_GPSProps> = ({ initialPosition = [51.505, -0.09], zoom = 13 }) => {
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

  // Define image and bounds (adjust based on your static map’s area)
  const imageUrl = '/Sodalite/static_map_tile_13_4093_2723.png';
const bounds = [[51.50874245880333, -0.1318359375], [51.53608560178475, -0.087890625]];  

  return (
    <>
      <button onClick={addTarget} style={{ margin: '10px' }}>Add Target</button>
      <h2>Static GPS Tracker</h2>
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
        crs={L.CRS.EPSG3857} // Default CRS
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} />

        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>

        {targets.map((tgt, i) => (
          <Marker key={i} position={tgt}>
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

export default Static_GPS;
