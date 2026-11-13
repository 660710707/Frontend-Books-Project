
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'หน้าแรก', end: true },
  { to: '/books', label: 'หนังสือทั้งหมด' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
];

function Navbar() {
  const { member, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const displayName =
    member?.displayName ||
    member?.name ||
    member?.email ||
    'สมาชิก';

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-8">

        {/* Logo */}
        <NavLink
          to="/"
          className="group flex shrink-0 items-center transition duration-300 hover:scale-[1.03]"
        >
          <img
            src="/bookhub-logo.png"
            alt="BookHub"
            className="h-auto w-28 object-contain sm:w-40 md:w-48"
          />
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-slate-50 p-1 md:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-5 sm:text-sm ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Authentication */}
        <div className="flex shrink-0 items-center gap-2">

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:px-6 sm:text-sm"
            >
              เข้าสู่ระบบ
            </Link>
          ) : (
            <>
              <span className="hidden max-w-32 truncate text-sm font-semibold text-emerald-800 sm:block">
                💚 นักอ่าน{displayName}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:px-4 sm:text-sm"
              >
                ออกจากระบบ
              </button>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}

export default Navbar;
