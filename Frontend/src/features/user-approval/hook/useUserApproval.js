import { useState, useCallback } from "react";
import { fetchUsersList, updateUserStatus } from "../services/userApproval.api";

export default function useUserApproval() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const loadUsersList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsersList();
      setUsers(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load users list");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId, currentStatus) => {
    try {
      setError(null);
      setMessage(null);
      const updatedUser = await updateUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (Number(u.id) === Number(userId) ? updatedUser : u))
      );
      setMessage(`Successfully ${!currentStatus ? "activated" : "deactivated"} ${updatedUser.full_name}`);
      return updatedUser;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user status");
      throw err;
    }
  }, []);

  return {
    users,
    loading,
    error,
    message,
    loadUsersList,
    toggleUserStatus,
    setError,
    setMessage,
  };
}
