import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-slate-100 px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-28" />
        </div>

        <ul className="hidden lg:flex items-center gap-4 text-sm text-slate-700">
          {[
            { to: "/", label: "Accueil", end: true },
            { to: "/vehicules", label: "Vélos" },
            { to: "/stations", label: "Stations" },
            { to: "/abonnements", label: "Abonnements" },
            { to: "/a-propos", label: "À propos" },
            { to: "/contacts", label: "Contacts" },
            { to: "/faq", label: "FAQ" },
          ].map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition duration-200 ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700 font-medium"
                      : "hover:text-emerald-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button className="rounded-xl bg-slate-200 px-3 py-2 text-sm transition hover:bg-slate-300">
          🌙
        </button>
        <button
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          onClick={() => navigate("/login")}
        >
          Connexion
        </button>
      </div>
      </div>
    </nav>
  );
}

export default Navbar;