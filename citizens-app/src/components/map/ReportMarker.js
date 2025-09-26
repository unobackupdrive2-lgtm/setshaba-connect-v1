import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_CATEGORIES, REPORT_STATUSES } from '../../config/api';

const ReportMarker = ({ report, onPress }) => {
  const category = REPORT_CATEGORIES.find(cat => cat.value === report.category);
  const status = REPORT_STATUSES.find(stat => stat.value === report.status);

  const getMarkerColor = () => {
    switch (report.status) {
      case 'resolved': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'acknowledged': return '#2196F3';
      default: return '#F44336';
    }
  };

  const getCategoryIcon = () => {
    switch (report.category) {
      case 'water': return 'water';
      case 'electricity': return 'flash';
      case 'roads': return 'car';
      case 'waste': return 'trash';
      case 'safety': return 'shield';
      default: return 'help-circle';
    }
  };

  return (
    <Marker
      coordinate={{
        latitude: report.lat,
        longitude: report.lng,
      }}
      onPress={() => onPress(report)}
    >
      <View style={[styles.markerContainer, { backgroundColor: getMarkerColor() }]}>
        <Ionicons
          name={getCategoryIcon()}
          size={16}
          color="#fff"
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ReportMarker;