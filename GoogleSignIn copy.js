import Config from 'react-native-config';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const GoogleSignIn = ({ onSignInSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Log fonksiyonunu özelleştirme
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

      // idToken'ın varlığını kontrol et
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

      // idToken ile Firebase Authentication'a kullanıcıyı kaydet
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

      // idToken'ın varlığını kontrol et
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

      // idToken ile Firebase Authentication'a kullanıcıyı kaydet
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2C2F33',
    },
    title: {
      fontSize: 24,
      color: '#FFFFFF',
      marginBottom: 20,
      fontWeight: 'bold',
    },
    signInButton: {
      backgroundColor: '#6C63FF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    signInButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Sign In with Google</Text>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={signIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.signInButtonText}>Sign In with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GoogleSignIn;