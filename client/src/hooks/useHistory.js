import { useState, useEffect, useCallback } from "react";
import { getAllPPTs } from "@/services/pptService";

export function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPPTs();
      if (Array.isArray(data)) {
        setHistory(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    refreshHistory: fetchHistory,
  };
}
