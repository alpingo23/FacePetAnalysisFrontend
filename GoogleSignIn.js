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
  ScrollView,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const GoogleSignIn = ({ onSignInSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced logging function
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
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signInSilently();
      log('User already signed in', userInfo);

      // Check for idToken
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

      // Sign in to Firebase with the Google idToken
      log('Creating Google credential with idToken', { idToken });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      log('Firebase sign-in successful', firebaseUserCredential.user.toJSON());

      onSignInSuccess(userInfo);
    } catch (error) {
      log('Check current user error', { error: error.message, code: error.code });
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        log('No user is currently signed in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        log('Play Services not available');
      }
    }
  };

  const signIn = async () => {
    setIsLoading(true);
    try {
      log('Starting Google Sign-In...');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      log('Google Sign-In successful', userInfo);

      // Check for idToken
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

      // Sign in to Firebase with the Google idToken
      log('Creating Google credential with idToken', { idToken });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      log('Firebase sign-in successful', firebaseUserCredential.user.toJSON());

      onSignInSuccess(userInfo);
    } catch (error) {
      log('Sign-in error', { error: error.message, code: error.code });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services not available');
      } else {
        Alert.alert('Sign-in error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#000000',
      paddingTop: height * 0.08,
      paddingHorizontal: width * 0.06,
    },
    scrollContent: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'center',
    },
    headingContainer: {
      width: '100%',
      marginBottom: height * 0.05,
      alignItems: 'center',
    },
    title: {
      fontSize: Math.min(width * 0.09, 35),
      color: '#FFFFFF',
      fontWeight: '700',
      letterSpacing: 0.2,
      marginBottom: height * 0.015,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Math.min(width * 0.04, 16),
      color: '#9E9E9E',
      lineHeight: Math.min(width * 0.055, 22),
      textAlign: 'center',
      marginBottom: height * 0.04,
    },
    infoContainer: {
      width: '100%',
      marginBottom: height * 0.06,
      backgroundColor: 'rgba(108, 99, 255, 0.1)',
      borderRadius: 12,
      padding: width * 0.05,
      borderWidth: 1,
      borderColor: 'rgba(108, 99, 255, 0.3)',
    },
    infoText: {
      fontSize: Math.min(width * 0.038, 15),
      color: '#CCCCCC',
      lineHeight: Math.min(width * 0.055, 22),
      textAlign: 'center',
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#FFFFFF',
      width: '100%',
      height: height * 0.07,
      borderRadius: 999,
      paddingHorizontal: width * 0.05,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: height * 0.02,
    },
    googleIconContainer: {
      width: width * 0.06,
      height: width * 0.06,
      marginRight: width * 0.06,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#000000',
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: '500',
      flex: 1,
    },
    loadingContainer: {
      position: 'absolute',
      right: width * 0.05,
    },
    termsText: {
      fontSize: Math.min(width * 0.03, 12),
      color: '#808080',
      textAlign: 'center',
      marginTop: height * 0.02,
      lineHeight: Math.min(width * 0.045, 18),
      paddingHorizontal: width * 0.05,
    },
    highlight: {
      color: '#6C63FF',
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Create your account</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Our AI-powered app analyzes your facial features and your pet's characteristics to reveal surprising connections and compatibility insights.
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.googleButton}
          onPress={signIn}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
              style={{ width: width * 0.06, height: width * 0.06 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.buttonText}>Sign in with Google</Text>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4285F4" />
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Your data is secure and will only be used to provide the Face Pet Match experience.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoogleSignIn;