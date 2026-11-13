
import { useEffect, useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { getBooks } from '../api/backend';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { member, isAuthenticated } = useAuth();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const memberName =
    member?.displayName ||
    member?.name ||
    member?.email?.split('@')[0] ||
    'นักอ่าน';

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
          setError(err.message || 'ไม่สามารถโหลดหนังสือได้');
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

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter((book) =>
      `${book.title} ${book.author} ${book.publisher}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [books, search]);

  const trendingBooks = filteredBooks.slice(0, 6);
  const suggestions = filteredBooks.slice(6, 9);

  return (
    <div className="min-h-screen bg-[#eef5f0] text-slate-800">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Search Your Books
            </label>

            <div className="flex items-center rounded-full border border-emerald-100 bg-white px-5 py-3 shadow-sm">
              <span className="mr-3 text-xl">⌕</span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* Left Sidebar */}
          <aside className="space-y-6 lg:col-span-3">

            {/* Reading Challenge */}
            <section className="rounded-3xl bg-[#dcebe1] p-6">
              <p className="text-xs font-bold tracking-widest text-emerald-800">
                YOUR READING JOURNEY
              </p>

              {isAuthenticated ? (
                <>
                  <h2 className="mt-4 text-2xl font-bold leading-snug">
                    YOUR 2026
                    <br />
                    READING CHALLENGE
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Challenge Yourself to Read More This Year.
                  </p>

                  <div className="mt-6 rounded-2xl bg-white/80 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        Reading Progress
                      </p>

                      <span className="text-sm font-bold text-emerald-700">
                        0 / 12
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
                      <div className="h-full w-0 rounded-full bg-emerald-600" />
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      เริ่มต้นอ่านหนังสือเล่มแรกของคุณกันเถอะ!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-2xl font-bold leading-snug">
                    2026
                    <br />
                    READING CHALLENGE
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Challenge Yourself to Read More This Year.
                  </p>

                  <div className="mt-6 rounded-2xl bg-white/70 p-4">
                    <p className="text-sm font-semibold">
                      พร้อมเริ่มอ่านหรือยัง?
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      ค้นพบหนังสือเล่มโปรดเล่มใหม่ของคุณ
                    </p>
                  </div>
                </>
              )}
            </section>

            {/* The Book Shelves */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  THE BOOK SHELVES
                </h2>

                {isAuthenticated && (
                  <span className="text-xs font-semibold text-emerald-700">
                    MY BOOKS
                  </span>
                )}
              </div>

              {isAuthenticated ? (
                <div className="mt-5 space-y-3">

                  <div className="rounded-2xl bg-[#eef5f0] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Want to Read
                      </span>

                      <span className="text-sm font-bold text-emerald-700">
                        0
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      หนังสือที่คุณอยากอ่าน
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#eef5f0] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Currently Reading
                      </span>

                      <span className="text-sm font-bold text-emerald-700">
                        0
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      หนังสือที่คุณกำลังอ่าน
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#eef5f0] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Completed
                      </span>

                      <span className="text-sm font-bold text-emerald-700">
                        0
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      หนังสือที่คุณอ่านจบแล้ว
                    </p>
                  </div>

                  <p className="pt-2 text-xs leading-5 text-slate-400">
                    เริ่มเพิ่มหนังสือเล่มโปรดลงในชั้นหนังสือของคุณได้เร็ว ๆ นี้
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span>Want to Read</span>
                      <span className="text-slate-400">—</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Currently Reading</span>
                      <span className="text-slate-400">—</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="text-slate-400">—</span>
                    </div>
                  </div>

                  <p className="mt-5 text-xs leading-5 text-slate-400">
                    ชั้นหนังสือส่วนตัวจะเชื่อมกับระบบสมาชิกในขั้นตอนถัดไป
                  </p>
                </>
              )}
            </section>
          </aside>

          {/* Center Content */}
          <section className="lg:col-span-6">

            {/* Member / Guest Welcome */}
            <div className="mb-5">
              {isAuthenticated ? (
                <>
                  <p className="text-xs font-bold tracking-widest text-emerald-700">
                    YOUR PERSONAL READING SPACE
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Welcome back คุณนักอ่าน{memberName}!
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    พร้อมออกเดินทางไปกับเรื่องราวใหม่ ๆ หรือยัง?
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold tracking-widest text-emerald-700">
                    DISCOVER YOUR NEXT READ
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Trending Books
                  </h2>
                </>
              )}
            </div>

            {/* Trending Books */}
            {loading ? (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
                กำลังโหลดข้อมูลหนังสือ...
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-8 text-center text-red-600">
                {error}
              </div>
            ) : trendingBooks.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
                ไม่พบหนังสือที่ค้นหา
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {trendingBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Suggestions */}
            {!search && suggestions.length > 0 && (
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Suggestions
                  </h2>

                  <span className="text-xs text-slate-500">
                    More books to explore
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {suggestions.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="space-y-6 lg:col-span-3">

            {/* Meet Your Favorite Book */}
            <section className="rounded-3xl bg-[#dcebe1] p-6">
              <div className="text-xs font-bold tracking-widest text-emerald-800">
                {isAuthenticated
                  ? 'YOUR READING COMMUNITY'
                  : 'WELCOME TO MOONY BOOKS'}
              </div>

              <h2 className="mt-4 text-2xl font-bold leading-snug">
                Meet Your
                <br />
                Favorite Book.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Meet your favorite book, discover new stories, and enjoy
                your reading journey with Moony Books.
              </p>

              <div className="mt-6 rounded-2xl bg-white p-4 text-center">
                <span className="text-4xl">📖</span>

                <p className="mt-2 text-sm font-bold">
                  Read. Review. Discover.
                </p>
              </div>
            </section>

            {/* Announcing the Best Books */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">
                Announcing the Best Books
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                ค้นหาหนังสือที่น่าสนใจ และเลือกเล่มที่อยากอ่านต่อไป
              </p>

              <div className="mt-5 rounded-2xl bg-[#eef5f0] p-4 text-center">
                <span className="text-4xl">✨</span>

                <p className="mt-2 text-sm font-semibold">
                  Your next favorite story awaits.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#dcebe1] px-6 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">

          <div>
            <h3 className="font-bold">Moony Books</h3>

            <p className="mt-3 text-sm text-slate-600">
              Your reading journey starts here.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Company</h3>

            <p className="mt-3 text-sm text-slate-600">
              About us
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Careers
            </p>
          </div>

          <div>
            <h3 className="font-bold">Explore</h3>

            <p className="mt-3 text-sm text-slate-600">
              Books
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Community
            </p>
          </div>

          <div>
            <h3 className="font-bold">Support</h3>

            <p className="mt-3 text-sm text-slate-600">
              Contact
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Help
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          © 2026 Moony Books. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
