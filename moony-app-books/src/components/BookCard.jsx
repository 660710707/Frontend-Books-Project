import { Link } from 'react-router-dom';

// การ์ดหนัง 1 ใบ รับ object รูปร่างเดียวกับ data.js: { id, title, titleTh, year, genre, rating, poster }
function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`}
          className="group block overflow-hidden rounded-xl border border-emerald-100 bg-white transition hover:border-emerald-300 hover:shadow-md">
      {book.poster ? (
        <img src={book.poster} alt={`โปสเตอร์ ${book.title}`} loading="lazy"
             className="aspect-[2/3] w-full object-cover" />
      ) : (
        <div className="grid aspect-[2/3] w-full place-items-center bg-slate-100 text-4xl">📚</div>
      )}
      <div className="p-3">
        <h3 className="truncate font-medium text-slate-900" title={book.title}>{book.title}</h3>
        {book.titleTh && <p className="truncate text-sm text-slate-500">{book.titleTh}</p>}
        <p className="mt-1 text-xs text-slate-400">
          {book.year ?? 'ไม่ระบุปี'}{book.rating != null && ` | ⭐ ${book.rating}`}
        </p>
      </div>
    </Link>
  );
}

export default BookCard;