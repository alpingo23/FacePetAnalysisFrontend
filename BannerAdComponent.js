import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BannerAdComponent = ({ adUnitId }) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  const handleAdLoaded = () => {
    console.log('[BANNER_AD] Banner ad loaded successfully.');
    setIsAdLoaded(true);
    setAdFailed(false);
  };

  const handleAdFailed = (error) => {
    console.log('[BANNER_AD] Failed to load banner ad:', error);
    setIsAdLoaded(false);
    setAdFailed(true);
  };

  // Reklam başarısız olduğunda otomatik yeniden deneme (isteğe bağlı)
  useEffect(() => {
    if (adFailed) {
      const retryTimeout = setTimeout(() => {
        setAdFailed(false); // Yeniden denemek için durumu sıfırla
      }, 5000); // 5 saniye sonra yeniden dene
      return () => clearTimeout(retryTimeout);
    }
  }, [adFailed]);

  return (
    <View style={styles.container}>
      {(!isAdLoaded && !adFailed) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#333" />
          <Text style={styles.loadingText}>Loading Ad...</Text>
        </View>
      )}
      {adFailed ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load ad</Text>
        </View>
      ) : (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER} // 320x50 standart banner
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailed}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Banner yüksekliği 50px + biraz boşluk
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    color: '#333',
    fontSize: 14,
    marginTop: 5,
  },
  errorContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 14,
  },
});

export default BannerAdComponent;