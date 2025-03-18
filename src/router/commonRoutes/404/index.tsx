import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NotFoundImage from "../../../assets/Notfound.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
      <motion.img
        src={NotFoundImage}
        alt="Page Not Found"
        className="w-80 h-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Tiêu đề */}
      <motion.h1
        className="text-5xl font-bold text-blue-600 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page Not Found
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-md">
        The page you are looking for does not exist or is under development. Please go back or return to the homepage.
      </p>

      <div className="flex gap-4 mt-6">
        <motion.button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Go Back
        </motion.button>
        <motion.button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
          whileHover={{ scale: 1.05 }}
        >
          Home
        </motion.button>
      </div>
    </div>
  );
}

export default NotFound;
