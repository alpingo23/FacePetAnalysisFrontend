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
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const IntroScreens = ({ onComplete, language, translations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Images for the intro screens can be imported or required
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

  // Default translations in case the passed translations aren't available
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
    }
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
        <View style={styles.contentWrapper}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          data={introContent}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
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

        <View style={styles.bottomControls}>
          <View style={styles.pagination}>
            {introContent.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentPage === index && styles.paginationDotActive,
                ]}
                onPress={() => handlePageChange(index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage === 2 
                ? (currentTranslations.start_button || "Get Started") 
                : (currentTranslations.next_button || "Next")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#c4c4c4',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  nextButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IntroScreens;