import Config from 'react-native-config';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  ImageBackground,
  Linking,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const GoogleSignIn = ({ onSignInSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const log = (message, data = null) => {
    if (data) {
      console.log(`[GOOGLE_SIGNIN] ${message}:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`[GOOGLE_SIGNIN] ${message}`);
    }
  };

  useEffect(() => {
    log('Configuring Google Sign-In...');
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email'],
      forceCodeForRefreshToken: true,
    });

    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      log('Checking for existing user with signInSilently...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signInSilently();
      log('User already signed in', userInfo);

      let idToken = userInfo.idToken;
      if (!idToken) {
        log('idToken missing, attempting to get tokens...');
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
        log('Tokens retrieved', tokens);
      }

      if (!idToken) {
        throw new Error('idToken is still missing after getTokens');
      }

      log('Creating Google credential with idToken', { idToken });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      log('Firebase sign-in successful', firebaseUserCredential.user.toJSON());

      const firebaseUserId = firebaseUserCredential.user.uid;
      onSignInSuccess({ ...userInfo, userId: firebaseUserId });
    } catch (error) {
      log('Check current user error', { error: error.message, code: error.code });
    }
  };

  const signIn = async () => {
    setIsLoading(true);
    try {
      log('Starting Google Sign-In...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      log('Google Sign-In successful', userInfo);

      let idToken = userInfo.idToken;
      if (!idToken) {
        log('idToken missing, attempting to get tokens...');
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
        log('Tokens retrieved', tokens);
      }

      if (!idToken) {
        throw new Error('idToken is still missing after getTokens');
      }

      log('Creating Google credential with idToken', { idToken });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      log('Firebase sign-in successful', firebaseUserCredential.user.toJSON());

      const firebaseUserId = firebaseUserCredential.user.uid;
      onSignInSuccess({ ...userInfo, userId: firebaseUserId });
    } catch (error) {
      log('Sign-in error', { error: error.message, code: error.code });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Kullanıcı iptal etti, sessizce devam et
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Sign-in process is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services Required', 'Please install Google Play Services to continue');
      } else {
        Alert.alert('Sign-in Failed', 'Could not sign in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'space-between',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: width * 0.06,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: height * 0.04,
    },
    logo: {
      width: width * 0.25,
      height: width * 0.25,
      marginBottom: 15,
      borderRadius: width * 0.125,
      borderWidth: 3,
      borderColor: 'rgba(108, 99, 255, 0.6)',
      overflow: 'hidden',
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    },
    headingContainer: {
      width: '100%',
      marginBottom: height * 0.03,
      alignItems: 'center',
    },
    title: {
      fontSize: Math.min(width * 0.07, 28),
      color: '#FFFFFF',
      fontWeight: 'bold',
      letterSpacing: 0.5,
      marginBottom: height * 0.015,
      textAlign: 'center',
      fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    },
    subtitle: {
      fontSize: Math.min(width * 0.04, 16),
      color: '#DDDDDD',
      lineHeight: Math.min(width * 0.055, 22),
      textAlign: 'center',
      marginBottom: height * 0.03,
      fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
      paddingHorizontal: 20,
    },
    featureCard: {
      width: '100%',
      backgroundColor: 'rgba(108, 99, 255, 0.15)',
      borderRadius: 20,
      padding: width * 0.05,
      marginBottom: height * 0.04,
      borderWidth: 1,
      borderColor: 'rgba(108, 99, 255, 0.3)',
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 10,
      fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    },
    featureList: {
      marginBottom: 10,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    featureBullet: {
      fontSize: 18,
      color: '#6C63FF',
      marginRight: 10,
      marginTop: -5,
    },
    featureText: {
      fontSize: 14,
      color: '#DDDDDD',
      flex: 1,
      lineHeight: 20,
      fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    },
    buttonContainer: {
      width: '100%',
      paddingBottom: height * 0.05,
      paddingHorizontal: width * 0.06,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      width: '100%',
      height: 56,
      borderRadius: 30,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 15,
    },
    googleIconContainer: {
      width: 24,
      height: 24,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    googleIcon: {
      width: 24,
      height: 24,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    },
    loadingContainer: {
      position: 'absolute',
      right: 20,
    },
    termsText: {
      fontSize: 12,
      color: '#AAAAAA',
      textAlign: 'center',
      marginTop: 15,
      lineHeight: 18,
      fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
      paddingHorizontal: 15,
    },
    highlight: {
      color: '#6C63FF',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ImageBackground
        source={require('./assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('./assets/logo.png')} 
                style={styles.logo}
                resizeMode="cover"
              />
              <Text style={styles.appName}>Face Pet AI</Text>
            </View>

            <View style={styles.headingContainer}>
              <Text style={styles.title}>Discover Your Connection</Text>
              <Text style={styles.subtitle}>
                Our AI analyzes you and your pet to reveal your special bond and compatibility
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>Face analysis to understand your personality traits</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>Pet breed identification and temperament analysis</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={styles.featureText}>Discover how well you match with your pet companion</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={signIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconContainer}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.buttonText}>Continue with Google</Text>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4285F4" />
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our <Text style={styles.highlight}>Terms of Service</Text> and{' '}
              <Text 
                style={styles.highlight}
                onPress={() => Linking.openURL('https://alpingo23.github.io/facepetmatch-privacy/')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default GoogleSignIn;