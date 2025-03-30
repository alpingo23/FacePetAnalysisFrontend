import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';

// Get screen dimensions and update them when orientation changes
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

// Banner için alan bırakacak şekilde kullanılabilir yükseklik hesabı
const BANNER_HEIGHT_RATIO = 0.1; // Banner yüksekliğinin ekran yüksekliğine oranı
const usableHeight = windowHeight * (1 - BANNER_HEIGHT_RATIO);

// Yardımcı bileşen: Yıldız şekli
const StarIcon = ({ size, color }) => (
  <View style={{
    width: size,
    height: size,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <View style={{
      width: size * 0.6,
      height: size * 0.6,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
      position: 'absolute',
    }} />
    <View style={{
      width: size * 0.6,
      height: size * 0.6,
      backgroundColor: color,
      transform: [{ rotate: '-45deg' }],
      position: 'absolute',
    }} />
  </View>
);

const QuestionsStep = ({
  language,
  translations,
  COLORS,
  SHADOWS,
  userQuestions,
  setUserQuestions,
  onContinue,
  onBack,
  faceResults,
  showStartAnalysisButton = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [screenDimensions, setScreenDimensions] = useState({
    width: windowWidth,
    height: usableHeight // Kullanılabilir yükseklik (banner dışında kalan)
  });

  // Listen for dimension changes (e.g., orientation changes)
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      const updatedUsableHeight = height * (1 - BANNER_HEIGHT_RATIO);
      setScreenDimensions({ width, height: updatedUsableHeight });
    };

    const dimensionsListener = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      dimensionsListener.remove();
    };
  }, []);

  const getStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000',
        width: screenDimensions.width, // Use full screen width
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '4%',
        paddingTop: '2%',
        paddingBottom: '2%',
        height: screenDimensions.height * 0.08, // Ekran yüksekliğine göre oransal
        backgroundColor: '#1A1A1A',
        width: '100%', // Ensure header uses full width
      },
      backButton: {
        width: screenDimensions.width * 0.09, // Ekran genişliğine göre oransal
        height: screenDimensions.width * 0.09, // Kare tuş için aynı değer
        borderRadius: screenDimensions.width * 0.045, // Yarıçap (yuvarlak için)
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '4%',
      },
      backIcon: {
        fontSize: screenDimensions.width * 0.07, // Ekran genişliğine göre oransal font
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: screenDimensions.width * 0.09, // Buton yüksekliğiyle aynı
        marginTop: screenDimensions.width * -0.025, // Oransal negatif margin
      },
      progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
      },
      progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
      },
      scrollView: {
        flex: 1,
        width: '100%', // Ensure scrollView uses full width
      },
      contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: Math.max(20, screenDimensions.height * 0.05), // Oransal padding
        minHeight: screenDimensions.height - (screenDimensions.height * 0.15), // Oransal yükseklik
        width: '100%', // Ensure content uses full width
      },
      title: {
        fontSize: screenDimensions.width * 0.07, // Ekran genişliğine göre oransal
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: screenDimensions.height * 0.015,
      },
      subtitle: {
        fontSize: screenDimensions.width * 0.035, // Ekran genişliğine göre oransal
        color: '#AAA',
        marginBottom: screenDimensions.height * 0.035,
      },
      optionContainer: {
        marginBottom: 15,
        width: '100%', // Make option container full width
      },
      option: {
        backgroundColor: '#1A1A1A',
        borderRadius: screenDimensions.width * 0.04, // Ekran genişliğine göre oransal
        padding: screenDimensions.width * 0.04, // Ekran genişliğine göre oransal
        marginBottom: screenDimensions.height * 0.025, // Ekran yüksekliğine göre oransal
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Make each option full width
      },
      optionSelected: {
        backgroundColor: COLORS.primary,
      },
      optionIcon: {
        width: screenDimensions.width * 0.12, // Ekran genişliğine göre oransal
        height: screenDimensions.width * 0.12, // Kare olması için aynı değer
        borderRadius: screenDimensions.width * 0.06, // Yarıçap (yuvarlak için)
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: screenDimensions.width * 0.04,
      },
      singleDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
      },
      tripleDots: {
        width: 30,
        height: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
      },
      starShape: {
        height: 20,
        width: 20,
      },
      starInner: {
        backgroundColor: '#FFFFFF',
        height: 20,
        width: 20,
      },
      houseShape: {
        width: 20,
        height: 16,
        backgroundColor: '#FFFFFF',
      },
      roofShape: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
        marginBottom: 2,
      },
      clockShape: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      clockHands: {
        position: 'absolute',
        width: 2,
        height: 8,
        backgroundColor: '#FFFFFF',
        top: 4,
      },
      personShape: {
        alignItems: 'center',
      },
      personHead: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginBottom: 2,
      },
      personBody: {
        width: 2,
        height: 10,
        backgroundColor: '#FFFFFF',
      },
      personLegs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 10,
      },
      personLeg: {
        width: 2,
        height: 8,
        backgroundColor: '#FFFFFF',
        transform: [{ rotate: '15deg' }],
      },
      personLegRight: {
        transform: [{ rotate: '-15deg' }],
      },
      groupShape: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
      },
      smallPersonHead: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        marginBottom: 1,
      },
      smallPersonBody: {
        width: 1,
        height: 6,
        backgroundColor: '#FFFFFF',
      },
      optionTextContainer: {
        flex: 1,
      },
      optionTitle: {
        fontSize: screenDimensions.width * 0.045, // Ekran genişliğine göre oransal
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: screenDimensions.height * 0.008,
      },
      optionDescription: {
        fontSize: screenDimensions.width * 0.035, // Ekran genişliğine göre oransal
        color: '#CCC',
      },
      selectedText: {
        color: '#FFFFFF',
      },
      nextButtonContainer: {
        paddingHorizontal: '5%',
        paddingVertical: screenDimensions.height * 0.07,
        borderTopWidth: 0,
        borderTopColor: '#333',
        width: '100%', // Make button container full width
        // Ekranın alt kısmında sabitler (banner'ın üstünde)
        position: 'absolute',
        bottom: 10,
        backgroundColor: '#000', // Arka plan rengi
      },
      nextButton: {
        backgroundColor: COLORS.primary, // Varsayılan renk
        height: screenDimensions.height * 0.07, // Ekran yüksekliğine göre oransal
        borderRadius: screenDimensions.height * 0.035, // Yuvarlatılmış kenarlar
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Make button full width
        ...SHADOWS.medium,
      },
      nextButtonDisabled: {
        backgroundColor: '#444',
      },
      nextButtonGreen: {
        backgroundColor: COLORS.success, // Yeşil renk (son soruda bir şık seçildiğinde)
      },
      nextButtonText: {
        color: '#FFFFFF',
        fontSize: screenDimensions.width * 0.04, // Ekran genişliğine göre oransal
        fontWeight: 'bold',
      },
    });

  // Define the questions
  const questions = [
    {
      key: 'hasLargeSpace',
      title: translations[language].questions.hasLargeSpace,
      subtitle: translations[language].questionsSubtitle || 'This will help us understand your living environment.',
      options: [
        { 
          value: true, 
          title: translations[language].yes, 
          description: '', 
          icon: 'house' 
        },
        { 
          value: false, 
          title: translations[language].no, 
          description: '', 
          icon: 'apartment' 
        },
      ],
    },
    {
      key: 'hoursAtHome',
      title: translations[language].questions.hoursAtHome,
      subtitle: translations[language].questionsSubtitle || 'This will help us understand your availability.',
      options: [
        { 
          value: '0-4', 
          title: translations[language].hoursAtHomeOptions['0-4'], 
          description: '', 
          icon: 'clock1' 
        },
        { 
          value: '4-8', 
          title: translations[language].hoursAtHomeOptions['4-8'], 
          description: '', 
          icon: 'clock2' 
        },
        { 
          value: '8+', 
          title: translations[language].hoursAtHomeOptions['8+'], 
          description: '', 
          icon: 'clock3' 
        },
      ],
    },
    {
      key: 'activeDays',
      title: translations[language].questions.activeDays,
      subtitle: translations[language].questionsSubtitle || 'This will help us gauge your activity level.',
      options: [
        { 
          value: '0-2', 
          title: translations[language].activeDaysOptions['0-2'], 
          description: '', 
          icon: 'walk1' 
        },
        { 
          value: '3-5', 
          title: translations[language].activeDaysOptions['3-5'], 
          description: '', 
          icon: 'walk2' 
        },
        { 
          value: '6-7', 
          title: translations[language].activeDaysOptions['6-7'], 
          description: '', 
          icon: 'walk3' 
        },
      ],
    },
    {
      key: 'hobbyTime',
      title: translations[language].questions.hobbyTime,
      subtitle: translations[language].questionsSubtitle || 'This will help us understand your free time.',
      options: [
        { 
          value: 'lessThan1', 
          title: translations[language].hobbyTimeOptions['lessThan1'], 
          description: '', 
          icon: 'star1' 
        },
        { 
          value: '1-3', 
          title: translations[language].hobbyTimeOptions['1-3'], 
          description: '', 
          icon: 'star2' 
        },
        { 
          value: '3+', 
          title: translations[language].hobbyTimeOptions['3+'], 
          description: '', 
          icon: 'star3' 
        },
      ],
    },
    {
      key: 'livingWith',
      title: faceResults && faceResults[0]?.age < 30
        ? translations[language].questions.livingWithYoung
        : translations[language].questions.livingWith,
      subtitle: translations[language].questionsSubtitle || 'This will help us understand your household.',
      options: [
        { 
          value: 'Yalnız yaşıyorum', 
          title: translations[language].alone, 
          description: '', 
          icon: 'person1' 
        },
        { 
          value: 'Ailemle', 
          title: translations[language].withFamily, 
          description: '', 
          icon: 'person2' 
        },
        { 
          value: 'Arkadaşlarla veya ev arkadaşlarıyla', 
          title: translations[language].withFriends, 
          description: '', 
          icon: 'person3' 
        },
      ],
    },
  ];

  const styles = getStyles();

  const handleOptionSelect = (questionKey, value) => {
    setUserQuestions((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onContinue();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = userQuestions[currentQuestion.key] !== undefined;

  // Render different custom icons based on option type
  const renderIcon = (iconType, isSelected) => {
    const iconColor = isSelected ? '#FFFFFF' : '#FFFFFF'; // Always white since outer circle is dark
    switch (iconType) {
      case 'house':
        return (
          <View style={styles.optionIcon}>
            <View style={[styles.roofShape, { borderBottomColor: iconColor }]} />
            <View style={[styles.houseShape, { backgroundColor: iconColor }]} />
          </View>
        );
      case 'apartment':
        return (
          <View style={styles.optionIcon}>
            <View style={{
              width: 20,
              height: 20,
              backgroundColor: iconColor,
              borderRadius: 2,
              justifyContent: 'space-between',
              padding: 3,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 5, height: 5, backgroundColor: '#333' }} />
                <View style={{ width: 5, height: 5, backgroundColor: '#333' }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 5, height: 5, backgroundColor: '#333' }} />
                <View style={{ width: 5, height: 5, backgroundColor: '#333' }} />
              </View>
            </View>
          </View>
        );
      case 'clock1':
        return (
          <View style={styles.optionIcon}>
            <View style={[styles.clockShape, { borderColor: iconColor }]}>
              <View style={[styles.clockHands, { backgroundColor: iconColor, transform: [{ rotate: '45deg' }] }]} />
            </View>
          </View>
        );
      case 'clock2':
        return (
          <View style={styles.optionIcon}>
            <View style={[styles.clockShape, { borderColor: iconColor }]}>
              <View style={[styles.clockHands, { backgroundColor: iconColor, transform: [{ rotate: '90deg' }] }]} />
            </View>
          </View>
        );
      case 'clock3':
        return (
          <View style={styles.optionIcon}>
            <View style={[styles.clockShape, { borderColor: iconColor }]}>
              <View style={[styles.clockHands, { backgroundColor: iconColor, transform: [{ rotate: '135deg' }] }]} />
            </View>
          </View>
        );
      case 'walk1':
        return (
          <View style={styles.optionIcon}>
            <View style={styles.personShape}>
              <View style={[styles.personHead, { backgroundColor: iconColor }]} />
              <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              <View style={styles.personLegs}>
                <View style={[styles.personLeg, { backgroundColor: iconColor }]} />
                <View style={[styles.personLeg, styles.personLegRight, { backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      case 'walk2':
        return (
          <View style={styles.optionIcon}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: 30 }}>
              <View style={styles.personShape}>
                <View style={[styles.smallPersonHead, { backgroundColor: iconColor }]} />
                <View style={[styles.smallPersonBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={styles.personShape}>
                <View style={[styles.personHead, { backgroundColor: iconColor }]} />
                <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      case 'walk3':
        return (
          <View style={styles.optionIcon}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: 36 }}>
              <View style={styles.personShape}>
                <View style={[styles.smallPersonHead, { backgroundColor: iconColor }]} />
                <View style={[styles.smallPersonBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={styles.personShape}>
                <View style={[styles.personHead, { backgroundColor: iconColor }]} />
                <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={styles.personShape}>
                <View style={[styles.smallPersonHead, { backgroundColor: iconColor }]} />
                <View style={[styles.smallPersonBody, { backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      case 'star1':
        return (
          <View style={styles.optionIcon}>
            <View style={{
              width: 20,
              height: 20,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <StarIcon size={20} color={iconColor} />
            </View>
          </View>
        );
      case 'star2':
        return (
          <View style={styles.optionIcon}>
            <View style={{
              flexDirection: 'row',
              width: 30,
              justifyContent: 'space-between',
            }}>
              <StarIcon size={16} color={iconColor} />
              <StarIcon size={16} color={iconColor} />
            </View>
          </View>
        );
      case 'star3':
        return (
          <View style={styles.optionIcon}>
            <View style={{
              flexDirection: 'row',
              width: 36,
              justifyContent: 'space-between',
            }}>
              <StarIcon size={14} color={iconColor} />
              <StarIcon size={14} color={iconColor} />
              <StarIcon size={14} color={iconColor} />
            </View>
          </View>
        );
      case 'person1':
        return (
          <View style={styles.optionIcon}>
            <View style={styles.personShape}>
              <View style={[styles.personHead, { backgroundColor: iconColor }]} />
              <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              <View style={styles.personLegs}>
                <View style={[styles.personLeg, { backgroundColor: iconColor }]} />
                <View style={[styles.personLeg, styles.personLegRight, { backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      case 'person2':
        return (
          <View style={styles.optionIcon}>
            <View style={styles.groupShape}>
              <View style={[styles.personShape, { marginRight: 5 }]}>
                <View style={[styles.personHead, { backgroundColor: iconColor }]} />
                <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={styles.personShape}>
                <View style={[styles.personHead, { width: 8, height: 8, borderRadius: 4, backgroundColor: iconColor }]} />
                <View style={[styles.personBody, { width: 1.5, height: 8, backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      case 'person3':
        return (
          <View style={styles.optionIcon}>
            <View style={styles.groupShape}>
              <View style={[styles.personShape, { marginRight: 4 }]}>
                <View style={[styles.smallPersonHead, { backgroundColor: iconColor }]} />
                <View style={[styles.smallPersonBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={[styles.personShape, { marginRight: 4 }]}>
                <View style={[styles.personHead, { backgroundColor: iconColor }]} />
                <View style={[styles.personBody, { backgroundColor: iconColor }]} />
              </View>
              <View style={styles.personShape}>
                <View style={[styles.smallPersonHead, { backgroundColor: iconColor }]} />
                <View style={[styles.smallPersonBody, { backgroundColor: iconColor }]} />
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.optionIcon}>
            <View style={[styles.singleDot, { backgroundColor: iconColor }]} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Burayı bırak - Banner'ın görüntülenmesi için StatusBar gizlenmeyecek */}
      
      {/* Header with back button and progress bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }]} />
        </View>
      </View>

      {/* Question content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.contentContainer,
          // Banner ve buton yüksekliğini hesaba katarak padding ekleyin
          { paddingBottom: screenDimensions.height * 0.12 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{currentQuestion.title}</Text>
        <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>

        <View style={styles.optionContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = userQuestions[currentQuestion.key] === option.value;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleOptionSelect(currentQuestion.key, option.value)}
              >
                {renderIcon(option.icon, isSelected)}
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
                    {option.title}
                  </Text>
                  {option.description ? (
                    <Text style={[styles.optionDescription, isSelected && styles.selectedText]}>
                      {option.description}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Next button container, positioned above the ad banner */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isCurrentQuestionAnswered && styles.nextButtonDisabled,
            currentQuestionIndex === questions.length - 1 && isCurrentQuestionAnswered && styles.nextButtonGreen, // Son soruda ve bir şık seçildiğinde yeşil
          ]}
          disabled={!isCurrentQuestionAnswered}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === questions.length - 1 && showStartAnalysisButton
              ? translations[language].startAnalysisButton
              : translations[language].continueButton || 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuestionsStep;