import { useState, useEffect } from 'react';
import reportService from '../services/reportService';

export const useReports = (filters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
  });

  const fetchReports = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const combinedFilters = { ...filters, ...newFilters };
      const result = await reportService.getReports(combinedFilters);
      
      setReports(result.reports);
      setPagination({
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshReports = () => {
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchReports,
    refreshReports,
  };
};

export const useMyReports = (filters = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
  });

  const fetchMyReports = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const combinedFilters = { ...filters, ...newFilters };
      const result = await reportService.getMyReports(combinedFilters);
      
      setReports(result.reports);
      setPagination({
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshMyReports = () => {
    fetchMyReports();
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchMyReports,
    refreshMyReports,
  };
};

export const useReport = (reportId) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await reportService.getReportById(reportId);
      setReport(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const upvoteReport = async () => {
    try {
      await reportService.upvoteReport(reportId);
      // Update local state immediately for better UX
      setReport(prev => ({
        ...prev,
        user_upvoted: true,
        upvote_count: (prev.upvote_count || 0) + 1
      }));
      // Then fetch fresh data
      setTimeout(() => fetchReport(), 100);
    } catch (err) {
      throw err;
    }
  };

  const removeUpvote = async () => {
    try {
      await reportService.removeUpvote(reportId);
      // Update local state immediately for better UX
      setReport(prev => ({
        ...prev,
        user_upvoted: false,
        upvote_count: Math.max((prev.upvote_count || 0) - 1, 0)
      }));
      // Then fetch fresh data
      setTimeout(() => fetchReport(), 100);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  return {
    report,
    loading,
    error,
    fetchReport,
    upvoteReport,
    removeUpvote,
  };
};