// FacePetAnalysis/CompatibilityScore.js

const dogTraits = require('./dogTraits.json');

// Utility function to add a small random factor
const addRandomFactor = (score, range = 5) => {
  const randomAdjustment = (Math.random() * range * 2) - range; // Random number between -range and +range
  return Math.max(0, Math.min(100, Math.round(score + randomAdjustment)));
};

// Enerji ve Mutluluk Uyumu (Energy and Happiness Compatibility)
function calculateEnergyHappinessCompatibility(dogEnergy, happinessScore, activityLevel) {
  let score = 50;
  let description = {
    uk: '',
    tr: '',
    es: '',
    fr: '',
    de: ''
  };

  // Adjust score based on happiness and dog energy
  const energyDiff = Math.abs(dogEnergy - happinessScore);
  score = 100 - (energyDiff * 0.5); // Closer energies give higher scores

  // Adjust based on activity level (new factor)
  if (activityLevel > 70 && happinessScore > 70) {
    score += 10;
    description.uk = 'Your high happiness matches this energetic dog perfectly, especially with your active lifestyle!';
    description.tr = 'Yüksek mutluluğunuz, özellikle aktif yaşam tarzınızla bu enerjik köpekle mükemmel bir uyum sağlıyor!';
    description.es = '¡Tu alta felicidad coincide perfectamente con este perro enérgico, especialmente con tu estilo de vida activo!';
    description.fr = 'Votre bonheur élevé correspond parfaitement à ce chien énergique, surtout avec votre style de vie actif !';
    description.de = 'Deine hohe Zufriedenheit passt perfekt zu diesem energischen Hund, besonders mit deinem aktiven Lebensstil!';
  } else if (activityLevel < 30 && happinessScore < 30) {
    score += 5;
    description.uk = 'Your calm demeanor aligns well with this low-energy dog.';
    description.tr = 'Sakin yapınız bu düşük enerjili köpekle iyi uyum sağlıyor.';
    description.es = 'Tu comportamiento tranquilo se alinea bien con este perro de baja energía.';
    description.fr = 'Votre comportement calme s’aligne bien avec ce chien à faible énergie.';
    description.de = 'Deine ruhige Art passt gut zu diesem Hund mit niedriger Energie.';
  } else {
    score -= 5;
    description.uk = 'Your energy levels differ, but you can still find common ground.';
    description.tr = 'Enerji seviyeleriniz farklı, ancak yine de ortak bir zemin bulabilirsiniz.';
    description.es = 'Tus niveles de energía difieren, pero aún puedes encontrar un terreno común.';
    description.fr = 'Vos niveaux d’énergie diffèrent, mais vous pouvez toujours trouver un terrain d’entente.';
    description.de = 'Eure Energieniveaus unterscheiden sich, aber ihr könnt trotzdem Gemeinsamkeiten finden.';
  }

  score = addRandomFactor(score, 3);
  return { score, description };
}

// Yaş Uyumu (Age Compatibility)
function calculateAgeCompatibility(dogEnergy, age, dogAgePreference) {
  let score = 50;
  let description = {
    uk: '',
    tr: '',
    es: '',
    fr: '',
    de: ''
  };

  const ageDiff = Math.abs(age - dogAgePreference);
  score = 100 - (ageDiff * 2); // Closer age preferences give higher scores

  if (age < 30 && dogEnergy >= 70) {
    score += 10;
    description.uk = 'As a young person, you match well with this energetic dog!';
    description.tr = 'Genç biri olarak, bu enerjik köpekle iyi bir uyum sağlıyorsunuz!';
    description.es = 'Como persona joven, ¡tienes una buena compatibilidad con este perro enérgico!';
    description.fr = 'En tant que jeune personne, vous êtes bien compatible avec ce chien énergique !';
    description.de = 'Als junge Person passt du gut zu diesem energischen Hund!';
  } else if (age >= 50 && dogEnergy <= 50) {
    score += 8;
    description.uk = 'Your maturity aligns well with this calm dog.';
    description.tr = 'Olgunluğunuz bu sakin köpekle iyi uyum sağlıyor.';
    description.es = 'Tu madurez se alinea bien con este perro tranquilo.';
    description.fr = 'Votre maturité s’aligne bien avec ce chien calme.';
    description.de = 'Deine Reife passt gut zu diesem ruhigen Hund.';
  } else {
    description.uk = 'Age compatibility is moderate; you may need to adjust to each other.';
    description.tr = 'Yaş uyumluluğu orta; birbirinize uyum sağlamanız gerekebilir.';
    description.es = 'La compatibilidad de edad es moderada; puede que necesiten adaptarse mutuamente.';
    description.fr = 'La compatibilité d’âge est modérée ; vous devrez peut-être vous adapter l’un à l’autre.';
    description.de = 'Die Alterskompatibilität ist moderat; ihr müsst euch möglicherweise aneinander anpassen.';
  }

  score = addRandomFactor(score, 4);
  return { score, description };
}

// Duygu ve İfade Uyumu (Emotion and Expression Compatibility)
function calculateEmotionCompatibility(dogTemperament, dominantExpression, sociability) {
  let score = 50;
  let description = {
    uk: '',
    tr: '',
    es: '',
    fr: '',
    de: ''
  };

  if (dominantExpression === 'happy' && ['friendly', 'playful', 'energetic'].includes(dogTemperament)) {
    score = 90;
    if (sociability > 70) score += 5;
    description.uk = 'Your happy expression pairs wonderfully with this friendly dog!';
    description.tr = 'Mutlu ifadeniz, bu arkadaş canlısı köpekle harika bir uyum sağlıyor!';
    description.es = '¡Tu expresión feliz combina maravillosamente con este perro amigable!';
    description.fr = 'Votre expression heureuse se marie à merveille avec ce chien amical !';
    description.de = 'Dein fröhlicher Ausdruck passt wunderbar zu diesem freundlichen Hund!';
  } else if (dominantExpression === 'sad' && ['calm', 'gentle', 'relaxed'].includes(dogTemperament)) {
    score = 85;
    if (sociability < 30) score += 3;
    description.uk = 'Your calm sadness matches this gentle dog’s temperament.';
    description.tr = 'Hüzünlü sakinliğiniz, bu nazik köpeğin mizacıyla uyum sağlıyor.';
    description.es = 'Tu tristeza tranquila coincide con el temperamento gentil de este perro.';
    description.fr = 'Votre tristesse calme correspond au tempérament doux de ce chien.';
    description.de = 'Deine ruhige Traurigkeit passt zum sanften Temperament dieses Hundes.';
  } else if (dominantExpression === 'angry' && ['protective', 'serious', 'bold'].includes(dogTemperament)) {
    score = 80;
    description.uk = 'Your strong emotions align with this protective dog.';
    description.tr = 'Güçlü duygularınız, bu koruyucu köpekle uyum sağlıyor.';
    description.es = 'Tus emociones fuertes se alinean con este perro protector.';
    description.fr = 'Vos émotions fortes s’alignent avec ce chien protecteur.';
    description.de = 'Deine starken Emotionen passen zu diesem beschützenden Hund.';
  } else {
    score = 60;
    description.uk = 'Your emotions and the dog’s temperament are somewhat different.';
    description.tr = 'Duygularınız ve köpeğin mizacı biraz farklı.';
    description.es = 'Tus emociones y el temperamento del perro son algo diferentes.';
    description.fr = 'Vos émotions et le tempérament du chien sont quelque peu différents.';
    description.de = 'Deine Emotionen und das Temperament des Hundes sind etwas unterschiedlich.';
  }

  score = addRandomFactor(score, 3);
  return { score, description };
}

// Çevresel Uyum (Environmental Compatibility)
function calculateEnvironmentCompatibility(dogEnvironment, userActivityLevel) {
  let score = 50;
  let description = {
    uk: '',
    tr: '',
    es: '',
    fr: '',
    de: ''
  };

  if (dogEnvironment === 'active' && userActivityLevel > 70) {
    score = 90;
    description.uk = 'You both thrive in active environments—perfect match!';
    description.tr = 'İkiniz de aktif ortamlarda gelişiyorsunuz—mükemmel bir eşleşme!';
    description.es = '¡Ambos prosperan en entornos activos—una combinación perfecta!';
    description.fr = 'Vous prospérez tous les deux dans des environnements actifs—un match parfait !';
    description.de = 'Ihr beide gedeiht in aktiven Umgebungen—eine perfekte Übereinstimmung!';
  } else if (dogEnvironment === 'calm' && userActivityLevel < 30) {
    score = 85;
    description.uk = 'You both prefer a calm environment, great compatibility!';
    description.tr = 'İkiniz de sakin bir ortamı tercih ediyorsunuz, harika bir uyum!';
    description.es = 'Ambos prefieren un entorno tranquilo, ¡gran compatibilidad!';
    description.fr = 'Vous préférez tous les deux un environnement calme, excellente compatibilité !';
    description.de = 'Ihr bevorzugt beide eine ruhige Umgebung, tolle Kompatibilität!';
  } else {
    score = 60;
    description.uk = 'Your environmental preferences differ slightly.';
    description.tr = 'Çevresel tercihleriniz biraz farklı.';
    description.es = 'Tus preferencias ambientales difieren ligeramente.';
    description.fr = 'Vos préférences environnementales diffèrent légèrement.';
    description.de = 'Eure Umgebungspräferenzen unterscheiden sich leicht.';
  }

  score = addRandomFactor(score, 2);
  return { score, description };
}

// Main Compatibility Score Calculation
export default function calculateCompatibilityScore(petResult, faceResult) {
  if (!petResult || !faceResult || !faceResult[0]) {
    return {
      score: 0,
      message: {
        uk: 'Compatibility score could not be calculated. Missing analysis results.',
        tr: 'Uyum skoru hesaplanamadı. Eksik analiz sonuçları.',
        es: 'No se pudo calcular la puntuación de compatibilidad. Faltan resultados de análisis.',
        fr: 'Le score de compatibilité n’a pas pu être calculé. Résultats d’analyse manquants.',
        de: 'Der Kompatibilitätswert konnte nicht berechnet werden. Fehlende Analyseergebnisse.'
      },
      details: [],
      color: 'gray'
    };
  }

  const dogBreed = petResult.predicted_label || "Unknown";
  const dogData = dogTraits[dogBreed] || dogTraits["Unknown"];

  const age = faceResult[0].age || 30;
  const gender = faceResult[0].gender || 'unknown';
  const expressions = faceResult[0].expressions || {
    happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0
  };
  const dominantExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
  const happinessScore = (expressions.happy || 0) * 100;

  // Simulate user activity level and sociability (these could be inputs from the user in a real app)
  const userActivityLevel = happinessScore * 1.2; // Approximate based on happiness
  const userSociability = Math.random() * 100; // Random for now

  const { score: eScore, description: eDesc } = calculateEnergyHappinessCompatibility(dogData.energy, happinessScore, userActivityLevel);
  const { score: aScore, description: aDesc } = calculateAgeCompatibility(dogData.energy, age, dogData.agePreference || 30);
  const { score: emScore, description: emDesc } = calculateEmotionCompatibility(dogData.temperament, dominantExpression, userSociability);
  const { score: envScore, description: envDesc } = calculateEnvironmentCompatibility(dogData.environment, userActivityLevel);

  // Dynamic weighting based on user and pet characteristics
  const weights = {
    energy: happinessScore > 70 ? 0.35 : 0.25,
    age: age < 30 || age > 50 ? 0.3 : 0.25,
    emotion: ['happy', 'sad'].includes(dominantExpression) ? 0.25 : 0.2,
    environment: userActivityLevel > 70 || userActivityLevel < 30 ? 0.2 : 0.3
  };

  const finalScore = Math.round(
    (weights.energy * eScore) +
    (weights.age * aScore) +
    (weights.emotion * emScore) +
    (weights.environment * envScore)
  );

  let color = 'red';
  if (finalScore >= 85) {
    color = 'green';
  } else if (finalScore >= 70) {
    color = 'orange';
  } else if (finalScore >= 50) {
    color = 'yellow';
  }

  const details = [
    { title: { uk: 'Energy and Happiness Compatibility', tr: 'Enerji ve Mutluluk Uyumu', es: 'Compatibilidad de Energía y Felicidad', fr: 'Compatibilité Énergie et Bonheur', de: 'Energie- und Glückskompatibilität' }, score: eScore, description: eDesc },
    { title: { uk: 'Age Compatibility', tr: 'Yaş Uyumu', es: 'Compatibilidad de Edad', fr: 'Compatibilité d’Âge', de: 'Alterskompatibilität' }, score: aScore, description: aDesc },
    { title: { uk: 'Emotion and Expression Compatibility', tr: 'Duygu ve İfade Uyumu', es: 'Compatibilidad de Emoción y Expresión', fr: 'Compatibilité Émotion et Expression', de: 'Emotions- und Ausdrucks-Kompatibilität' }, score: emScore, description: emDesc },
    { title: { uk: 'Environment Compatibility', tr: 'Çevresel Uyum', es: 'Compatibilidad Ambiental', fr: 'Compatibilité Environnementale', de: 'Umgebungskompatibilität' }, score: envScore, description: envDesc }
  ];

  let message = {
    uk: '',
    tr: '',
    es: '',
    fr: '',
    de: ''
  };
  if (finalScore >= 85) {
    message.uk = `Perfect match! You and ${dogBreed} are a dream team!`;
    message.tr = `Mükemmel eşleşme! Sen ve ${dogBreed} harika bir ikilisiniz!`;
    message.es = `¡Combinación perfecta! ¡Tú y ${dogBreed} son un equipo de ensueño!`;
    message.fr = `Match parfait ! Vous et ${dogBreed} formez une équipe de rêve !`;
    message.de = `Perfekte Übereinstimmung! Du und ${dogBreed} seid ein Dreamteam!`;
  } else if (finalScore >= 70) {
    message.uk = `Great compatibility! You and ${dogBreed} can build a strong bond with a little effort.`;
    message.tr = `Harika bir uyum! Sen ve ${dogBreed} biraz çabayla güçlü bir bağ kurabilirsiniz.`;
    message.es = `¡Gran compatibilidad! Tú y ${dogBreed} pueden construir un vínculo fuerte con un poco de esfuerzo.`;
    message.fr = `Grande compatibilité ! Vous et ${dogBreed} pouvez créer un lien fort avec un peu d’effort.`;
    message.de = `Große Kompatibilität! Du und ${dogBreed} könnt mit etwas Aufwand eine starke Bindung aufbauen.`;
  } else if (finalScore >= 50) {
    message.uk = `Moderate compatibility. You and ${dogBreed} may need some adjustments to get along well.`;
    message.tr = `Orta düzey uyum. Sen ve ${dogBreed} iyi anlaşmak için bazı ayarlamalar yapmanız gerekebilir.`;
    message.es = `Compatibilidad moderada. Tú y ${dogBreed} podrían necesitar algunos ajustes para llevarse bien.`;
    message.fr = `Compatibilité modérée. Vous et ${dogBreed} devrez peut-être faire des ajustements pour bien vous entendre.`;
    message.de = `Moderate Kompatibilität. Du und ${dogBreed} müsst vielleicht einige Anpassungen vornehmen, um gut miteinander auszukommen.`;
  } else {
    message.uk = `Low compatibility. You and ${dogBreed} might find it challenging to connect.`;
    message.tr = `Düşük uyum. Sen ve ${dogBreed} bağlantı kurmakta zorlanabilirsiniz.`;
    message.es = `Baja compatibilidad. Tú y ${dogBreed} podrían encontrar difícil conectar.`;
    message.fr = `Faible compatibilité. Vous et ${dogBreed} pourriez avoir du mal à vous connecter.`;
    message.de = `Geringe Kompatibilität. Du und ${dogBreed} könntet Schwierigkeiten haben, eine Verbindung aufzubauen.`;
  }

  return {
    score: finalScore,
    message,
    details,
    color
  };
}