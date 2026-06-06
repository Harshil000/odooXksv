import "../styles/category-modal.scss";

const VendorDetailsModal = ({ isOpen, onClose, vendor }) => {
  if (!isOpen || !vendor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h2 className="modal-title">Vendor Information</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ gridTemplateColumns: "1fr", gap: "16px", padding: "24px" }}>
          <div className="form-section" style={{ background: "#eef0f5", border: "1px solid rgba(200,202,212,0.4)" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#5b6af0", fontSize: "1.2rem", fontWeight: 800 }}>
              {vendor.company_name}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem", color: "#3a3d52" }}>
              <div>
                <strong style={{ color: "#7a7f9a" }}>Contact Person: </strong>
                {vendor.contact_person || "—"}
              </div>

              <div>
                <strong style={{ color: "#7a7f9a" }}>Email: </strong>
                <span style={{ color: "#5b6af0", fontWeight: 600 }}>{vendor.email || "—"}</span>
              </div>

              <div>
                <strong style={{ color: "#7a7f9a" }}>Phone Number: </strong>
                {vendor.phone || "—"}
              </div>

              <div>
                <strong style={{ color: "#7a7f9a" }}>GST number: </strong>
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{vendor.gst_number || "—"}</span>
              </div>

              <div>
                <strong style={{ color: "#7a7f9a" }}>Business Address: </strong>
                <div style={{ background: "#e8eaf0", padding: "10px", borderRadius: "8px", marginTop: "4px", boxShadow: "inset 2px 2px 4px #c8cad4, inset -2px -2px 4px #ffffff" }}>
                  {vendor.address || "No address details available."}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                <div>
                  <strong style={{ color: "#7a7f9a" }}>Vendor Rating: </strong>
                  <span style={{ fontWeight: 800, color: "#10b981" }}>{(vendor.rating || 0)} / 5 ★</span>
                </div>
                <div>
                  <strong style={{ color: "#7a7f9a" }}>Status: </strong>
                  <span className={`status-badge status-${vendor.status?.toLowerCase()}`} style={{ padding: "4px 10px", borderRadius: "8px", fontWeight: 700 }}>
                    {vendor.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
