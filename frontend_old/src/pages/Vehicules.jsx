import VehicleCard from "../components/Cards/VehicleCard";
import scooter1 from "../assets/scooter1.png";
import scooter2 from "../assets/scooter2.png";
import velo from "../assets/velo.png";
function Vehicules() {
  return (
    <>
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900">Nos Véhicules</h1>
          <p className="mt-2 text-slate-600">Trouvez le véhicule parfait pour votre trajet.</p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <input
              placeholder="🔍 Rechercher un véhicule..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
            />

            <select className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500">
              <option>Tous les types</option>
            </select>

            <select className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500">
              <option>Tous</option>
            </select>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <VehicleCard
              title="Scooter express"
              price="400"
              image={scooter1}
              available={true}
            />

            <VehicleCard
              title="Scooter city"
              price="350"
              image={scooter2}
              available={true}
            />

            <VehicleCard
              title="Vélo Urbain Pro"
              price="200"
              image={velo}
              available={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Vehicules;