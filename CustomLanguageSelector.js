// Final CustomLanguageSelector.js with no background shadow
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const CustomLanguageSelector = ({ language, setLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Define language options with flag images
  const languageOptions = [
    { code: 'uk', flag: require('./assets/flags/uk.png') },
    { code: 'tr', flag: require('./assets/flags/tr.png') },
    { code: 'es', flag: require('./assets/flags/es.png') },
    { code: 'fr', flag: require('./assets/flags/fr.png') },
    { code: 'de', flag: require('./assets/flags/de.png') },
  ];
  
  // Get current flag image
  const getCurrentFlag = () => {
    const current = languageOptions.find(option => option.code === language);
    return current ? current.flag : languageOptions[0].flag;
  };
  
  return (
    <View style={styles.container}>
      {/* Current language flag (clickable) */}
      <TouchableOpacity
        style={styles.flagButton}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={getCurrentFlag()}
          style={styles.flag}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      {/* Language selection modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {languageOptions.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={styles.languageOption}
                onPress={() => {
                  setLanguage(item.code);
                  setModalVisible(false);
                }}
              >
                <Image
                  source={item.flag}
                  style={styles.optionFlag}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagButton: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  flag: {
    width: 30,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // Completely transparent background
  },
  modalContent: {
    position: 'absolute',
    top: 80, // Position below header
    left: 15, // Match position of language selector
    backgroundColor: '#fff',
    borderRadius: 0, // No rounded corners
    overflow: 'hidden',
    width: 70, // Fixed width for the dropdown
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  optionFlag: {
    width: 30,
    height: 20,
  },
});

export default CustomLanguageSelector;