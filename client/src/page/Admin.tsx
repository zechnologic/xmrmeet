import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

interface Review {
  id: string;
  reviewer_id: string;
  reviewer_username: string;
  reviewee_username: string;
  rating: number;
  comment: string;
  created_at: number;
}

function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    checkAdminAccess(token);
  }, [navigate]);

  const checkAdminAccess = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success || !data.isAdmin) {
        navigate("/");
        return;
      }

      fetchPendingReviews(token);
    } catch (err) {
      console.error("Error checking admin access:", err);
      navigate("/");
    }
  };

  const fetchPendingReviews = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      } else {
        setError(data.error || "Failed to fetch pending reviews");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setProcessingId(reviewId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Review approved successfully");
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to approve review");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Approve error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    setProcessingId(reviewId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Review deleted successfully");
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to delete review");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#121212] text-orange-600">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold text-4xl uppercase mb-8">Admin Panel</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-600 text-green-200 rounded-md">
              {success}
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-2xl uppercase mb-4">
              Pending Reviews ({reviews.length})
            </h3>
            <p className="text-[#FAFAFA] mb-6">
              Reviews must be approved before they appear on user profiles. Review each submission for spam, abuse, or inappropriate content.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 bg-[#171717] border border-orange-600 rounded-md text-center">
              <p className="text-[#FAFAFA]">No pending reviews at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-[#171717] border border-orange-600 rounded-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[#FAFAFA] font-semibold">
                          {review.reviewer_username}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-orange-500 font-semibold">
                          {review.reviewee_username}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-gray-500 text-sm">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[#FAFAFA] mb-4 whitespace-pre-wrap">{review.comment}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={processingId === review.id}
                      className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-all font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === review.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={processingId === review.id}
                      className="px-6 py-2 bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === review.id ? "Processing..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Admin;
