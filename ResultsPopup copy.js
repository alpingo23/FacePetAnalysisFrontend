import React, { useRef, useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ResultsPopup = ({
  visible,
  onClose,
  compatibilityScore,
  details,
  petImage,
  faceImage,
  petBreed,
  onSeeMoreDetails,
  translations,
  language,
  userQuestions,
  faceResult,
  petResult,
}) => {
  console.log('[ResultsPopup] FILE VERSION: 2025-03-26-v3 - Fixed expressions rendering issue');
  console.log('[ResultsPopup] userQuestions:', userQuestions);
  console.log('[ResultsPopup] faceResult:', faceResult);
  console.log('[ResultsPopup] petResult:', petResult);
  console.log('[ResultsPopup] Version Check: Using updated ResultsPopup.js with fixed expressions rendering');

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to determine the color based on the score
  const getScoreColor = (score) => {
    if (score < 45) return '#FF0000'; // Red
    if (score < 60) return '#FFFF00'; // Yellow
    if (score < 75) return '#FFA500'; // Orange
    if (score < 85) return '#90EE90'; // Light Green
    return '#2ECC71'; // Green
  };

  // Function to format the breed name
  const formatBreedName = (breed) => {
    if (!breed) return translations[language].unknown || 'Unknown';
    const breedPart = breed.split('-')[1] || breed;
    return breedPart.charAt(0).toUpperCase() + breedPart.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  // Helper function to safely get the dominant expression
  const getDominantExpression = (expressions) => {
    if (!expressions || typeof expressions !== 'object') {
      console.log('[getDominantExpression] Expressions is invalid:', expressions);
      return translations[language].neutralExpression || 'Neutral';
    }
    const entries = Object.entries(expressions);
    if (entries.length === 0) {
      console.log('[getDominantExpression] No expressions found:', expressions);
      return translations[language].neutralExpression || 'Neutral';
    }
    const [dominantExpression] = entries.sort((a, b) => b[1] - a[1])[0];
    return (
      (translations[language].expressions[dominantExpression] || dominantExpression).charAt(0).toUpperCase() +
      (translations[language].expressions[dominantExpression] || dominantExpression).slice(1)
    );
  };

  // Format details for the Overall Slide
  const formattedDetails = details
    ? details.map((detail) => ({
        title: detail.title[language]?.replace(' Compatibility', '') || detail.title,
        score: detail.score,
        description: detail.description?.[language] || '',
        recommendation: detail.recommendation?.[language] || '',
      }))
    : [];

  // Format details for Category Slides (used from the 4th slide onward)
  const formattedCategoryDetails = details
    ? details.map((detail) => ({
        title: detail.title[language] || detail.title,
        score: detail.score,
        description: detail.description?.[language] || '',
        recommendation: detail.recommendation?.[language] || '',
      }))
    : [];

  // Prepare face analysis data with safe defaults
  console.log('[ResultsPopup] Constructing faceAnalysis...');
  const faceAnalysis = faceResult && faceResult[0]
    ? {
        age: faceResult[0].age || 30,
        gender: faceResult[0].gender || 'Unknown',
        expressions: faceResult[0].expressions && typeof faceResult[0].expressions === 'object'
          ? faceResult[0].expressions
          : { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0 },
      }
    : {
        age: 30,
        gender: 'Unknown',
        expressions: { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0 },
      };
  console.log('[ResultsPopup] faceAnalysis constructed:', faceAnalysis);

  // Prepare pet analysis data with safe defaults
  const petAnalysis = petResult
    ? {
        breed: formatBreedName(petBreed),
        gender: petResult.gender || 'Unknown',
        energy: petResult.energy || 50,
        socialNeed: petResult.socialNeed || 50,
        independence: petResult.independence || 50,
        groomingNeed: petResult.groomingNeed || 50,
        spaceRequirement: petResult.spaceRequirement || 'medium',
        activityPreference: petResult.activityPreference || 'outdoor',
        temperament: petResult.temperament || 'Friendly',
        agePreference: petResult.agePreference || 30,
        traits: petResult.traits || ['Friendly', 'Energetic'],
      }
    : {
        breed: 'Unknown',
        gender: 'Unknown',
        energy: 50,
        socialNeed: 50,
        independence: 50,
        groomingNeed: 50,
        spaceRequirement: 'medium',
        activityPreference: 'outdoor',
        temperament: 'Friendly',
        agePreference: 30,
        traits: ['Friendly', 'Energetic'],
      };

  // Combine all slides
  const slides = [
    { type: 'overall', data: { compatibilityScore, details: formattedDetails } }, // First slide: Overall
    { type: 'faceAnalysis', data: faceAnalysis }, // Second slide: Face Analysis
    { type: 'petAnalysis', data: petAnalysis }, // Third slide: Pet Analysis
    ...formattedCategoryDetails.map((detail) => ({ type: 'category', data: detail })), // Subsequent slides: Compatibility Categories
  ];

  // Render a progress bar for scores
  const renderProgressBar = (score, color) => {
    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${score}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    );
  };

  // Handle slide change for pagination
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Render the Overall Slide
  const renderOverallSlide = (compatibilityScore, details) => {
    console.log('[ResultsPopup] Rendering Overall Slide...');
    return (
      <ScrollView contentContainerStyle={styles.slide}>
        <Text style={[styles.categoryTitle, { color: getScoreColor(compatibilityScore) }]}>
          {translations[language].overallScore || 'Overall'}
        </Text>

        <View style={styles.imagesContainer}>
          <View style={styles.imageWithLabel}>
            {petImage ? (
              <Image source={{ uri: petImage }} style={styles.circularImage} resizeMode="cover" />
            ) : (
              <Text style={styles.imageLabel}>
                {translations[language].errorPetImageNotAvailable || 'Pet image not available'}
              </Text>
            )}
            <Text style={styles.imageLabel} numberOfLines={1}>
              {formatBreedName(petBreed)}
            </Text>
          </View>
          <View style={styles.imageWithLabel}>
            {faceImage ? (
              <Image source={{ uri: faceImage }} style={styles.circularImage} resizeMode="cover" />
            ) : (
              <Text style={styles.imageLabel}>
                {translations[language].errorFaceImageNotAvailable || 'Face image not available'}
              </Text>
            )}
            <Text style={styles.imageLabel}>{translations[language].human || 'Human'}</Text>
          </View>
        </View>

        <Text style={[styles.scoreText, { color: getScoreColor(compatibilityScore) }]}>
          {compatibilityScore || 0}
        </Text>
        {renderProgressBar(compatibilityScore || 0, getScoreColor(compatibilityScore))}

        <View style={styles.categoriesGrid}>
          <View style={styles.categoryRow}>
            {details.length > 0 && (
              <View style={styles.categoryColumn}>
                <Text style={styles.categoryTitleSmall} numberOfLines={1} ellipsizeMode="tail">
                  {details[0]?.title}
                </Text>
                <Text style={[styles.categoryScore, { color: getScoreColor(details[0]?.score) }]}>
                  {details[0]?.score}
                </Text>
                {renderProgressBar(details[0]?.score, getScoreColor(details[0]?.score))}
              </View>
            )}
            {details.length > 1 && (
              <View style={styles.categoryColumn}>
                <Text style={styles.categoryTitleSmall} numberOfLines={1} ellipsizeMode="tail">
                  {details[1]?.title}
                </Text>
                <Text style={[styles.categoryScore, { color: getScoreColor(details[1]?.score) }]}>
                  {details[1]?.score}
                </Text>
                {renderProgressBar(details[1]?.score, getScoreColor(details[1]?.score))}
              </View>
            )}
          </View>
          <View style={styles.categoryRow}>
            {details.length > 2 && (
              <View style={styles.categoryColumn}>
                <Text style={styles.categoryTitleSmall} numberOfLines={1} ellipsizeMode="tail">
                  {details[2]?.title}
                </Text>
                <Text style={[styles.categoryScore, { color: getScoreColor(details[2]?.score) }]}>
                  {details[2]?.score}
                </Text>
                {renderProgressBar(details[2]?.score, getScoreColor(details[2]?.score))}
              </View>
            )}
            {details.length > 3 && (
              <View style={styles.categoryColumn}>
                <Text style={styles.categoryTitleSmall} numberOfLines={1} ellipsizeMode="tail">
                  {details[3]?.title}
                </Text>
                <Text style={[styles.categoryScore, { color: getScoreColor(details[3]?.score) }]}>
                  {details[3]?.score}
                </Text>
                {renderProgressBar(details[3]?.score, getScoreColor(details[3]?.score))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  // Render the Face Analysis Slide
  const renderFaceAnalysisSlide = (faceAnalysis) => {
    console.log('[ResultsPopup] Rendering Face Analysis Slide...');
    console.log('[renderFaceAnalysisSlide] faceAnalysis:', faceAnalysis);
  
    // faceAnalysis veya expressions yoksa hata mesajı döndür
    if (!faceAnalysis || !faceAnalysis.expressions) {
      return (
        <ScrollView contentContainerStyle={styles.slide}>
          <Text style={[styles.categoryTitle, { color: '#fff' }]}>
            {translations[language].faceAnalysisTitle || 'Face Analysis'}
          </Text>
          <Text style={styles.imageLabel}>
            {translations[language].noFaceAnalysisData || 'No face analysis data available.'}
          </Text>
        </ScrollView>
      );
    }
  
    // expressions dizisini güvenli bir şekilde işleyelim
    const expressionEntries = Array.isArray(faceAnalysis.expressions)
      ? faceAnalysis.expressions.map(entry => ({
          name: entry.expression || 'Unknown', // expression yoksa varsayılan değer
          value: entry.value || '0',          // value yoksa varsayılan değer
        }))
      : [];
  
    return (
      <ScrollView contentContainerStyle={styles.slide}>
        <Text style={[styles.categoryTitle, { color: '#fff' }]}>
          {translations[language].faceAnalysisTitle || 'Face Analysis'}
        </Text>
  
        <View style={styles.imageWithLabel}>
          {faceImage ? (
            <Image source={{ uri: faceImage }} style={styles.circularImage} resizeMode="cover" />
          ) : (
            <Text style={styles.imageLabel}>
              {translations[language].errorFaceImageNotAvailable || 'Face image not available'}
            </Text>
          )}
          <Text style={styles.imageLabel}>{translations[language].human || 'Human'}</Text>
        </View>
  
        <View style={styles.analysisDetails}>
          <Text style={styles.analysisLabel}>
            {translations[language].ageLabel || 'Age'}: <Text style={styles.analysisValue}>{faceAnalysis.age || 'N/A'}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].genderLabel || 'Gender'}: <Text style={styles.analysisValue}>{faceAnalysis.gender || 'N/A'}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].expressions || 'Expressions'}:
          </Text>
          {expressionEntries.length > 0 ? (
            expressionEntries.map((entry, index) => {
              // Çeviri yoksa entry.name'i olduğu gibi kullan
              const expressionLabel = translations[language].expressions?.[entry.name]
                ? translations[language].expressions[entry.name].charAt(0).toUpperCase() + translations[language].expressions[entry.name].slice(1)
                : entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
              const value = parseFloat(entry.value) || 0; // String'i sayıya çevir, hata varsa 0 kullan
  
              return (
                <View key={index} style={styles.expressionRow}>
                  <Text style={styles.expressionLabel}>
                    {expressionLabel}:
                  </Text>
                  <Text style={styles.expressionValue}>{value}%</Text>
                  {renderProgressBar(value, getScoreColor(value))}
                </View>
              );
            })
          ) : (
            <Text style={styles.analysisValue}>
              {translations[language].noExpressionData || 'No expression data available'}
            </Text>
          )}
        </View>
      </ScrollView>
    );
  };

  // Render the Pet Analysis Slide
  const renderPetAnalysisSlide = (petAnalysis) => {
    console.log('[ResultsPopup] Rendering Pet Analysis Slide...');
    return (
      <ScrollView contentContainerStyle={styles.slide}>
        <Text style={[styles.categoryTitle, { color: '#fff' }]}>
          {translations[language].petAnalysisTitle || 'Pet Analysis'}
        </Text>

        <View style={styles.imageWithLabel}>
          {petImage ? (
            <Image source={{ uri: petImage }} style={styles.circularImage} resizeMode="cover" />
          ) : (
            <Text style={styles.imageLabel}>
              {translations[language].errorPetImageNotAvailable || 'Pet image not available'}
            </Text>
          )}
          <Text style={styles.imageLabel} numberOfLines={1}>
            {petAnalysis.breed}
          </Text>
        </View>

        <View style={styles.analysisDetails}>
          <Text style={styles.analysisLabel}>
            {translations[language].breedLabel || 'Breed'}: <Text style={styles.analysisValue}>{petAnalysis.breed}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].genderLabel || 'Gender'}: <Text style={styles.analysisValue}>{petAnalysis.gender}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].energy || 'Energy Level'}: <Text style={styles.analysisValue}>{petAnalysis.energy}</Text>
          </Text>
          {renderProgressBar(petAnalysis.energy, getScoreColor(petAnalysis.energy))}
          <Text style={styles.analysisLabel}>
            {translations[language].socialNeed || 'Social Need'}: <Text style={styles.analysisValue}>{petAnalysis.socialNeed}</Text>
          </Text>
          {renderProgressBar(petAnalysis.socialNeed, getScoreColor(petAnalysis.socialNeed))}
          <Text style={styles.analysisLabel}>
            {translations[language].independence || 'Independence'}: <Text style={styles.analysisValue}>{petAnalysis.independence}</Text>
          </Text>
          {renderProgressBar(petAnalysis.independence, getScoreColor(petAnalysis.independence))}
          <Text style={styles.analysisLabel}>
            {translations[language].groomingNeed || 'Grooming Need'}: <Text style={styles.analysisValue}>{petAnalysis.groomingNeed}</Text>
          </Text>
          {renderProgressBar(petAnalysis.groomingNeed, getScoreColor(petAnalysis.groomingNeed))}
          <Text style={styles.analysisLabel}>
            {translations[language].spaceRequirement || 'Space Requirement'}: <Text style={styles.analysisValue}>{petAnalysis.spaceRequirement}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].activityPreference || 'Activity Preference'}: <Text style={styles.analysisValue}>{petAnalysis.activityPreference}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].temperament || 'Temperament'}: <Text style={styles.analysisValue}>{petAnalysis.temperament}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].agePreference || 'Age Preference'}: <Text style={styles.analysisValue}>{petAnalysis.agePreference}</Text>
          </Text>
          <Text style={styles.analysisLabel}>
            {translations[language].traits || 'Traits'}: <Text style={styles.analysisValue}>{petAnalysis.traits.join(', ')}</Text>
          </Text>
        </View>
      </ScrollView>
    );
  };

  // Render a Category Slide
  const renderCategorySlide = (item) => {
    console.log('[ResultsPopup] Rendering Category Slide...');
    const { title, score, description, recommendation } = item;

    return (
      <ScrollView contentContainerStyle={styles.slide}>
        <Text style={[styles.categoryTitle, { color: getScoreColor(score) }]}>{title}</Text>

        <View style={styles.imagesContainer}>
          <View style={styles.imageWithLabel}>
            {petImage ? (
              <Image source={{ uri: petImage }} style={styles.circularImage} resizeMode="cover" />
            ) : (
              <Text style={styles.imageLabel}>
                {translations[language].errorPetImageNotAvailable || 'Pet image not available'}
              </Text>
            )}
            <Text style={styles.imageLabel} numberOfLines={1}>
              {formatBreedName(petBreed)}
            </Text>
          </View>
          <View style={styles.imageWithLabel}>
            {faceImage ? (
              <Image source={{ uri: faceImage }} style={styles.circularImage} resizeMode="cover" />
            ) : (
              <Text style={styles.imageLabel}>
                {translations[language].errorFaceImageNotAvailable || 'Face image not available'}
              </Text>
            )}
            <Text style={styles.imageLabel}>{translations[language].human || 'Human'}</Text>
          </View>
        </View>

        <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>{score}</Text>
        {renderProgressBar(score, getScoreColor(score))}

        <Text style={styles.descriptionText}>{description}</Text>

        {recommendation && (
          <>
            <Text style={styles.recommendationTitle}>
              {translations[language].recommendationLabel || 'Recommendation'}
            </Text>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </>
        )}
      </ScrollView>
    );
  };

  // Render each slide based on its type
  const renderSlide = ({ item }) => {
    console.log('[ResultsPopup] Rendering slide type:', item.type);
    switch (item.type) {
      case 'overall':
        return renderOverallSlide(item.data.compatibilityScore, item.data.details);
      case 'faceAnalysis':
        return renderFaceAnalysisSlide(item.data);
      case 'petAnalysis':
        return renderPetAnalysisSlide(item.data);
      case 'category':
        return renderCategorySlide(item.data);
      default:
        return null;
    }
  };

  console.log('[ResultsPopup] Rendering Modal...');
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={() => {
        console.log('Modal onRequestClose triggered');
        onClose();
        onSeeMoreDetails();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with Title and Close Button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                console.log('Close button pressed in ResultsPopup');
                onClose();
                onSeeMoreDetails();
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{translations[language].resultsTitle || 'Compatibility Result'}</Text>
            <View style={styles.placeholderRight} />
          </View>

          {/* Slides */}
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />

          {/* Pagination Dots */}
          {slides.length > 1 && (
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor: currentIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Fixed Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.buttonText}>{translations[language].save || 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.buttonText}>{translations[language].share || 'Share'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholderRight: {
    width: 36,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width: SCREEN_WIDTH - 40,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryTitleSmall: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 5,
  },
  categoryScore: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 30,
    marginBottom: 20,
  },
  imageWithLabel: {
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.3,
  },
  circularImage: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    borderRadius: SCREEN_WIDTH * 0.125,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 5,
  },
  imageLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  scoreText: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  categoriesGrid: {
    width: '100%',
    marginTop: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryColumn: {
    alignItems: 'center',
    width: '45%',
  },
  analysisDetails: {
    width: '100%',
    paddingHorizontal: 20,
  },
  analysisLabel: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
  analysisValue: {
    color: '#90EE90',
    fontWeight: 'bold',
  },
  expressionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  expressionLabel: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  expressionValue: {
    color: '#90EE90',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 20,
  },
  recommendationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  recommendationText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsPopup;