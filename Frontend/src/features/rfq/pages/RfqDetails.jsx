import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import useAuth from "../../auth/hook/useAuth";
import useRfq from "../hook/useRfq";
import { formatDate } from "../utils/rfq.utils";
import { toast } from "react-toastify";
import "../styles/rfq.scss";

const RfqDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedRfq, loadingDetails, loadRfqDetails } = useRfq();

  useEffect(() => {
    if (id) {
      loadRfqDetails(id).catch((err) => {
        toast.error(err.message || "Failed to load RFQ details");
        navigate("/rfqs");
      });
    }
  }, [id, loadRfqDetails, navigate]);

  if (loadingDetails) {
    return (
      <div className="rfq-container">
        <div style={{ textAlign: "center", padding: "80px", color: "#7a7f9a", fontFamily: "Inter, sans-serif" }}>
          Loading RFQ details...
        </div>
      </div>
    );
  }

  if (!selectedRfq) {
    return (
      <div className="rfq-container">
        <div style={{ textAlign: "center", padding: "80px", color: "#7a7f9a", fontFamily: "Inter, sans-serif" }}>
          RFQ not found or has been deleted.
          <br />
          <button className="action-btn" onClick={() => navigate("/rfqs")} style={{ marginTop: "20px" }}>
            Back to RFQs List
          </button>
        </div>
      </div>
    );
  }

  const isVendor = user?.role === "VENDOR";

  return (
    <div className="rfq-container">
      {/* RFQ Header Bar */}
      <div className="rfq-header-bar">
        <div className="rfq-title-area">
          <h1 className="rfq-title">RFQ Details — {selectedRfq.rfq_number}</h1>
          <p className="rfq-subtitle">
            Detailed specifications and vendor routing overview
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="action-btn secondary"
            onClick={() => navigate("/rfqs")}
            style={{ minWidth: "140px", minHeight: "42px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Back to List
          </button>
          
          {/* Hide edit button for vendors */}
          {!isVendor && (
            <button
              className="action-btn"
              onClick={() => navigate(`/rfq/${id}/edit`)}
              style={{ minWidth: "140px", minHeight: "42px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              Edit RFQ
            </button>
          )}
        </div>
      </div>

      {/* RFQ Detail Information Card */}
      <div className="rfq-form-card" style={{ maxWidth: "1000px" }}>
        
        {/* Section 1: Basic Information */}
        <div className="form-section-title">RFQ Basic Information</div>
        <div className="modal-details-grid" style={{ marginBottom: "30px" }}>
          <div className="detail-item">
            <div className="label">Title</div>
            <div className="value">{selectedRfq.title}</div>
          </div>
          <div className="detail-item">
            <div className="label">Status</div>
            <div className="value">
              <span className={`status-pill ${selectedRfq.status.toLowerCase()}`}>
                {selectedRfq.status}
              </span>
            </div>
          </div>
          <div className="detail-item" style={{ gridColumn: "span 2", marginTop: "10px" }}>
            <div className="label">Description / Terms</div>
            <div className="value" style={{ fontWeight: 400, whiteSpace: "pre-line", lineHeight: "1.6" }}>
              {selectedRfq.description || "No description provided."}
            </div>
          </div>
          <div className="detail-item" style={{ marginTop: "10px" }}>
            <div className="label">Quotation Deadline</div>
            <div className="value">{formatDate(selectedRfq.deadline)}</div>
          </div>
          <div className="detail-item" style={{ marginTop: "10px" }}>
            <div className="label">Created By</div>
            <div className="value">
              {selectedRfq.creator_name} ({selectedRfq.creator_email})
            </div>
          </div>
        </div>

        {/* Section 2: Requested Items List */}
        <div className="form-section-title">Requested Product Items</div>
        <div className="nm-table-wrapper" style={{ marginBottom: "30px" }}>
          <table style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: "12px 16px" }}>Product Name</th>
                <th style={{ padding: "12px 16px" }}>Specifications</th>
                <th style={{ padding: "12px 16px" }}>Quantity</th>
                <th style={{ padding: "12px 16px" }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {selectedRfq.items.map((item, index) => (
                <tr key={item.id || index} style={{ boxShadow: "none", transform: "none" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 700 }}>{item.product_name}</td>
                  <td style={{ padding: "14px 16px", color: "#7a7f9a" }}>{item.product_description || "-"}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 800, color: "#5b6af0" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 16px" }}>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Mapped Vendors list (Procurements & Managers only) */}
        {!isVendor && selectedRfq.vendors && selectedRfq.vendors.length > 0 && (
          <>
            <div className="form-section-title">Invited Vendors</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {selectedRfq.vendors.map((vendor, index) => (
                <div
                  key={vendor.vendor_id || index}
                  style={{
                    background: "#eef0f5",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "4px 4px 10px #c8cad4, -4px -4px 10px #ffffff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#3a3d52" }}>
                    {vendor.company_name}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#7a7f9a", display: "flex", flexDirection: "column" }}>
                    <span>Contact: {vendor.contact_person}</span>
                    <span>Email: {vendor.vendor_email}</span>
                    {vendor.phone && <span>Phone: {vendor.phone}</span>}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default RfqDetails;
