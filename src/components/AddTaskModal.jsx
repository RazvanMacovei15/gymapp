import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";

export default function AddTaskModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    deadline: "",
    priority: "",
    gyms: [],
    users: [],
  });

  const [users, setUsers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isGymSelected, setIsGymSelected] = useState(false); // Track if a gym is selected

  const fetchManagersByGymIds = async (gymIds) => {
    try {
      const response = await axios.get("http://maco-coding.go.ro:8010/gyms/getManagers", {
        params: {
          gymIds: gymIds.map((gym) => gym.gymId), // Extract IDs from selected gyms
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const getGyms = async () => {
    try {
      const response = await axios.get("http://maco-coding.go.ro:8010/gyms/all");
      setGyms(response.data);
    } catch (error) {
      console.error("Failed to fetch gyms:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://maco-coding.go.ro:8010/api/enum/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectGyms = async (selectedList) => {
    setFormData({ ...formData, gyms: selectedList });
    setIsGymSelected(selectedList.length > 0); // Check if gyms are selected
    if (selectedList.length > 0) {
      const gymIds = selectedList.map((gym) => gym.id); // Extract gym IDs
      await fetchManagersByGymIds(gymIds); // Fetch managers
    } else {
      setUsers([]); // Reset users if no gym is selected
    }
  };

  const handleSelectUsers = (selectedList) => {
    if (!isGymSelected) {
      alert("Please select a gym first!");
      return;
    }
    setFormData({ ...formData, users: selectedList });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      taskDTO: {
        category: formData.category,
        description: formData.description,
        deadline: formData.deadline,
        priority: formData.priority,
      },
      users: formData.users,
      gyms: formData.gyms,
    };

    onSubmit(formattedData);
  };

  useEffect(() => {
    fetchCategories();
    getGyms();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-lg transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gyms */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Gyms
            </label>
            <Multiselect
              options={gyms}
              selectedValues={formData.gyms}
              onSelect={handleSelectGyms}
              onRemove={handleSelectGyms}
              displayValue="name"
              placeholder="Select Gyms"
              className="w-full border rounded-lg shadow-sm"
            />
          </div>
          {/* Users */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Users
            </label>
            <Multiselect
              options={users}
              selectedValues={formData.users}
              onSelect={handleSelectUsers}
              onRemove={handleSelectUsers}
              displayValue="name"
              placeholder="Select Users"
              className="w-full border rounded-lg shadow-sm"
              disable={!isGymSelected} // Disable if no gym is selected
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              placeholder="Enter task description..."
              required
            ></textarea>
          </div>
          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              required
            />
          </div>
          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-black to-pink-950 text-white py-3 px-4 rounded-lg w-full hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
