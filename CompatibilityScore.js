// calculateCompatibilityScore.js - Updated Version
const dogTraits = require('./dogTraits.json');

// Utility function to add a small random factor
const addRandomFactor = (score, range = 5) => {
  const randomAdjustment = (Math.random() * range * 2) - range; // Random number between -range and +range
  return Math.max(0, Math.min(100, Math.round(score + randomAdjustment)));
};

// Enerji ve Mutluluk Uyumu
function calculateEnergyHappinessCompatibility(dogEnergy, happinessScore, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };

  const energyDiff = Math.abs(dogEnergy - happinessScore);
  score = 100 - (energyDiff * 0.5);

  const activeDays = userQuestions.activeDays || "3-5";
  const hobbyTime = userQuestions.hobbyTime || "1-3";

  if (activeDays === "6-7" && happinessScore > 70) {
    score += 10;
    description.uk = 'Your high happiness and active lifestyle align perfectly!';
    description.tr = 'Yüksek mutluluğunuz ve aktif yaşam tarzınız mükemmel bir uyum sağlıyor!';
    description.es = '¡Tu alta felicidad y estilo de vida activo se alinean perfectamente!';
    description.fr = 'Votre bonheur élevé et votre style de vie actif s’alignent parfaitement !';
    description.de = 'Deine hohe Zufriedenheit und dein aktiver Lebensstil passen perfekt!';
  } else if (activeDays === "0-2" && happinessScore < 30) {
    score += 5;
    description.uk = 'Your calm energy suits a relaxed pace.';
    description.tr = 'Sakin enerjiniz rahat bir tempoya uyuyor.';
    description.es = 'Tu energía tranquila se adapta a un ritmo relajado.';
    description.fr = 'Votre énergie calme convient à un rythme détendu.';
    description.de = 'Deine ruhige Energie passt zu einem entspannten Tempo.';
  } else {
    score -= 5;
    description.uk = 'Your energy levels differ slightly, but it’s manageable.';
    description.tr = 'Enerji seviyeleriniz biraz farklı, ancak idare edilebilir.';
    description.es = 'Tus niveles de energía difieren ligeramente, pero es manejable.';
    description.fr = 'Vos niveaux d’énergie diffèrent légèrement, mais c’est gérable.';
    description.de = 'Eure Energieniveaus unterscheiden sich leicht, aber es ist machbar.';
  }

  // Incorporate hobbyTime: More hobby time might indicate more energy for activities
  if (hobbyTime === "3+") {
    score += 5;
  } else if (hobbyTime === "lessThan1") {
    score -= 5;
  }

  score = addRandomFactor(score, 3);
  return { score, description };
}

// Yaş Uyumu
function calculateAgeCompatibility(dogEnergy, age, dogAgePreference, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };

  const ageDiff = Math.abs(age - (dogAgePreference || 30));
  score = 100 - (ageDiff * 2);

  const activeDays = userQuestions.activeDays || "3-5";

  if (age < 30 && dogEnergy >= 70) {
    score += 10;
    if (activeDays === "6-7") {
      score += 5; // Active lifestyle suits a high-energy dog
    }
    description.uk = 'Your youthful energy matches an active lifestyle!';
    description.tr = 'Genç enerjiniz aktif bir yaşam tarzıyla uyuşuyor!';
    description.es = '¡Tu energía juvenil coincide con un estilo de vida activo!';
    description.fr = 'Votre énergie juvénile correspond à un style de vie actif !';
    description.de = 'Deine jugendliche Energie passt zu einem aktiven Lebensstil!';
  } else if (age >= 50 && dogEnergy <= 50) {
    score += 8;
    if (activeDays === "0-2") {
      score += 5; // Less active lifestyle suits a low-energy dog
    }
    description.uk = 'Your maturity suits a calm pace.';
    description.tr = 'Olgunluğunuz sakin bir tempoya uyuyor.';
    description.es = 'Tu madurez se adapta a un ritmo tranquilo.';
    description.fr = 'Votre maturité convient à un rythme calme.';
    description.de = 'Deine Reife passt zu einem ruhigen Tempo.';
  } else {
    description.uk = 'Age compatibility is moderate; adjustments may help.';
    description.tr = 'Yaş uyumluluğu orta; ayarlamalar yardımcı olabilir.';
    description.es = 'La compatibilidad de edad es moderada; ajustes podrían ayudar.';
    description.fr = 'La compatibilité d’âge est modérée ; des ajustements peuvent aider.';
    description.de = 'Die Alterskompatibilität ist moderat; Anpassungen könnten helfen.';
  }

  score = addRandomFactor(score, 4);
  return { score, description };
}

// Duygu ve İfade Uyumu
function calculateEmotionCompatibility(dogTemperament, dominantExpression, socialNeed, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };

  const hobbyTime = userQuestions.hobbyTime || "1-3";
  const livingWith = userQuestions.livingWith || "Yalnız yaşıyorum";

  if (dominantExpression === 'happy' && ['friendly', 'playful', 'energetic'].includes(dogTemperament)) {
    score = 90;
    if (socialNeed > 70) score += 5;
    if (livingWith !== "Yalnız yaşıyorum") score += 5; // Social environment boosts happiness
    description.uk = 'Your cheerful mood complements a lively spirit!';
    description.tr = 'Neşeli ruh haliniz canlı bir enerjiyle uyum sağlıyor!';
    description.es = '¡Tu estado de ánimo alegre complementa un espíritu vivaz!';
    description.fr = 'Votre humeur joyeuse complète un esprit vif !';
    description.de = 'Deine fröhliche Stimmung ergänzt einen lebhaften Geist!';
  } else if (dominantExpression === 'sad' && ['calm', 'gentle', 'relaxed'].includes(dogTemperament)) {
    score = 85;
    if (socialNeed < 30) score += 3;
    if (livingWith === "Yalnız yaşıyorum") score += 3; // Solitude suits a calm temperament
    description.uk = 'Your calm mood aligns with a gentle nature.';
    description.tr = 'Sakin ruh haliniz nazik bir doğayla uyuşuyor.';
    description.es = 'Tu estado de ánimo tranquilo se alinea con una naturaleza gentil.';
    description.fr = 'Votre humeur calme s’aligne avec une nature douce.';
    description.de = 'Deine ruhige Stimmung passt zu einer sanften Natur.';
  } else if (dominantExpression === 'angry' && ['protective', 'serious', 'bold'].includes(dogTemperament)) {
    score = 80;
    description.uk = 'Your strong emotions match a bold personality.';
    description.tr = 'Güçlü duygularınız cesur bir kişilikle uyuşuyor.';
    description.es = 'Tus emociones fuertes coinciden con una personalidad audaz.';
    description.fr = 'Vos émotions fortes correspondent à une personnalité audacieuse.';
    description.de = 'Deine starken Emotionen passen zu einer mutigen Persönlichkeit.';
  } else {
    score = 60;
    description.uk = 'Your mood and temperament differ slightly.';
    description.tr = 'Ruh haliniz ve mizacınız biraz farklı.';
    description.es = 'Tu estado de ánimo y temperamento difieren ligeramente.';
    description.fr = 'Votre humeur et tempérament diffèrent légèrement.';
    description.de = 'Deine Stimmung und dein Temperament unterscheiden sich leicht.';
  }

  // Incorporate hobbyTime: More hobby time might indicate better emotional availability
  if (hobbyTime === "3+") {
    score += 5;
  } else if (hobbyTime === "lessThan1") {
    score -= 5;
  }

  score = addRandomFactor(score, 3);
  return { score, description };
}

// Çevresel Uyum (Güncellendi)
function calculateEnvironmentCompatibility(dogData, userQuestions, age, dominantExpression) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };

  // Soru 1: Bahçeli ev
  if (dogData.spaceRequirement === "high" && userQuestions.hasLargeSpace) {
    score += 20;
    description.uk = 'Your spacious home suits an active lifestyle!';
    description.tr = 'Geniş eviniz aktif bir yaşam tarzına uyuyor!';
    description.es = '¡Tu hogar espacioso se adapta a un estilo de vida activo!';
    description.fr = 'Votre maison spacieuse convient à un style de vie actif !';
    description.de = 'Dein geräumiges Zuhause passt zu einem aktiven Lebensstil!';
  } else if (dogData.spaceRequirement === "low" && !userQuestions.hasLargeSpace) {
    score += 15;
    description.uk = 'Your cozy space fits a relaxed vibe!';
    description.tr = 'Küçük alanınız sakin bir havaya uyuyor!';
    description.es = '¡Tu espacio acogedor encaja con una vibra relajada!';
    description.fr = 'Votre espace confortable convient à une ambiance détendue !';
    description.de = 'Dein gemütlicher Raum passt zu einer entspannten Atmosphäre!';
  } else {
    description.uk = 'Your space may need adjustments for your pet.';
    description.tr = 'Eviniz evcil hayvanınız için bazı ayarlamalara ihtiyaç duyabilir.';
    description.es = 'Tu espacio puede necesitar ajustes para tu mascota.';
    description.fr = 'Votre espace peut nécessiter des ajustements pour votre animal.';
    description.de = 'Dein Raum könnte Anpassungen für dein Haustier benötigen.';
  }

  // Soru 2: Evde geçirilen süre
  if (dogData.socialNeed > 70 && userQuestions.hoursAtHome === "8+") {
    score += 15;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space')) {
      description.uk = 'Your time at home supports a social vibe!';
      description.tr = 'Evde geçirdiğiniz süre sosyal bir havayı destekliyor!';
      description.es = '¡El tiempo que pasas en casa apoya una vibra social!';
      description.fr = 'Le temps passé chez vous soutient une ambiance sociale !';
      description.de = 'Die Zeit zu Hause unterstützt eine soziale Atmosphäre!';
    }
  } else if (dogData.independence > 70 && userQuestions.hoursAtHome === "0-4") {
    score += 10;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space')) {
      description.uk = 'Your busy schedule suits an independent nature!';
      description.tr = 'Yoğun programınız bağımsız bir doğaya uyuyor!';
      description.es = '¡Tu agenda ocupada encaja con una naturaleza independiente!';
      description.fr = 'Votre emploi du temps chargé convient à une nature indépendante !';
      description.de = 'Dein voller Terminkalender passt zu einer unabhängigen Natur!';
    }
  }

  // Soru 3: Aktif günler
  if (dogData.activityPreference === "outdoor" && userQuestions.activeDays === "6-7" && age < 30) {
    score += 20;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule')) {
      description.uk = 'Your youthful energy thrives outdoors!';
      description.tr = 'Genç enerjiniz dışarıda parlıyor!';
      description.es = '¡Tu energía juvenil prospera al aire libre!';
      description.fr = 'Votre énergie juvénile s’épanouit en extérieur !';
      description.de = 'Deine jugendliche Energie gedeiht im Freien!';
    }
  } else if (dogData.activityPreference === "indoor" && userQuestions.activeDays === "0-2") {
    score += 15;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule')) {
      description.uk = 'Your calm routine enjoys indoor time!';
      description.tr = 'Sakin rutininiz iç mekan zamanını seviyor!';
      description.es = '¡Tu rutina tranquila disfruta del tiempo en interiores!';
      description.fr = 'Votre routine calme apprécie le temps en intérieur !';
      description.de = 'Deine ruhige Routine genießt die Zeit drinnen!';
    }
  }

  // Soru 4: Hobiler ve bakım
  if (dogData.groomingNeed > 50 && userQuestions.hobbyTime === "3+") {
    score += 10;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule') && !description.uk.includes('Your youthful energy') && !description.uk.includes('Your calm routine')) {
      description.uk = 'Your dedication to hobbies fits a detailed routine!';
      description.tr = 'Hobilerinize olan bağlılığınız detaylı bir rutine uyuyor!';
      description.es = '¡Tu dedicación a los pasatiempos encaja con una rutina detallada!';
      description.fr = 'Votre dévouement aux loisirs convient à une routine détaillée !';
      description.de = 'Deine Hingabe an Hobbys passt zu einer detaillierten Routine!';
    }
  } else if (dogData.groomingNeed < 30 && userQuestions.hobbyTime === "lessThan1") {
    score += 5;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule') && !description.uk.includes('Your youthful energy') && !description.uk.includes('Your calm routine')) {
      description.uk = 'You prefer a low-maintenance lifestyle!';
      description.tr = 'Düşük bakım gerektiren bir yaşam tarzını tercih ediyorsunuz!';
      description.es = '¡Prefieres un estilo de vida de bajo mantenimiento!';
      description.fr = 'Vous préférez un style de vie nécessitant peu d’entretien !';
      description.de = 'Du bevorzugst einen pflegeleichten Lebensstil!';
    }
  }

  // Soru 5: Evdeki bireyler
  if (dogData.socialNeed > 70 && userQuestions.livingWith !== "Yalnız yaşıyorum" && dominantExpression === "happy") {
    score += 10;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule') && !description.uk.includes('Your youthful energy') && !description.uk.includes('Your calm routine') && !description.uk.includes('Your dedication to hobbies') && !description.uk.includes('You prefer a low-maintenance lifestyle')) {
      description.uk = 'Your lively household matches your positivity!';
      description.tr = 'Canlı eviniz pozitifliğinize uyuyor!';
      description.es = '¡Tu hogar animado coincide con tu positividad!';
      description.fr = 'Votre foyer animé correspond à votre positivité !';
      description.de = 'Dein lebhafter Haushalt passt zu deiner Positivität!';
    }
  } else if (dogData.independence > 70 && userQuestions.livingWith === "Yalnız yaşıyorum") {
    score += 5;
    if (!description.uk.includes('Your spacious home') && !description.uk.includes('Your cozy space') && !description.uk.includes('Your time at home') && !description.uk.includes('Your busy schedule') && !description.uk.includes('Your youthful energy') && !description.uk.includes('Your calm routine') && !description.uk.includes('Your dedication to hobbies') && !description.uk.includes('You prefer a low-maintenance lifestyle')) {
      description.uk = 'Your solo living suits a calm vibe!';
      description.tr = 'Yalnız yaşamınız sakin bir havaya uyuyor!';
      description.es = '¡Tu vida en solitario encaja con una vibra tranquila!';
      description.fr = 'Votre vie en solo convient à une ambiance calme !';
      description.de = 'Dein Alleinleben passt zu einer ruhigen Atmosphäre!';
    }
  }

  score = addRandomFactor(score, 3);
  return { score: Math.min(score, 100), description };
}

// Main Compatibility Score Calculation
export default function calculateCompatibilityScore(petResult, faceResult, userQuestions = {}) {
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
  const expressions = faceResult[0].expressions || {
    happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 0
  };
  const dominantExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
  const happinessScore = (expressions.happy || 0) * 100;

  const { score: eScore, description: eDesc } = calculateEnergyHappinessCompatibility(
    dogData.energy,
    happinessScore,
    userQuestions
  );
  const { score: aScore, description: aDesc } = calculateAgeCompatibility(
    dogData.energy,
    age,
    dogData.agePreference || 30,
    userQuestions
  );
  const { score: emScore, description: emDesc } = calculateEmotionCompatibility(
    dogData.temperament,
    dominantExpression,
    dogData.socialNeed,
    userQuestions
  );
  const { score: envScore, description: envDesc } = calculateEnvironmentCompatibility(
    dogData,
    userQuestions,
    age,
    dominantExpression
  );

  // Dynamic weighting
  const weights = {
    energy: happinessScore > 70 ? 0.25 : 0.20,
    age: age < 30 || age > 50 ? 0.20 : 0.15,
    emotion: ['happy', 'sad'].includes(dominantExpression) ? 0.20 : 0.15,
    environment: 0.40 // Sorular çevresel uyuma daha fazla etki etsin
  };

  const finalScore = Math.round(
    (weights.energy * eScore) +
    (weights.age * aScore) +
    (weights.emotion * emScore) +
    (weights.environment * envScore)
  );

  let color = 'red';
  if (finalScore >= 85) color = 'green';
  else if (finalScore >= 70) color = 'orange';
  else if (finalScore >= 50) color = 'yellow';

  const details = [
    { title: { uk: 'Energy and Happiness Compatibility', tr: 'Enerji ve Mutluluk Uyumu', es: 'Compatibilidad de Energía y Felicidad', fr: 'Compatibilité Énergie et Bonheur', de: 'Energie- und Glückskompatibilität' }, score: eScore, description: eDesc },
    { title: { uk: 'Age Compatibility', tr: 'Yaş Uyumu', es: 'Compatibilidad de Edad', fr: 'Compatibilité d’Âge', de: 'Alterskompatibilität' }, score: aScore, description: aDesc },
    { title: { uk: 'Emotion and Expression Compatibility', tr: 'Duygu ve İfade Uyumu', es: 'Compatibilidad de Emoción y Expresión', fr: 'Compatibilité Émotion et Expression', de: 'Emotions- und Ausdrucks-Kompatibilität' }, score: emScore, description: emDesc },
    { title: { uk: 'Environment Compatibility', tr: 'Çevresel Uyum', es: 'Compatibilidad Ambiental', fr: 'Compatibilité Environnementale', de: 'Umgebungskompatibilität' }, score: envScore, description: envDesc }
  ];

  let message = { uk: '', tr: '', es: '', fr: '', de: '' };
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