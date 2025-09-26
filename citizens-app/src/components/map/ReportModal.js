import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../common/Button';
import { REPORT_CATEGORIES, REPORT_STATUSES } from '../../config/api';
import reportService from '../../services/reportService';

const ReportModal = ({ 
  visible, 
  report, 
  onClose, 
  onUpvote, 
  onViewDetails,
  currentUser 
}) => {
  const [upvoting, setUpvoting] = useState(false);

  if (!report) return null;

  const category = REPORT_CATEGORIES.find(cat => cat.value === report.category);
  const status = REPORT_STATUSES.find(stat => stat.value === report.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpvote = async () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to upvote reports');
      return;
    }

    if (report.created_by === currentUser.id) {
      Alert.alert('Error', 'You cannot upvote your own report');
      return;
    }

    try {
      setUpvoting(true);
      if (report.user_upvoted) {
        await reportService.removeUpvote(report.id);
      } else {
        await reportService.upvoteReport(report.id);
      }
      
      if (onUpvote) {
        onUpvote(report.id);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpvoting(false);
    }
  };

  const getAssignedOfficialInfo = () => {
    if (report.assigned_official_user) {
      return {
        name: report.assigned_official_user.name,
        email: report.assigned_official_user.email,
      };
    }
    return null;
  };

  const assignedOfficial = getAssignedOfficialInfo();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.reportHeader}>
            <View style={styles.categoryContainer}>
              <Ionicons 
                name={category?.icon || 'help-circle'} 
                size={20} 
                color="#2196F3" 
              />
              <Text style={styles.category}>{category?.label || 'Other'}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status?.color || '#666' }]}>
              <Text style={styles.statusText}>{status?.label || report.status}</Text>
            </View>
          </View>

          <Text style={styles.title}>{report.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{report.address}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{formatDate(report.created_at)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                {report.created_by_user?.name || 'Anonymous'}
              </Text>
            </View>
          </View>

          {report.photo_url && (
            <Image source={{ uri: report.photo_url }} style={styles.photo} />
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{report.description}</Text>
          </View>

          {assignedOfficial && (
            <View style={styles.assignedContainer}>
              <Text style={styles.sectionTitle}>Assigned Municipal Staff</Text>
              <View style={styles.officialCard}>
                <Ionicons name="person-circle-outline" size={24} color="#2196F3" />
                <View style={styles.officialInfo}>
                  <Text style={styles.officialName}>{assignedOfficial.name}</Text>
                  <Text style={styles.officialEmail}>{assignedOfficial.email}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.upvoteContainer}>
            <TouchableOpacity
              style={[styles.upvoteButton, report.user_upvoted && styles.upvotedButton]}
              onPress={handleUpvote}
              disabled={upvoting}
            >
              <Ionicons
                name={report.user_upvoted ? 'heart' : 'heart-outline'}
                size={20}
                color={report.user_upvoted ? '#fff' : '#F44336'}
              />
              <Text style={[
                styles.upvoteText,
                report.user_upvoted && styles.upvotedText
              ]}>
                {report.user_upvoted ? 'Upvoted' : 'Upvote'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.upvoteCount}>
              {report.upvote_count || 0} {(report.upvote_count || 0) === 1 ? 'upvote' : 'upvotes'}
            </Text>
          </View>

          <Button
            title="View Full Details"
            onPress={() => {
              onClose();
              if (onViewDetails) {
                onViewDetails(report);
              }
            }}
            style={styles.detailsButton}
          />
        </ScrollView>
      </View>
    </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 28,
  },
  metaContainer: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  assignedContainer: {
    marginBottom: 20,
  },
  officialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  officialInfo: {
    marginLeft: 12,
    flex: 1,
  },
  officialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  officialEmail: {
    fontSize: 12,
    color: '#666',
  },
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F44336',
    backgroundColor: '#fff',
  },
  upvotedButton: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  upvoteText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  upvotedText: {
    color: '#fff',
  },
  upvoteCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailsButton: {
    marginBottom: 20,
  },
});

export default ReportModal;