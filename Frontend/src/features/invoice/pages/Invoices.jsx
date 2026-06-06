import { useEffect, useRef } from "react";
import useInvoice from "../hook/useInvoice";
import { formatAmount, calculateTaxes } from "../utils/invoice.utils";
import "../../../styles/dashboard.scss";

// Ensure html2pdf is available globally
// Note: html2pdf should be included via CDN in index.html or installed via npm
const html2pdf = window.html2pdf || (typeof require !== 'undefined' ? require('html2pdf') : null);

export default function Invoices() {
  const {
    invoices,
    selectedInvoice,
    invoiceDetails,
    loading,
    error,
    loadInvoices,
    loadInvoiceDetails,
  } = useInvoice();

  const invoiceRef = useRef(null);

  // Handle PDF download using html2pdf
  const handlePdfDownload = () => {
    if (!invoiceRef.current || !invoiceDetails) return;

    const element = invoiceRef.current;
    const fileName = `Invoice_${invoiceDetails.invoice_number}_${new Date().toISOString().split('T')[0]}.pdf`;

    const options = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#eef0f5' },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    if (html2pdf && typeof html2pdf.jsPDF === 'function') {
      // Using html2pdf library
      html2pdf().set(options).from(element).save();
    } else {
      console.warn('html2pdf library not available. Falling back to print dialog.');
      window.print();
    }
  };

  useEffect(() => {
    loadInvoices().then((data) => {
      if (data && data.length > 0) {
        loadInvoiceDetails(data[0]);
      }
    });
  }, [loadInvoices, loadInvoiceDetails]);

  if (loading && invoices.length === 0) {
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

  // Calculate taxes
  const subtotal = invoiceDetails ? Number(invoiceDetails.subtotal) : 0;
  const { cgst, sgst, grandTotal } = calculateTaxes(subtotal);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Invoices</h1>
        <p className="dashboard-subtitle">
          Manage and review generated invoices for awarded purchase orders
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

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }}>

        {/* Invoice List Panel */}
        <div className="table-card" style={{ padding: "16px" }}>
          <div className="card-title" style={{ fontSize: "1rem", marginBottom: "12px" }}>All Invoices</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {invoices.map((inv) => {
              const isActive = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => loadInvoiceDetails(inv)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isActive ? "#e0e7ff" : "#eef0f5",
                    borderLeft: isActive ? "4px solid #5b6af0" : "4px solid transparent",
                    boxShadow: isActive
                      ? "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff"
                      : "4px 4px 8px #c8cad4, -4px -4px 8px #ffffff"
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#3a3d52" }}>{inv.invoice_number}</div>
                  <div style={{ fontSize: "0.75rem", color: "#7a7f9a", margin: "2px 0 6px 0" }}>
                    PO: {inv.po_number} | {inv.company_name}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#5b6af0", fontSize: "0.85rem" }}>
                      {formatAmount(inv.grand_total)}
                    </span>
                    <span className="status-badge" style={{
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: inv.status === "PAID" ? "#dcfce7" : "#fee2e2",
                      color: inv.status === "PAID" ? "#166534" : "#991b1b",
                    }}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {invoices.length === 0 && (
              <div style={{ textAlign: "center", color: "#a8adc4", padding: "20px", fontSize: "0.85rem" }}>
                No invoices found.
              </div>
            )}
          </div>
        </div>

        {/* Invoice Detail Sheet (Wireframe 3) */}
        <div>
          {invoiceDetails ? (
            <div className="table-card" style={{ padding: "30px", background: "#eef0f5", boxShadow: "8px 8px 20px #c8cad4, -8px -8px 20px #ffffff" }} ref={invoiceRef}>

              {/* Header section */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px dashed #c8cad4", paddingBottom: "20px", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#3a3d52" }}>
                    Order & Invoice
                  </h2>
                  <span style={{ fontSize: "0.8rem", color: "#7a7f9a", fontWeight: 600 }}>
                    Auto-generated after approval
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    className="action-btn secondary"
                    style={{ minWidth: "100px", minHeight: "40px", fontSize: "0.85rem", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                  <button
                    className="action-btn"
                    style={{ minWidth: "150px", minHeight: "40px", fontSize: "0.85rem", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    onClick={handlePdfDownload}
                  >
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Bill To & Vendor Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid rgba(200,202,212,0.4)", marginBottom: "24px", boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.05)" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", color: "#7a7f9a", fontSize: "0.75rem", textTransform: "uppercase" }}>Bill to:</h4>
                  <div style={{ fontWeight: 800, color: "#3a3d52", fontSize: "0.9rem" }}>Your Organization Name</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a", marginTop: "2px" }}>
                    123 business park, ahmedabad
                    <br />
                    GSTIN: 25383438AFB
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", color: "#7a7f9a", fontSize: "0.75rem", textTransform: "uppercase" }}>Vendor:</h4>
                  <div style={{ fontWeight: 800, color: "#3a3d52", fontSize: "0.9rem" }}>{invoiceDetails.company_name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a", marginTop: "2px" }}>
                    {invoiceDetails.vendor_address || "456, industrial estate, surat"}
                    {invoiceDetails.gst_number && <div>GSTIN: {invoiceDetails.gst_number}</div>}
                    {invoiceDetails.vendor_phone && <div>Phone: {invoiceDetails.vendor_phone}</div>}
                  </div>
                </div>
              </div>

              {/* Metadata details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginBottom: "24px", fontSize: "0.85rem", color: "#3a3d52", background: "rgba(200,202,212,0.2)", padding: "16px", borderRadius: "10px" }}>
                <div>
                  <strong>PO Number:</strong> {invoiceDetails.po_number}
                </div>
                <div>
                  <strong>Invoice Date:</strong> {new Date(invoiceDetails.generated_at).toLocaleDateString()}
                </div>
                <div>
                  <strong>PO Date:</strong> {new Date(invoiceDetails.issue_date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Due Date:</strong> {new Date(new Date(invoiceDetails.generated_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} (Net 30)
                </div>
              </div>

              {/* Line items table */}
              <div className="nm-table-wrapper" style={{ background: "#ffffff", borderRadius: "10px", padding: "10px", marginBottom: "24px", boxShadow: "2px 2px 8px rgba(0,0,0,0.05)" }}>
                <table style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th style={{ textAlign: "center" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Unit Price</th>
                      <th style={{ textAlign: "right" }}>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails.items?.map((it) => (
                      <tr key={it.id} style={{ transform: "none", boxShadow: "none" }}>
                        <td style={{ fontWeight: 700 }}>{it.product_name}</td>
                        <td style={{ textAlign: "center" }}>{it.quantity} {it.unit}</td>
                        <td style={{ textAlign: "right", color: "#5b6af0", fontWeight: 700 }}>{formatAmount(it.unit_price)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{formatAmount(it.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Breakdown breakdown */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", color: "#3a3d52" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7a7f9a" }}>Subtotal:</span>
                    <span style={{ fontWeight: 700 }}>{formatAmount(subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7a7f9a" }}>CGST (9%):</span>
                    <span style={{ fontWeight: 600 }}>{formatAmount(cgst)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7a7f9a" }}>SGST (9%):</span>
                    <span style={{ fontWeight: 600 }}>{formatAmount(sgst)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #c8cad4", paddingTop: "8px", fontSize: "1.1rem" }}>
                    <span style={{ fontWeight: 800, color: "#3a3d52" }}>Grand Total:</span>
                    <span style={{ fontWeight: 900, color: "#10b981" }}>{formatAmount(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#7a7f9a" }}>Invoice Status:</span>
                <span className="status-badge" style={{
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  background: invoiceDetails.status === "GENERATED" ? "#e0e7ff" : "#dcfce7",
                  color: invoiceDetails.status === "GENERATED" ? "#3730a3" : "#166534"
                }}>
                  {invoiceDetails.status}
                </span>
              </div>

            </div>
          ) : (
            <div className="table-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "#a8adc4" }}>
              Select an Invoice to render.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
