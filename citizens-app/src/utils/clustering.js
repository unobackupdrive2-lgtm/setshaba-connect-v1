import SuperCluster from 'react-native-super-cluster';

export class ReportClusterer {
  constructor(options = {}) {
    this.superCluster = new SuperCluster({
      radius: options.radius || 60,
      maxZoom: options.maxZoom || 16,
      minZoom: options.minZoom || 0,
      minPoints: options.minPoints || 2,
      ...options
    });
  }

  load(reports) {
    // Transform reports to GeoJSON points
    const points = reports.map(report => ({
      type: 'Feature',
      properties: {
        cluster: false,
        reportId: report.id,
        report: report,
      },
      geometry: {
        type: 'Point',
        coordinates: [report.lng, report.lat]
      }
    }));

    this.superCluster.load(points);
  }

  getClusters(bbox, zoom) {
    return this.superCluster.getClusters(bbox, zoom);
  }

  getClusterExpansionZoom(clusterId) {
    return this.superCluster.getClusterExpansionZoom(clusterId);
  }

  getClusterChildren(clusterId) {
    return this.superCluster.getClusterChildren(clusterId);
  }

  getClusterLeaves(clusterId, limit = 10, offset = 0) {
    return this.superCluster.getClusterLeaves(clusterId, limit, offset);
  }
}

export const createReportClusters = (reports, bbox, zoom, options = {}) => {
  const clusterer = new ReportClusterer(options);
  clusterer.load(reports);
  return clusterer.getClusters(bbox, zoom);
};

export const getBoundingBox = (region) => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  
  return [
    longitude - longitudeDelta / 2, // west
    latitude - latitudeDelta / 2,   // south
    longitude + longitudeDelta / 2, // east
    latitude + latitudeDelta / 2    // north
  ];
};

export const getZoomLevel = (latitudeDelta) => {
  // Convert latitude delta to zoom level (approximate)
  return Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
};