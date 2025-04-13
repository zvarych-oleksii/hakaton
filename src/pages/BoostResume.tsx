import React, { useState, useRef } from "react";
import { FiUpload, FiUser, FiFileText, FiCheckCircle } from "react-icons/fi";
import useApi from "../lib/axiosClient";

const BoostResumePage: React.FC = () => {
  const { generateUserResume, uploadUserResume } = useApi();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasResume, setHasResume] = useState(false);
  const [resumeLinks, setResumeLinks] = useState<{
    pdf_url: string;
    latex_url: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerateResume = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await generateUserResume();
      setResumeLinks(response);
      setHasResume(true);
      setSuccessMessage("Resume successfully generated. Ready to download.");
    } catch (err) {
      console.error("Failed to generate resume", err);
      setError("Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await uploadUserResume(file);
      setHasResume(true);
      setResumeLinks(null);
      setSuccessMessage("Resume successfully uploaded.");
    } catch (err) {
      console.error("Failed to upload resume", err);
      setError("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-4 py-12">
      {/* Title */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Boost Your Resume</h2>
        <p className="text-gray-300">
          Students often miss out on job opportunities due to poorly written
          resumes. Take this chance to improve your resume by choosing one of
          the two options below.
        </p>
      </section>

      {/* Options */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Generate Resume */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow p-6 text-center flex flex-col items-center">
          <FiUser size={40} className="text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Generate Resume from Profile
          </h3>
          <p className="text-gray-300 mb-4">
            Quickly build a resume using your PickMe profile.
          </p>
          <button
            onClick={handleGenerateResume}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Get My Profile"}
          </button>
        </div>

        {/* Upload Resume */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow p-6 text-center flex flex-col items-center">
          <FiUpload size={40} className="text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-gray-300 mb-4">
            Already have a resume? Let our AI enhance and optimize it for you.
          </p>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-semibold transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload & Enhance"}
          </button>
        </div>
      </section>

      {/* Feedback */}
      {error && (
        <div className="text-center text-red-400 font-medium mb-6">{error}</div>
      )}
      {successMessage && (
        <div className="text-center text-green-400 font-medium mb-6 flex justify-center items-center gap-2">
          <FiCheckCircle className="text-green-400" />
          {successMessage}
        </div>
      )}

      {/* Divider */}
      <hr className="my-12 border-gray-700" />

      {/* Resume Preview or Export */}
      {hasResume && (
        <section className="mb-16">
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              {resumeLinks
                ? "Preview or Export Your Resume"
                : "Resume Uploaded"}
            </h3>

            <div className="bg-gray-900 border border-gray-700 rounded h-40 flex items-center justify-center mb-6">
              <FiFileText size={40} className="text-gray-500" />
            </div>

            {resumeLinks ? (
              <>
                <p className="text-gray-300 mb-4">
                  Your resume has been generated. You can now download it:
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={resumeLinks.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
                  >
                    Download PDF
                  </a>

                  <a
                    href={resumeLinks.latex_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold"
                  >
                    Download LaTeX
                  </a>

                  <button
                    onClick={handleGenerateResume}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center">
                Your resume has been uploaded successfully. Our AI is analyzing
                it. You'll be notified once suggestions are ready.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Resume Forum */}
      <section className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl shadow p-6 text-center">
        <h3 className="text-3xl font-bold mb-6">Resume Forum</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Build a resume that gets you hired. Hear from our experts about what
          really matters.
        </p>
        <h4 className="text-lg font-semibold mb-2">
          Build a Resume That Gets You Hired
        </h4>
        <p className="text-sm text-gray-300 mb-4 max-w-2xl mx-auto">
          Not getting the responses you hoped for after sending your resume?
          Even strong candidates get overlooked because their resume doesn’t
          highlight what really matters. So, how do you catch the attention of
          recruiters?
        </p>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded transition text-base">
          Read More
        </button>
      </section>
    </div>
  );
};

export default BoostResumePage;
