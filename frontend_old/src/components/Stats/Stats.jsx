function Stats() {
  return (
    <section className="flex flex-wrap justify-center gap-8 bg-white px-10 py-16 text-center sm:px-16">
      <div className="min-w-[170px]">
        <h2 className="text-3xl font-bold text-emerald-500 mb-2">500+</h2>
        <p className="text-sm text-slate-600">Vélos disponibles</p>
      </div>

      <div>
        <h2>50+</h2>
        <p>Stations</p>
      </div>

      <div>
        <h2>10K+</h2>
        <p>Utilisateurs</p>
      </div>

      <div>
        <h2>50K+</h2>
        <p>Trajets effectués</p>
      </div>
    </section>
  );
}

export default Stats;