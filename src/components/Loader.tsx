import { FaCircle } from "react-icons/fa";

const Loader = () => {
  const dotStyle = {
    animationName: "pulse-dot",
    animationDuration: "1.2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse-dot {
            0%, 100% {
              transform: scale(0.7);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        `}
      </style>

      <div className="flex items-center justify-center min-h-screen space-x-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <FaCircle
            key={i}
            className="text-white text-2xl"
            style={{ ...dotStyle, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </>
  );
};

export default Loader;
