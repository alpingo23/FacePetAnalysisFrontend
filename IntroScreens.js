import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const IntroScreens = ({ onComplete, language, translations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Images for the intro screens
  const images = [
    require('./assets/face_analysis_intro.png'),
    require('./assets/pet_analysis_intro.png'),
    require('./assets/compatibility_intro.png'),
  ];

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    flatListRef.current?.scrollToIndex({
      index: pageIndex,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentPage < 2) {
      handlePageChange(currentPage + 1);
    } else {
      onComplete();
    }
  };

  // Default translations
  const defaultTranslations = {
    uk: {
      intro_page1_title: "Face Analysis",
      intro_page1_desc: "We analyze facial features to understand your personality traits and preferences.",
      intro_page2_title: "Pet Analysis",
      intro_page2_desc: "We identify your pet's breed and analyze its temperament and behavioral tendencies.",
      intro_page3_title: "Compatibility Match",
      intro_page3_desc: "We compare both analyses to determine your compatibility score and relationship potential.",
      next_button: "Next",
      start_button: "Get Started",
    },
  };

  // Merge with passed translations or use defaults
  const currentTranslations = translations?.[language] || defaultTranslations.uk;

  const introContent = [
    {
      title: currentTranslations.intro_page1_title || "Face Analysis",
      description: currentTranslations.intro_page1_desc || 
        "We analyze facial features to understand your personality traits and preferences.",
      image: images[0],
    },
    {
      title: currentTranslations.intro_page2_title || "Pet Analysis",
      description: currentTranslations.intro_page2_desc || 
        "We identify your pet's breed and analyze its temperament and behavioral tendencies.",
      image: images[1],
    },
    {
      title: currentTranslations.intro_page3_title || "Compatibility Match",
      description: currentTranslations.intro_page3_desc || 
        "We compare both analyses to determine your compatibility score and relationship potential.",
      image: images[2],
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        {/* Image section - frame ve corner elementleri kaldırıldı */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
        
        {/* White content card with rounded corners */}
        <View style={styles.contentCard}>
          {/* Title and description */}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {introContent.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.paginationDot,
                  currentPage === dotIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          
          {/* Next button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage === 2 
                ? (currentTranslations.start_button || "Get Started") 
                : (currentTranslations.next_button || "Next")}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          data={introContent}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          snapToInterval={width}
          decelerationRate="fast"
          snapToAlignment="center"
          keyExtractor={(_, index) => index.toString()}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentPage(slideIndex);
          }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: width,
    paddingHorizontal: 0,
    marginTop: -17,
  },
  contentContainer: {
    flex: 1,
  },
  slide: {
    width: width, 
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    width: width,
    height: height * 0.85,
    position: 'relative',
  },
  image: {
    width: width,
    height: height * 0.5, 
    position: 'relative',
    top: 0,
    left: 0,
    resizeMode: 'stretch', 
  },
  contentCard: {
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    paddingTop: 30,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.36,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#333',
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IntroScreens;