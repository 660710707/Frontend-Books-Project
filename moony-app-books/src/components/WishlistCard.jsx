import React from 'react';
import { Link } from 'react-router-dom';

function WishlistCard({ book, onToggleWishlist }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col justify-between group">
      <div>
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
          <img
            src={book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {/* ปุ่มกดเอาออกจาก Wishlist */}
          <button
            onClick={() => onToggleWishlist && onToggleWishlist(book.id)}
            title="นำออกจากรายการโปรด"
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 shadow-sm transition"
          >
            ❤️
          </button>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          {book.genre || book.category || 'General'}
        </span>

        <Link to={`/books/${book.id}`}>
          <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1 hover:text-emerald-700 transition">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {book.year || '2025'} | ⭐ <strong className="text-slate-700">{book.rating || '9.0'}</strong>
        </span>
        <Link
          to={`/books/${book.id}`}
          className="text-emerald-600 font-bold hover:underline"
        >
          อ่านรีวิว →
        </Link>
      </div>
    </div>
  );
}

export default WishlistCard;