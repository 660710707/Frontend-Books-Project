import React, { useState } from 'react';

function ReviewForm({ bookId, onAddReview }) {
  const [reviewerName, setReviewerName] = useState('นักอ่านMoony');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: Date.now(),
      user: reviewerName || 'นักอ่านทั่วไป',
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    if (onAddReview) {
      onAddReview(bookId, newReview);
    }
    setComment('');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100/80 sticky top-24 font-sans">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E9F6E]">
        SHARE YOUR THOUGHTS
      </span>
      <h2 className="text-xl font-extrabold text-slate-900 mt-1 mb-4">
        เขียนรีวิวหนังสือเล่มนี้
      </h2>

      <form onSubmit={handleSubmitReview} className="space-y-4">
        {/* ชื่อนักอ่าน */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ชื่อนักอ่าน
          </label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full bg-[#F2F7F4] border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            placeholder="ระบุชื่อของคุณ..."
            required
          />
        </div>

        {/* เลือกให้คะแนนดาว */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ให้คะแนนความประทับใจ
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${
                  rating >= star
                    ? 'bg-amber-50 border-amber-300 text-amber-500 shadow-sm'
                    : 'bg-[#F2F7F4] border-slate-200 text-slate-400'
                }`}
              >
                {star} ★
              </button>
            ))}
          </div>
        </div>

        {/* กล่องข้อความรีวิว */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ความคิดเห็นของคุณ
          </label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เล่าความรู้สึกหลังอ่าน หรือสิ่งที่ชอบเกี่ยวกับหนังสือเล่มนี้..."
            className="w-full bg-[#F2F7F4] border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            required
          />
        </div>

        {/* ปุ่มส่งรีวิว */}
        <button
          type="submit"
          className="w-full bg-[#0E9F6E] hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-sm transition shadow-sm"
        >
          โพสต์รีวิว
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;