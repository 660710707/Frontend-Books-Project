// src/pages/Playground.jsx
import BookCard from '../components/BookCard';
import BookGrid from '../components/BookGrid';

function Playground() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="text-2xl font-bold">สนามทดลอง 🧪</h1>
      <BookCard book={{ id: 1, title: "Parasite", year: 2019 }} />
      <BookGrid books={[]} status="success" />
      {/* เขียน component ใหม่เสร็จ ก็ import แล้วมาวางตรงนี้ */}
    </div>
  );
}
export default Playground;
