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
  SafeAreaView,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import translations from './translations.json';
import CustomLanguageSelector from './CustomLanguageSelector';
import ResultsPopup from './ResultsPopup';
import QuestionsStep from './QuestionsStep'; // Yeni soru bileşeni
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { InterstitialAd, AdEventType, BannerAdSize } from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import BannerAdComponent from './BannerAdComponent.js';

// Screen width for responsive design
const SCREEN_WIDTH = Dimensions.get('window').width;

// Define COLORS and SHADOWS
const COLORS = {
  light: {
    primary: '#6C63FF',
    secondary: '#4ECDC4',
    accent: '#FF6B6B',
    success: '#2ECC71',
    warning: '#FF0000',
    danger: '#F25F5C',
    info: '#45B7D1',
    light: '#F8F9FA',
    dark: '#343A40',
    white: '#FFFFFF',
    teal: '#20C997',
    landmarkColors: { default: '#FFFFFF' },
  },
  dark: {
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
  },
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
    shadowColor: COLORS.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  accent: {
    shadowColor: COLORS.light.accent,
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

// Banner Ad birimini platforma göre belirliyoruz
const bannerAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-8034970392301400/5715662429' : 'ca-app-pub-8034970392301400/3849451955';

const CombinedAnalysisApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [faceImage, setFaceImage] = useState(null);
  const [petImage, setPetImage] = useState(null);
  const [petFile, setPetFile] = useState(null);
  const [faceFile, setFaceFile] = useState(null);
  const [faceResults, setFaceResults] = useState(null);
  const [petResults, setPetResults] = useState(null);
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
  const [theme, setTheme] = useState('light');
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [userQuestions, setUserQuestions] = useState({
    hasLargeSpace: undefined,
    hoursAtHome: undefined,
    activeDays: undefined,
    hobbyTime: undefined,
    livingWith: undefined,
  });

  // Interstitial Ad (useRef ile sabit tutuyoruz)
  const interstitialAdRef = useRef(InterstitialAd.createForAdRequest(
    Platform.OS === 'ios' ? 'ca-app-pub-8034970392301400/2845956506' : 'ca-app-pub-8034970392301400/9435114266'
  ));

  const animationTimer = useRef(null);
  const blinkInterval = useRef(null);

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
  }, []);

  // Interstitial Ad Event Listeners
  useEffect(() => {
    const interstitialAd = interstitialAdRef.current;

    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[AD] Interstitial ad loaded successfully.');
      setIsAdLoaded(true);
      setIsAdLoading(false);
    });

    const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[AD] Ad failed to load:', error);
      setIsAdLoaded(false);
      setIsAdLoading(false);
      setShowResultsPopup(true);
    });

    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[AD] Interstitial ad closed.');
      setIsAdLoaded(false);
      setIsAdLoading(true);
      setShowResultsPopup(true);
      setTimeout(() => {
        console.log('[AD] Loading new interstitial ad after close...');
        interstitialAd.load();
      }, 100);
    });

    const unsubscribeOpened = interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log('[AD] Interstitial ad opened.');
    });

    if (!isAdLoading && !isAdLoaded) {
      console.log('[AD] Initial loading of interstitial ad...');
      setIsAdLoading(true);
      interstitialAd.load();
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      unsubscribeOpened();
    };
  }, []);

  const formatBreedName = (breed) => {
    if (!breed) return '';
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

      const scaledLandmarks = res.data.landmarks.map((lm) => ({
        x: lm.x * scaleX + offsetX,
        y: lm.y * scaleY + offsetY,
      }));

      const scaledDetectionBox = {
        x: res.data.detection.box.x * scaleX + offsetX,
        y: res.data.detection.box.y * scaleY + offsetY,
        width: res.data.detection.box.width * scaleX,
        height: res.data.detection.box.height * scaleY,
      };

      const result = [
        {
          age: res.data.age,
          gender: res.data.gender,
          genderProbability: res.data.genderProbability,
          expressions: res.data.expressions,
          detection: { box: scaledDetectionBox },
          landmarks: scaledLandmarks,
        },
      ];

      setFaceResults(result);
      return result;
    } catch (err) {
      console.error('[ANALYSIS] Face Analysis Error:', err);
      setError(translations[language].faceBackendError + err.message);
      return null;
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

      const scaledDetectionBox = {
        x: res.data.detection.box.x * scaleX + offsetX,
        y: res.data.detection.box.y * scaleY + offsetY,
        width: res.data.detection.box.width * scaleX,
        height: res.data.detection.box.height * scaleY,
      };

      const result = {
        ...res.data,
        detection: { box: scaledDetectionBox },
      };

      setPetResults(result);
      return result;
    } catch (err) {
      console.error('[ANALYSIS] Pet Analysis Error:', err);
      setError(translations[language].petBackendError + err.message);
      return null;
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
    setCurrentStep(3); // Soru adımına geçiş
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    setCurrentStep(4); // Analysis adımına geçiş
    setAnalysisProgress(0);
    setError(null);

    const [faceDetections, petResult] = await Promise.all([analyzeFace(), analyzePet()]);
    if (!faceDetections || !petResult) {
      setIsAnalyzing(false);
      setCurrentStep(3); // Sorulara geri dön
      return;
    }

    const compatibilityResult = calculateCompatibilityScore(petResult, faceDetections, userQuestions);
    setCompatibility(compatibilityResult);

    let frameCount = 0;
    const animate = () => {
      const progress = Math.min(100, (frameCount / 600) * 100);
      setAnalysisProgress(Math.floor(progress));
      frameCount++;
      if (progress < 100) {
        animationTimer.current = requestAnimationFrame(animate);
      } else {
        setIsAnalyzing(false);
        console.log('[ANALYSIS] Analysis completed. Checking ad status...');

        if (isAdLoaded && !isAdLoading) {
          console.log('[AD] Showing interstitial ad...');
          try {
            interstitialAdRef.current.show();
          } catch (adError) {
            console.error('[AD] Error showing ad:', adError);
            setShowResultsPopup(true);
          }
        } else {
          console.log('[AD] Ad not loaded or still loading, showing ResultsPopup after 5s timeout...');
          setTimeout(() => {
            setShowResultsPopup(true);
          }, 5000);
        }
        setCurrentStep(5); // Sonuç adımına geçiş
      }
    };
    animate();
  };

  const resetAnalysis = () => {
    setCurrentStep(1);
    setFaceImage(null);
    setPetImage(null);
    setPetFile(null);
    setFaceFile(null);
    setFaceResults(null);
    setPetResults(null);
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

    for (let i = 0; i < chin.length - 1; i++) lines.push([chin[i], chin[i + 1], COLORS[theme].landmarkColors.default]);
    if (chin.length > 2) lines.push([chin[0], chin[chin.length - 1], COLORS[theme].landmarkColors.default]);
    for (let i = 0; i < leftEyebrow.length - 1; i++) lines.push([leftEyebrow[i], leftEyebrow[i + 1], COLORS[theme].landmarkColors.default]);
    for (let i = 0; i < rightEyebrow.length - 1; i++) lines.push([rightEyebrow[i], rightEyebrow[i + 1], COLORS[theme].landmarkColors.default]);
    for (let i = 0; i < noseBridge.length - 1; i++) lines.push([noseBridge[i], noseBridge[i + 1], COLORS[theme].landmarkColors.default]);
    if (noseBridge.length > 0 && noseTip.length > 0) lines.push([noseBridge[noseBridge.length - 1], noseTip[0], COLORS[theme].landmarkColors.default]);
    for (let i = 0; i < noseTip.length - 1; i++) lines.push([noseTip[i], noseTip[i + 1], COLORS[theme].landmarkColors.default]);
    if (noseTip.length > 2) lines.push([noseTip[0], noseTip[noseTip.length - 1], COLORS[theme].landmarkColors.default]);
    if (leftEye.length === 6) {
      lines.push([leftEye[0], leftEye[1], COLORS[theme].landmarkColors.default]);
      lines.push([leftEye[1], leftEye[2], COLORS[theme].landmarkColors.default]);
      lines.push([leftEye[2], leftEye[3], COLORS[theme].landmarkColors.default]);
      lines.push([leftEye[3], leftEye[4], COLORS[theme].landmarkColors.default]);
      lines.push([leftEye[4], leftEye[5], COLORS[theme].landmarkColors.default]);
      lines.push([leftEye[5], leftEye[0], COLORS[theme].landmarkColors.default]);
    }
    if (rightEye.length === 6) {
      lines.push([rightEye[0], rightEye[1], COLORS[theme].landmarkColors.default]);
      lines.push([rightEye[1], rightEye[2], COLORS[theme].landmarkColors.default]);
      lines.push([rightEye[2], rightEye[3], COLORS[theme].landmarkColors.default]);
      lines.push([rightEye[3], rightEye[4], COLORS[theme].landmarkColors.default]);
      lines.push([rightEye[4], rightEye[5], COLORS[theme].landmarkColors.default]);
      lines.push([rightEye[5], rightEye[0], COLORS[theme].landmarkColors.default]);
    }
    if (topLip.length >= 12) {
      for (let i = 0; i < topLip.length - 1; i++) lines.push([topLip[i], topLip[i + 1], COLORS[theme].landmarkColors.default]);
      lines.push([topLip[0], topLip[topLip.length - 1], COLORS[theme].landmarkColors.default]);
    }
    if (bottomLip.length >= 8) {
      for (let i = 0; i < bottomLip.length - 1; i++) lines.push([bottomLip[i], bottomLip[i + 1], COLORS[theme].landmarkColors.default]);
      lines.push([bottomLip[0], bottomLip[bottomLip.length - 1], COLORS[theme].landmarkColors.default]);
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
          lines.push([point, landmarks[nearestIndex], COLORS[theme].landmarkColors.default]);
        });
      }
    });

    if (chin.length > 0 && noseTip.length > 0) {
      chin.forEach((chinPoint, i) => {
        if (i % 2 === 0) lines.push([chinPoint, noseTip[Math.floor(noseTip.length / 2)], COLORS[theme].landmarkColors.default]);
      });
    }
    if (chin.length > 0 && leftEyebrow.length > 0) {
      chin.slice(0, Math.floor(chin.length / 2)).forEach((chinPoint, i) =>
        lines.push([chinPoint, leftEyebrow[Math.floor(i / 2) % leftEyebrow.length], COLORS[theme].landmarkColors.default])
      );
    }
    if (chin.length > 0 && rightEyebrow.length > 0) {
      chin.slice(Math.floor(chin.length / 2)).forEach((chinPoint, i) =>
        lines.push([chinPoint, rightEyebrow[Math.floor(i / 2) % rightEyebrow.length], COLORS[theme].landmarkColors.default])
      );
    }
    if (noseTip.length > 0 && leftEyebrow.length > 0) {
      noseTip.forEach((nosePoint, i) => {
        if (i % 2 === 0) lines.push([nosePoint, leftEyebrow[Math.floor(i / 2) % leftEyebrow.length], COLORS[theme].landmarkColors.default]);
      });
    }
    if (noseTip.length > 0 && rightEyebrow.length > 0) {
      noseTip.forEach((nosePoint, i) => {
        if (i % 2 === 0) lines.push([nosePoint, rightEyebrow[Math.floor(i / 2) % rightEyebrow.length], COLORS[theme].landmarkColors.default]);
      });
    }

    return lines;
  };

  const renderPetUploadStep = () => (
    <View style={getStyles().stepContainer}>
      <Text style={getStyles().stepTitle}>{translations[language].step1Title}</Text>
      <View style={getStyles().uploadContainer}>
        <View style={getStyles().buttonRow}>
          <TouchableOpacity
            onPress={handlePetUpload}
            style={[getStyles().actionButton, { backgroundColor: COLORS[theme].primary }]}
          >
            <Text style={getStyles().actionButtonText}>{translations[language].uploadPetButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePetCamera}
            style={[getStyles().actionButton, { backgroundColor: COLORS[theme].teal }]}
          >
            <Text style={getStyles().actionButtonText}>{translations[language].takePetPictureButton}</Text>
          </TouchableOpacity>
        </View>
        {petImage && (
          <View style={getStyles().imageContainer}>
            <Image source={{ uri: petImage }} style={[getStyles().image, { width: 180, height: 180 }]} resizeMode="contain" />
          </View>
        )}
      </View>
      <Text style={getStyles().warningText}>{translations[language].petUploadWarning}</Text>
      {petImage && (
        <TouchableOpacity onPress={() => setCurrentStep(2)} style={getStyles().continueButton}>
          <Text style={getStyles().buttonText}>{translations[language].continueToFaceUpload}</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={getStyles().errorText}>{error}</Text>}
    </View>
  );

  const renderFaceUploadStep = () => (
    <View style={getStyles().stepContainer}>
      <Text style={getStyles().stepTitle}>{translations[language].step2Title}</Text>
      <View style={getStyles().uploadContainer}>
        <View style={getStyles().buttonRow}>
          <TouchableOpacity
            onPress={handleFaceUpload}
            style={[getStyles().actionButton, { backgroundColor: COLORS[theme].primary }]}
          >
            <Text style={getStyles().actionButtonText}>{translations[language].uploadFaceButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFaceCamera}
            style={[getStyles().actionButton, { backgroundColor: COLORS[theme].teal }]}
          >
            <Text style={getStyles().actionButtonText}>{translations[language].takeSelfieButton}</Text>
          </TouchableOpacity>
        </View>
        {faceImage && (
          <View style={getStyles().imageContainer}>
            <Image source={{ uri: faceImage }} style={[getStyles().image, { width: 180, height: 180 }]} resizeMode="contain" />
          </View>
        )}
      </View>
      <Text style={getStyles().warningText}>{translations[language].faceUploadWarning}</Text>
      <View style={getStyles().buttonRow}>
        {faceImage && (
          <TouchableOpacity onPress={startAnalysis} style={getStyles().continueButton}>
            <Text style={getStyles().buttonText}>{translations[language].startAnalysisButton}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setCurrentStep(1)} style={getStyles().backButton}>
          <Text style={getStyles().buttonText}>{translations[language].goBackButton}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={getStyles().errorText}>{error}</Text>}
    </View>
  );

  const renderQuestionsStep = () => (
    <QuestionsStep
      language={language}
      translations={translations}
      theme={theme}
      COLORS={COLORS}
      SHADOWS={SHADOWS}
      userQuestions={userQuestions}
      setUserQuestions={setUserQuestions}
      onContinue={analyzeImages}
      onBack={() => setCurrentStep(2)}
      faceResults={faceResults}
    />
  );

  const renderAnalysisStep = () => (
    <View style={getStyles().stepContainer}>
      <Text style={getStyles().stepTitle}>{translations[language].analysisInProgressTitle}</Text>
      <View style={getStyles().progressContainer}>
        <View style={getStyles().progressBarBackground}>
          <View style={[getStyles().progressBar, { width: `${analysisProgress}%` }]} />
        </View>
        <Text style={getStyles().progressText}>{analysisProgress}% Complete</Text>
      </View>
      <View style={getStyles().analysisContainer}>
        <View style={getStyles().analysisItem}>
          <Text style={getStyles().analysisTitle}>{translations[language].faceAnalysisTitle}</Text>
          {faceImage ? (
            <View style={getStyles().imageWrapper}>
              <Image source={{ uri: faceImage }} style={[getStyles().image, { width: 300, height: 300 }]} resizeMode="contain" />
              {isLoading && (
                <View style={getStyles().loadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS[theme].primary} />
                  <Text style={getStyles().loadingText}>{translations[language].analyzingText}</Text>
                </View>
              )}
              {!isLoading && faceResults && faceResults[0] && faceResults[0].detection && faceResults[0].landmarks && (
                <Svg height="300" width="300" style={getStyles().svgOverlay}>
                  {isLVisible && (
                    <>
                      <Path
                        d={`M${faceResults[0].detection.box.x},${faceResults[0].detection.box.y} L${faceResults[0].detection.box.x - 22},${faceResults[0].detection.box.y} L${faceResults[0].detection.box.x - 22},${faceResults[0].detection.box.y + 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResults[0].detection.box.x + faceResults[0].detection.box.width},${faceResults[0].detection.box.y} L${faceResults[0].detection.box.x + faceResults[0].detection.box.width + 22},${faceResults[0].detection.box.y} L${faceResults[0].detection.box.x + faceResults[0].detection.box.width + 22},${faceResults[0].detection.box.y + 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResults[0].detection.box.x},${faceResults[0].detection.box.y + faceResults[0].detection.box.height} L${faceResults[0].detection.box.x - 22},${faceResults[0].detection.box.y + faceResults[0].detection.box.height} L${faceResults[0].detection.box.x - 22},${faceResults[0].detection.box.y + faceResults[0].detection.box.height - 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                      <Path
                        d={`M${faceResults[0].detection.box.x + faceResults[0].detection.box.width},${faceResults[0].detection.box.y + faceResults[0].detection.box.height} L${faceResults[0].detection.box.x + faceResults[0].detection.box.width + 22},${faceResults[0].detection.box.y + faceResults[0].detection.box.height} L${faceResults[0].detection.box.x + faceResults[0].detection.box.width + 22},${faceResults[0].detection.box.y + faceResults[0].detection.box.height - 22}`}
                        fill="none"
                        stroke="#ff3333"
                        strokeWidth="3"
                      />
                    </>
                  )}
                  {faceResults[0].landmarks.map((point, index) => (
                    <Circle
                      key={`point-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="1.65"
                      fill={COLORS[theme].landmarkColors.default}
                      stroke={COLORS[theme].landmarkColors.default}
                      strokeWidth="1"
                    />
                  ))}
                  {faceResults[0].landmarks.length >= 68 &&
                    connectFaceFeatures(faceResults[0].landmarks).map((line, index) => {
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
            <Text style={getStyles().errorText}>{translations[language].errorFaceImageNotAvailable}</Text>
          )}
        </View>
        <View style={getStyles().analysisItem}>
          <Text style={getStyles().analysisTitle}>{translations[language].petAnalysisTitle}</Text>
          {petImage ? (
            <View style={getStyles().imageWrapper}>
              <Image source={{ uri: petImage }} style={[getStyles().image, { width: 300, height: 300 }]} resizeMode="contain" />
              {petResults && petResults.detection && petResults.detection.box && (
                <View
                  style={{
                    position: 'absolute',
                    left: petResults.detection.box.x,
                    top: petResults.detection.box.y,
                    width: petResults.detection.box.width,
                    height: petResults.detection.box.height,
                    borderWidth: 2,
                    borderColor: COLORS[theme].danger,
                  }}
                />
              )}
            </View>
          ) : (
            <Text style={getStyles().errorText}>{translations[language].errorPetImageNotAvailable}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderResultsStep = () => (
    <ScrollView style={getStyles().stepContainer} showsVerticalScrollIndicator={false}>
      <View style={getStyles().compatibilityCard}>
        <Text style={getStyles().compatibilityTitle}>{translations[language].compatibilityScoreLabel}</Text>
        <View style={getStyles().compatibilityScoreContainer}>
          <Image source={{ uri: petImage }} style={getStyles().compatibilityImage} resizeMode="cover" />
          <Text style={[getStyles().compatibilityScoreText, { color: getScoreColor(compatibility?.score) }]}>
            {compatibility?.score || 0}/100
          </Text>
          <Image source={{ uri: faceImage }} style={getStyles().compatibilityImage} resizeMode="cover" />
        </View>
        <Text style={getStyles().compatibilityMessage}>
          {compatibility?.message[language]?.replace(petResults?.predicted_label, formatBreedName(petResults?.predicted_label)) ||
            `${translations[language].compatibilityMessagePrefix} ${formatBreedName(petResults?.predicted_label)} ${translations[language].compatibilityMessageSuffix}`}
        </Text>
      </View>

      {compatibility &&
        compatibility.details.map((detail, index) => (
          <View key={index} style={getStyles().detailCard}>
            <View style={getStyles().detailCardHeader}>
              <Text style={getStyles().detailCardTitle}>{detail.title[language]}</Text>
              <Text style={[getStyles().detailCardScore, { color: getScoreColor(detail.score) }]}>{detail.score}/100</Text>
            </View>
            <View style={getStyles().progressBarBackground}>
              <View style={[getStyles().progressBar, { width: `${detail.score}%`, backgroundColor: getScoreColor(detail.score) }]} />
            </View>
            <Text style={getStyles().detailCardDescription}>{detail.description[language]}</Text>
          </View>
        ))}

      {petResults && (
        <>
          <Image source={{ uri: petImage }} style={getStyles().fullWidthImage} resizeMode="cover" />
          <View style={getStyles().infoCard}>
            <View style={getStyles().infoRow}>
              <Text style={getStyles().infoLabel}>{translations[language].breedLabel}:</Text>
              <Text style={getStyles().infoValue}>{formatBreedName(petResults.predicted_label)}</Text>
            </View>
            <View style={getStyles().infoRow}>
              <Text style={getStyles().infoLabel}>{translations[language].confidenceLabel}:</Text>
              <Text style={getStyles().infoValue}>{Math.round(petResults.confidence * 100)}%</Text>
            </View>
            <View style={getStyles().progressBarBackground}>
              <View style={[getStyles().progressBar, { width: `${petResults.confidence * 100}%`, backgroundColor: COLORS[theme].primary }]} />
            </View>
          </View>
        </>
      )}

      {faceResults && faceResults[0] && (
        <>
          <Image source={{ uri: faceImage }} style={getStyles().fullWidthImage} resizeMode="cover" />
          <View style={getStyles().infoCard}>
            <View style={getStyles().infoRow}>
              <Text style={getStyles().infoLabel}>{translations[language].ageLabel}:</Text>
              <Text style={getStyles().infoValue}>{Math.round(faceResults[0].age)} {translations[language].years}</Text>
            </View>
            <View style={getStyles().infoRow}>
              <Text style={getStyles().infoLabel}>{translations[language].genderLabel}:</Text>
              <Text style={getStyles().infoValue}>
                {translations[language].genders[faceResults[0].gender.toLowerCase()] || faceResults[0].gender.toLowerCase()} (
                {(faceResults[0].genderProbability * 100).toFixed(1)}%)
              </Text>
            </View>
            <View style={getStyles().infoRow}>
              <Text style={getStyles().infoLabel}>{translations[language].expressionLabel}:</Text>
              <Text style={getStyles().infoValue}>
                {faceResults[0].expressions
                  ? translations[language].expressions[
                      Object.entries(faceResults[0].expressions).sort((a, b) => b[1] - a[1])[0][0]
                    ] ||
                    Object.entries(faceResults[0].expressions).sort((a, b) => b[1] - a[1])[0][0]
                  : translations[language].neutralExpression}
              </Text>
            </View>
          </View>
        </>
      )}

      <View style={getStyles().buttonContainer}>
        <TouchableOpacity onPress={resetAnalysis} style={getStyles().greenButton}>
          <Text style={getStyles().buttonText}>{translations[language].newAnalysisButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowResultsPopup(true)} style={getStyles().redButton}>
          <Text style={getStyles().buttonText}>{translations[language].backToSummary}</Text>
        </TouchableOpacity>
      </View>
      {/* Banner Ad için boşluk bırakıyoruz */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS[theme].light,
      },
      safeArea: {
        flex: 1,
      },
      header: {
        backgroundColor: COLORS[theme].primary,
        padding: 18,
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        ...SHADOWS.medium,
      },
      headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
      },
      languageWrapper: {
        width: 40,
        alignItems: 'flex-start',
      },
      logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      smallLogo: {
        width: 50,
        height: 50,
      },
      themeToggle: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        overflow: 'hidden',
      },
      themeToggleText: {
        fontSize: 20,
        color: COLORS[theme].white,
      },
      headerTitle: {
        color: COLORS[theme].dark,
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 0.5,
      },
      main: {
        padding: 18,
        width: '100%',
      },
      stepContainer: {
        marginBottom: 25,
        width: '100%',
      },
      stepTitle: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 24,
        color: COLORS[theme].dark,
        fontWeight: 'bold',
        letterSpacing: 0.5,
      },
      uploadContainer: {
        marginBottom: 25,
        width: '100%',
        alignItems: 'center',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
      },
      actionButton: {
        backgroundColor: COLORS[theme].primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        minWidth: SCREEN_WIDTH * 0.35,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.colored,
      },
      actionButtonText: {
        color: COLORS[theme].white,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        numberOfLines: 2,
      },
      continueButton: {
        backgroundColor: COLORS[theme].success,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 50,
        minWidth: SCREEN_WIDTH * 0.4,
        alignItems: 'center',
        ...SHADOWS.medium,
      },
      backButton: {
        backgroundColor: COLORS[theme].accent,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 50,
        minWidth: 100,
        alignItems: 'center',
        ...SHADOWS.accent,
      },
      buttonText: {
        color: COLORS[theme].white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 15,
      },
      image: {
        borderRadius: 20,
        ...SHADOWS.medium,
        borderWidth: 3,
        borderColor: COLORS[theme].dark,
      },
      progressContainer: {
        margin: 25,
        width: '90%',
      },
      progressBarBackground: {
        height: 15,
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        borderRadius: 10,
        overflow: 'hidden',
      },
      progressBar: {
        height: '100%',
        backgroundColor: COLORS[theme].primary,
        borderRadius: 10,
      },
      progressText: {
        textAlign: 'center',
        fontSize: 16,
        color: COLORS[theme].dark,
        fontWeight: '600',
        marginTop: 8,
      },
      analysisContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
        width: '100%',
      },
      analysisItem: {
        width: '100%',
        marginBottom: 25,
        backgroundColor: COLORS[theme].white,
        borderRadius: 20,
        padding: 15,
        ...SHADOWS.small,
      },
      analysisTitle: {
        textAlign: 'center',
        marginBottom: 15,
        color: COLORS[theme].primary,
        fontSize: 20,
        fontWeight: 'bold',
      },
      imageWrapper: {
        position: 'relative',
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        overflow: 'hidden',
      },
      svgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      },
      loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(44, 47, 51, 0.85)',
        borderRadius: 15,
      },
      loadingText: {
        color: COLORS[theme].dark,
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold',
      },
      compatibilityCard: {
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        ...SHADOWS.small,
      },
      compatibilityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS[theme].dark,
        textAlign: 'center',
        marginBottom: 10,
      },
      compatibilityScoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      compatibilityImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: COLORS[theme].dark,
      },
      compatibilityScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      compatibilityMessage: {
        fontSize: 14,
        color: COLORS[theme].dark,
        textAlign: 'center',
        lineHeight: 20,
      },
      detailCard: {
        backgroundColor: COLORS[theme].white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS[theme].primary,
        ...SHADOWS.small,
      },
      detailCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      detailCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS[theme].dark,
        flex: 1,
      },
      detailCardScore: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      detailCardDescription: {
        fontSize: 14,
        color: COLORS[theme].dark,
        marginTop: 8,
        lineHeight: 20,
      },
      fullWidthImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginVertical: 12,
        ...SHADOWS.small,
      },
      infoCard: {
        backgroundColor: COLORS[theme].white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        ...SHADOWS.small,
      },
      infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS[theme].dark,
      },
      infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS[theme].primary,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
      },
      greenButton: {
        backgroundColor: COLORS[theme].success,
        borderRadius: 10,
        paddingVertical: 15,
        marginVertical: 10,
        alignItems: 'center',
        ...SHADOWS.medium,
        flex: 1,
        marginRight: 5,
      },
      redButton: {
        backgroundColor: COLORS[theme].danger,
        borderRadius: 10,
        paddingVertical: 15,
        marginVertical: 10,
        alignItems: 'center',
        ...SHADOWS.medium,
        flex: 1,
        marginLeft: 5,
      },
      errorText: {
        color: COLORS[theme].danger,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: 'rgba(242, 95, 92, 0.2)',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        fontWeight: 'bold',
      },
      warningText: {
        color: COLORS[theme].warning,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: 'rgba(255, 0, 0, 0.23)',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        fontStyle: 'italic',
      },
    });

  const popupProps = useMemo(() => ({
    visible: showResultsPopup,
    onClose: () => {
      console.log('Closing ResultsPopup');
      setShowResultsPopup(false);
    },
    compatibilityScore: compatibility?.score,
    details: compatibility?.details,
    petImage,
    faceImage,
    petBreed: petResults?.predicted_label,
    onSeeMoreDetails: () => {
      console.log('Navigating to detailed results');
      setShowResultsPopup(false);
      setCurrentStep(5);
    },
    translations,
    language,
  }), [
    showResultsPopup,
    compatibility?.score,
    compatibility?.details,
    petImage,
    faceImage,
    petResults?.predicted_label,
    language,
  ]);

  return (
    <SafeAreaView style={getStyles().safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={COLORS[theme].primary} />
      <View style={{ flex: 1 }}>
        <ScrollView style={getStyles().container}>
          <View style={getStyles().header}>
            <View style={getStyles().headerTopRow}>
              <View style={getStyles().languageWrapper}>
                <CustomLanguageSelector language={language} setLanguage={setLanguage} />
              </View>
              <View style={getStyles().logoContainer}>
                <Image source={require('./logo.png')} style={getStyles().smallLogo} resizeMode="contain" />
              </View>
              <TouchableOpacity onPress={toggleTheme} style={getStyles().themeToggle}>
                <Text style={getStyles().themeToggleText}>{theme === 'light' ? '🌙' : '☀️'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={getStyles().headerTitle}>{translations[language].appTitle}</Text>
          </View>
          <View style={getStyles().main}>
            {currentStep === 1 && renderPetUploadStep()}
            {currentStep === 2 && renderFaceUploadStep()}
            {currentStep === 3 && renderQuestionsStep()}
            {currentStep === 4 && isAnalyzing && renderAnalysisStep()}
            {currentStep === 5 && renderResultsStep()}
          </View>
        </ScrollView>
        <BannerAdComponent adUnitId={bannerAdUnitId} />
      </View>
      <ResultsPopup {...popupProps} />
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

export default CombinedAnalysisApp;