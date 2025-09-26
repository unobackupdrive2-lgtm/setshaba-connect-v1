import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const MapMarkerCluster = ({ coordinate, count, onPress }) => {
  const getClusterSize = (count) => {
    if (count < 10) return 'small';
    if (count < 50) return 'medium';
    return 'large';
  };

  const size = getClusterSize(count);

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={[styles.cluster, styles[size]]}>
        <Text style={[styles.clusterText, styles[`${size}Text`]]}>
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  cluster: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#fff',
  },
  small: {
    width: 30,
    height: 30,
  },
  medium: {
    width: 40,
    height: 40,
    backgroundColor: '#FF9800',
  },
  large: {
    width: 50,
    height: 50,
    backgroundColor: '#F44336',
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
});

export default MapMarkerCluster;