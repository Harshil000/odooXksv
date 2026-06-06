import { useEffect } from "react";
import usePurchaseOrder from "../hook/usePurchaseOrder";
import { formatAmount } from "../utils/po.utils";
import "../../../styles/dashboard.scss";

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    selectedPo,
    loading,
    error,
    loadPurchaseOrders,
    loadPoDetails,
  } = usePurchaseOrder();

  useEffect(() => {
    loadPurchaseOrders().then((data) => {
      if (data && data.length > 0) {
        loadPoDetails(data[0]);
      }
    });
  }, [loadPurchaseOrders, loadPoDetails]);

  if (loading && purchaseOrders.length === 0) {
    return (
      <div className="dashboard-container">
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Purchase Orders</h1>
        <p className="dashboard-subtitle">
          View and track generated Purchase Orders (POs) for approved bids
        </p>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px", alignItems: "start" }}>
        
        {/* PO List */}
        <div className="table-card">
          <div className="card-title">All Purchase Orders</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor Name</th>
                  <th>Issue Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr
                    key={po.id}
                    onClick={() => loadPoDetails(po)}
                    style={{
                      cursor: "pointer",
                      background: selectedPo?.id === po.id ? "rgba(91, 106, 240, 0.08)" : "transparent",
                    }}
                  >
                    <td style={{ fontWeight: 700 }}>{po.po_number}</td>
                    <td>{po.company_name}</td>
                    <td>{new Date(po.issue_date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700, color: "#5b6af0" }}>{formatAmount(po.total_amount)}</td>
                    <td>
                      <span className={`status ${po.status === "COMPLETED" ? "approved" : "pending"}`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {purchaseOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "#a8adc4", padding: "20px" }}>
                      No Purchase Orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PO Details Panel */}
        <div>
          {selectedPo ? (
            <div className="table-card" style={{ padding: "24px" }}>
              <div className="card-title" style={{ borderBottom: "1px solid rgba(200, 202, 212, 0.4)", paddingBottom: "12px", marginBottom: "16px" }}>
                PO Details: {selectedPo.po_number}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Vendor Company</span>
                  <span style={{ fontWeight: 800, color: "#3a3d52" }}>{selectedPo.company_name}</span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Issue Date</span>
                    <span style={{ fontWeight: 700, color: "#3a3d52" }}>
                      {new Date(selectedPo.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Status</span>
                    <span style={{ fontWeight: 700, color: "#5b6af0" }}>{selectedPo.status}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Bid Total (Subtotal)</span>
                    <span style={{ fontWeight: 700, color: "#3a3d52" }}>{formatAmount(selectedPo.total_amount)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Estimated GST (18%)</span>
                    <span style={{ fontWeight: 700, color: "#3a3d52" }}>{formatAmount(Number(selectedPo.total_amount) * 0.18)}</span>
                  </div>
                </div>

                <div style={{ background: "#eef0f5", padding: "12px", borderRadius: "10px", marginTop: "10px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Grand Total PO Value</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#10b981" }}>
                    {formatAmount(Number(selectedPo.total_amount) * 1.18)}
                  </span>
                </div>

                <div style={{ borderTop: "1px solid rgba(200, 202, 212, 0.4)", paddingTop: "14px", marginTop: "10px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#7a7f9a", textTransform: "uppercase", display: "block" }}>Contact Person</span>
                  <span style={{ fontWeight: 600, color: "#3a3d52" }}>{selectedPo.contact_person}</span>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a" }}>Phone: {selectedPo.phone || "—"}</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a" }}>Address: {selectedPo.address || "—"}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", color: "#a8adc4" }}>
              Select a Purchase Order to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
