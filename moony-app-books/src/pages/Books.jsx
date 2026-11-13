
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api/backend';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError('');

        const data = await getBooks();

        if (isMounted) {
          setBooks(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'ไม่สามารถโหลดข้อมูลหนังสือได้');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  // ค้นหาหนังสือจากชื่อ ผู้แต่ง สำนักพิมพ์ และ ISBN
  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter((book) => {
      const searchableText = [
        book.title,
        book.author,
        book.publisher,
        book.isbn,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [books, search]);

  return (
    <div className="min-h-screen bg-[#eef5f0] text-slate-800">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Header */}
        <section className="mb-10">
          <p className="text-xs font-bold tracking-widest text-emerald-700">
            DISCOVER YOUR NEXT READ
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            หนังสือทั้งหมด
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            ค้นพบหนังสือเล่มโปรดเล่มใหม่
            และออกเดินทางไปกับเรื่องราวที่คุณชื่นชอบ
          </p>
        </section>

        {/* Search and Book Count */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              ชั้นหนังสือของเรา
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              เลือกหนังสือที่สนใจ แล้วไปอ่านรายละเอียดกันเลย
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center rounded-full border border-emerald-100 bg-white px-5 py-3 shadow-sm sm:w-80">
              <span className="mr-3 text-xl">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="whitespace-nowrap rounded-full bg-[#dcebe1] px-5 py-3 text-center text-sm font-semibold text-emerald-800">
              📖 {filteredBooks.length} เล่ม
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            กำลังโหลดข้อมูลหนังสือ...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="font-semibold text-red-600">
              โหลดข้อมูลหนังสือไม่สำเร็จ
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty Books */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            ยังไม่มีข้อมูลหนังสือ
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="text-lg font-bold text-slate-800">
              ไม่พบหนังสือที่ค้นหา
            </p>
            <p className="mt-2 text-sm text-slate-500">
              ลองเปลี่ยนคำค้นหาอีกครั้งนะ
            </p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-5 rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              ล้างคำค้นหา
            </button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <section>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${encodeURIComponent(book.id)}`}
                  className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                >
                  {/* Book Cover */}
                  <div className="flex h-52 items-center justify-center overflow-hidden bg-[#eef5f0] p-4 sm:h-64">
                    {book.poster ? (
                      <img
                        src={book.poster}
                        alt={`ปกหนังสือ ${book.title}`}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                        <span className="text-4xl">📕</span>
                        <span className="text-xs">
                          ไม่มีรูปปกหนังสือ
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Book Information */}
                  <div className="p-4 sm:p-5">
                    <h3 className="line-clamp-2 min-h-[3rem] text-sm font-bold leading-6 text-slate-800 transition group-hover:text-emerald-700 sm:text-base">
                      {book.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-xs text-slate-600 sm:text-sm">
                      โดย {book.author || 'ไม่ระบุผู้แต่ง'}
                    </p>

                    <div className="my-3 h-px bg-emerald-100" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-[11px] text-slate-500 sm:text-xs">
                        {book.year || 'ไม่ระบุปี'}
                      </span>

                      <span className="shrink-0 rounded-full bg-[#dcebe1] px-3 py-1 text-[10px] font-semibold text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white sm:text-xs">
                        ดูรายละเอียด →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer Note */}
        {!loading && !error && books.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Every book opens a new journey.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Books;
