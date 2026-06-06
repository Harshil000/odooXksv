import "./../styles/reports.scss";

const ReportsAnalytics = () => {
  const categorySpend = [
    { name: "IT Hardware", amount: "₹4.8L", width: "80%" },
    { name: "Furniture", amount: "₹3.2L", width: "60%" },
    { name: "Stationery", amount: "₹2.1L", width: "40%" },
    { name: "Logistics", amount: "₹2.3L", width: "45%" },
  ];

  const vendors = [
    {
      vendor: "TechCore Ltd",
      spend: "₹4,20,000",
      po: 6,
    },
    {
      vendor: "Infra Supplies",
      spend: "₹3,10,000",
      po: 4,
    },
    {
      vendor: "FastLog",
      spend: "₹2,40,000",
      po: 3,
    },
  ];

  const monthlyData = [35, 55, 48, 80, 65, 95];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Procurement Insights - May 2025</p>
        </div>

        <div className="reports-actions">
          <button>May 2025</button>
          <button>Export</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h2>12.4 L</h2>
          <p>Total Spend</p>
        </div>

        <div className="stat-card green">
          <h2>28</h2>
          <p>Active Vendors</p>
        </div>

        <div className="stat-card orange">
          <h2>94%</h2>
          <p>PO Fulfillment</p>
        </div>

        <div className="stat-card red">
          <h2>3</h2>
          <p>Overdue Invoices</p>
        </div>
      </div>

      <div className="reports-content">

        <div className="glass-card">
          <h3>Spend By Category</h3>

          {categorySpend.map((item) => (
            <div key={item.name} className="category-row">

              <div className="row-top">
                <span>{item.name}</span>
                <span>{item.amount}</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: item.width }}
                />
              </div>

            </div>
          ))}
        </div>

        <div className="glass-card">
          <h3>Top Vendors By Spend</h3>

          <table className="vendors-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Spend</th>
                <th>POs</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.vendor}>
                  <td>{vendor.vendor}</td>
                  <td>{vendor.spend}</td>
                  <td>{vendor.po}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="glass-card trend-card">
        <h3>Monthly Trend</h3>

        <div className="bar-chart">
          {monthlyData.map((value, index) => (
            <div className="bar-item" key={index}>
              <div
                className="bar"
                style={{
                  height: `${value}%`,
                }}
              />

              <span>
                {["Dec", "Jan", "Feb", "Mar", "Apr", "May"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;