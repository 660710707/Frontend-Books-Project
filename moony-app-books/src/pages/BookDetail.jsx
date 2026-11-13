import { useParams, Link } from 'react-router-dom';
import { books } from '../data/data';

function BookDetail() {
  const { id } = useParams();                       // อ่านค่าจาก URL (ได้เป็น string!)
  const book = books.find(b => b.id === Number(id));

  if (!book) {
    return <p className="p-8 text-center text-slate-500">ไม่พบหนังสือเล่มนี้ 😢</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold text-slate-800">{book.title}</h1>
      <p className="text-lg text-slate-600">โดย {book.author}</p>
      <p className="mt-1 text-slate-500">ปี {book.year} · {book.genre}</p>
      <p className="mt-4 leading-relaxed text-slate-700">{book.detail}</p>
      <Link to="/books"
            className="mt-6 inline-block rounded-lg bg-cyan-600 px-4 py-2
                       font-semibold text-white hover:bg-cyan-700 transition">
        ← กลับไปหน้าหนังสือทั้งหมด
      </Link>
    </div>
  );
}

export default BookDetail;