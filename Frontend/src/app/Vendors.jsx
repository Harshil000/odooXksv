import { useState } from "react";
import CategoryModal from "../components/CategoryModal";
import "../styles/vendors.scss";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Sample vendor data
  const vendorData = [
    {
      id: 1,
      name: "Infra Supplies PVT ltd",
      category: "Constructions",
      gstNumber: "27J44GC5W2JBqD",
      contactNo: "XYZ Number",
      status: "Active",
    },
    {
      id: 2,
      name: "Tech Core LTD",
      category: "IT",
      gstNumber: "27J44GC5W2JBqD",
      contactNo: "XYZ Number",
      status: "Active",
    },
    {
      id: 3,
      name: "FastEng Transport",
      category: "logistics",
      gstNumber: "27J44GC5W2JBqD",
      contactNo: "XYZ Number",
      status: "Blocked",
    },
  ];

  const filters = [
    { label: "All", value: "all", count: 25 },
    { label: "Active", value: "active", count: 24 },
    { label: "Pending", value: "pending", count: 0 },
    { label: "Blocked", value: "blocked", count: 1 },
  ];

  const filteredVendors = vendorData.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && vendor.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="vendors-container">
      {/* Page Header */}
      <div className="vendors-header">
        <div className="header-content">
          <h1 className="vendors-title">Vendors</h1>
          <p className="vendors-subtitle">
            Manage supplier profiles and registrations
          </p>
        </div>
        <button
          className="add-vendor-btn"
          onClick={() => setIsCategoryModalOpen(true)}
        >
          🏷️ Manage Categories
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search bar ..... search by name, gst number, category..."
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
                <th>Category</th>
                <th>GST no.</th>
                <th>contact no.</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="vendor-name">{vendor.name}</td>
                    <td>{vendor.category}</td>
                    <td className="gst-number">{vendor.gstNumber}</td>
                    <td>{vendor.contactNo}</td>
                    <td>
                      <span
                        className={`status-badge status-${vendor.status.toLowerCase()}`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <button className="view-btn">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
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
    </div>
  );
}
