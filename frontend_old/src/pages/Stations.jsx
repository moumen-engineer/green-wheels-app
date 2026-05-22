import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const stations = [
  {
    name: "Alger centre",
    bikes: 12,
    occupied: 12,
    total: 20,
    hours: "6h-23h",
  },
  {
    name: "Bab El Oued",
    bikes: 8,
    occupied: 8,
    total: 15,
    hours: "6h-21h",
  },
  {
    name: "Hussein Dey",
    bikes: 5,
    occupied: 5,
    total: 10,
    hours: "7h-20h",
  },
];

export default function Stations() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">Carte des Stations</h1>
        <p className="mt-2 text-slate-600">Trouvez la station la plus proche de vous.</p>

        <MapContainer center={[36.75, 3.05]} zoom={11} className="mt-8 h-[250px] w-full rounded-3xl shadow-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>

        <div className="mt-10 flex flex-col gap-6">
        {stations.map((station, index) => {
          const percentage = (station.occupied / station.total) * 100;

          return (
            <div key={index} className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{station.name}</h3>
                <span className="text-sm text-slate-600">{station.hours}</span>
              </div>

              <p className="mt-3 text-slate-600">{station.bikes} vélos</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <small className="mt-3 block text-sm text-slate-500">
                {station.occupied}/{station.total} emplacements occupés
              </small>

            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}