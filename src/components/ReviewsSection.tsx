import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquare, CheckCircle2 } from 'lucide-react';
import { VerifiedReview } from '../types/restaurant.ts';
import { api } from '../services/api.ts';

interface ReviewsSectionProps {
  reviews: VerifiedReview[];
  onReviewSubmitted: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewSubmitted }) => {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!authorName.trim() || !comment.trim()) {
      setErrorMsg('Please enter your name and comments.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
        visitDate: visitDate.trim() || 'Dined recently'
      });

      setSuccessMsg(res.message || 'Thank you! Your feedback has been received and will be verified by the owner.');
      setAuthorName('');
      setComment('');
      setVisitDate('');
      onReviewSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#FAF8F2] border-b border-[#E7E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#1B432E] uppercase mb-2">
            Verified Customer Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#162E20] tracking-tight [text-wrap:balance]">
            Authentic Diner Experiences
          </h2>
          <p className="mt-3 text-base text-[#475448] leading-relaxed">
            In accordance with our strict verification standards, we only publish verified customer reviews. We never fabricate testimonials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Reviews List / Empty Verified Notice */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E7E2D6] space-y-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#1B432E] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#162E20]">Strict Review Integrity Policy</h3>
                  <p className="text-xs text-[#526053] leading-relaxed">
                    No fabricated or computer-generated reviews are shown. All reviews displayed here require verification from actual visits to our California City restaurant.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAF8F2] border border-[#DDD7C8] text-xs text-[#4A554A]">
                  Have you dined at Wow Falafel before our temporary hiatus? Please submit your verified experience using the form, and our management will review and publish it.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-5 rounded-xl bg-white border border-[#E7E2D6] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-[#162E20]">{rev.authorName}</div>
                        <div className="text-xs text-[#6C786D]">{rev.visitDate}</div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#475448] leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#1B432E] font-medium pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Customer Visit</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Form Column */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E7E2D6] shadow-xs space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B432E]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit Customer Feedback</span>
                </div>
                <h3 className="font-bold text-lg text-[#162E20]">Share Your Experience</h3>
                <p className="text-xs text-[#526053]">
                  All submitted reviews are checked by our owner before being published to the website.
                </p>
              </div>

              {successMsg && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sarah Jenkins"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#4A554A] ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Approximate Visit Date or Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Spring 2026, or Recent takeout"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you enjoyed about the falafel, hummus, or hospitality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold transition-colors disabled:opacity-60 shadow-xs"
                >
                  {submitting ? 'Submitting for Verification...' : 'Submit Feedback'}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
