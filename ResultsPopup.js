// ResultsPopup.js - Güncellenmiş versiyon
import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
  language
}) => {
  // Skora göre renk belirleme
  const getScoreColor = (score) => {
    if (score < 45) return '#FF0000';
    if (score < 60) return '#FFFF00';
    if (score < 75) return '#FFA500';
    if (score < 85) return '#90EE90';
    return '#2ECC71';
  };

  // Detayları formatlama (kısaltılmış başlıklar)
  const formattedDetails = details ? details.map(detail => ({
    title: detail.title[language]?.replace(' Compatibility', ''),
    score: detail.score
  })) : [];

  // Irk adını biçimlendirme
  const formatBreedName = (breed) => {
    if (!breed) return '';
    const breedPart = breed.split('-')[1] || breed;
    return breedPart.charAt(0).toUpperCase() + breedPart.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  // Progress bar render fonksiyonu (skora göre % olarak)
  const renderProgressBar = (score, color) => {
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar,
            { 
              width: `${score}%`, // Skora göre direkt % olarak
              backgroundColor: color
            }
          ]} 
        />
      </View>
    );
  };

  // Kategori render fonksiyonu
  const renderCategory = (title, score, index) => {
    let displayTitle = title;
    if (title && title.includes(' and ')) {
      displayTitle = title.split(' and ')[0]; // Çok satırlı başlıklar için kısaltma
    }
    
    return (
      <View style={styles.categorySection} key={index}>
        <Text style={styles.categoryTitle} numberOfLines={1}>{displayTitle}</Text>
        <Text style={[styles.categoryScore, { color: getScoreColor(score) }]}>
          {score}
        </Text>
        {renderProgressBar(score, getScoreColor(score))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        onClose();
        onSeeMoreDetails();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => {
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

          {/* Pet ve Face Resimleri */}
          <View style={styles.imagesContainer}>
            <View style={styles.imageWithLabel}>
              <Image 
                source={{ uri: petImage }} 
                style={styles.circularImage} 
                resizeMode="cover" 
              />
              <Text style={styles.imageLabel} numberOfLines={1}>{formatBreedName(petBreed)}</Text>
            </View>
            <View style={styles.imageWithLabel}>
              <Image 
                source={{ uri: faceImage }} 
                style={styles.circularImage} 
                resizeMode="cover" 
              />
              <Text style={styles.imageLabel}>{translations[language].human || 'Human'}</Text>
            </View>
          </View>

          {/* Overall Score */}
          <View style={styles.overallScoreSection}>
            <Text style={styles.overallTitle}>{translations[language].overallScore || 'Overall'}</Text>
            <Text style={[styles.overallScoreValue, { color: getScoreColor(compatibilityScore) }]}>
              {compatibilityScore || 0}
            </Text>
            {renderProgressBar(compatibilityScore || 0, getScoreColor(compatibilityScore))}
          </View>

          {/* Kategori Skorları */}
          <View style={styles.categoriesGrid}>
            <View style={styles.categoryRow}>
              {formattedDetails.length > 0 && (
                <View style={styles.categoryColumn}>
                  {renderCategory(formattedDetails[0]?.title, formattedDetails[0]?.score, 0)}
                </View>
              )}
              {formattedDetails.length > 1 && (
                <View style={styles.categoryColumn}>
                  {renderCategory(formattedDetails[1]?.title, formattedDetails[1]?.score, 1)}
                </View>
              )}
            </View>
            <View style={styles.categoryRow}>
              {formattedDetails.length > 2 && (
                <View style={styles.categoryColumn}>
                  {renderCategory(formattedDetails[2]?.title, formattedDetails[2]?.score, 2)}
                </View>
              )}
              {formattedDetails.length > 3 && (
                <View style={styles.categoryColumn}>
                  {renderCategory(formattedDetails[3]?.title, formattedDetails[3]?.score, 3)}
                </View>
              )}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.actionButton} onPress={onSeeMoreDetails}>
            <Text style={styles.actionButtonText}>{translations[language].seeMoreDetails || 'See More Details'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  imageWithLabel: {
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.25,
  },
  circularImage: {
    width: SCREEN_WIDTH * 0.22,
    height: SCREEN_WIDTH * 0.22,
    borderRadius: SCREEN_WIDTH * 0.11,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 3,
  },
  imageLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  overallScoreSection: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  overallTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  overallScoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  categoriesGrid: {
    width: '100%',
    marginTop: 5,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  categoryColumn: {
    width: '48%',
  },
  categorySection: {
    alignItems: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 85 : 'auto', // Sabit yükseklik iOS için
    marginBottom: 10,
    justifyContent: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: '90%',
  },
  categoryScore: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    width: '90%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsPopup;