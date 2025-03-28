import { StyleSheet, Dimensions } from 'react-native';

// Screen width for responsive design
const SCREEN_WIDTH = Dimensions.get('window').width;
const { height } = Dimensions.get('window');

const getStyles = (COLORS, SHADOWS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000', // Siyah arka plan
    },
    safeArea: {
      flex: 1,
    },
    header: {
      backgroundColor: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      padding: 18,
      alignItems: 'center',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      ...SHADOWS.medium,
    },
    headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    languageWrapper: {
      width: 40,
      alignItems: 'flex-start',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallLogo: {
      width: 50,
      height: 50,
    },
    headerTitle: {
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      fontSize: 26,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    main: {
      padding: 18,
      width: '100%',
    },
    stepContainer: {
      marginBottom: 25,
      width: '100%',
      paddingHorizontal: 15,
    },
    stepTitle: {
      fontSize: 22,
      textAlign: 'center',
      marginBottom: 24,
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    uploadContainer: {
      marginBottom: 25,
      width: '100%',
      alignItems: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      width: '100%',
    },
    actionButton: {
      backgroundColor: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 25,
      minWidth: SCREEN_WIDTH * 0.35,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.colored,
    },
    actionButtonText: {
      color: COLORS.white, // COLORS[theme].white yerine doğrudan COLORS.white
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      numberOfLines: 2,
    },
    continueButton: {
      backgroundColor: COLORS.success, // COLORS[theme].success yerine doğrudan COLORS.success
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 50,
      minWidth: SCREEN_WIDTH * 0.4,
      alignItems: 'center',
      ...SHADOWS.medium,
    },
    backButton: {
      backgroundColor: COLORS.accent, // COLORS[theme].accent yerine doğrudan COLORS.accent
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 50,
      minWidth: 100,
      alignItems: 'center',
      ...SHADOWS.accent,
    },
    buttonText: {
      color: '#fff',
      fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    imageContainer: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 15,
    },
    image: {
      borderRadius: 20,
      ...SHADOWS.medium,
      borderWidth: 3,
      borderColor: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
    },
    progressContainer: {
      margin: 25,
      width: '90%',
      alignSelf: 'center',
    },
    progressBarBackground: {
      height: 15,
      backgroundColor: 'rgba(108, 99, 255, 0.2)',
      borderRadius: 10,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      borderRadius: 10,
    },
    progressText: {
      textAlign: 'center',
      fontSize: 16,
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      fontWeight: '600',
      marginTop: 8,
    },
    analysisContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 30,
      width: '100%',
    },
    analysisItem: {
      width: '100%',
      marginBottom: 25,
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: 15,
      ...SHADOWS.small,
    },
    analysisTitle: {
      textAlign: 'center',
      marginBottom: 15,
      color: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      fontSize: 20,
      fontWeight: 'bold',
    },
    imageWrapper: {
      position: 'relative',
      width: 300,
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      overflow: 'hidden',
    },
    svgOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(44, 47, 51, 0.85)',
      borderRadius: 15,
    },
    loadingText: {
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      fontSize: 20,
      marginTop: 15,
      fontWeight: 'bold',
    },
    compatibilityCard: {
      backgroundColor: 'rgba(108, 99, 255, 0.2)',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      ...SHADOWS.small,
    },
    compatibilityTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      textAlign: 'center',
      marginBottom: 10,
    },
    compatibilityScoreContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    compatibilityImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
    },
    compatibilityScoreText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    compatibilityMessage: {
      fontSize: 14,
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      textAlign: 'center',
      lineHeight: 20,
    },
    detailCard: {
      backgroundColor: COLORS.white, // COLORS[theme].white yerine doğrudan COLORS.white
      borderRadius: 15,
      padding: 15,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      ...SHADOWS.small,
    },
    detailCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailCardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      flex: 1,
    },
    detailCardScore: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    detailCardDescription: {
      fontSize: 14,
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
      marginTop: 8,
      lineHeight: 20,
    },
    fullWidthImage: {
      width: '100%',
      height: 200,
      borderRadius: 15,
      marginVertical: 12,
      ...SHADOWS.small,
    },
    infoCard: {
      backgroundColor: COLORS.white, // COLORS[theme].white yerine doğrudan COLORS.white
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      ...SHADOWS.small,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.dark, // COLORS[theme].dark yerine doğrudan COLORS.dark
    },
    infoValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
      gap: 10,
    },
    greenButton: {
      backgroundColor: COLORS.success, // COLORS[theme].success yerine doğrudan COLORS.success
      borderRadius: 10,
      paddingVertical: 15,
      marginVertical: 10,
      alignItems: 'center',
      ...SHADOWS.medium,
      flex: 1,
    },
    redButton: {
      backgroundColor: COLORS.danger, // COLORS[theme].danger yerine doğrudan COLORS.danger
      borderRadius: 10,
      paddingVertical: 15,
      marginVertical: 10,
      alignItems: 'center',
      ...SHADOWS.medium,
      flex: 1,
    },
    unlockButton: {
      backgroundColor: COLORS.primary, // COLORS[theme].primary yerine doğrudan COLORS.primary
      borderRadius: 10,
      paddingVertical: 15,
      marginVertical: 10,
      alignItems: 'center',
      ...SHADOWS.medium,
      flex: 1,
      borderWidth: 2,
      borderColor: COLORS.accent, // COLORS[theme].accent yerine doğrudan COLORS.accent
    },
    errorText: {
      color: COLORS.danger, // COLORS[theme].danger yerine doğrudan COLORS.danger
      textAlign: 'center',
      fontSize: 16,
      backgroundColor: 'rgba(242, 95, 92, 0.2)',
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      fontWeight: 'bold',
    },
    warningText: {
      color: COLORS.warning, // COLORS[theme].warning yerine doğrudan COLORS.warning
      textAlign: 'center',
      fontSize: 16,
      backgroundColor: 'rgba(255, 0, 0, 0.23)',
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      fontStyle: 'italic',
    },
    teaserText: {
      fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
      color: '#7B31FF',
      textAlign: 'center',
      marginVertical: 15,
      fontStyle: 'italic',
      fontWeight: '600',
      paddingHorizontal: 20,
    },
    resultsHeader: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    eyesIcon: {
      fontSize: 32,
      marginBottom: 10,
      color: '#fff',
    },
    resultsTitle: {
      fontSize: Math.min(36, SCREEN_WIDTH * 0.09),
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
    },
    resultsSubtitle: {
      fontSize: Math.min(18, SCREEN_WIDTH * 0.045),
      color: '#fff',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    imagesContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: 15,
    },
    imageWithLabel: {
      alignItems: 'center',
      width: '40%',
      maxWidth: 150,
    },
    circularImage: {
      width: SCREEN_WIDTH * 0.25,
      height: SCREEN_WIDTH * 0.25,
      maxWidth: 100,
      maxHeight: 100,
      borderRadius: SCREEN_WIDTH * 0.125,
      borderWidth: 3,
      borderColor: '#fff',
      marginBottom: 5,
    },
    imageLabel: {
      color: '#fff',
      fontSize: Math.min(14, SCREEN_WIDTH * 0.035),
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
    },
    blurredCategories: {
      width: '100%',
      marginTop: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
      width: '100%',
    },
    categoryColumn: {
      alignItems: 'center',
      width: '48%',
    },
    categoryTitleSmall: {
      color: '#fff',
      fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
      textAlign: 'center',
      marginBottom: 5,
    },
    blurredScoreContainer: {
      width: 60,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 15,
    },
    blurredScore: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blurredContent: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 15,
    },
    fakeBlurOverlay: {
      position: 'absolute',
      width: '20%',
      height: '20%',
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: 15,
      opacity: 0.2,
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 18,
      elevation: 4,
    },
    scoreProgressBar: {
      width: '90%',
      height: 6,
      backgroundColor: '#444',
      borderRadius: 3,
      overflow: 'hidden',
    },
    scoreProgress: {
      height: '100%',
      backgroundColor: '#888',
      borderRadius: 3,
    },
    actionsButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: '5%',
      width: '100%',
      marginBottom: 20,
    },
    getProButton: {
      backgroundColor: '#7B31FF',
      paddingVertical: Math.min(15, SCREEN_WIDTH * 0.035),
      paddingHorizontal: Math.min(20, SCREEN_WIDTH * 0.04),
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginRight: 10,
      ...SHADOWS.medium,
      borderWidth: 2,
      borderColor: '#fff',
    },
    inviteFriendsButton: {
      backgroundColor: '#000',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#333',
      paddingVertical: Math.min(15, SCREEN_WIDTH * 0.035),
      paddingHorizontal: Math.min(20, SCREEN_WIDTH * 0.04),
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginLeft: 10,
      opacity: 0.7,
    },
    inviteFriendsButtonText: {
      color: '#aaa',
      fontSize: Math.min(16, SCREEN_WIDTH * 0.04),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    // ScrollView stilleri (Eklendi)
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 80,
      minHeight: height - 150,
      alignItems: 'center', // alignItems özelliği contentContainerStyle içinde tanımlı
    },
  });

export default getStyles;