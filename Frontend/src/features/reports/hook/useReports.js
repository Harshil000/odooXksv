import { useState, useCallback } from "react";
import { fetchReportsData } from "../services/reports.api";

export default function useReports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchReportsData();
      if (res.success) {
        setReportsData(res.data);
      } else {
        setError(res.message || "Failed to load reports data");
      }
      setError(null);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reportsData,
    loading,
    error,
    loadReports,
  };
}
