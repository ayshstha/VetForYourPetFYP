import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([]);
  const [rescueRequests, setRescueRequests] = useState([]);
  const navigate = useNavigate();
  const [rescueHistory, setRescueHistory] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);

  const fetchRescueRequests = async () => {
    try {
      const response = await AxiosInstance.get("/rescue-requests/");
      setRescueRequests(response.data);
    } catch (error) {
      console.error("Error fetching rescue requests:", error);
    }
  };

  const fetchRescueHistory = async () => {
    try {
      const response = await AxiosInstance.get("/rescue-requests/");
      setRescueHistory(response.data); // Fetch all rescue requests for history
      console.log("Rescue History Data:", response.data); // Debugging: Log the data
    } catch (error) {
      console.error("Error fetching rescue history:", error);
    }
  };

  useEffect(() => {
    fetchRescueRequests();
    fetchRescueHistory();
    // Fetch initial data
    AxiosInstance.get("/users/")
      .then((response) => {
        // Filter out superusers
        const normalUsers = response.data.filter((user) => !user.is_superuser);
        setUsers(normalUsers);
      })
      .catch(console.error);

    AxiosInstance.get("/rescue-requests/")
      .then((response) => setRescueRequests(response.data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfile />;
      case "users":
        return <TotalUsers users={users} />;
      case "rescue":
        return (
          <RescueRequests
            requests={rescueRequests}
            fetchRescueRequests={fetchRescueRequests}
          />
        );
      case "rescue-history":
        return <RescueHistory history={rescueHistory} />;
      case "adoption":
        return <AdoptionRequests requests={adoptionRequests} />;
      case "add-dog":
        return <AddDog />;
      case "adoption-history":
        return <AdoptionHistory />;
      case "vet":
        return <VetAppointments />;
      case "appointment-history": // New tab
        return <AppointmentHistory />;
      case "feedback":
        return <Feedbacks />;
      case "donations":
        return <Donations />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-top">
          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Admin Profile
          </button>
          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Total Users ({users.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "rescue" ? "active" : ""}`}
            onClick={() => setActiveTab("rescue")}
          >
            🐶 Rescue Requests ({rescueRequests.length})
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "rescue-history" ? "active" : ""
            }`}
            onClick={() => setActiveTab("rescue-history")}
          >
            📜 Rescue History
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "adoption" ? "active" : ""
            }`}
            onClick={() => setActiveTab("adoption")}
          >
            🐾 Adoption Requests ({adoptionRequests.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "add-dog" ? "active" : ""}`}
            onClick={() => setActiveTab("add-dog")}
          >
            ➕ Add New Dog
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "adoption-history" ? "active" : ""
            }`}
            onClick={() => setActiveTab("adoption-history")}
          >
            📜 Adoption History
          </button>

          <button
            className={`sidebar-btn ${activeTab === "vet" ? "active" : ""}`}
            onClick={() => setActiveTab("vet")}
          >
            🏥 Vet Appointments
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "appointment-history" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointment-history")}
          >
            📜 Appointment History
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "feedback" ? "active" : ""
            }`}
            onClick={() => setActiveTab("feedback")}
          >
            💬 Feedbacks
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "donations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("donations")}
          >
            💰 Donations
          </button>
        </div>
        <button
          className="sidebar-btn logout-btn"
          style={{ backgroundColor: "green" }}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

// Example Component (Add others similarly)
const TotalUsers = ({ users }) => (
  <div className="dashboard-section">
    <h2>Registered Users</h2>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <img
                  src={user.profile_picture || "/default-avatar.png"}
                  alt="Profile"
                  width="50"
                  height="50"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DogList = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await AxiosInstance.get("/Adoption/");
        setDogs(response.data);
      } catch (error) {
        setError("Failed to fetch dogs.");
        console.error("Error fetching dogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const handleDelete = async (dogId) => {
    try {
      await AxiosInstance.delete(`/Adoption/${dogId}/`);
      setDogs(dogs.filter((dog) => dog.id !== dogId)); // Remove the deleted dog from the list
      alert("Dog deleted successfully!");
    } catch (error) {
      console.error("Error deleting dog:", error);
      alert("Failed to delete dog. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Dog List</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Behavior</th>
              <th>Rescue Story</th>
              <th>Image</th>
              <th>Action</th> {/* New column for the delete button */}
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>{dog.id}</td>
                <td>{dog.name}</td>
                <td>{dog.behavior}</td>
                <td>{dog.rescue_story}</td>
                <td>
                  <img src={dog.image} alt={dog.name} width="50" height="50" />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(dog.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddDog = () => {
  const [formData, setFormData] = useState({
    name: "",
    behavior: "",
    rescue_story: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("behavior", formData.behavior);
    data.append("rescue_story", formData.rescue_story);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await AxiosInstance.post("/Adoption/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Dog added successfully!");
      setFormData({
        name: "",
        behavior: "",
        rescue_story: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding dog:", error);
      alert("Failed to add dog. Please try again.");
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Add New Dog</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Dog Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Behavior and Personality</label>
          <input
            type="text"
            value={formData.behavior}
            onChange={(e) =>
              setFormData({ ...formData, behavior: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Rescue Story</label>
          <input
            type="text"
            value={formData.rescue_story}
            onChange={(e) =>
              setFormData({ ...formData, rescue_story: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Dog
        </button>
      </form>

      {/* Include the DogList component below the form */}
      <DogList />
    </div>
  );
};

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await AxiosInstance.get("/admin/profile/");
        setAdminData(response.data);
      } catch (error) {
        setError("Failed to fetch admin profile.");
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <div className="detail-item">
          <label>Full Name</label>
          <p>{adminData?.full_name || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <p>{adminData?.email || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Phone Number</label>
          <p>{adminData?.phone_number || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Role</label>
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

const RescueRequests = ({ requests, fetchRescueRequests }) => {
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await AxiosInstance.post(
        `/rescue-requests/${requestId}/update-status/`,
        { status: newStatus }
      );
      console.log("Status update response:", response.data);

      // Refresh the list of rescue requests after updating the status
      fetchRescueRequests();
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      alert("Failed to update status. Please try again.");
    }
  };

  // Filter requests to only show pending ones
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  return (
    <div className="dashboard-section">
      <h2>Rescue Requests ({pendingRequests.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Images</th>
              <th>Location</th>
              <th>Description</th>
              <th>Report Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        request.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt={request.user_details?.full_name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <p>{request.user_details?.full_name || "Unknown User"}</p>
                      <small>{request.user_details?.email || ""}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="image-gallery">
                    {request.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.image}
                        alt={`Rescue ${index + 1}`}
                        width="50"
                        height="50"
                        style={{ marginRight: "5px", borderRadius: "4px" }}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <a
                    href={`https://maps.google.com/?q=${request.latitude},${request.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </td>
                <td>{request.description}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "rescued")
                        }
                      >
                        Rescued
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "declined")
                        }
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await AxiosInstance.get("/adoption-requests/");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const originalRequests = [...requests];

      // Optimistic update
      setRequests((prev) => prev.filter((request) => request.id !== requestId));

      await AxiosInstance.patch(`/adoption-requests/${requestId}/`, {
        status: newStatus,
      });

      // Refresh dog list after rejection
      if (newStatus === "rejected") {
        const dogResponse = await AxiosInstance.get("/Adoption/");
        setAvailableDogs(dogResponse.data);
      }
    } catch (error) {
      console.error("Error:", error.response?.data);
      setRequests(originalRequests);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.status?.[0] ||
        `Failed to ${newStatus} request. Please try again.`;

      alert(errorMessage);
    }
  };

  const getDogImage = (request) => {
    return request.dog_details?.image || "/placeholder-dog.jpg";
  };

  const getUserAvatar = (request) => {
    return request.user_details?.profile_picture || "/default-avatar.png";
  };

  // Filter requests to only show pending requests
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  return (
    <div className="dashboard-section">
      <h2>Adoption Requests ({pendingRequests.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Dog</th>
              <th>Adoption Reason</th>
              <th>Request Date</th>
              <th>Pickup Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={getUserAvatar(request)}
                      alt={request.user_details?.full_name || "User"}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div>
                      <p>{request.user_details?.full_name || "Unknown User"}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dog-info">
                    <img
                      src={getDogImage(request)}
                      alt={request.dog_details?.name || "Dog"}
                      width="50"
                      height="50"
                      onError={(e) => {
                        e.target.src = "/placeholder-dog.jpg";
                      }}
                    />
                    <p>{request.dog_details?.name || "Unknown Dog"}</p>
                  </div>
                </td>
                <td className="adoption-reason-cell">
                  {request.adoption_reason || "N/A"}
                </td>
                <td>
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {request.pickup_date
                    ? new Date(request.pickup_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleStatusChange(request.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, "rejected")}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const AdoptionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await AxiosInstance.get("/adoption-requests/");
        setHistory(response.data);
      } catch (error) {
        setError("Failed to load adoption history");
        console.error("Error fetching adoption history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { label: "Approved", className: "status-accepted" },
      rejected: { label: "Rejected", className: "status-rejected" },
      pending: { label: "Pending", className: "status-pending" },
    };

    const { label, className } = statusMap[status] || {
      label: "Unknown",
      className: "",
    };
    return <span className={`status-badge ${className}`}>{label}</span>;
  };

  if (loading)
    return <div className="loading">Loading adoption history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Adoption History</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Dog</th>
              <th>Adoption Reason</th>
              <th>Request Date</th>
              <th>Pickup Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        request.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt={request.user_details?.full_name}
                      width="40"
                      height="40"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <p>{request.user_details?.full_name || "Unknown User"}</p>
                      <small>{request.user_details?.email || ""}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dog-info">
                    <img
                      src={request.dog_details?.image || "/placeholder-dog.jpg"}
                      alt={request.dog_details?.name}
                      width="40"
                      height="40"
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                    <div>
                      <p>{request.dog_details?.name || "Unknown Dog"}</p>
                    </div>
                  </div>
                </td>
                <td className="adoption-reason-cell">
                  {request.adoption_reason || "N/A"}
                </td>
                <td>
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {request.pickup_date
                    ? new Date(request.pickup_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{getStatusBadge(request.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && (
          <div className="no-results">No adoption requests found</div>
        )}
      </div>
    </div>
  );
};

const RescueHistory = ({ history }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      rescued: { label: "Rescued", className: "status-rescued" },
      pending: { label: "Pending", className: "status-pending" },
      declined: { label: "Declined", className: "status-declined" },
    };

    const { label, className } = statusMap[status] || {
      label: "Unknown",
      className: "",
    };
    return <span className={`status-badge ${className}`}>{label}</span>;
  };

  console.log("Rescue History Data in Component:", history); // Debugging: Log the data

  return (
    <div className="dashboard-section">
      <h2>Rescue History</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Images</th>
              <th>Location</th>
              <th>Description</th>
              <th>Report Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        request.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt={request.user_details?.full_name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <p>{request.user_details?.full_name || "Unknown User"}</p>
                      <small>{request.user_details?.email || ""}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="image-gallery">
                    {request.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.image}
                        alt={`Rescue ${index + 1}`}
                        width="50"
                        height="50"
                        style={{ marginRight: "5px", borderRadius: "4px" }}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <a
                    href={`https://maps.google.com/?q=${request.latitude},${request.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </td>
                <td>{request.description}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
                <td>{getStatusBadge(request.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && (
          <div className="no-results">No rescue history found</div>
        )}
      </div>
    </div>
  );
};

const VetAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AxiosInstance.get("/appointments/");
        // Filter to show only active appointments
        const activeAppointments = response.data.filter(
          (appt) => appt.status === "pending" || appt.status === "confirmed"
        );
        setAppointments(activeAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

 const handleStatusChange = async (appointmentId, newStatus) => {
   try {
     console.log(`Updating appointment ${appointmentId} to ${newStatus}`);

     const response = await AxiosInstance.post(
       `/appointments/${appointmentId}/update-status/`,
       { status: newStatus }
     );

     console.log("Update response:", response.data);

     // Refresh appointments
     const refreshResponse = await AxiosInstance.get("/appointments/");
     const activeAppointments = refreshResponse.data.filter(
       (appt) => appt.status === "pending" || appt.status === "confirmed"
     );
     setAppointments(activeAppointments);

     alert(`Appointment marked as ${newStatus}!`);
   } catch (error) {
     console.error("Update failed:", error);
     console.error("Error details:", error.response?.data);
     alert(`Failed to update: ${error.response?.data?.error || error.message}`);
   }
 };
  // Added incomplete status to badge mapping
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending", className: "status-pending" },
      confirmed: { text: "Confirmed", className: "status-confirmed" },
      completed: { text: "Completed", className: "status-completed" },
      incomplete: { text: "Incomplete", className: "status-incomplete" }, // New entry
      cancelled: { text: "Cancelled", className: "status-cancelled" },
    };
    const { text, className } = statusMap[status] || {
      text: "Unknown",
      className: "status-unknown",
    };
    return <span className={`status-badge ${className}`}>{text}</span>;
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="dashboard-section">
      <h2>Vet Appointments ({appointments.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Pet Info</th>
              <th>Appointment Details</th>
              <th>Medical Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        appt.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt={appt.user_details?.full_name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <p>{appt.user_details?.full_name}</p>
                      <small>{appt.user_details?.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="pet-info">
                    <p>
                      <strong>Name:</strong> {appt.pet_name}
                    </p>
                    <p>
                      <strong>Breed:</strong> {appt.pet_breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {appt.pet_age} years
                    </p>
                    <p>
                      <strong>Weight:</strong> {appt.pet_weight} kg
                    </p>
                  </div>
                </td>
                <td>
                  <p>
                    <strong>Type:</strong> {appt.checkup_type}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.time}
                  </p>
                </td>
                <td>
                  <p>
                    <strong>Medical History:</strong>{" "}
                    {appt.medical_history || "N/A"}
                  </p>
                  <p>
                    <strong>Medications:</strong>{" "}
                    {appt.current_medications || "N/A"}
                  </p>
                  <p>
                    <strong>Allergies:</strong> {appt.allergies || "N/A"}
                  </p>
                </td>
                <td>{getStatusBadge(appt.status)}</td>
                <td>
                  <div className="action-buttons">
                    {/* Added incomplete button */}
                    <button
                      onClick={() => handleStatusChange(appt.id, "completed")}
                      className="complete-btn"
                      disabled={appt.status === "completed"}
                    >
                      Checkup Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(appt.id, "incomplete")}
                      className="incomplete-btn"
                      disabled={appt.status === "incomplete"}
                    >
                      Checkup Incomplete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="no-results">No active appointments found</div>
        )}
      </div>
    </div>
  );
};

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AxiosInstance.get("/appointments/");
        setAppointments(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load appointment history");
        console.error("Error fetching appointment history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending", className: "status-pending" },
      confirmed: { text: "Confirmed", className: "status-confirmed" },
      completed: { text: "Completed", className: "status-completed" },
      cancelled: { text: "Cancelled", className: "status-cancelled" },
      incomplete: { text: "Incomplete", className: "status-incomplete" },
    };
    const { text, className } = statusMap[status] || {
      text: "Unknown",
      className: "status-unknown",
    };
    return <span className={`status-badge ${className}`}>{text}</span>;
  };

  if (loading)
    return <div className="loading">Loading appointment history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Appointment History</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Pet Info</th>
              <th>Appointment Details</th>
              <th>Medical Info</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        appt.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt={appt.user_details?.full_name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <p>{appt.user_details?.full_name}</p>
                      <small>{appt.user_details?.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="pet-info">
                    <p>
                      <strong>Name:</strong> {appt.pet_name}
                    </p>
                    <p>
                      <strong>Breed:</strong> {appt.pet_breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {appt.pet_age} years
                    </p>
                    <p>
                      <strong>Weight:</strong> {appt.pet_weight} kg
                    </p>
                  </div>
                </td>
                <td>
                  <p>
                    <strong>Type:</strong> {appt.checkup_type}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {appt.time}
                  </p>
                </td>
                <td>
                  <p>
                    <strong>Medical History:</strong>{" "}
                    {appt.medical_history || "N/A"}
                  </p>
                  <p>
                    <strong>Medications:</strong>{" "}
                    {appt.current_medications || "N/A"}
                  </p>
                  <p>
                    <strong>Allergies:</strong> {appt.allergies || "N/A"}
                  </p>
                </td>
                <td>{getStatusBadge(appt.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="no-results">No appointment history found</div>
        )}
      </div>
    </div>
  );
};

const Donations = () => (
  <div className="dashboard-section">
    <h2>Donations</h2>
    <p>Donation records will appear here.</p>
  </div>
);

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await AxiosInstance.get("/feedback/");
        setFeedbacks(response.data);
      } catch (error) {
        setError("Failed to fetch feedbacks.");
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleFeatured = async (feedbackId) => {
    try {
      const response = await AxiosInstance.post(
        `/feedback/toggle-featured/${feedbackId}/`
      );
      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback.id === feedbackId
            ? { ...feedback, featured: response.data.featured }
            : feedback
        )
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>User Feedbacks</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Image</th>
              <th>User Name</th>
              <th>Message</th>
              <th>Date</th>
              <th>Featured</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>
                  <img
                    src={
                      feedback.user?.profile_picture || "/default-avatar.png"
                    }
                    alt={feedback.user?.full_name || "User"}
                    width="50"
                    height="50"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </td>
                <td>{feedback.user?.full_name || "Anonymous User"}</td>
                <td>{feedback.message}</td>
                <td>
                  {feedback.created_at
                    ? new Date(feedback.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{feedback.featured ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="feature-btn"
                    onClick={() => toggleFeatured(feedback.id)}
                  >
                    {feedback.featured ? "Unfeature" : "Feature"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashBoard;
