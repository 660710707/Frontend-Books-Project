import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="mt-4 text-slate-500">ไม่พบหน้าที่คุณกำลังหา</p>
      <Link to="/" className="mt-6 inline-block text-cyan-600 hover:underline">
        กลับหน้าแรก
      </Link>
    </div>
  );
}

export default NotFound;