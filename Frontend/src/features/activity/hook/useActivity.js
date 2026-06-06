import { useState, useCallback } from "react";
import { fetchActivityLogs } from "../services/activity.api";

export default function useActivity() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchActivityLogs();
      setActivityLogs(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activityLogs,
    loading,
    error,
    loadActivities,
  };
}
