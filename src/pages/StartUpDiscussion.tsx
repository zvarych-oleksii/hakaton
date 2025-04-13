import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaPlusCircle,
  FaUserCircle,
  FaReply,
} from "react-icons/fa";
import useApi from "../lib/axiosClient";
import CreatePostForm from "../components/PostForm";
import ModalWindow from "../components/ModalWindow";
import { Startup } from "../lib/types/startups";
import { Comment, CommentCreate } from "../lib/types/comment";

const COMMENTS_PER_PAGE = 5;

// Interface for analysis result
interface StartupAnalysis {
  description: string;
  monetization: string;
}

const StartupDiscussionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    getStartupById,
    getCommentsByStartupId,
    createComment,
    likeComment,
    dislikeComment,
    analyzeStartup,
  } = useApi();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StartupAnalysis | null>(
    null,
  );
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE,
  );

  useEffect(() => {
    const fetchStartupAndComments = async () => {
      if (!id) return;

      try {
        const [startupData, allComments] = await Promise.all([
          getStartupById(id),
          getCommentsByStartupId(id),
        ]);

        const topLevelComments = allComments.filter((c) => !c.parent_id);
        setStartup(startupData);
        setComments(topLevelComments);
      } catch (error) {
        console.error("Failed to load startup or comments", error);
      }
    };

    fetchStartupAndComments();
  }, [id]);

  const updateCommentState = (updated: Comment) => {
    const updateTree = (comments: Comment[]): Comment[] =>
      comments.map((comment) => {
        if (comment.id === updated.id) return { ...comment, ...updated };
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: updateTree(comment.replies),
          };
        }
        return comment;
      });

    setComments((prev) => updateTree(prev));
  };

  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId);
      updateCommentState(updated);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleDislike = async (commentId: string) => {
    try {
      const updated = await dislikeComment(commentId);
      updateCommentState(updated);
    } catch (err) {
      console.error("Dislike failed:", err);
    }
  };

  const handleCommentSubmit = async (
    data: { content: string; title?: string },
    parentId?: string,
  ) => {
    if (!id) return;

    try {
      const payload: CommentCreate = {
        content: data.content,
        title: data.title || "",
        parent_id: parentId,
        startup_id: id,
      };

      const newComment = await createComment(payload);

      if (parentId) {
        const insertReply = (comments: Comment[]): Comment[] =>
          comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [newComment, ...(c.replies || [])],
              };
            }
            if (c.replies?.length) {
              return {
                ...c,
                replies: insertReply(c.replies),
              };
            }
            return c;
          });

        setComments((prev) => insertReply(prev));
        setReplyingTo(null);
      } else {
        setComments((prev) => [newComment, ...prev]);
        setShowForm(false);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Failed to create comment", err);
    }
  };

  const handleAnalyze = async () => {
    if (!id) return;
    try {
      setLoadingAnalysis(true);
      setShowAnalysisModal(true);
      const result = await analyzeStartup(id);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResult({
        description: "",
        monetization: "Something went wrong during analysis.",
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const renderComment = (comment: Comment) => (
    <div
      key={comment.id}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center gap-3">
        {comment.author_avatar ? (
          <img
            src={comment.author_avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-600"
          />
        ) : (
          <FaUserCircle className="text-3xl text-gray-500" />
        )}
        <div>
          <p className="font-semibold">{comment.author_name}</p>
          <span className="text-gray-400 text-sm">
            Karma: {comment.karma} •{" "}
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <h4 className="mt-3 font-bold">{comment.title}</h4>
      <p className="mt-2 text-gray-300 whitespace-pre-wrap">
        {comment.content}
      </p>

      <div className="flex gap-4 mt-4 text-sm">
        <button
          onClick={() => handleLike(comment.id)}
          className="flex items-center gap-1 text-green-400 hover:text-green-500 transition"
        >
          <FaThumbsUp /> {comment.likes}
        </button>
        <button
          onClick={() => handleDislike(comment.id)}
          className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
        >
          <FaThumbsDown /> {comment.dislikes}
        </button>
        <button
          onClick={() => setReplyingTo(comment.id)}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition"
        >
          <FaReply /> Reply
        </button>
      </div>

      {replyingTo === comment.id && (
        <div className="mt-4 ml-6">
          <CreatePostForm
            onCancel={() => setReplyingTo(null)}
            onSubmit={(data) => handleCommentSubmit(data, comment.id)}
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-4 ml-6 border-l border-gray-600 pl-4">
          {comment.replies.map((reply) => renderComment(reply))}
        </div>
      )}
    </div>
  );

  if (!startup)
    return <div className="text-white mt-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen text-white p-6 font-sans max-w-3xl mx-auto">
      {/* 🔍 Analysis Modal */}
      {showAnalysisModal && (
        <ModalWindow onClose={() => setShowAnalysisModal(false)}>
          {loadingAnalysis ? (
            <p className="text-center text-sm text-gray-400">
              Analyzing startup...
            </p>
          ) : (
            <div className="space-y-4">
              <h2 className="font-bold">💡 Ideas from AI Agent</h2>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  🧠 Description Analysis
                </h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {analysisResult?.description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  💰 Monetization Strategy
                </h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {analysisResult?.monetization}
                </p>
              </div>
            </div>
          )}
        </ModalWindow>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{startup.name}</h1>
        <p className="text-gray-300">{startup.description}</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded transition"
          >
            🚀 Help with Startup
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-400">
          <span className="bg-purple-600 px-3 py-1 rounded-full text-xs text-white">
            Field: {startup.field}
          </span>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-xs text-white">
            Location: {startup.location}
          </span>
          <span className="bg-green-600 px-3 py-1 rounded-full text-xs text-white">
            Stage: {startup.stage}
          </span>
          <span className="bg-pink-600 px-3 py-1 rounded-full text-xs text-white">
            Model: {startup.monetization_model}
          </span>
          {startup.phase === "crowdfunding" && (
            <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs text-white">
              Crowdfunding: {startup.raised_funds} / {startup.goal}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <span className="text-sm">Join the discussion:</span>
        <button
          onClick={() => {
            setReplyingTo(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 rounded px-3 py-1 transition"
        >
          <FaPlusCircle />
          {showForm ? "Close Form" : "Add Comment"}
        </button>
      </div>

      {showForm && (
        <CreatePostForm
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => handleCommentSubmit(data)}
        />
      )}

      <div className="space-y-6">{paginatedComments.map(renderComment)}</div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-purple-600"
                  : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StartupDiscussionPage;
