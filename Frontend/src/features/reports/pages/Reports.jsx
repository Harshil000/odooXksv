import { useEffect, useState } from "react";
import useReports from "../hook/useReports";
import "../../../styles/dashboard.scss";

const formatLakhs = (amount) => {
  const num = Number(amount || 0);
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(1)}L`;
  }
  return `₹ ${num.toLocaleString("en-IN")}`;
};

const formatCurrency = (amount) => {
  return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};

export default function Reports() {
  const { reportsData, loading, error, loadReports } = useReports();
  const [selectedMonth, setSelectedMonth] = useState("May 2025");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (loading || !reportsData) {
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

  const data = reportsData;
  const filteredCategories = data.spendByCategory.filter(c => c.spend > 0);
  const maxSpendVal = Math.max(...data.monthlySpend.map(m => m.spend)) || 1;
  const maxCatSpend = Math.max(...filteredCategories.map(c => c.spend)) || 1;

  const months = ["May 2025", "April 2025", "March 2025", "February 2025", "January 2025"];

  return (
    <div className="dashboard-container">
      {/* Header with selector and export */}
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "30px" }}>
        <div>
          <h1 className="dashboard-title">Reports & analytics</h1>
          <p className="dashboard-subtitle" style={{ fontWeight: 600, color: "#7a7f9a" }}>
            Procurement Insights - {selectedMonth}
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "14px", alignItems: "center", position: "relative" }}>
          <div>
            <button 
              className="action-btn secondary"
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              style={{ minWidth: "130px", minHeight: "42px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              📅 {selectedMonth} ▾
            </button>
            {showMonthDropdown && (
              <div style={{
                position: "absolute",
                top: "46px",
                left: 0,
                background: "#eef0f5",
                borderRadius: "12px",
                boxShadow: "6px 6px 16px #c8cad4, -6px -6px 16px #ffffff",
                border: "1px solid rgba(200,202,212,0.5)",
                width: "140px",
                zIndex: 100,
                padding: "8px 0"
              }}>
                {months.map(m => (
                  <div 
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setShowMonthDropdown(false);
                    }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#3a3d52",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#e0e7ff"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="action-btn"
            onClick={() => alert("Exporting report...")}
            style={{ minWidth: "120px", minHeight: "42px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Export
          </button>
        </div>
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

      {/* KPI Cards section */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: "30px" }}>
        
        {/* Card 1 */}
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
          <div className="stat-value" style={{ color: "#5b6af0", fontSize: "2.6rem", fontWeight: 800 }}>
            {data.totalRfqs}
          </div>
          <div className="stat-label" style={{ marginTop: "4px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#a8adc4" }}>
            Total RFQs
          </div>
        </div>

        {/* Card 2 */}
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
          <div className="stat-value" style={{ color: "#10b981", fontSize: "2.6rem", fontWeight: 800 }}>
            {data.activeVendors}
          </div>
          <div className="stat-label" style={{ marginTop: "4px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#a8adc4" }}>
            Active Vendors
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
          <div className="stat-value" style={{ color: "#f59e0b", fontSize: "2.6rem", fontWeight: 800 }}>
            {data.poFulfillment}%
          </div>
          <div className="stat-label" style={{ marginTop: "4px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#a8adc4" }}>
            PO Fulfillment
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
          <div className="stat-value" style={{ color: "#ef4444", fontSize: "2.6rem", fontWeight: 800 }}>
            {data.overdueInvoices}
          </div>
          <div className="stat-label" style={{ marginTop: "4px", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#ef4444", opacity: 0.8 }}>
            Overdue Invoices
          </div>
        </div>
      </div>

      {/* Two Widgets Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start", marginBottom: "30px" }}>
        
        {/* Spend by Category */}
        <div className="table-card" style={{ padding: "24px", minHeight: "450px" }}>
          <div className="card-title" style={{ fontSize: "1.1rem", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Spend by Category
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "10px" }}>
            {filteredCategories.length === 0 ? (
              <div style={{ textAlign: "center", color: "#a8adc4", fontStyle: "italic", padding: "40px 0" }}>
                No active categories spend recorded yet.
              </div>
            ) : (
              filteredCategories.map((cat, idx) => {
                const pct = Math.max(10, Math.round((cat.spend / maxCatSpend) * 100));
                const progressColors = ["#5b6af0", "#10b981", "#f59e0b", "#ef4444"];
                const barColor = progressColors[idx % progressColors.length];
                
                return (
                  <div key={cat.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.95rem", fontWeight: 700, color: "#3a3d52" }}>
                      <span>{cat.name}</span>
                      <span style={{ color: "#7a7f9a" }}>{formatLakhs(cat.spend)}</span>
                    </div>
                    
                    {/* Progress Bar wrapper */}
                    <div style={{
                      width: "100%",
                      height: "14px",
                      background: "#e8eaf0",
                      borderRadius: "8px",
                      boxShadow: "inset 2px 2px 4px #c8cad4, inset -2px -2px 4px #ffffff",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: barColor,
                        borderRadius: "8px",
                        boxShadow: "2px 2px 5px rgba(0,0,0,0.15)"
                      }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Vendors by Spend & Monthly Spend Chart container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Top Vendors by Spend */}
          <div className="table-card" style={{ padding: "24px" }}>
            <div className="card-title" style={{ fontSize: "1.1rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Top Vendors by Spend
            </div>
            <div className="table-wrapper">
              <table style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th style={{ textAlign: "right" }}>Spend (₹)</th>
                    <th style={{ textAlign: "center" }}>POs</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topVendors.map((v) => (
                    <tr key={v.vendor} style={{ transform: "none", boxShadow: "none" }}>
                      <td style={{ fontWeight: 700, color: "#3a3d52" }}>{v.vendor}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#5b6af0" }}>
                        {formatCurrency(v.spend)}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{v.pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Spend Bar Chart */}
          <div className="table-card" style={{ padding: "24px" }}>
            <div className="card-title" style={{ fontSize: "1.1rem", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Monthly Spend Trend
            </div>
            
            {/* Custom Neumorphic CSS Chart */}
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "end",
              height: "160px",
              padding: "10px 20px 0 20px",
              background: "#e8eaf0",
              borderRadius: "16px",
              boxShadow: "inset 4px 4px 10px #c8cad4, inset -4px -4px 10px #ffffff"
            }}>
              {data.monthlySpend.map((m) => {
                const ht = Math.max(15, Math.round((m.spend / maxSpendVal) * 110));
                return (
                  <div 
                    key={m.month} 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      width: "40px" 
                    }}
                  >
                    {/* Bar tooltips/value */}
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#5b6af0", marginBottom: "4px" }}>
                      {formatLakhs(m.spend)}
                    </span>
                    
                    {/* Bar visual */}
                    <div style={{
                      width: "24px",
                      height: `${ht}px`,
                      background: "linear-gradient(180deg, #5b6af0 0%, #3b82f6 100%)",
                      borderRadius: "6px 6px 0 0",
                      boxShadow: "2px -2px 6px rgba(91,106,240,0.3)"
                    }}></div>
                    
                    {/* Bar Label */}
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a7f9a", marginTop: "6px" }}>
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
