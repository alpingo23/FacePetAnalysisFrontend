import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import ResultsPopup from './ResultsPopup';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;

const COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#6C63FF',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  card: '#252525',
  cardHighlight: '#2C2C2C',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const PreviousResults = ({
  results,
  translations,
  language,
  currentPetImage,
  currentFaceImage,
  isProUnlocked,
  referralCount,
  setCurrentStep,
  setShowResultsPopup,
  setSelectedPreviousResult,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localShowResultsPopup, setLocalShowResultsPopup] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };
    Dimensions.addEventListener('change', updateLayout);
    return () => {
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', updateLayout);
      }
    };
  }, []);

  const formatBreedName = (breed) => {
    if (!breed) return translations[language]?.unknown || 'Unknown';
    const breedPart = breed.split('-')[1] || breed;
    return breedPart.charAt(0).toUpperCase() + breedPart.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp);

  const handleSeeMyResults = (result) => {
    console.log('[PreviousResults] Selected result for ResultsPopup:', JSON.stringify(result, null, 2));
    setSelectedResult(result);
    const isPro = isProUnlocked || (referralCount >= 2);
    if (isPro) {
      if (setSelectedPreviousResult && setShowResultsPopup) {
        setSelectedPreviousResult(result);
        setShowResultsPopup(true);
        setModalVisible(false);
      } else {
        setLocalShowResultsPopup(true);
      }
    } else {
      if (setSelectedPreviousResult && setCurrentStep) {
        setSelectedPreviousResult(result);
        setCurrentStep(6);
      }
      setModalVisible(false);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (language === 'tr') {
      return `${day}.${month}.${year} · ${hours}:${minutes}`;
    } else {
      return `${month}/${day}/${year} · ${hours}:${minutes}`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return COLORS.success;
    if (score >= 50) return COLORS.warning;
    return COLORS.error;
  };

  const isPro = isProUnlocked || (referralCount >= 2);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.seePreviousButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.seePreviousText}>
          {translations[language]?.seePreviousResults || 'See Previous Results'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.headerContainer}>
                <Text style={styles.modalTitle}>
                  {translations[language]?.myResults || 'My Results'}
                </Text>
                <View style={styles.headerUnderline} />
              </View>

              {sortedResults.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {translations[language]?.noResultsYet || 'No results yet'}
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.resultsList}
                  contentContainerStyle={styles.resultsListContent}
                  showsVerticalScrollIndicator={false}
                >
                  {sortedResults.map((result, index) => (
                    <View key={index} style={styles.resultItem}>
                      <View style={styles.dateTimeContainer}>
                        <Text style={styles.resultDateTime}>
                          {formatDateTime(result.timestamp)}
                        </Text>
                      </View>

                      <View style={styles.imageContainer}>
                        <View style={styles.imageWrapper}>
                          {result.faceImageUrl ? (
                            <Image
                              source={{ uri: result.faceImageUrl }}
                              style={[
                                styles.resultImage,
                                !isPro && styles.blurredImage
                              ]}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.placeholderImage}>
                              <Text style={styles.placeholderText}>👤</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.connectionContainer}>
                          <View style={styles.connectionLine} />
                          <View style={styles.connectionDot} />
                          <View style={styles.connectionLine} />
                        </View>

                        <View style={styles.imageWrapper}>
                          {result.petImageUrl ? (
                            <Image
                              source={{ uri: result.petImageUrl }}
                              style={[
                                styles.resultImage,
                                !isPro && styles.blurredImage
                              ]}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.placeholderImage}>
                              <Text style={styles.placeholderText}>🐾</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.resultDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {translations[language]?.breed || 'Breed'}:
                          </Text>
                          <Text style={styles.breedText}>
                            {formatBreedName(result.petBreed)}
                          </Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {translations[language]?.score || 'Score'}:
                          </Text>
                          <View style={styles.scoreContainer}>
                            <View style={[
                              styles.scoreIndicator,
                              { backgroundColor: getScoreColor(result.compatibilityScore) }
                            ]} />
                            {isPro ? (
                              <Text style={[
                                styles.compatibilityText,
                                { color: getScoreColor(result.compatibilityScore) }
                              ]}>
                                {result.compatibilityScore}%
                              </Text>
                            ) : (
                              <View style={styles.blurredScoreContainer}>
                                <Text style={styles.hiddenScoreText}>
                                  {result.compatibilityScore}%
                                </Text>
                                <View style={styles.fakeBlurOverlay} />
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.seeResultButton,
                          !isPro && styles.upgradeButton
                        ]}
                        onPress={() => handleSeeMyResults(result)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.seeResultText}>
                          {!isPro
                            ? (translations[language]?.upgradeToSee || 'Upgrade to See Results')
                            : (translations[language]?.seeMyResults || 'See My Results')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>
                  {translations[language]?.backButton || 'Back'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {selectedResult && (
        <ResultsPopup
          visible={localShowResultsPopup}
          onClose={() => setLocalShowResultsPopup(false)}
          compatibilityScore={selectedResult.compatibilityScore}
          details={selectedResult.details || []}
          petImage={null}
          faceImage={null}
          petImageUrl={selectedResult.petImageUrl}
          faceImageUrl={selectedResult.faceImageUrl}
          petBreed={selectedResult.petBreed}
          translations={translations}
          language={language}
          userQuestions={selectedResult.userQuestions || null}
          faceResult={selectedResult.faceResult || null}
          petResult={selectedResult.petResult || null}
        />
      )}
    </View>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  seePreviousButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
    minWidth: scale(200),
    alignItems: 'center',
  },
  seePreviousText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    width: '92%',
    maxHeight: '85%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: COLORS.card,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerUnderline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resultsList: {
    flexGrow: 0,
    maxHeight: scale(400),
  },
  resultsListContent: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  resultItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  resultDateTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    backgroundColor: COLORS.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageWrapper: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(37.5),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.primary,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  blurredImage: {
    opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  resultDetails: {
    marginBottom: 15,
    backgroundColor: COLORS.cardHighlight,
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: scale(50),
    marginRight: 8,
  },
  breedText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  compatibilityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  blurredScoreContainer: {
    position: 'relative',
    width: 50,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    opacity: 0, // Metni görünmez yap ama yer kaplasın
  },
  fakeBlurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    // Blur efekti için ek stil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  seeResultButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: scale(150),
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
  },
  seeResultText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    margin: 15,
    minWidth: scale(120),
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreviousResults;