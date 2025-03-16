import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Don't try to use NativeAdsManager or other problematic components
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NativeAdBanner = () => {
  // Simple placeholder banner that won't cause crashes
  return (
    <View style={styles.container}>
      <View style={styles.adContent}>
        <Text style={styles.adLabel}>Ad</Text>
        <Text style={styles.adText}>Advertisement Space</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 1000,
  },
  adContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  adLabel: {
    position: 'absolute',
    top: 5,
    left: 10,
    fontSize: 12,
    color: '#777',
  },
  adText: {
    fontSize: 16,
    color: '#333',
  },
});

export default NativeAdBanner;