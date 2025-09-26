import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ReportMarker from '../../components/map/ReportMarker';
import ReportModal from '../../components/map/ReportModal';
import MapFilters from '../../components/map/MapFilters';
import MapMarkerCluster from '../../components/map/MapMarkerCluster';
import { useLocation } from '../../hooks/useLocation';
import reportService from '../../services/reportService';
import wardService from '../../services/wardService';
import { useAuth } from '../../hooks/useAuth';

const { width, height } = Dimensions.get('window');
const CLUSTERING_RADIUS = 50; // pixels
const LOW_END_DEVICE_THRESHOLD = width * height < 1000000; // Rough threshold for low-end devices

const MapScreen = ({ navigation }) => {
  const [wardBoundaries, setWardBoundaries] = useState(null);
  const [reports, setReports] = useState([]);
  const [clusteredReports, setClusteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPolygons, setShowPolygons] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLowEndDevice] = useState(LOW_END_DEVICE_THRESHOLD);
  const [mapRegion, setMapRegion] = useState({
    latitude: -26.2041,
    longitude: 28.0473,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const { getCurrentLocation } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    loadMapData();
  }, []);

  useEffect(() => {
    clusterReports();
  }, [reports, selectedCategories, selectedStatuses]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load reports
      const reportsData = await reportService.getReports({ limit: 100 });
      setReports(reportsData.reports);

      // Load ward boundaries if not on low-end device
      if (!isLowEndDevice) {
        try {
          const boundaries = await wardService.getSimplifiedBoundaries(null, 50);
          setWardBoundaries(boundaries);
        } catch (boundaryError) {
          console.log('Could not load ward boundaries:', boundaryError.message);
        }
      }

      // Try to get user's current location
      try {
        const location = await getCurrentLocation();
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      } catch (locationError) {
        console.log('Could not get current location:', locationError.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clusterReports = () => {
    let filteredReports = reports;

    // Apply filters
    if (selectedCategories.length > 0) {
      filteredReports = filteredReports.filter(report => 
        selectedCategories.includes(report.category)
      );
    }

    if (selectedStatuses.length > 0) {
      filteredReports = filteredReports.filter(report => 
        selectedStatuses.includes(report.status)
      );
    }

    // Simple clustering algorithm
    const clusters = [];
    const processed = new Set();

    filteredReports.forEach((report, index) => {
      if (processed.has(index)) return;

      const cluster = {
        id: `cluster-${index}`,
        coordinate: {
          latitude: report.lat,
          longitude: report.lng,
        },
        reports: [report],
      };

      // Find nearby reports
      filteredReports.forEach((otherReport, otherIndex) => {
        if (index === otherIndex || processed.has(otherIndex)) return;

        const distance = getDistance(
          report.lat, report.lng,
          otherReport.lat, otherReport.lng
        );

        // If reports are close enough, add to cluster
        if (distance < 0.01) { // ~1km threshold
          cluster.reports.push(otherReport);
          processed.add(otherIndex);
        }
      });

      processed.add(index);
      clusters.push(cluster);
    });

    setClusteredReports(clusters);
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleReportPress = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleClusterPress = (cluster) => {
    if (cluster.reports.length === 1) {
      handleReportPress(cluster.reports[0]);
    } else {
      // Zoom to cluster area
      const latitudes = cluster.reports.map(r => r.lat);
      const longitudes = cluster.reports.map(r => r.lng);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDelta = (maxLat - minLat) * 1.5;
      const lngDelta = (maxLng - minLng) * 1.5;
      
      setMapRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      });
    }
  };

  const handleUpvote = async (reportId) => {
    try {
      // Refresh reports to get updated upvote counts
      const reportsData = await reportService.getReports({ limit: 100 });
      setReports(reportsData.reports);
      
      // Update selected report if it's the one being upvoted
      if (selectedReport && selectedReport.id === reportId) {
        const updatedReport = reportsData.reports.find(r => r.id === reportId);
        if (updatedReport) {
          setSelectedReport(updatedReport);
        }
      }
    } catch (error) {
      console.error('Error refreshing reports after upvote:', error);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
  };

  const renderWardPolygons = () => {
    if (!showPolygons || !wardBoundaries || isLowEndDevice) {
      return null;
    }

    return wardBoundaries.features?.map((feature, index) => {
      if (!feature.geometry || !feature.geometry.coordinates) {
        return null;
      }

      try {
        const coordinates = feature.geometry.coordinates[0].map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        return (
          <Polygon
            key={`ward-${feature.properties.ward_id}-${index}`}
            coordinates={coordinates}
            strokeColor="rgba(33, 150, 243, 0.8)"
            strokeWidth={1}
            fillColor="rgba(33, 150, 243, 0.05)"
          />
        );
      } catch (error) {
        console.log('Error rendering polygon for ward:', feature.properties.name);
        return null;
      }
    });
  };

  const renderMarkers = () => {
    return clusteredReports.map((cluster) => {
      if (cluster.reports.length === 1) {
        return (
          <ReportMarker
            key={cluster.reports[0].id}
            report={cluster.reports[0]}
            onPress={handleReportPress}
          />
        );
      } else {
        return (
          <MapMarkerCluster
            key={cluster.id}
            coordinate={cluster.coordinate}
            count={cluster.reports.length}
            onPress={() => handleClusterPress(cluster)}
          />
        );
      }
    ));
  };

  if (loading) {
    return <LoadingSpinner message="Loading map data..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadMapData}
        retryText="Retry"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Map</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={showFilters ? '#2196F3' : '#666'} 
            />
          </TouchableOpacity>
          {!isLowEndDevice && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowPolygons(!showPolygons)}
            >
              <Ionicons 
                name="map" 
                size={20} 
                color={showPolygons ? '#2196F3' : '#666'} 
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={loadMapData}
          >
            <Ionicons name="refresh" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <MapFilters
          selectedCategories={selectedCategories}
          selectedStatuses={selectedStatuses}
          onCategoryToggle={handleCategoryToggle}
          onStatusToggle={handleStatusToggle}
          onClearFilters={handleClearFilters}
        />
      )}

      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        maxZoomLevel={18}
        minZoomLevel={8}
      >
        {renderWardPolygons()}
        {renderMarkers()}
      </MapView>

      <ReportModal
        visible={modalVisible}
        report={selectedReport}
        onClose={() => {
          setModalVisible(false);
          setSelectedReport(null);
        }}
        onUpvote={handleUpvote}
        onViewDetails={(report) => {
          navigation.navigate('ReportDetail', { reportId: report.id });
        }}
        currentUser={user}
      />

      {!showFilters && (
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>
            {clusteredReports.length} {clusteredReports.length === 1 ? 'Report' : 'Reports'}
          </Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.viewAllText}>View All Reports</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  viewAllButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapScreen;