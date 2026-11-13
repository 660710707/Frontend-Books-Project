function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">เกี่ยวกับ BookHub</h1>
      <p className="mt-3 leading-relaxed text-slate-600">
        โปรเจกต์ฝึกหัดในรายวิชา 520 341 Client Side Web Programming
        ใช้เรียนรู้การเรียก API ด้วย React (fetch, useEffect, การจัดการสถานะ loading / error / success)
        และการเตรียมหน้าเว็บให้พร้อมเชื่อมกับ Backend ที่เขียนด้วย Go
      </p>

      <h2 className="mt-8 font-medium text-slate-900">ทีม</h2>
      <p className="text-sm text-slate-500">Moony</p>
      <ul className="mt-2 list-disc pl-5 text-slate-700">
        <li>ณัฐกฤตา เพ็ชรคง 660710707</li>
        <li>เพลงพิณ ฉุ้นประดับ 660710769</li>
      </ul>

      {/* เครดิต TMDB ตามเงื่อนไขการใช้งาน: ต้องมีทั้งโลโก้และข้อความนี้ (ดาวน์โหลดโลโก้จากหน้า Logos & Attribution ของ TMDB มาวางแทนข้อความ TMDB) */}
      <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 md:flex-row md:items-center">
        <a href="https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset" target="_blank" rel="noreferrer" className="font-semibold text-emerald-600">
          kaggle
        </a>
        <p className="text-sm text-slate-500">
          ข้อมูลหนังสือและปกทั้งหมดมาจาก book recommendation dataset จาก kaggle
        </p>
      </div>
    </div>
  );
}

export default About;