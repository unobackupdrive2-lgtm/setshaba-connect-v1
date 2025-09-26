import { API_BASE_URL } from '../config/api';
import { supabase } from '../config/supabase';

class WardService {
  async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  async searchWards(query, municipalityId = null) {
    try {
      const params = new URLSearchParams({ query });
      if (municipalityId) {
        params.append('municipality_id', municipalityId);
      }

      const response = await fetch(`${API_BASE_URL}/wards/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search wards');
      }

      return data.data.wards || [];
    } catch (error) {
      throw error;
    }
  }

  async getSimplifiedBoundaries(municipalityId = null, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
      if (municipalityId) {
        params.append('municipality_id', municipalityId);
      }

      const response = await fetch(`${API_BASE_URL}/wards/boundaries/simplified?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ward boundaries');
      }

      return data.data.geojson;
    } catch (error) {
      throw error;
    }
  }

  async getWardStatistics(municipalityId = null) {
    try {
      const headers = await this.getAuthHeaders();
      const params = new URLSearchParams();
      if (municipalityId) {
        params.append('municipality_id', municipalityId);
      }

      const response = await fetch(`${API_BASE_URL}/wards/statistics?${params}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ward statistics');
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  }

  // Geocoding service for address predictions
  async geocodeAddress(address) {
    try {
      // This would typically use a geocoding service like Google Maps or Mapbox
      // For now, we'll use a simple implementation
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
      );
      
      const data = await response.json();
      
      return data.map(item => ({
        address: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        place_id: item.place_id,
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      
      const data = await response.json();
      
      return {
        address: data.display_name,
        latitude,
        longitude,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        latitude,
        longitude,
      };
    }
  }
}

export default new WardService();