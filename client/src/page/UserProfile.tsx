import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

interface User {
  id: string;
  username: string;
  country: string | null;
  postal_code: string | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  contact_info: string | null;
  created_at: number;
}

interface Review {
  id: string;
  reviewer_username: string;
  rating: number;
  comment: string;
  created_at: number;
}

function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      const parsed = JSON.parse(userData);
      setCurrentUsername(parsed.username);
    }

    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${username}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setReviewCount(data.reviewCount);
      } else {
        setError(data.error || "User not found");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitSuccess("");
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          revieweeUsername: username,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess("Review submitted! It will be visible after admin approval.");
        setShowReviewForm(false);
        setComment("");
        setRating(5);
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-orange-500" : "text-gray-600"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 px-4 bg-[#121212]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => navigate("/meet")}
              className="px-6 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-all rounded-md"
            >
              Browse Users
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const isOwnProfile = currentUsername === username;

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#121212] text-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          {/* User Header */}
          <div className="mb-8">
            <h1 className="font-bold text-4xl uppercase text-orange-600 mb-2">
              {user.username}
            </h1>

            {/* Rating Display */}
            {averageRating !== null && reviewCount > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {renderStars(Math.round(averageRating))}
                <span className="text-orange-500 font-semibold text-lg">
                  {averageRating}
                </span>
                <span className="text-gray-500 text-sm">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <section className="mb-8 p-6 bg-[#171717] border border-orange-600 rounded-md">
            <h2 className="text-xl font-bold text-orange-500 mb-4">Profile</h2>

            {user.country && (
              <div className="mb-3">
                <span className="text-gray-400">Location:</span>{" "}
                <span className="text-white">{user.country}{user.postal_code ? ` (${user.postal_code})` : ""}</span>
              </div>
            )}

            <div className="mb-3">
              <span className="text-gray-400">Available to:</span>
              <div className="mt-2 space-y-1">
                {user.available_sell_xmr === 1 && (
                  <div className="text-white">📤 Sell XMR for cash</div>
                )}
                {user.available_buy_xmr === 1 && (
                  <div className="text-white">📥 Buy XMR with cash</div>
                )}
                {user.available_sell_xmr === 0 && user.available_buy_xmr === 0 && (
                  <div className="text-gray-500">Not currently available</div>
                )}
              </div>
            </div>

            {user.contact_info && (
              <div className="mt-4 pt-4 border-t border-orange-900">
                <span className="text-gray-400 block mb-2">Contact:</span>
                {isLoggedIn ? (
                  <p className="text-white whitespace-pre-wrap">{user.contact_info}</p>
                ) : (
                  <div className="relative">
                    <p className="text-white whitespace-pre-wrap blur-sm select-none">
                      {user.contact_info}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href="/login"
                        className="px-4 py-2 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all rounded-md"
                      >
                        Sign in to view contact info
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Success/Error Messages */}
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-600 text-green-200 rounded-md">
              {submitSuccess}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Review Button */}
          {isLoggedIn && !isOwnProfile && !showReviewForm && (
            <div className="mb-8">
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all rounded-md"
              >
                Write a Review
              </button>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <section className="mb-8 p-6 bg-[#171717] border border-orange-600 rounded-md">
              <h2 className="text-xl font-bold text-orange-500 mb-4">Submit Review</h2>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl ${
                          star <= rating ? "text-orange-500" : "text-gray-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="block mb-2 font-semibold">
                    Review (10-120 characters)
                  </label>
                  <input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.length >= 10) {
                        // Allow form submission on Enter if valid
                        return;
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
                    minLength={10}
                    maxLength={120}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/120 characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 rounded-md"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2 border border-orange-600 text-orange-600 font-semibold hover:bg-orange-900/30 transition-all rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Reviews List */}
          <section>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Reviews ({reviewCount})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-[#171717] border border-orange-900 rounded-md">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-white mb-1">
                          {review.reviewer_username}
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.created_at * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default UserProfile;
