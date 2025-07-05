import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdAddCircleOutline, MdEdit, MdInfoOutline } from "react-icons/md";
import { format } from "timeago.js";
import useDarkMode from "../hooks/useDarkMode";

const typeIcons = {
  Created: (
    <MdAddCircleOutline className="text-blue-600 dark:text-blue-400 w-5 h-5" />
  ),
  Update: (
    <MdEdit className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
  ),
  Info: <MdInfoOutline className="text-gray-600 dark:text-gray-300 w-5 h-5" />,
};

const typeColors = {
  Created: "border-blue-600",
  Update: "border-yellow-500",
  Info: "border-gray-500",
};

export default function ServiceDetailPage() {
  const { state } = useLocation();
  const { name } = useParams();
  const navigate = useNavigate();
  useDarkMode();

  const service = state;

  if (!service) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold mb-2">No service data found.</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const sortedHistory = [...service.history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6 md:px-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 dark:text-blue-400 font-medium hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        {service.name} — Timeline
      </h1>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-600" />

        <div className="space-y-10 pl-12">
          {sortedHistory.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-2 ${typeColors[entry.type] || "border-gray-500"} flex items-center justify-center z-10`}
              >
                {typeIcons[entry.type] || typeIcons.Info}
              </div>

              {/* Timeline Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">
                    {entry.type}
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                    {entry.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {entry.description}
                </p>
                <time className="text-xs text-gray-500 dark:text-gray-400 block mt-2">
                  {format(entry.timestamp)} —{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </time>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
