import React from 'react';
import { Link } from 'react-router-dom';

function WishlistCard({ book, wishlist = [], onToggleWishlist }) {
  const bookId = book.id || book.isbn;

  // ฟังก์ชันกลางเช็คว่าเป็นหนังสือเล่มเดียวกันหรือไม่
  const isSameBook = (item1, item2) => {
    if (!item1 || !item2) return false;
    const getCode = (x) => {
      if (typeof x === 'object' && x !== null) {
        return String(x.isbn || x.id || x._id || '');
      }
      return String(x);
    };
    return getCode(item1) === getCode(item2);
  };

  // เช็คว่าเล่มนี้อยู่ใน wishlist หรือยัง
  const isWishlisted = wishlist.some((item) => isSameBook(item, book));

  // จัดการลิงก์รูปปก
  const bookCover = book.isbn 
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : (book.poster || book.imageUrl || book.imageUrlM || book.imageUrlS || book.cover || book.image || book.thumbnail);

  return (
    <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-sm flex flex-col justify-between relative group">
      
      {/* 💚 ปุ่มหัวใจมุมขวาบน: กดปุ๊บ สลับสถานะ เพิ่ม/ลบ ออกจาก Wishlist ทันที */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault(); // ป้องกันไม่ให้ลิงก์ Card ทำงานตอนกดหัวใจ
          e.stopPropagation();
          if (onToggleWishlist) {
            onToggleWishlist(book);
          }
        }}
        className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
            : 'bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-100'
        }`}
        title={isWishlisted ? 'เอาออกจากรายการโปรด' : 'เพิ่มลงรายการโปรด'}
      >
        <span>{isWishlisted ? '❤️' : '🤍'}</span>
      </button>

      {/* คลิกที่การ์ดเพื่อไปหน้าดูรายละเอียด */}
      <Link to={`/books/${bookId}`} className="block">
        <div className="aspect-[2/3] w-full bg-[#eef5f0] rounded-2xl overflow-hidden flex items-center justify-center p-2">
          {bookCover ? (
            <img
              src={bookCover}
              alt={book.title}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span className="text-4xl">📚</span>
          )}
        </div>
        
        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-slate-800 text-sm line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1">
            โดย {book.author || 'ไม่ระบุผู้แต่ง'}
          </p>
        </div>
      </Link>

      {/* เรตติ้งด้านล่างการ์ด */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-amber-500">
          ★ {Number(book.rating || 0).toFixed(2)}
        </span>
        <span className="text-emerald-700 font-medium">
          {isWishlisted ? 'อยู่ในรายการโปรดแล้ว' : ''}
        </span>
      </div>

    </div>
  );
}

export default WishlistCard;