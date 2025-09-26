import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_CATEGORIES, REPORT_STATUSES } from '../../config/api';

const MapFilters = ({ 
  selectedCategories = [], 
  selectedStatuses = [], 
  onCategoryToggle, 
  onStatusToggle,
  onClearFilters,
  style 
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedStatuses.length > 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Reports</Text>
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {REPORT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.filterChip,
                  selectedCategories.includes(category.value) && styles.activeChip,
                ]}
                onPress={() => onCategoryToggle(category.value)}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={selectedCategories.includes(category.value) ? '#fff' : '#2196F3'}
                />
                <Text
                  style={[
                    styles.chipText,
                    selectedCategories.includes(category.value) && styles.activeChipText,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {REPORT_STATUSES.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.filterChip,
                  selectedStatuses.includes(status.value) && {
                    backgroundColor: status.color,
                    borderColor: status.color,
                  },
                ]}
                onPress={() => onStatusToggle(status.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStatuses.includes(status.value) && styles.activeChipText,
                  ]}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#fff',
  },
  activeChip: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#fff',
  },
});

export default MapFilters;