import { NavLink } from 'react-router-dom';

// ฟังก์ชันเลือก class: ถ้าเป็นหน้าปัจจุบัน ให้สีฟ้า + ขีดเส้นใต้
const linkClass = ({ isActive }) =>
  isActive
    ? 'text-cyan-400 font-semibold underline underline-offset-4'
    : 'text-slate-300 hover:text-cyan-400 transition';

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-4">
      <span className="text-xl font-bold text-white">
        📚 Book<span className="text-cyan-400">Hub</span>
      </span>
      <div className="flex gap-6">
        <NavLink to="/" className={linkClass}>หน้าแรก</NavLink>
        <NavLink to="/books" className={linkClass}>หนังสือทั้งหมด</NavLink>
        <NavLink to="/about" className={linkClass}>เกี่ยวกับเรา</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;