import { useState, useEffect } from "react";
import { FiMoon, FiSun, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import {
  MdCheckCircle,
  MdError,
  MdPauseCircleFilled,
  MdSync,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

const statusOptions = ["Running", "Error", "Stopped"];
const SERVICES_PER_PAGE = 10;
const statusStyles = {
  Running: {
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100",
    icon: <MdCheckCircle className="w-4 h-4" />,
  },
  Error: {
    color: "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-100",
    icon: <MdError className="w-4 h-4" />,
  },
  Stopped: {
    color: "bg-amber-100 text-amber-700 dark:bg-amber-700 dark:text-amber-100",
    icon: <MdPauseCircleFilled className="w-4 h-4" />,
  },
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    Running: true,
    Error: true,
    Stopped: true,
  });
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "Running",
    updateDesc: "",
  });
  const [editService, setEditService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState("updatedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const [currentPage, setCurrentPage] = useState(1);

  // Initial fetch
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => toast.error("Failed to fetch services"));
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data) => {
          setServices(data);
          toast.success("Services refreshed");
        })
        .catch(() => toast.error("Refresh failed"));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const sortServices = (arr) => {
    return [...arr].sort((a, b) => {
      let vA = sortKey === "updatedAt" ? new Date(a[sortKey]) : a[sortKey];
      let vB = sortKey === "updatedAt" ? new Date(b[sortKey]) : b[sortKey];
      if (vA < vB) return sortKey === "updatedAt" ? 1 : sortAsc ? -1 : 1;
      if (vA > vB) return sortKey === "updatedAt" ? -1 : sortAsc ? 1 : -1;
      return 0;
    });
  };

  const filtered = sortServices(
    services.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        statusFilters[s.status]
    )
  );
    // Paginated
  const totalPages = Math.ceil(filtered.length / SERVICES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * SERVICES_PER_PAGE,
    currentPage * SERVICES_PER_PAGE
  );


  const handleDelete = (name) => {
    const service = services.find((s) => s.name === name);
    if (!service) return;
    fetch(`/api/services/${service.id}`, { method: "DELETE" })
      .then(() => {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        toast.success("Service deleted");
      })
      .catch(() => toast.error("Delete failed"));
  };

  const handleFormSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Name required");
      return;
    }

    const updateEntry = formData.updateDesc
      ? {
          type: "Update",
          description: formData.updateDesc,
          timestamp: new Date().toISOString(),
        }
      : null;

    const newHistory = editService
      ? [...(editService.history || []), ...(updateEntry ? [updateEntry] : [])]
      : [
          {
            type: "Created",
            description: "Service created",
            timestamp: new Date().toISOString(),
          },
          ...(updateEntry ? [updateEntry] : []),
        ];

    const payload = {
      name: formData.name,
      type: formData.type,
      status: formData.status,
      updatedAt: new Date().toISOString(),
      history: newHistory,
    };

    const url = editService
      ? `/api/services/${editService.id}`
      : "/api/services";
    const method = editService ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setServices((prev) => {
          if (editService) {
            return prev.map((s) =>
              s.id === editService.id ? data.service : s
            );
          }
          return [...prev, data.service];
        });
        toast.success(editService ? "Service updated" : "Service added");
        resetForm();
      })
      .catch(() => toast.error("Save failed"));
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", status: "Running", updateDesc: "" });
    setEditService(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white py-6 px-4 md:px-10">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Microservices Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFormData({
                  name: "",
                  type: "",
                  status: "Running",
                  updateDesc: "",
                });
                setEditService(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
            >
              <FiPlus /> Add Service
            </button>
            <button
              onClick={() => setIsDarkMode((p) => !p)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full"
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
          <input
            className="w-full sm:w-96 px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {statusOptions.map((status) => (
              <label key={status} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={statusFilters[status]}
                  onChange={() =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      [status]: !prev[status],
                    }))
                  }
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="w-full table-auto bg-white dark:bg-gray-800 border-separate border-spacing-0 rounded shadow-md">
            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <tr>
                {["name", "type", "status", "updatedAt"].map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
                    onClick={() => {
                      setSortKey(key);
                      setSortAsc(sortKey === key ? !sortAsc : true);
                    }}
                  >
                    {key === "updatedAt"
                      ? "Last Updated"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                    <MdSync className="inline ml-1" />
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {filtered.map((s) => {
                  const { color, icon } = statusStyles[s.status];
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() =>
                          navigate(`/service/${encodeURIComponent(s.name)}`, {
                            state: s,
                          })
                        }
                      >
                        {s.name}
                      </td>
                      <td className="px-6 py-4 cursor-pointer">{s.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
                        >
                          {icon} {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(s.updatedAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <FiEdit2
                          onClick={() => {
                            setEditService(s);
                            setFormData({
                              name: s.name,
                              type:s.type,
                              status: s.status,
                              updateDesc: "",
                            });
                            setShowModal(true);
                          }}
                          className="text-blue-600 cursor-pointer"
                        />
                        <FiTrash2
                          onClick={() => handleDelete(s.name)}
                          className="text-red-600 cursor-pointer"
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          <AnimatePresence>
            {filtered.map((s) => {
              const { color, icon } = statusStyles[s.status];
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    onClick={() =>
                      navigate(`/service/${encodeURIComponent(s.name)}`, {
                        state: s,
                      })
                    }
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold">{s.name}</h2>

                      <div
                        className={`flex items-center gap-1 px-2 py-1 text-sm rounded-full ${color}`}
                      >
                        {icon} {s.status}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Last updated: {new Date(s.updatedAt).toLocaleTimeString()}
                    </p>
                    <div className="flex justify-end mt-4 gap-4">
                      <FiEdit2
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditService(s);
                          setFormData({
                            name: s.name,
                            status: s.status,
                            updateDesc: "",
                          });
                          setShowModal(true);
                        }}
                        className="text-blue-600 cursor-pointer"
                      />
                      <FiTrash2
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.name);
                        }}
                        className="text-red-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[90%] max-w-md mx-auto"
            >
              <Dialog.Title className="text-xl font-bold mb-4">
                {editService ? "Edit Service" : "Add Service"}
              </Dialog.Title>
              <input
                className="w-full mb-3 px-4 py-2 rounded border dark:border-gray-600"
                placeholder="Service name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                className="w-full mb-3 px-4 py-2 rounded border dark:border-gray-600"
                placeholder="Service type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
              />
              <select
                className="w-full mb-3 px-4 py-2 rounded border dark:border-gray-600"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {statusOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              {editService && (
                <textarea
                  className="w-full mb-3 px-4 py-2 rounded border dark:border-gray-600"
                  placeholder="Update description"
                  value={formData.updateDesc}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      updateDesc: e.target.value,
                    }))
                  }
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editService ? "Save Update" : "Add Service"}
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
