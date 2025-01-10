import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ Lat, Lng }) => {
  const position = [Lat, Lng]; // القاهرة

  return (
    <MapContainer
      center={position}
      zoom={25}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>هذه القاهرة!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
