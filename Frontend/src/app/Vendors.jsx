import { useState, useEffect } from "react";
import axios from "axios";
import CategoryModal from "../components/CategoryModal";
import VendorDetailsModal from "../components/VendorDetailsModal";
import "../styles/vendors.scss";

const vendorsApi = axios.create({
  baseURL: "http://localhost:3000/api/vendors",
  withCredentials: true,
});

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await vendorsApi.get("/");
      setVendors(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendors list");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically calculate counts based on database records
  const allCount = vendors.length;
  const activeCount = vendors.filter((v) => v.status === "ACTIVE").length;
  const inactiveCount = vendors.filter((v) => v.status === "INACTIVE").length;
  const blockedCount = vendors.filter((v) => v.status === "BLACKLISTED" || v.status === "BLOCKED").length;

  const filters = [
    { label: "All", value: "all", count: allCount },
    { label: "Active", value: "active", count: activeCount },
    { label: "Inactive", value: "inactive", count: inactiveCount },
    { label: "Blocked", value: "blocked", count: blockedCount },
  ];

  const filteredVendors = vendors.filter((vendor) => {
    const name = vendor.company_name || "";
    const gst = vendor.gst_number || "";
    const contact = vendor.contact_person || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active") return matchesSearch && vendor.status === "ACTIVE";
    if (activeFilter === "inactive") return matchesSearch && vendor.status === "INACTIVE";
    if (activeFilter === "blocked") return matchesSearch && (vendor.status === "BLACKLISTED" || vendor.status === "BLOCKED");
    return matchesSearch;
  });

  const handleOpenDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="vendors-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <div className="loader" style={{
            width: "40px",
            height: "40px",
            border: "4px solid #c8cad4",
            borderTop: "4px solid #5b6af0",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendors-container">
      {/* Page Header */}
      <div className="vendors-header">
        <div className="header-content">
          <h1 className="vendors-title">Vendors</h1>
          <p className="vendors-subtitle">
            Manage supplier profiles and registrations in real-time
          </p>
        </div>
        <button
          className="add-vendor-btn"
          onClick={() => setIsCategoryModalOpen(true)}
          style={{ minWidth: "180px", minHeight: "44px" }}
        >
          🏷️ Manage Categories
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #fca5a5"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by company name, contact person, or gst number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-tab ${activeFilter === filter.value ? "active" : ""}`}
            onClick={() => setActiveFilter(filter.value)}
            style={{ whiteSpace: "nowrap" }}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Vendors Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Contact Person</th>
                <th>GST no.</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="vendor-name" style={{ fontWeight: 700 }}>{vendor.company_name}</td>
                    <td>{vendor.contact_person || "—"}</td>
                    <td className="gst-number" style={{ fontFamily: "monospace" }}>{vendor.gst_number || "—"}</td>
                    <td>{vendor.phone || "—"}</td>
                    <td>
                      <span
                        className={`status-badge status-${vendor.status.toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => handleOpenDetails(vendor)}
                        style={{ minWidth: "80px", minHeight: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data" style={{ textAlign: "center", padding: "20px", color: "#a8adc4" }}>
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vendor={selectedVendor}
      />
    </div>
  );
}
