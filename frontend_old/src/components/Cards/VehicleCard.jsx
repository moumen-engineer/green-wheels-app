import { useNavigate } from "react-router-dom";

function VehicleCard({ id, title, price, image, available }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[1rem] overflow-hidden bg-white shadow-[0_10px_25px_rgba(0,0,0,0.05)]">
      
      {/* IMAGE */}
      <div className="bg-slate-100 p-5 flex justify-center">
        <img src={image} alt={title} className="h-40 object-contain" />
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <span
          className={`text-sm font-medium ${
            available ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {available ? "Disponible" : "Indisponible"}
        </span>

        <p className="text-emerald-500 font-semibold">{price} DA/h</p>

        <button
          onClick={() => navigate(`/vehicules/${id}`)}
          className="w-full rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Détails
        </button>
      </div>
    </div>
  );
}

export default VehicleCard;