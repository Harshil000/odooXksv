import React from "react";

export default function VendorSelector({
  vendors,
  loadingVendors,
  selectedVendors,
  handleVendorToggle,
}) {
  if (loadingVendors) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#7a7f9a" }}>
        Retrieving verified vendors list...
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div style={{ color: "#7a7f9a", fontSize: "0.9rem", paddingLeft: "4px" }}>
        No active vendors registered in system. RFQ will be open to all.
      </div>
    );
  }

  return (
    <div className="vendors-selection-grid">
      {vendors.map((vendor) => {
        const numericId = Number(vendor.id);
        const isSelected = selectedVendors.map(Number).includes(numericId);
        return (
          <label
            key={vendor.id}
            className={`vendor-checkbox-label ${isSelected ? "selected" : ""}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleVendorToggle(numericId)}
            />
            <div className="checkbox-indicator">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="vendor-info">
              <span className="vendor-name">{vendor.company_name}</span>
              <span className="vendor-email">{vendor.contact_person}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
}
