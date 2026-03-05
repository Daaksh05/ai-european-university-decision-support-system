/**
 * Advanced API Service for Frontend
 * ----------------------------------
 * Optional service file for frontend to call new v2 APIs.
 * 
 * Create this file at: frontend/src/services/advancedApiService.js
 * 
 * This service provides easy access to all new analytics endpoints.
 * Does not modify existing api.js - use alongside it.
 */

// Configuration
const API_BASE = process.env.REACT_APP_API_URL || "/api";
const API_V2_BASE = `${API_BASE}/v2`;

// Error handler
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Analytics Service
 * Provides access to all new v2 analytics endpoints
 */
export const analyticsService = {
  /**
   * Get comprehensive analytics summary for universities
   * 
   * @param {Array} universities - List of university objects
   * @returns {Promise} Analytics data
   * 
   * Example:
   * const summary = await analyticsService.getSummary(universities);
   */
  async getSummary(universities) {
    try {
      const response = await fetch(`${API_V2_BASE}/analytics/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ universities }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Analytics Summary Error:", error);
      throw error;
    }
  },

  /**
   * Analyze recommendation quality
   * 
   * @param {Array} recommendations - List of recommendation objects
   * @returns {Promise} Quality metrics
   */
  async analyzeRecommendations(recommendations) {
    try {
      const response = await fetch(`${API_V2_BASE}/analytics/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendations }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Recommendations Analysis Error:", error);
      throw error;
    }
  },

  /**
   * Get system performance metrics
   * 
   * @returns {Promise} Performance data
   */
  async getPerformance() {
    try {
      const response = await fetch(`${API_V2_BASE}/analytics/performance`);
      return handleResponse(response);
    } catch (error) {
      console.error("Performance Metrics Error:", error);
      throw error;
    }
  },

  /**
   * Compare multiple universities
   * 
   * @param {Array} universities - Universities to compare
   * @returns {Promise} Comparison data
   */
  async compareUniversities(universities) {
    try {
      const response = await fetch(`${API_V2_BASE}/analytics/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ universities }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("University Comparison Error:", error);
      throw error;
    }
  },

  /**
   * Cache analytics results locally
   * Useful for offline support
   */
  cacheResults(key, data) {
    try {
      localStorage.setItem(`analytics_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn("Cache storage error:", error);
    }
  },

  /**
   * Retrieve cached results
   * 
   * @param {string} key - Cache key
   * @param {number} maxAge - Max age in milliseconds
   * @returns {Object} Cached data or null
   */
  getCachedResults(key, maxAge = 300000) {
    try {
      const cached = localStorage.getItem(`analytics_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`analytics_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("Cache retrieval error:", error);
      return null;
    }
  },

  /**
   * Clear all cached analytics
   */
  clearCache() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('analytics_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Cache clear error:", error);
    }
  },
};

/**
 * Hook Usage Example (React Component):
 * 
 * import { useState, useEffect } from 'react';
 * import { analyticsService } from '../services/advancedApiService';
 * 
 * function AnalyticsDashboard() {
 *   const [analytics, setAnalytics] = useState(null);
 *   const [loading, setLoading] = useState(false);
 *   const [error, setError] = useState(null);
 * 
 *   const loadAnalytics = async (universities) => {
 *     setLoading(true);
 *     setError(null);
 *     
 *     try {
 *       const result = await analyticsService.getSummary(universities);
 *       setAnalytics(result.data);
 *       analyticsService.cacheResults('main', result.data);
 *     } catch (err) {
 *       setError(err.message);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       {loading && <p>Loading...</p>}
 *       {error && <p>Error: {error}</p>}
 *       {analytics && <p>Average Cost: €{analytics.cost_analysis.average}</p>}
 *       <button onClick={() => loadAnalytics(universityList)}>
 *         Load Analytics
 *       </button>
 *     </div>
 *   );
 * }
 */

export default analyticsService;
