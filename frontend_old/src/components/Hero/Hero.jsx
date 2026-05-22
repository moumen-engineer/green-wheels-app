import bikeImg from "../../assets/bike.png";

function Hero() {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-10 py-20 lg:px-24 bg-slate-100">
      <div className="max-w-xl">
        <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🌱 Mobilité verte intelligente
        </span>

        <h1 className="text-5xl font-bold leading-tight mb-5 text-slate-900">
          Roulez <span className="text-emerald-500">vert</span>, <br />
          roulez libre
        </h1>

        <p className="text-slate-600 text-base leading-7 mb-8">
          Louez un vélo ou un scooter électrique en quelques clics.
          Explorez votre ville de manière écologique avec GreenWheels.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button className="inline-flex items-center justify-center bg-emerald-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-xl shadow-emerald-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-600">
            Explorer les vélos →
          </button>

          <button className="inline-flex items-center justify-center border border-slate-200 bg-white text-slate-900 px-6 py-4 rounded-2xl font-medium transition-colors duration-200 hover:border-emerald-500 hover:text-emerald-500">
            📍 Voir les stations
          </button>
        </div>
      </div>

      <div className="rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        <img src={bikeImg} alt="bike" className="w-full max-w-[520px] object-cover" />
      </div>
    </section>
  );
}

export default Hero;