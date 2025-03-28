import translations from './translations.json'; // translations.json dosyasını import et
import { formatBreedName } from './App.js'; // formatBreedName fonksiyonunu app.js'den import et (ya da bunu da ayrı bir util dosyasına taşıyabilirsin)

const generatePersonalizedReport = (petResults, faceResults, userQuestions, language) => {
  const dogBreed = formatBreedName(petResults.predicted_label);
  const age = faceResults[0].age;
  const dominantExpression = Object.entries(faceResults[0].expressions).sort((a, b) => b[1] - a[1])[0][0];

  // Temel rapor mesajı
  const baseMessage = translations[language].personalizedReportBaseMessage
    ?.replace('{dogBreed}', dogBreed) || `Your compatibility with ${dogBreed} is highly unique based on your lifestyle and emotional state.`;

  let report = baseMessage + ' ';

  // Koşullu eklemeler
  if (userQuestions.hasLargeSpace) {
    report += translations[language].personalizedReportLargeSpace || "Having a large living space supports this breed’s energy. ";
  }
  if (userQuestions.hoursAtHome === "8+") {
    report += translations[language].personalizedReportLongHours || "Spending long hours at home allows you to build a strong bond with your dog. ";
  }
  if (dominantExpression === "happy") {
    report += translations[language].personalizedReportHappyExpression || "Your happy expression pairs wonderfully with this dog’s cheerful nature.";
  } else if (dominantExpression === "sad") {
    report += translations[language].personalizedReportSadExpression || "Your calm and emotional demeanor could help this dog provide a peaceful companionship.";
  }

  return report.trim();
};

export default generatePersonalizedReport;