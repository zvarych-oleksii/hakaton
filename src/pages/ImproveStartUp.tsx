import React from "react";

const advisors = [
  {
    name: "Oleg Kit",
    role: "Fintech Advisor",
    avatar: "/avatars/oleg.jpg",
    description:
      "Ukrainian banker, entrepreneur, and experienced startup founder in the field of financial technologies. Ask me about creating and developing financial startups.",
  },
  {
    name: "Max Gram",
    role: "IT Advisor",
    avatar: "/avatars/max.jpg",
    description:
      "Ukrainian IT specialist, co-founder of a successful startup. Ask me about IT startups.",
  },
  {
    name: "Mychaylo Diia",
    role: "Miltech Advisor",
    avatar: "/avatars/mychaylo.jpg",
    description:
      "Ukrainian political figure, military expert, and defense technology specialist. Ask me about military technologies, strategy, or defense innovations.",
  },
];

const ImproveStartupPage: React.FC = () => {
  return (
    <div className="min-h-screen px-6 py-12 text-white flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        IMPROVE YOUR STARTUP
      </h1>

      {/* Description */}
      <p className="text-center max-w-3xl text-gray-400 mb-12 text-sm sm:text-base">
        With the help of our unique AI agents, you can enhance your projects,
        receive valuable insights, and identify current weaknesses. They won’t
        just provide you with in-depth answers — they’ll also help you develop a
        growth plan, outline funding strategies, highlight key professional
        recommendations, and introduce platform features that can truly support
        your journey.
      </p>

      {/* Advisors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14 w-full max-w-6xl">
        {advisors.map((advisor) => (
          <div
            key={advisor.name}
            className="bg-gray-800/40 backdrop-blur-md border border-gray-700 shadow-lg rounded-xl p-6 text-center flex flex-col items-center transition hover:scale-[1.02]"
          >
            <img
              src={advisor.avatar}
              alt={advisor.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-purple-500 shadow"
            />
            <h3 className="text-lg font-bold">{advisor.name}</h3>
            <p className="text-purple-400 font-semibold text-sm mb-3">
              {advisor.role}
            </p>
            <p className="text-sm text-gray-300">{advisor.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-md font-semibold text-sm shadow-lg transition">
        TRY
      </button>
    </div>
  );
};

export default ImproveStartupPage;
