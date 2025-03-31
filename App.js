import React, { useRef, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import calculateCompatibilityScore from './CompatibilityScore.js';
import {
  PermissionsAndroid,
  Linking,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
  Modal,
  AppState,
  StatusBar,
  Share,
  Clipboard,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import translations from './translations.json';
import CustomLanguageSelector from './CustomLanguageSelector';
import ResultsPopup from './ResultsPopup';
import { SafeAreaView } from 'react-native-safe-area-context';
import getStyles from './Styles.js';
import QuestionsStep from './QuestionsStep';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { InterstitialAd, AdEventType, BannerAdSize } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import BannerAdComponent from './BannerAdComponent.js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleSignIn from './GoogleSignIn';
import IntroScreens from './IntroScreens';
import PreviousResults from './PreviousResults';
import { initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { BlurView } from '@react-native-community/blur';

const dogTraits = require('./dogTraits.json');

// Firebase yapılandırması (Firebase Console'dan alın)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Firebase uygulamasını başlat
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('Firebase app already initialized');
    app = initializeApp(firebaseConfig, { name: '[DEFAULT]' });
  } else {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// Define COLORS and SHADOWS for dark mode only
const COLORS = {
  primary: '#6C63FF',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  success: '#2ECC71',
  warning: '#FF0000',
  danger: '#F25F5C',
  info: '#45B7D1',
  light: '#2C2F33',
  dark: '#FFFFFF',
  white: '#1E2124',
  teal: '#20C997',
  landmarkColors: { default: '#FFFFFF' },
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  colored: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  accent: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
};

// Initialize Mobile Ads SDK
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log('[AD] Google Mobile Ads initialized:', adapterStatuses);
  });

// Banner Ad birimini platforma göre belirliyoruz (Test ID'leri kullanıldı)
const bannerAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-3940256099942544/6300978111';

const CombinedAnalysisApp = () => {
  const [currentStep, setCurrentStep] = useState(0); // Step 0 is IntroScreens
  const [faceImage, setFaceImage] = useState(null);
  const [petImage, setPetImage] = useState(null);
  const [petFile, setPetFile] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [faceFile, setFaceFile] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [petResult, setPetResult] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState(null);
  const [petImageSize, setPetImageSize] = useState({ width: 1000, height: 700 });
  const [faceImageSize, setFaceImageSize] = useState({ width: 324, height: 324 });
  const [isLVisible, setIsLVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('uk');
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [userQuestions, setUserQuestions] = useState({
    hasLargeSpace: undefined,
    hoursAtHome: undefined,
    activeDays: undefined,
    hobbyTime: undefined,
    livingWith: undefined,
  });
  const [isPaid, setIsPaid] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [userId, setUserId] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [referredBy, setReferredBy] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);
 
  const interstitialAdRef = useRef(InterstitialAd.createForAdRequest(
    Platform.OS === 'ios' ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-3940256099942544/1033173712' // Test ID'leri
  ));

  const animationTimer = useRef(null);
  const blinkInterval = useRef(null);
  const [selectedPreviousResult, setSelectedPreviousResult] = useState(null);


  // Get styles with fixed dark theme
  const styles = getStyles(COLORS, SHADOWS);

  const uploadImageToStorage = async (imageData, userId, fileName) => {
    try {
      const reference = storage().ref(`users/${userId}/${fileName}`);
      await reference.putString(imageData, 'data_url');
      const url = await reference.getDownloadURL();
      console.log(`[STORAGE] Image uploaded successfully: ${url}`);
      return url;
    } catch (error) {
      console.error('[STORAGE] Error uploading image:', error);
      throw error;
    }
  };

  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const loadUserIdFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedReferralCode = await AsyncStorage.getItem('referralCode');
      const storedReferralCount = await AsyncStorage.getItem('referralCount');
      const storedReferredBy = await AsyncStorage.getItem('referredBy');

      if (storedUserId) {
        setUserId(storedUserId);
        setIsSignedIn(true);
        setReferralCode(storedReferralCode || generateReferralCode());
        setReferralCount(parseInt(storedReferralCount) || 0);
        setReferredBy(storedReferredBy || null);
        setIsProUnlocked((parseInt(storedReferralCount) || 0) >= 2);
        return storedUserId;
      }
      return null;
    } catch (error) {
      console.error('[ASYNC_STORAGE] Error loading user data:', error);
      return null;
    }
  };

  const saveUserIdToStorage = async (userId) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      console.log('[ASYNC_STORAGE] userId saved to AsyncStorage:', userId);
    } catch (error) {
      console.error('[ASYNC_STORAGE] Error saving userId to AsyncStorage:', error);
    }
  };

  const saveReferralData = async (userId, referralCode, referredBy = null) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set(
          {
            referralCode: referralCode,
            referredBy: referredBy,
            referralCount: 0,
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      await AsyncStorage.setItem('referralCode', referralCode);
      if (referredBy) {
        await AsyncStorage.setItem('referredBy', referredBy);
      }
    } catch (error) {
      console.error('[FIRESTORE] Error saving referral data:', error);
    }
  };

  const updateReferralCount = async (referrerId) => {
    try {
      console.log('[FIRESTORE] Updating referral count for user:', referrerId);
      
      // Firestore'da Transaction kullanarak güvenli bir şekilde sayacı artır
      await firestore().runTransaction(async (transaction) => {
        // Referrer kullanıcının dokümanını al
        const referrerRef = firestore().collection('users').doc(referrerId);
        const referrerDoc = await transaction.get(referrerRef);
        
        if (!referrerDoc.exists) {
          console.log('[FIRESTORE] Referrer document does not exist:', referrerId);
          throw new Error('Referrer document does not exist');
        }
        
        // Mevcut sayaç değerini al (değer yoksa 0 kullan)
        const currentCount = referrerDoc.data().referralCount || 0;
        const newCount = currentCount + 1;
        
        console.log(`[FIRESTORE] Updating count from ${currentCount} to ${newCount}`);
        
        // Dokümanı güncelle
        transaction.update(referrerRef, { referralCount: newCount });
        
        // Eğer bu kullanıcı, giriş yapmış olan kullanıcı ise, state'i de güncelle
        if (userId === referrerId) {
          console.log('[FIRESTORE] Updating current user state with new count:', newCount);
          setReferralCount(newCount);
          setIsProUnlocked(newCount >= 2);
          await AsyncStorage.setItem('referralCount', newCount.toString());
        }
      });
      
      console.log('[FIRESTORE] Referral count updated successfully');
      return true;
    } catch (error) {
      console.error('[FIRESTORE] Error updating referral count:', error);
      return false;
    }
  };

  const saveResult = async (userId, petImage, faceImage, { compatibility, faceResult, petResult }) => {
    try {
      const petImageUrl = await uploadImageToStorage(petImage, userId, `pet_${Date.now()}.jpg`);
      const faceImageUrl = await uploadImageToStorage(faceImage, userId, `face_${Date.now()}.jpg`);

      const result = {
        timestamp: firestore.FieldValue.serverTimestamp(),
        compatibilityScore: compatibility?.score || 0,
        petBreed: petResult?.predicted_label || 'Unknown',
        petImageUrl,
        faceImageUrl,
        details: compatibility?.details || [],
        faceResult: faceResult || null,
        petResult: petResult || null,
        userQuestions: userQuestions || null,
      };

      console.log('[saveResult] Saving to Firestore:', JSON.stringify(result, null, 2));

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('results')
        .add(result);

      console.log('Result saved to Firestore for user:', userId);
      return result;
    } catch (error) {
      console.error('Error saving result to Firestore:', error);
      throw error;
    }
  };

  const loadPreviousResults = async (userId) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('results')
        .orderBy('timestamp', 'desc')
        .get();

      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().getTime() : Date.now(),
        compatibilityScore: doc.data().compatibilityScore || 0,
        petBreed: doc.data().petBreed || 'Unknown',
        petImageUrl: doc.data().petImageUrl || null,
        faceImageUrl: doc.data().faceImageUrl || null,
        details: doc.data().details || [],
        faceResult: doc.data().faceResult || null,
        petResult: doc.data().petResult || null,
        userQuestions: doc.data().userQuestions || null,
      }));

      return results;
    } catch (error) {
      console.error('Error loading previous results from Firestore:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAppState = async () => {
      const storedUserId = await loadUserIdFromStorage();
      if (storedUserId) {
        try {
          const results = await loadPreviousResults(storedUserId);
          setPreviousResults(results);
          console.log('Previous results loaded on app start:', results);
        } catch (error) {
          console.error('[FIRESTORE] Error loading previous results on app start:', error);
        }
      }
    };

    initializeAppState();
  }, []);

  const handleSignInSuccess = async (userInfo) => {
    const newUserId = userInfo.userId;
    setUserId(newUserId);
    setIsSignedIn(true);
    await saveUserIdToStorage(newUserId);
    
    // Kullanıcının daha önce referral girip girmediğini kontrol et
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(newUserId)
        .get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Kullanıcının verileri varsa ve referredBy alanı doldurulmuşsa
        if (userData && (userData.referredBy || userData.referralCode)) {
          // Kullanıcının verilerini state'e yükle
          setReferralCode(userData.referralCode || generateReferralCode());
          setReferredBy(userData.referredBy || null);
          setReferralCount(userData.referralCount || 0);
          setIsProUnlocked((userData.referralCount || 0) >= 2);
          
          // Referral sayfasını atlayıp direkt Pet Upload adımına geç
          setCurrentStep(2);
        } else {
          // Referral verisi yoksa referral kodu giriş sayfasına yönlendir
          setCurrentStep(1.5);
        }
      } else {
        // Kullanıcı daha önce kaydedilmemişse referral kodu giriş sayfasına yönlendir
        setCurrentStep(1.5);
      }
    } catch (error) {
      console.error('Error checking user referral data:', error);
      // Hata durumunda da referral kodu giriş sayfasına yönlendir
      setCurrentStep(1.5);
    }
  };

  const handleReferralCodeSubmit = async () => {
    if (referredBy && referredBy.length !== 6) {
      Alert.alert(
        translations[language].invalidCode || "Invalid Code",
        translations[language].invalidCodeMessage || "Referral code must be 6 characters long."
      );
      return;
    }
    
    let userReferralCode = referralCode || generateReferralCode();
    setReferralCode(userReferralCode);

    await saveReferralData(userId, userReferralCode, referredBy);

    if (referredBy) {
      const referrerSnapshot = await firestore()
        .collection('users')
        .where('referralCode', '==', referredBy)
        .get();

      if (!referrerSnapshot.empty) {
        const referrerId = referrerSnapshot.docs[0].id;
        await updateReferralCount(referrerId);
      } else {
        Alert.alert(
          translations[language].invalidCode || "Invalid Code",
          translations[language].codeNotFound || "The referral code you entered does not exist."
        );
        return;
      }
    }
    
    setCurrentStep(2); // Proceed to Pet Upload step
  };

  const handleClosePopup = () => {
    setShowResultsPopup(false);
    setSelectedPreviousResult(null); // Seçilen önceki sonucu temizle

    setCurrentStep(2);
  };

  const handleSeeMoreDetails = () => {
    setShowResultsPopup(false);
    setCurrentStep(6);
  };

  useEffect(() => {
    blinkInterval.current = setInterval(() => {
      setIsLVisible((prev) => !prev);
    }, 500);

    const handleAppStateChange = (nextAppState) => {
      console.log('[APP] AppState changed to:', nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (blinkInterval.current) clearInterval(blinkInterval.current);
      if (animationTimer.current) cancelAnimationFrame(animationTimer.current);
      subscription.remove();
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 0) {
      const interstitialAd = interstitialAdRef.current;

      const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('[AD] Interstitial ad loaded successfully at:', Date.now());
        setIsAdLoaded(true);
        setIsAdLoading(false);
      });

      const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('[AD] Ad failed to load at:', Date.now(), 'Error:', error);
        setIsAdLoaded(false);
        setIsAdLoading(false);
        if (isProUnlocked) {
          setShowResultsPopup(true);
        } else {
          setCurrentStep(6);
        }
      });

      const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('[AD] Interstitial ad closed at:', Date.now());
        setIsAdLoaded(false);
        setIsAdLoading(true);
        if (isProUnlocked) {
          setShowResultsPopup(true);
        } else {
          setCurrentStep(6);
        }
        setTimeout(() => {
          console.log('[AD] Loading new interstitial ad after close at:', Date.now());
          interstitialAd.load();
        }, 100);
      });

      const unsubscribeOpened = interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        console.log('[AD] Interstitial ad opened at:', Date.now());
      });

      if (!isAdLoading && !isAdLoaded) {
        console.log('[AD] Initial loading of interstitial ad at:', Date.now());
        setIsAdLoading(true);
        interstitialAd.load();
      }

      return () => {
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
        unsubscribeOpened();
      };
    }
  }, [currentStep, isAdLoading, isAdLoaded, isProUnlocked]);

  const formatBreedName = (breed) => {
    if (!breed) return translations[language].unknown || 'Unknown';
    const breedPart = breed.split('-')[1] || breed;
    return breedPart.charAt(0).toUpperCase() + breedPart.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  const requestGalleryPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        const granted = await PermissionsAndroid.check(permission);
        if (granted) return true;

        const result = await PermissionsAndroid.request(permission, {
          title: translations[language].galleryPermissionTitle,
          message: translations[language].galleryPermissionMessage,
          buttonPositive: translations[language].allowButton,
          buttonNegative: translations[language].denyButton,
        });

        if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
        else {
          Alert.alert(
            translations[language].permissionDeniedTitle,
            translations[language].permissionDeniedMessage,
            [
              { text: translations[language].goToSettingsButton, onPress: () => Linking.openSettings() },
              { text: translations[language].cancelButton, style: 'cancel' },
            ]
          );
          return false;
        }
      } else if (Platform.OS === 'ios') {
        const permissionStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (permissionStatus === RESULTS.GRANTED) return true;

        if (permissionStatus === RESULTS.DENIED) {
          const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (result === RESULTS.GRANTED) return true;
        }

        Alert.alert(
          translations[language].permissionDeniedTitle,
          translations[language].permissionDeniedMessage,
          [
            { text: translations[language].goToSettingsButton, onPress: () => Linking.openSettings() },
            { text: translations[language].cancelButton, style: 'cancel' },
          ]
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error('Gallery permission error:', err);
      setError(translations[language].galleryPermissionError + err.message);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        const granted = await PermissionsAndroid.check(permission);
        if (granted) return true;

        const result = await PermissionsAndroid.request(permission, {
          title: translations[language].cameraPermissionTitle,
          message: translations[language].cameraPermissionMessage,
          buttonPositive: translations[language].allowButton,
          buttonNegative: translations[language].denyButton,
        });

        if (result === PermissionsAndroid.RESULTS.GRANTED) return true;
        else {
          Alert.alert(
            translations[language].permissionDeniedTitle,
            translations[language].permissionDeniedMessageCamera,
            [
              { text: translations[language].goToSettingsButton, onPress: () => Linking.openSettings() },
              { text: translations[language].cancelButton, style: 'cancel' },
            ]
          );
          return false;
        }
      } else if (Platform.OS === 'ios') {
        const permissionStatus = await check(PERMISSIONS.IOS.CAMERA);
        if (permissionStatus === RESULTS.GRANTED) return true;

        if (permissionStatus === RESULTS.DENIED) {
          const result = await request(PERMISSIONS.IOS.CAMERA);
          if (result === RESULTS.GRANTED) return true;
        }

        Alert.alert(
          translations[language].permissionDeniedTitle,
          translations[language].permissionDeniedMessageCamera,
          [
            { text: translations[language].goToSettingsButton, onPress: () => Linking.openSettings() },
            { text: translations[language].cancelButton, style: 'cancel' },
          ]
        );
        return false;
      }
      return true;
    } catch (err) {
      console.error('Camera permission error:', err);
      setError(translations[language].cameraPermissionError + err.message);
      return false;
    }
  };

  const handlePetUpload = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const options = { mediaType: 'photo', includeBase64: true };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setError(translations[language].imagePickerError + (response.errorMessage || 'Unknown error'));
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setPetFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'pet_image.jpg',
          width: asset.width,
          height: asset.height,
        });
        const petImageData = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setPetImage(petImageData);
        setPetImageSize({ width: asset.width, height: asset.height });
        setError(null);
      }
    });
  };

  const handleFaceUpload = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const options = { mediaType: 'photo', includeBase64: true };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setError(translations[language].imagePickerError + (response.errorMessage || 'Unknown error'));
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setFaceFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'face_image.jpg',
          width: asset.width,
          height: asset.height,
        });
        const faceImageData = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setFaceImage(faceImageData);
        setFaceImageSize({ width: asset.width, height: asset.height });
        setError(null);
      }
    });
  };

  const handlePetCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const options = { mediaType: 'photo', includeBase64: true };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setError(translations[language].cameraError + (response.errorMessage || 'Unknown error'));
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setPetFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'pet_image.jpg',
          width: asset.width,
          height: asset.height,
        });
        const petImageData = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setPetImage(petImageData);
        setPetImageSize({ width: asset.width, height: asset.height });
        setError(null);
      }
    });
  };

  const handleFaceCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const options = { mediaType: 'photo', includeBase64: true };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setError(translations[language].cameraError + (response.errorMessage || 'Unknown error'));
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setFaceFile({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'face_image.jpg',
          width: asset.width,
          height: asset.height,
        });
        const faceImageData = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setFaceImage(faceImageData);
        setFaceImageSize({ width: asset.width, height: asset.height });
        setError(null);
      }
    });
  };

  const analyzeFace = async () => {
    if (!faceImage || !faceFile) {
      setError(translations[language].errorFaceImageNotLoaded);
      return null;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: faceFile.uri,
        type: faceFile.type,
        name: faceFile.name,
      });

      const res = await axios.post('https://face-analysis-backend-3c9a9754c4c7.herokuapp.com/predict_face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageWidth = res.data.imageDimensions?.width || faceFile.width || 452;
      const imageHeight = res.data.imageDimensions?.height || faceFile.height || 678;
      const displayWidth = 300;
      const displayHeight = 300;

      const aspectRatio = imageWidth / imageHeight;
      let renderedWidth, renderedHeight, offsetX, offsetY;

      if (aspectRatio > 1) {
        renderedWidth = displayWidth;
        renderedHeight = displayWidth / aspectRatio;
        offsetX = 0;
        offsetY = (displayHeight - renderedHeight) / 2;
      } else {
        renderedHeight = displayHeight;
        renderedWidth = displayHeight * aspectRatio;
        offsetX = (displayWidth - renderedWidth) / 2;
        offsetY = 0;
      }

      const scaleX = renderedWidth / imageWidth;
      const scaleY = renderedHeight / imageHeight;

      const scaledLandmarks = res.data.landmarks?.map((lm) => ({
        x: lm.x * scaleX + offsetX,
        y: lm.y * scaleY + offsetY,
      })) || [];

      const scaledDetectionBox = res.data.detection?.box
        ? {
            x: res.data.detection.box.x * scaleX + offsetX,
            y: res.data.detection.box.y * scaleY + offsetY,
            width: res.data.detection.box.width * scaleX,
            height: res.data.detection.box.height * scaleY,
          }
        : { x: 0, y: 0, width: 0, height: 0 };

      const result = [
        {
          age: res.data.age || 30,
          gender: res.data.gender || 'Unknown',
          genderProbability: res.data.genderProbability || 0,
          expressions: res.data.expressions || {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            neutral: 0,
          },
          detection: { box: scaledDetectionBox },
          landmarks: scaledLandmarks,
        },
      ];

      setFaceResult(result);
      return result;
    } catch (err) {
      console.error('[ANALYSIS] Face Analysis Error:', err);
      setError(translations[language].faceBackendError + err.message);
      const defaultResult = [
        {
          age: 30,
          gender: 'Unknown',
          genderProbability: 0,
          expressions: {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
            neutral: 0,
          },
          detection: { box: { x: 0, y: 0, width: 0, height: 0 } },
          landmarks: [],
        },
      ];
      setFaceResult(defaultResult);
      return defaultResult;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzePet = async () => {
    if (!petImage || !petFile) {
      setError(translations[language].errorPetImageNotLoaded);
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: petFile.uri,
        type: petFile.type,
        name: petFile.name,
      });

      const res = await axios.post('https://pet-analysis-backend-1546ecd6728b.herokuapp.com/predict_pet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageWidth = petFile.width || 1000;
      const imageHeight = petFile.height || 700;
      const displayWidth = 300;
      const displayHeight = 300;

      const aspectRatio = imageWidth / imageHeight;
      let renderedWidth, renderedHeight, offsetX, offsetY;

      if (aspectRatio > 1) {
        renderedWidth = displayWidth;
        renderedHeight = displayWidth / aspectRatio;
        offsetX = 0;
        offsetY = (displayHeight - renderedHeight) / 2;
      } else {
        renderedHeight = displayHeight;
        renderedWidth = displayHeight * aspectRatio;
        offsetX = (displayWidth - renderedWidth) / 2;
        offsetY = 0;
      }

      const scaleX = renderedWidth / imageWidth;
      const scaleY = renderedHeight / imageHeight;

      const scaledDetectionBox = res.data.detection?.box
        ? {
            x: res.data.detection.box.x * scaleX + offsetX,
            y: res.data.detection.box.y * scaleY + offsetY,
            width: res.data.detection.box.width * scaleX,
            height: res.data.detection.box.height * scaleY,
          }
        : { x: 0, y: 0, width: 0, height: 0 };

      const dogBreed = res.data.predicted_label || 'Unknown';
      const dogData = dogTraits[dogBreed] || dogTraits['Unknown'];

      const result = {
        predicted_label: dogBreed,
        confidence: res.data.confidence || 0,
        detection: { box: scaledDetectionBox },
        energy: dogData.energy || 50,
        socialNeed: dogData.socialNeed || 50,
        independence: dogData.independence || 50,
        groomingNeed: dogData.groomingNeed || 50,
        spaceRequirement: dogData.spaceRequirement || 'medium',
        activityPreference: dogData.activityPreference || 'outdoor',
        temperament: dogData.temperament || 'Friendly',
        agePreference: dogData.agePreference || 30,
        traits: dogData.traits || ['Friendly', 'Energetic'],
        gender: res.data.gender || 'Unknown',
      };

      setPetResult(result);
      return result;
    } catch (err) {
      console.error('[ANALYSIS] Pet Analysis Error:', err);
      setError(translations[language].petBackendError + err.message);
      const defaultResult = {
        predicted_label: 'Unknown',
        confidence: 0,
        detection: { box: { x: 0, y: 0, width: 0, height: 0 } },
        energy: 50,
        socialNeed: 50,
        independence: 50,
        groomingNeed: 50,
        spaceRequirement: 'medium',
        activityPreference: 'outdoor',
        temperament: 'Friendly',
        agePreference: 30,
        traits: ['Friendly', 'Energetic'],
        gender: 'Unknown',
      };
      setPetResult(defaultResult);
      return defaultResult;
    }
  };

  const startAnalysis = async () => {
    if (!petImage) {
      setError(translations[language].errorUploadPetImage);
      return;
    }
    if (!faceImage) {
      setError(translations[language].errorUploadFaceImage);
      return;
    }
    setCurrentStep(4);
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    setCurrentStep(5);
    setAnalysisProgress(0);
    setError(null);

    let progress = 0;
    let apiCompleted = false;
    const animateInitialProgress = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!apiCompleted) {
            progress += 1;
            setAnalysisProgress(Math.min(progress, 99));
          }
          if (apiCompleted) {
            clearInterval(interval);
            resolve();
          }
        }, 500);
      });
    };

    const animationPromise = animateInitialProgress();
    const [faceDetections, petAnalysis] = await Promise.all([analyzeFace(), analyzePet()]);
    apiCompleted = true;

    await animationPromise;
    const preApiProgress = progress;

    if (!faceDetections || !petAnalysis) {
      setIsAnalyzing(false);
      setCurrentStep(4);
      setError(translations[language].errorAnalysisFailed || 'Analysis failed. Please try again.');
      return;
    }

    const compatibilityResult = calculateCompatibilityScore(petAnalysis, faceDetections, userQuestions);

    setFaceResult(faceDetections);
    setPetResult(petAnalysis);
    setCompatibility(compatibilityResult);

    if (userId) {
      try {
        const savedResult = await saveResult(userId, petImage, faceImage, {
          compatibility: compatibilityResult,
          faceResult: faceDetections,
          petResult: petAnalysis,
        });
        const updatedResults = await loadPreviousResults(userId);
        setPreviousResults(updatedResults);
        console.log('[FIRESTORE] Results saved and fetched successfully:', savedResult);
      } catch (firestoreError) {
        console.error('[FIRESTORE] Error during Firestore operations:', firestoreError);
        setError(translations[language].firestoreError || 'Failed to save results to Firestore.');
      }
    }

    const animateFinalProgress = () => {
      return new Promise((resolve) => {
        let finalProgress = preApiProgress;
        const remainingPercentage = 100 - finalProgress;
        const step = remainingPercentage / (5000 / 50);
        const interval = setInterval(() => {
          finalProgress += step;
          setAnalysisProgress(Math.min(Math.round(finalProgress), 100));
          if (finalProgress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    };

    await animateFinalProgress();
    setIsAnalyzing(false);

    if (isProUnlocked) {
      if (isAdLoaded && !isAdLoading) {
        try {
          interstitialAdRef.current.show();
        } catch (adError) {
          console.error('[AD] Error showing ad:', adError);
          setShowResultsPopup(true);
        }
      } else {
        setShowResultsPopup(true);
      }
    } else {
      if (isAdLoaded && !isAdLoading) {
        try {
          interstitialAdRef.current.show();
        } catch (adError) {
          console.error('[AD] Error showing ad:', adError);
          setCurrentStep(6);
        }
      } else {
        setCurrentStep(6);
      }
    }
  };

  const resetAnalysis = () => {
    setCurrentStep(2);
    setFaceImage(null);
    setPetImage(null);
    setPetFile(null);
    setFaceFile(null);
    setFaceResult(null);
    setPetResult(null);
    setCompatibility(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setError(null);
    setPetImageSize({ width: 1000, height: 700 });
    setFaceImageSize({ width: 324, height: 324 });
    setShowResultsPopup(false);
    setUserQuestions({
      hasLargeSpace: undefined,
      hoursAtHome: undefined,
      activeDays: undefined,
      hobbyTime: undefined,
      livingWith: undefined,
    });
    if (animationTimer.current) cancelAnimationFrame(animationTimer.current);
  };

  const connectFaceFeatures = (landmarks) => {
    const lines = [];
    const chin = landmarks.slice(0, 17);
    const leftEyebrow = landmarks.slice(17, 22);
    const rightEyebrow = landmarks.slice(22, 27);
    const noseBridge = landmarks.slice(27, 31);
    const noseTip = landmarks.slice(31, 36);
    const leftEye = landmarks.slice(36, 42);
    const rightEye = landmarks.slice(42, 48);
    const topLip = landmarks.slice(48, 60);
    const bottomLip = landmarks.slice(60, 68);

    const getNearestPoints = (point, allPoints, maxConnections = 6, excludeIndices = []) => {
      const distances = allPoints
        .map((p, i) => ({
          index: i,
          distance: Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2)),
        }))
        .filter((d) => !excludeIndices.includes(d.index))
        .sort((a, b) => a.distance - b.distance);
      return distances.slice(0, maxConnections).map((d) => d.index);
    };

    for (let i = 0; i < chin.length - 1; i++) lines.push([chin[i], chin[i + 1], COLORS.landmarkColors.default]);
    if (chin.length > 2) lines.push([chin[0], chin[chin.length - 1], COLORS.landmarkColors.default]);
    for (let i = 0; i < leftEyebrow.length - 1; i++) lines.push([leftEyebrow[i], leftEyebrow[i + 1], COLORS.landmarkColors.default]);
    for (let i = 0; i < rightEyebrow.length - 1; i++) lines.push([rightEyebrow[i], rightEyebrow[i + 1], COLORS.landmarkColors.default]);
    for (let i = 0; i < noseBridge.length - 1; i++) lines.push([noseBridge[i], noseBridge[i + 1], COLORS.landmarkColors.default]);
    if (noseBridge.length > 0 && noseTip.length > 0) lines.push([noseBridge[noseBridge.length - 1], noseTip[0], COLORS.landmarkColors.default]);
    for (let i = 0; i < noseTip.length - 1; i++) lines.push([noseTip[i], noseTip[i + 1], COLORS.landmarkColors.default]);
    if (noseTip.length > 2) lines.push([noseTip[0], noseTip[noseTip.length - 1], COLORS.landmarkColors.default]);
    if (leftEye.length === 6) {
      lines.push([leftEye[0], leftEye[1], COLORS.landmarkColors.default]);
      lines.push([leftEye[1], leftEye[2], COLORS.landmarkColors.default]);
      lines.push([leftEye[2], leftEye[3], COLORS.landmarkColors.default]);
      lines.push([leftEye[3], leftEye[4], COLORS.landmarkColors.default]);
      lines.push([leftEye[4], leftEye[5], COLORS.landmarkColors.default]);
      lines.push([leftEye[5], leftEye[0], COLORS.landmarkColors.default]);
    }
    if (rightEye.length === 6) {
      lines.push([rightEye[0], rightEye[1], COLORS.landmarkColors.default]);
      lines.push([rightEye[1], rightEye[2], COLORS.landmarkColors.default]);
      lines.push([rightEye[2], rightEye[3], COLORS.landmarkColors.default]);
      lines.push([rightEye[3], rightEye[4], COLORS.landmarkColors.default]);
      lines.push([rightEye[4], rightEye[5], COLORS.landmarkColors.default]);
      lines.push([rightEye[5], rightEye[0], COLORS.landmarkColors.default]);
    }
    if (topLip.length >= 12) {
      for (let i = 0; i < topLip.length - 1; i++) lines.push([topLip[i], topLip[i + 1], COLORS.landmarkColors.default]);
      lines.push([topLip[0], topLip[topLip.length - 1], COLORS.landmarkColors.default]);
    }
    if (bottomLip.length >= 8) {
      for (let i = 0; i < bottomLip.length - 1; i++) lines.push([bottomLip[i], bottomLip[i + 1], COLORS.landmarkColors.default]);
      lines.push([bottomLip[0], bottomLip[bottomLip.length - 1], COLORS.landmarkColors.default]);
    }

    landmarks.forEach((point, index) => {
      const connectedIndices = new Set();
      lines.forEach(([p1, p2]) => {
        if (p1 === point) connectedIndices.add(landmarks.indexOf(p2));
        if (p2 === point) connectedIndices.add(landmarks.indexOf(p1));
      });
      const currentConnections = connectedIndices.size;
      const neededConnections = Math.max(0, 6 - currentConnections);
      if (neededConnections > 0) {
        const nearestIndices = getNearestPoints(point, landmarks, neededConnections, [index, ...connectedIndices]);
        nearestIndices.forEach((nearestIndex) => {
          lines.push([point, landmarks[nearestIndex], COLORS.landmarkColors.default]);
        });
      }
    });

    if (chin.length > 0 && noseTip.length > 0) {
      chin.forEach((chinPoint, i) => {
        if (i % 2 === 0) lines.push([chinPoint, noseTip[Math.floor(noseTip.length / 2)], COLORS.landmarkColors.default]);
      });
    }
    if (chin.length > 0 && leftEyebrow.length > 0) {
      chin.slice(0, Math.floor(chin.length / 2)).forEach((chinPoint, i) =>
        lines.push([chinPoint, leftEyebrow[Math.floor(i / 2) % leftEyebrow.length], COLORS.landmarkColors.default])
      );
    }
    if (chin.length > 0 && rightEyebrow.length > 0) {
      chin.slice(Math.floor(chin.length / 2)).forEach((chinPoint, i) =>
        lines.push([chinPoint, rightEyebrow[Math.floor(i / 2) % rightEyebrow.length], COLORS.landmarkColors.default])
      );
    }
    if (noseTip.length > 0 && leftEyebrow.length > 0) {
      noseTip.forEach((nosePoint, i) => {
        if (i % 2 === 0) lines.push([nosePoint, leftEyebrow[Math.floor(i / 2) % leftEyebrow.length], COLORS.landmarkColors.default]);
      });
    }
    if (noseTip.length > 0 && rightEyebrow.length > 0) {
      noseTip.forEach((nosePoint, i) => {
        if (i % 2 === 0) lines.push([nosePoint, rightEyebrow[Math.floor(i / 2) % rightEyebrow.length], COLORS.landmarkColors.default]);
      });
    }

    return lines;
  };

  const renderIntroStep = () => (
    <IntroScreens
      onComplete={() => setCurrentStep(1)}
      language={language}
      translations={translations}
    />
  );

  const renderReferralCodeEntryPage = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>
          {translations[language].referralPromptTitle || "Do you have a referral code?"}
        </Text>
        <TextInput
          style={styles.referralInput}
          placeholder={translations[language].enterReferralCode || "Enter your code here"}
          placeholderTextColor="#888"
          onChangeText={(text) => setReferredBy(text.toUpperCase())}
          value={referredBy}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: '#6C63FF', 
            width: 150,
            paddingVertical: 12,
            paddingHorizontal: 0,
            borderRadius: 10,
            marginBottom: 15
          }]}
          onPress={async () => {
            // Referral kodu gerekmiyorsa direkt geç
            if (!referredBy || referredBy.trim() === '') {
              Alert.alert(
                translations[language].noCode || "No Referral Code",
                translations[language].enterCodeMessage || "Please enter a referral code or use the Skip button."
              );
              return;
            }

            // Referral kodu formatını kontrol et - 6 karakter olmalı
            if (referredBy.length !== 6) {
              Alert.alert(
                translations[language].invalidCode || "Invalid Code",
                translations[language].invalidCodeMessage || "Referral code must be 6 characters long."
              );
              return;
            }

            // Kendi kodunu referral olarak girmeyi engelle
            if (referralCode && referredBy === referralCode) {
              Alert.alert(
                translations[language].invalidCode || "Invalid Code",
                translations[language].cannotUseSelfCode || "You cannot use your own referral code."
              );
              return;
            }

            // Yükleniyor durumunu göster
            setIsLoading(true);

            try {
              // Firestore'da referral kodunu ara
              console.log('[REFERRAL] Searching for referrer with code:', referredBy);
              const querySnapshot = await firestore()
                .collection('users')
                .where('referralCode', '==', referredBy)
                .get();
              
              // Referral kodu bulunamadıysa uyarı göster
              if (querySnapshot.empty) {
                console.log('[REFERRAL] No referrer found with code:', referredBy);
                setIsLoading(false);
                Alert.alert(
                  translations[language].invalidCode || "Invalid Code",
                  translations[language].codeNotFound || "The referral code you entered does not exist."
                );
                return;
              }

              // Referral kodu bulundu, kullanıcı bilgilerini al
              const referrerDoc = querySnapshot.docs[0];
              const referrerId = referrerDoc.id;
              console.log('[REFERRAL] Found referrer ID:', referrerId);

              // Kendini referral etmeyi engelle
              if (referrerId === userId) {
                setIsLoading(false);
                Alert.alert(
                  translations[language].invalidCode || "Invalid Code",
                  translations[language].cannotReferSelf || "You cannot refer yourself."
                );
                return;
              }

              // Kullanıcının kendi referral kodunu oluştur veya mevcut kodu kullan
              let userReferralCode = referralCode || generateReferralCode();
              setReferralCode(userReferralCode);
              
              // Referral veren kullanıcının count değerini artır
              const referrerRef = firestore().collection('users').doc(referrerId);
              const referrerData = referrerDoc.data();
              const currentCount = referrerData.referralCount || 0;
              const newCount = currentCount + 1;
              
              console.log(`[REFERRAL] Updating count from ${currentCount} to ${newCount}`);
              
              // Referral verenin dokümanını güncelle
              await referrerRef.update({ 
                referralCount: newCount 
              });
              
              console.log('[REFERRAL] Referral count updated successfully');
              
              // Kullanıcının kendi referral bilgilerini kaydet
              await saveReferralData(userId, userReferralCode, referredBy);
              
              // İşlem tamamlandı, sonraki sayfaya geç
              setIsLoading(false);
              setCurrentStep(2);
              
            } catch (error) {
              console.error('[REFERRAL] Error during referral process:', error);
              setIsLoading(false);
              Alert.alert(
                translations[language].error || "Error",
                translations[language].generalError || "An error occurred. Please try again."
              );
            }
          }}
        >
          <Text style={styles.buttonText}>
            {translations[language].continue || "Continue"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 5,
            padding: 10
          }}
          onPress={async () => {
            // Skip - doğrudan ileri
            setIsLoading(true);
            
            try {
              // Kullanıcının kendi referral kodunu oluştur
              let userReferralCode = referralCode || generateReferralCode();
              setReferralCode(userReferralCode);
              
              // Null referral ile kaydet
              await saveReferralData(userId, userReferralCode, null);
              
              // İlerle
              setIsLoading(false);
              setCurrentStep(2);
            } catch (error) {
              console.error("[REFERRAL] Skip referral error:", error);
              setIsLoading(false);
              setCurrentStep(2); // Hata olsa bile ilerle
            }
          }}
        >
          <Text style={{
            color: '#888',
            fontSize: 16,
            textAlign: 'center'
          }}>
            {translations[language].skip || "Skip"}
          </Text>
        </TouchableOpacity>
        
        {/* Yükleniyor göstergesi */}
        {isLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        )}
      </View>
    );
  };

  const renderPetUploadStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{translations[language].step1Title}</Text>
      <View style={styles.uploadContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handlePetUpload}
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.actionButtonText}>{translations[language].uploadPetButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePetCamera}
            style={[styles.actionButton, { backgroundColor: COLORS.teal }]}
          >
            <Text style={styles.actionButtonText}>{translations[language].takePetPictureButton}</Text>
          </TouchableOpacity>
        </View>
        {petImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: petImage }} style={[styles.image, { width: 180, height: 180 }]} resizeMode="contain" />
          </View>
        )}
      </View>
      <Text style={styles.warningText}>{translations[language].petUploadWarning}</Text>
      {petImage && (
        <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.continueButton}>
          <Text style={styles.buttonText}>{translations[language].continueToFaceUpload}</Text>
        </TouchableOpacity>
      )}
      <PreviousResults
         results={previousResults}
         translations={translations}
         language={language}
         currentPetImage={petImage}
         currentFaceImage={faceImage}
         isProUnlocked={isProUnlocked} // Pro durumunu ilet
         referralCount={referralCount} // Referral sayısını ilet
         setCurrentStep={setCurrentStep} // renderResultsStep'e yönlendirmek için
         setShowResultsPopup={setShowResultsPopup} // Popup gösterme kontrolü
         setSelectedPreviousResult={setSelectedPreviousResult} // Seçilen sonucu iletmek için
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderFaceUploadStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{translations[language].step2Title}</Text>
      <View style={styles.uploadContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={handleFaceUpload}
            style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.actionButtonText}>{translations[language].uploadFaceButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFaceCamera}
            style={[styles.actionButton, { backgroundColor: COLORS.teal }]}
          >
            <Text style={styles.actionButtonText}>{translations[language].takeSelfieButton}</Text>
          </TouchableOpacity>
        </View>
        {faceImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: faceImage }} style={[styles.image, { width: 180, height: 180 }]} resizeMode="contain" />
          </View>
        )}
      </View>
      <Text style={styles.warningText}>{translations[language].faceUploadWarning}</Text>
      <View style={styles.buttonRow}>
        {faceImage && (
          <TouchableOpacity onPress={startAnalysis} style={styles.continueButton}>
            <Text style={styles.buttonText}>{translations[language].startAnalysisButton}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.backButton}>
          <Text style={styles.buttonText}>{translations[language].goBackButton}</Text>
        </TouchableOpacity>
      </View>
      <PreviousResults
        results={previousResults}
        translations={translations}
        language={language}
        currentPetImage={petImage}
        currentFaceImage={faceImage}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderQuestionsStep = () => (
    <QuestionsStep
      language={language}
      translations={translations}
      COLORS={COLORS}
      SHADOWS={SHADOWS}
      userQuestions={userQuestions}
      setUserQuestions={setUserQuestions}
      onContinue={analyzeImages}
      onBack={() => setCurrentStep(3)}
      faceResult={optimizedFaceResult}
      showStartAnalysisButton={true}
    />
  );

  const renderAnalysisStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{translations[language].analysisInProgressTitle}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${analysisProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{analysisProgress}% Complete</Text>
      </View>
      <View style={styles.analysisContainer}>
        <View style={styles.analysisItem}>
          <Text style={styles.analysisTitle}>{translations[language].faceAnalysisTitle}</Text>
          {faceImage ? (
            <View style={[styles.imageWrapper, {
              alignSelf: 'center',
              width: 300,
              height: 300,
              position: 'relative'
            }]}>
              <View style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderWidth: 3,
                borderColor: COLORS.dark,
                borderRadius: 20,
                zIndex: 1
              }} />
              <Image
                source={{ uri: faceImage }}
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 20
                }}
                resizeMode="contain"
              />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>{translations[language].analyzingText}</Text>
                </View>
              )}
              {!isLoading && faceResult && faceResult[0] && faceResult[0].detection && faceResult[0].landmarks && (
                <Svg height="300" width="300" style={styles.svgOverlay}>
                  {isLVisible && (
                    <>
                      <Path
                        d={`M${faceResult[0].detection.box.x},${faceResult[0].detection.box.y} L${faceResult[0].detection.box.x - 22},${faceResult[0].detection.box.y} L${faceResult[0].detection.box.x - 22},${faceResult[0].detection.box.y + 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResult[0].detection.box.x + faceResult[0].detection.box.width},${faceResult[0].detection.box.y} L${faceResult[0].detection.box.x + faceResult[0].detection.box.width + 22},${faceResult[0].detection.box.y} L${faceResult[0].detection.box.x + faceResult[0].detection.box.width + 22},${faceResult[0].detection.box.y + 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResult[0].detection.box.x},${faceResult[0].detection.box.y + faceResult[0].detection.box.height} L${faceResult[0].detection.box.x - 22},${faceResult[0].detection.box.y + faceResult[0].detection.box.height} L${faceResult[0].detection.box.x - 22},${faceResult[0].detection.box.y + faceResult[0].detection.box.height - 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResult[0].detection.box.x + faceResult[0].detection.box.width},${faceResult[0].detection.box.y + faceResult[0].detection.box.height} L${faceResult[0].detection.box.x + faceResult[0].detection.box.width + 22},${faceResult[0].detection.box.y + faceResult[0].detection.box.height} L${faceResult[0].detection.box.x + faceResult[0].detection.box.width + 22},${faceResult[0].detection.box.y + faceResult[0].detection.box.height - 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                    </>
                  )}
                  {faceResult[0].landmarks.map((point, index) => (
                    <Circle
                      key={`point-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="1.65"
                      fill={COLORS.landmarkColors.default}
                      stroke={COLORS.landmarkColors.default}
                      strokeWidth="1"
                    />
                  ))}
                  {faceResult[0].landmarks.length >= 68 &&
                    connectFaceFeatures(faceResult[0].landmarks).map((line, index) => {
                      const [p1, p2, strokeColor] = line;
                      return (
                        <Line
                          key={`line-${index}`}
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke={strokeColor}
                          strokeWidth="0.5"
                        />
                      );
                    })}
                </Svg>
              )}
            </View>
          ) : (
            <Text style={styles.errorText}>{translations[language].errorFaceImageNotAvailable}</Text>
          )}
        </View>
        <View style={styles.analysisItem}>
          <Text style={styles.analysisTitle}>{translations[language].petAnalysisTitle}</Text>
          {petImage ? (
            <View style={[styles.imageWrapper, {
              alignSelf: 'center',
              width: 300,
              height: 300,
              position: 'relative'
            }]}>
              <View style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderWidth: 3,
                borderColor: COLORS.dark,
                borderRadius: 20,
                zIndex: 1
              }} />
              <Image
                source={{ uri: petImage }}
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 20
                }}
                resizeMode="contain"
              />
              {petResult && petResult.detection && petResult.detection.box && (
                <View
                  style={{
                    position: 'absolute',
                    left: petResult.detection.box.x,
                    top: petResult.detection.box.y,
                    width: petResult.detection.box.width,
                    height: petResult.detection.box.height,
                    borderWidth: 2,
                    borderColor: COLORS.danger,
                    zIndex: 2
                  }}
                />
              )}
            </View>
          ) : (
            <Text style={styles.errorText}>{translations[language].errorPetImageNotAvailable}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderResultsStep = () => {
    // Eğer bir önceki sonuç seçilmişse onu kullan, yoksa mevcut analiz verilerini kullan
    const displayPetImage = selectedPreviousResult ? selectedPreviousResult.petImageUrl : petImage;
    const displayFaceImage = selectedPreviousResult ? selectedPreviousResult.faceImageUrl : faceImage;
    const displayPetBreed = selectedPreviousResult ? selectedPreviousResult.petBreed : petResult?.predicted_label;
    const displayCompatibilityScore = selectedPreviousResult ? selectedPreviousResult.compatibilityScore : compatibility?.score;
    const displayDetails = selectedPreviousResult ? selectedPreviousResult.details : compatibility?.details;
    const displayFaceResult = selectedPreviousResult ? selectedPreviousResult.faceResult : faceResult;
    const displayPetResult = selectedPreviousResult ? selectedPreviousResult.petResult : petResult;
  
    const formattedDetails = displayDetails
      ? displayDetails.map((detail) => ({
          title: detail.title[language]?.replace(' Compatibility', '') || detail.title,
          score: detail.score,
        }))
      : [];
  
    const faceAnalysis = displayFaceResult && displayFaceResult[0]
      ? {
          age: displayFaceResult[0].age || 30,
          expressions: displayFaceResult[0].expressions && typeof displayFaceResult[0].expressions === 'object'
            ? displayFaceResult[0].expressions
            : { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0 },
        }
      : {
          age: 30,
          expressions: { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0 },
        };
  
    const petAnalysis = displayPetResult
      ? {
          energy: displayPetResult.energy || 50,
          socialNeed: displayPetResult.socialNeed || 50,
          independence: displayPetResult.independence || 50,
          groomingNeed: displayPetResult.groomingNeed || 50,
        }
      : {
          energy: 50,
          socialNeed: 50,
          independence: 50,
          groomingNeed: 50,
        };
  
    const energyAndHappiness = Math.min(85 + (faceAnalysis.expressions.happy * 15), 96);
    const emotionAndExpression = Math.min(78 + (Object.values(faceAnalysis.expressions).reduce((sum, value) => sum + value, 0) * 2), 95);
    const environment = userQuestions.hoursAtHome === 'more_than_8' ? 88 : 79;
    const compatibilityScore = displayCompatibilityScore || Math.floor(Math.random() * 11) + 85;
  
    const randomTeaserInsights = [
      translations[language].teaserInsight1 || "We found a surprising energy match!",
      translations[language].teaserInsight2 || "Your expressions reveal a special connection",
      translations[language].teaserInsight3 || "You might need to adjust one key habit",
      translations[language].teaserInsight4 || "There's an unexpected personality alignment",
    ];
  
    const shuffledInsights = [...randomTeaserInsights].sort(() => 0.5 - Math.random());
    const selectedInsights = shuffledInsights.slice(0, 2);
  
    return (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: '#000' }]}
        contentContainerStyle={styles.stepContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.sparkleIcon}>✨</Text>
          <Text style={styles.resultsTitle}>{translations[language].magicMatchFound || "Your Magic Match!"}</Text>
          <View style={styles.scoreCircleContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{compatibilityScore}<Text style={styles.scorePercent}>%</Text></Text>
              <Text style={styles.scoreLabel}>{translations[language].compatibilityLabel || "MATCH"}</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.imagesComparisonContainer}>
          <View style={styles.imageWithLabel}>
            {displayFaceImage ? (
              <Image source={{ uri: displayFaceImage }} style={styles.circularProfileImage} resizeMode="cover" />
            ) : (
              <View style={styles.circularProfileImage} />
            )}
            <Text style={styles.imageLabel}>{translations[language].you || 'You'}</Text>
          </View>
  
          <View style={styles.heartContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
          </View>
  
          <View style={styles.imageWithLabel}>
            {displayPetImage ? (
              <Image source={{ uri: displayPetImage }} style={styles.circularProfileImage} resizeMode="cover" />
            ) : (
              <View style={styles.circularProfileImage} />
            )}
            <Text style={styles.imageLabel} numberOfLines={1}>
              {formatBreedName(displayPetBreed || '')}
            </Text>
          </View>
        </View>
  
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>{translations[language].keyInsightsTitle || "Key Insights Discovered:"}</Text>
          {selectedInsights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Text style={styles.insightIcon}>🔍</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
          <View style={styles.lockedInsightItem}>
            <Text style={styles.insightIcon}>🔒</Text>
            <Text style={styles.lockedInsightText}>{translations[language].lockedInsight || "3 more insights locked"}</Text>
          </View>
        </View>
  
        <Text style={styles.analysisTitle}>{translations[language].fullAnalysisTitle || "Your Complete Compatibility Analysis"}</Text>
  
        <View style={styles.blurredCategories}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].energyAndHappiness || 'Energy & Happiness'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{Math.round(energyAndHappiness)}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${energyAndHappiness}%`, backgroundColor: '#4A8FE7' }]} />
              </View>
            </View>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].perfectAge || 'Perfect Age Match'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>92%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: '92%', backgroundColor: '#6C63FF' }]} />
              </View>
            </View>
          </View>
  
          <View style={styles.categoryRow}>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].emotionAndExpression || 'Emotional Bond'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{Math.round(emotionAndExpression)}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${emotionAndExpression}%`, backgroundColor: '#9D65F9' }]} />
              </View>
            </View>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].environment || 'Living Environment'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{environment}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${environment}%`, backgroundColor: '#5271FF' }]} />
              </View>
            </View>
          </View>
        </View>
  
        <View style={styles.blurredCategories}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].energy || 'Energy Level'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{petAnalysis.energy + 30}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${petAnalysis.energy + 30}%`, backgroundColor: '#FF6B6B' }]} />
              </View>
            </View>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].socialNeed || 'Social Compatibility'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{petAnalysis.socialNeed + 25}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${petAnalysis.socialNeed + 25}%`, backgroundColor: '#FF8E53' }]} />
              </View>
            </View>
          </View>
  
          <View style={styles.categoryRow}>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].independence || 'Independence Match'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{petAnalysis.independence + 20}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${petAnalysis.independence + 20}%`, backgroundColor: '#45B7D1' }]} />
              </View>
            </View>
            <View style={styles.categoryColumn}>
              <Text style={styles.categoryTitleSmall}>{translations[language].groomingNeed || 'Care Compatibility'}</Text>
              <View style={styles.blurredScoreContainer}>
                <View style={styles.blurredScore}>
                  <Text style={styles.hiddenScoreText}>{petAnalysis.groomingNeed + 35}%</Text>
                  <View style={styles.fakeBlurOverlay} />
                </View>
              </View>
              <View style={styles.scoreProgressBar}>
                <View style={[styles.scoreProgress, { width: `${petAnalysis.groomingNeed + 35}%`, backgroundColor: '#4ECDC4' }]} />
              </View>
            </View>
          </View>
        </View>
  
        <View style={styles.lockOverlayContainer}>
          <Text style={styles.lockOverlayIcon}>🔒</Text>
          <Text style={styles.lockOverlayText}>{translations[language].unlockDetailedAnalysis || "Unlock your detailed analysis"}</Text>
        </View>
  
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>{translations[language].whatYouGet || "With Pro+ You'll Unlock:"}</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>{translations[language].benefit1 || "Complete compatibility breakdown"}</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>{translations[language].benefit2 || "Personalized care recommendations"}</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>{translations[language].benefit3 || "Unlimited future analyses"}</Text>
          </View>
        </View>
  
        <View style={styles.actionsButtonContainer}>
          <TouchableOpacity
            style={styles.getProButton}
            onPress={() => setShowResultsPopup(true)}
          >
            <Text style={styles.buttonText}>💪 {translations[language].getProButton || "Get Pro+ Now"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inviteFriendsButton}
            onPress={() => {
              setModalVisible(true); // Referral modalını aç
            }}
          >
            <Text style={styles.inviteFriendsButtonText}>
              {translations[language].inviteFriendsButton || "Invite 2 Friends to Unlock"}
            </Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.testimonialsContainer}>
          <Text style={styles.testimonialsTitle}>{translations[language].whatUsersSay || "What our users discovered:"}</Text>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "{translations[language].testimonial1 || "The analysis was spot on! I found out my dog and I share the exact same energy level."}"
            </Text>
            <Text style={styles.testimonialAuthor}>- Sarah, 32</Text>
          </View>
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "{translations[language].testimonial2 || "I was considering the wrong breed! Thanks to this analysis I found my perfect match."}"
            </Text>
            <Text style={styles.testimonialAuthor}>- James, 28</Text>
          </View>
        </View>
  
        <View style={{ height: 60 }} />
      </ScrollView>
    );
  };

  const CustomModal = () => {
    if (!modalVisible) return null;
    
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
        <View style={{
          width: '80%',
          backgroundColor: '#1E2124',
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
          }}>
            {translations[language].shareInviteCode || "Share Your Invite Code"}
          </Text>
          
          <Text style={{
            color: 'white',
            fontSize: 16,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            {translations[language].inviteFriendsToUnlock || "Invite 3 friends to unlock results"}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#2C2F33',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
              marginRight: 10,
            }}>{referralCode}</Text>
            
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(referralCode);
                Alert.alert(
                  translations[language].copied || "Copied!",
                  translations[language].codeCopied || "Referral code copied to clipboard"
                );
              }}
            >
              <Text style={{ fontSize: 24 }}>📋</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#6C63FF',
              padding: 15,
              borderRadius: 10,
              width: '100%',
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={() => {
              Share.share({
                message: `${translations[language].shareMessage || "Check out this app! Use my referral code to unlock your results:"} ${referralCode}`,
              });
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              {translations[language].share || "Share"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{
              color: '#FF6B6B',
              fontSize: 16,
            }}>
              {translations[language].close || "Close"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const optimizedFaceResult = useMemo(() => {
    if (!faceResult || !faceResult[0]) return null;
    const { landmarks, expressions, ...rest } = faceResult[0];
    const expressionsArray = expressions && typeof expressions === 'object'
      ? Object.entries(expressions).map(([key, value]) => ({
          expression: key,
          value: (value * 100).toFixed(1),
        }))
      : [];
    return [{ ...rest, landmarks: landmarks.slice(0, 10), expressions: expressionsArray }];
  }, [faceResult]);

  const popupProps = useMemo(() => {
    return {
      visible: showResultsPopup,
      onClose: handleClosePopup,
      onSeeMoreDetails: handleSeeMoreDetails,
      compatibilityScore: selectedPreviousResult ? selectedPreviousResult.compatibilityScore : compatibility?.score,
      details: selectedPreviousResult ? selectedPreviousResult.details : compatibility?.details,
      petImage,
      faceImage,
      petImageUrl: selectedPreviousResult ? selectedPreviousResult.petImageUrl : null,
      faceImageUrl: selectedPreviousResult ? selectedPreviousResult.faceImageUrl : null,
      petBreed: selectedPreviousResult ? selectedPreviousResult.petBreed : petResult?.predicted_label,
      translations,
      language,
      userQuestions: selectedPreviousResult ? selectedPreviousResult.userQuestions : userQuestions,
      faceResult: selectedPreviousResult ? selectedPreviousResult.faceResult : optimizedFaceResult,
      petResult: selectedPreviousResult ? selectedPreviousResult.petResult : petResult,
    };
  }, [
    showResultsPopup,
    compatibility?.score,
    compatibility?.details,
    petImage,
    faceImage,
    petResult?.predicted_label,
    language,
    userQuestions,
    optimizedFaceResult,
    petResult,
    selectedPreviousResult, // Bağımlılık listesine ekleyin
  ]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.headerContainer}>
        <View style={styles.languageContainer}>
          <CustomLanguageSelector language={language} setLanguage={setLanguage} />
        </View>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.main}>
          {currentStep === 0 && renderIntroStep()}
          {currentStep === 1 && <GoogleSignIn onSignInSuccess={handleSignInSuccess} />}
          {currentStep === 1.5 && renderReferralCodeEntryPage()}
          {currentStep === 2 && renderPetUploadStep()}
          {currentStep === 3 && renderFaceUploadStep()}
          {currentStep === 4 && renderQuestionsStep()}
          {currentStep === 5 && isAnalyzing && renderAnalysisStep()}
          {currentStep === 6 && renderResultsStep()}
        </View>
      </ScrollView>
      {currentStep !== 0 && <BannerAdComponent adUnitId={bannerAdUnitId} />}
      <ResultsPopup {...popupProps} />
      <CustomModal/>
    </SafeAreaView>
  );
};

const getScoreColor = (score) => {
  if (score < 45) return '#FF0000';
  if (score < 60) return '#FFFF00';
  if (score < 75) return '#FFA500';
  if (score < 85) return '#90EE90';
  return '#2ECC71';
};

export { app };
export default CombinedAnalysisApp;