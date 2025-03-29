import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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

  const getStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        height: 50,
        backgroundColor: '#1A1A1A',
      },
      backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      },
      backIcon: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 36,
        marginTop: -10,
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
      },
      contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80,
        minHeight: height - 150,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 14,
        color: '#AAA',
        marginBottom: 25,
      },
      optionContainer: {
        marginBottom: 15,
      },
      option: {
        backgroundColor: '#1A1A1A',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
      },
      optionSelected: {
        backgroundColor: COLORS.primary,
      },
      optionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
      },
      optionDescription: {
        fontSize: 14,
        color: '#CCC',
      },
      selectedText: {
        color: '#FFFFFF',
      },
      nextButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
      },
      nextButton: {
        backgroundColor: COLORS.primary, // Varsayılan renk
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 16,
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
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

        {/* Next button as part of the scrollable content */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionsStep;