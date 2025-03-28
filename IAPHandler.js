import * as RNIap from 'react-native-iap';
import { Alert, Platform } from 'react-native';

const itemSkus = Platform.select({
  ios: ['detailed_results_299'], // App Store’da tanımlı ürün ID’si
  android: ['detailed_results_299'], // Google Play’de tanımlı ürün ID’si
});

const initializeIAP = async () => {
  try {
    await RNIap.initConnection();
    console.log('[IAP] In-App Purchase initialized');
  } catch (err) {
    console.error('[IAP] Error initializing IAP:', err);
  }
};

const purchaseDetailedResults = async (setIsPaid) => {
  try {
    const products = await RNIap.getProducts(itemSkus);
    if (products.length === 0) {
      Alert.alert('Hata', 'Ürün bulunamadı.');
      return;
    }
    await RNIap.requestPurchase(itemSkus[0]);
    setIsPaid(true); // Ödeme başarılıysa durumu güncelle
    console.log('[IAP] Purchase successful');
  } catch (err) {
    console.error('[IAP] Purchase error:', err);
    Alert.alert('Hata', 'Ödeme işlemi başarısız oldu: ' + err.message);
  }
};

const cleanupIAP = () => {
  RNIap.endConnection();
};

export { initializeIAP, purchaseDetailedResults, cleanupIAP };