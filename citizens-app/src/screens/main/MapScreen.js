// screens/main/MapScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { renderGeoJSONPolygons, shouldRenderFeature } from "../../utils/mapUtils"; 
// adjust path based on where those utils live
import { theme } from "../../config/theme"; 

const MapScreen = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await fetch("http://your-api/wards");
        const data = await response.json();
        setWards(data);
      } catch (err) {
        console.error("Error fetching wards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {/* Example: render polygons */}
        {wards.map((feature, idx) =>
          shouldRenderFeature(feature) ? (
            renderGeoJSONPolygons(feature, idx) // this returns <Polygon />
          ) : null
        )}

        {/* Example: Add markers */}
        {wards.map((ward, idx) => (
          <Marker
            key={`marker-${idx}`}
            coordinate={{
              latitude: ward.center.lat,
              longitude: ward.center.lng,
            }}
            title={`Ward ${ward.id}`}
            description={ward.name}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
