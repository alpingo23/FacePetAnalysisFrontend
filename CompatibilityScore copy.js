// calculateCompatibilityScore.js - Enhanced Version
const dogTraits = require('./dogTraits.json');

// Utility function to add a small random factor
const addRandomFactor = (score, range = 5) => {
  const randomAdjustment = Math.random() * range * 2 - range; // Random number between -range and +range
  return Math.max(0, Math.min(100, Math.round(score + randomAdjustment)));
};

// Enerji ve Mutluluk Uyumu
function calculateEnergyHappinessCompatibility(dogEnergy, happinessScore, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const energyDiff = Math.abs(dogEnergy - happinessScore);
  score = 100 - energyDiff * 0.5;

  const activeDays = userQuestions.activeDays || "3-5";
  const hobbyTime = userQuestions.hobbyTime || "1-3";

  if (activeDays === "6-7" && happinessScore > 70) {
    score += 15;
    description.uk = 'Your vibrant energy and active lifestyle create a perfect harmony! You both thrive on movement and joy.';
    description.tr = 'Canlı enerjiniz ve aktif yaşam tarzınız mükemmel bir uyum yaratıyor! İkiniz de hareket ve neşeden besleniyorsunuz.';
    description.es = '¡Tu energía vibrante y estilo de vida activo crean una armonía perfecta! Ambos prosperan con movimiento y alegría.';
    description.fr = 'Votre énergie vibrante et votre style de vie actif créent une harmonie parfaite ! Vous prospérez tous les deux grâce au mouvement et à la joie.';
    description.de = 'Deine lebendige Energie und dein aktiver Lebensstil schaffen eine perfekte Harmonie! Ihr beide gedeiht durch Bewegung und Freude.';
    recommendation.uk = 'Keep up your active routine! Plan daily walks or playtime to maintain this amazing energy match.';
    recommendation.tr = 'Aktif rutininizi devam ettirin! Bu harika enerji uyumunu korumak için günlük yürüyüşler veya oyun zamanı planlayın.';
    recommendation.es = '¡Mantén tu rutina activa! Planea paseos diarios o tiempo de juego para mantener esta increíble coincidencia de energía.';
    recommendation.fr = 'Continuez votre routine active ! Planifiez des promenades quotidiennes ou des moments de jeu pour maintenir cette incroyable correspondance énergétique.';
    recommendation.de = 'Behalte deine aktive Routine bei! Plane tägliche Spaziergänge oder Spielzeiten, um diese großartige Energieübereinstimmung zu erhalten.';
  } else if (activeDays === "0-2" && happinessScore < 30) {
    score += 10;
    description.uk = 'Your calm and relaxed energy aligns beautifully with a slower pace. You both enjoy a peaceful vibe.';
    description.tr = 'Sakin ve rahat enerjiniz, daha yavaş bir tempoyla güzel bir uyum sağlıyor. İkiniz de huzurlu bir atmosferden keyif alıyorsunuz.';
    description.es = 'Tu energía tranquila y relajada se alinea maravillosamente con un ritmo más lento. Ambos disfrutan de una vibra pacífica.';
    description.fr = 'Votre énergie calme et détendue s’aligne magnifiquement avec un rythme plus lent. Vous appréciez tous les deux une ambiance paisible.';
    description.de = 'Deine ruhige und entspannte Energie passt wunderbar zu einem langsameren Tempo. Ihr beide genießt eine friedliche Atmosphäre.';
    recommendation.uk = 'Create a cozy space for relaxation. A quiet evening routine will strengthen your bond.';
    recommendation.tr = 'Rahatlamak için sıcak bir alan yaratın. Sessiz bir akşam rutini bağınızı güçlendirecektir.';
    recommendation.es = 'Crea un espacio acogedor para la relajación. Una rutina tranquila por la noche fortalecerá su vínculo.';
    recommendation.fr = 'Créez un espace confortable pour la détente. Une routine calme le soir renforcera votre lien.';
    recommendation.de = 'Schaffe einen gemütlichen Raum zum Entspannen. Eine ruhige Abendroutine wird eure Bindung stärken.';
  } else {
    score -= 5;
    description.uk = 'Your energy levels differ slightly, which might require some adjustments to find a balance.';
    description.tr = 'Enerji seviyeleriniz biraz farklı, bu da dengeyi bulmak için bazı ayarlamalar gerektirebilir.';
    description.es = 'Tus niveles de energía difieren ligeramente, lo que podría requerir algunos ajustes para encontrar un equilibrio.';
    description.fr = 'Vos niveaux d’énergie diffèrent légèrement, ce qui pourrait nécessiter quelques ajustements pour trouver un équilibre.';
    description.de = 'Eure Energieniveaus unterscheiden sich leicht, was einige Anpassungen erfordern könnte, um ein Gleichgewicht zu finden.';
    recommendation.uk = 'Try to match your energy levels by scheduling activities that suit both of you, like a short walk or a playful game.';
    recommendation.tr = 'İkinize de uygun aktiviteler planlayarak enerji seviyelerinizi eşitlemeye çalışın, örneğin kısa bir yürüyüş veya eğlenceli bir oyun.';
    recommendation.es = 'Intenta igualar tus niveles de energía programando actividades que les convengan a ambos, como un paseo corto o un juego divertido.';
    recommendation.fr = 'Essayez d’harmoniser vos niveaux d’énergie en planifiant des activités qui conviennent à tous les deux, comme une courte promenade ou un jeu amusant.';
    recommendation.de = 'Versuche, eure Energieniveaus anzugleichen, indem du Aktivitäten planst, die euch beiden passen, wie ein kurzer Spaziergang oder ein spielerisches Spiel.';
  }

  if (hobbyTime === "3+") {
    score += 5;
    recommendation.uk += ' Your ample hobby time suggests you can dedicate more energy to activities—perfect for keeping up with your pet!';
    recommendation.tr += ' Bol hobi zamanınız, aktivitelere daha fazla enerji ayırabileceğinizi gösteriyor—evcil hayvanınızla uyum için mükemmel!';
    recommendation.es += ' ¡Tu amplio tiempo para hobbies sugiere que puedes dedicar más energía a actividades, perfecto para seguirle el paso a tu mascota!';
    recommendation.fr += ' Votre temps libre pour les loisirs suggère que vous pouvez consacrer plus d’énergie aux activités, parfait pour suivre votre animal !';
    recommendation.de += ' Deine reichliche Freizeit für Hobbys deutet darauf hin, dass du mehr Energie für Aktivitäten aufbringen kannst – perfekt, um mit deinem Haustier Schritt zu halten!';
  } else if (hobbyTime === "lessThan1") {
    score -= 5;
    recommendation.uk += ' With limited hobby time, consider short, meaningful activities to boost your energy connection.';
    recommendation.tr += ' Sınırlı hobi zamanınızla, enerji bağlantınızı artırmak için kısa, anlamlı aktiviteler düşünün.';
    recommendation.es += ' Con un tiempo limitado para hobbies, considera actividades cortas y significativas para fortalecer tu conexión energética.';
    recommendation.fr += ' Avec un temps limité pour les loisirs, envisagez des activités courtes et significatives pour renforcer votre connexion énergétique.';
    recommendation.de += ' Bei begrenzter Freizeit für Hobbys solltest du kurze, bedeutungsvolle Aktivitäten in Betracht ziehen, um eure energetische Verbindung zu stärken.';
  }

  score = addRandomFactor(score, 3);
  return { score, description, recommendation };
}

// Yaş Uyumu
function calculateAgeCompatibility(dogEnergy, age, dogAgePreference, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const ageDiff = Math.abs(age - (dogAgePreference || 30));
  score = 100 - ageDiff * 2;

  const activeDays = userQuestions.activeDays || "3-5";

  if (age < 30 && dogEnergy >= 70) {
    score += 15;
    if (activeDays === "6-7") {
      score += 5;
    }
    description.uk = 'Your youthful spirit and high energy make you a dynamic duo! You’re both ready for adventure.';
    description.tr = 'Genç ruhunuz ve yüksek enerjiniz sizi dinamik bir ikili yapıyor! İkiniz de maceraya hazırsınız.';
    description.es = '¡Tu espíritu juvenil y alta energía los convierten en un dúo dinámico! Ambos están listos para la aventura.';
    description.fr = 'Votre esprit juvénile et votre haute énergie font de vous un duo dynamique ! Vous êtes tous les deux prêts pour l’aventure.';
    description.de = 'Dein jugendlicher Geist und deine hohe Energie machen euch zu einem dynamischen Duo! Ihr seid beide bereit für Abenteuer.';
    recommendation.uk = 'Embrace your energy with outdoor adventures like hiking or fetch games to keep the excitement alive.';
    recommendation.tr = 'Heyecanınızı canlı tutmak için yürüyüş veya getir-götür oyunları gibi açık hava maceralarıyla enerjinizi kucaklayın.';
    recommendation.es = 'Aprovecha tu energía con aventuras al aire libre como caminatas o juegos de buscar para mantener la emoción viva.';
    recommendation.fr = 'Profitez de votre énergie avec des aventures en plein air comme la randonnée ou des jeux de lancer pour garder l’excitation vivante.';
    recommendation.de = 'Nutze deine Energie mit Outdoor-Abenteuern wie Wandern oder Apportierspielen, um die Aufregung am Leben zu erhalten.';
  } else if (age >= 50 && dogEnergy <= 50) {
    score += 12;
    if (activeDays === "0-2") {
      score += 5;
    }
    description.uk = 'Your mature and calm demeanor pairs wonderfully with a relaxed pace. You both value tranquility.';
    description.tr = 'Olgun ve sakin tavrınız, rahat bir tempoyla harika bir şekilde eşleşiyor. İkiniz de huzuru değer veriyorsunuz.';
    description.es = 'Tu actitud madura y tranquila se combina maravillosamente con un ritmo relajado. Ambos valoran la tranquilidad.';
    description.fr = 'Votre attitude mature et calme se marie à merveille avec un rythme détendu. Vous appréciez tous les deux la tranquillité.';
    description.de = 'Deine reife und ruhige Art passt wunderbar zu einem entspannten Tempo. Ihr beide schätzt die Ruhe.';
    recommendation.uk = 'Focus on low-energy bonding activities like cuddling or gentle strolls to deepen your connection.';
    recommendation.tr = 'Bağınızı derinleştirmek için sarılma veya nazik yürüyüşler gibi düşük enerjili bağ kurma aktivitelerine odaklanın.';
    recommendation.es = 'Concéntrate en actividades de vínculo de baja energía como acurrucarse o paseos suaves para profundizar tu conexión.';
    recommendation.fr = 'Concentrez-vous sur des activités de lien à faible énergie comme les câlins ou des promenades douces pour approfondir votre connexion.';
    recommendation.de = 'Konzentriere dich auf energiesparende Bindungsaktivitäten wie Kuscheln oder sanfte Spaziergänge, um eure Verbindung zu vertiefen.';
  } else {
    description.uk = 'Your age and energy levels have some differences, but with small adjustments, you can find harmony.';
    description.tr = 'Yaşınız ve enerji seviyeleriniz arasında bazı farklar var, ancak küçük ayarlamalarla uyum bulabilirsiniz.';
    description.es = 'Tu edad y niveles de energía tienen algunas diferencias, pero con pequeños ajustes, pueden encontrar armonía.';
    description.fr = 'Votre âge et vos niveaux d’énergie présentent quelques différences, mais avec de petits ajustements, vous pouvez trouver l’harmonie.';
    description.de = 'Dein Alter und deine Energieniveaus weisen einige Unterschiede auf, aber mit kleinen Anpassungen könnt ihr Harmonie finden.';
    recommendation.uk = 'Balance your energy by finding activities that suit both your lifestyles, like a mix of active and calm moments.';
    recommendation.tr = 'Hem aktif hem de sakin anları içeren aktiviteler bularak enerjinizi dengeleyin, böylece yaşam tarzlarınıza uygun bir uyum sağlayabilirsiniz.';
    recommendation.es = 'Equilibra tu energía encontrando actividades que se adapten a ambos estilos de vida, como una mezcla de momentos activos y tranquilos.';
    recommendation.fr = 'Équilibrez votre énergie en trouvant des activités qui conviennent à vos deux styles de vie, comme un mélange de moments actifs et calmes.';
    recommendation.de = 'Gleiche deine Energie aus, indem du Aktivitäten findest, die zu euren beiden Lebensstilen passen, wie eine Mischung aus aktiven und ruhigen Momenten.';
  }

  score = addRandomFactor(score, 4);
  return { score, description, recommendation };
}

// Duygu ve İfade Uyumu
function calculateEmotionCompatibility(dogTemperament, dominantExpression, socialNeed, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const hobbyTime = userQuestions.hobbyTime || "1-3";
  const livingWith = userQuestions.livingWith || "Yalnız yaşıyorum";

  if (dominantExpression === 'happy' && ['friendly', 'playful', 'energetic'].includes(dogTemperament)) {
    score = 90;
    if (socialNeed > 70) score += 5;
    if (livingWith !== "Yalnız yaşıyorum") score += 5;
    description.uk = 'Your radiant happiness and their lively spirit create a joyful connection! You’re a match made in heaven.';
    description.tr = 'Parlayan mutluluğunuz ve onların canlı ruhu, neşeli bir bağ yaratıyor! Cennette yapılmış bir eşleşmesiniz.';
    description.es = '¡Tu felicidad radiante y su espíritu vivaz crean una conexión alegre! Son una pareja hecha en el cielo.';
    description.fr = 'Votre bonheur rayonnant et leur esprit vif créent une connexion joyeuse ! Vous êtes un couple fait au paradis.';
    description.de = 'Dein strahlendes Glück und ihr lebhafter Geist schaffen eine freudige Verbindung! Ihr seid ein himmlisches Paar.';
    recommendation.uk = 'Keep spreading joy with playful interactions! Try games like fetch or tug-of-war to enhance your bond.';
    recommendation.tr = 'Eğlenceli etkileşimlerle neşeyi yaymaya devam edin! Bağınızı güçlendirmek için getir-götür veya halat çekme gibi oyunlar deneyin.';
    recommendation.es = '¡Sigue difundiendo alegría con interacciones juguetonas! Prueba juegos como buscar o tirar de la cuerda para fortalecer tu vínculo.';
    recommendation.fr = 'Continuez à répandre la joie avec des interactions ludiques ! Essayez des jeux comme aller chercher ou tirer sur la corde pour renforcer votre lien.';
    recommendation.de = 'Verbreite weiterhin Freude mit spielerischen Interaktionen! Probiere Spiele wie Apportieren oder Tauziehen, um eure Bindung zu stärken.';
  } else if (dominantExpression === 'sad' && ['calm', 'gentle', 'relaxed'].includes(dogTemperament)) {
    score = 85;
    if (socialNeed < 30) score += 3;
    if (livingWith === "Yalnız yaşıyorum") score += 3;
    description.uk = 'Your reflective mood pairs beautifully with their gentle nature, creating a soothing companionship.';
    description.tr = 'Düşünceli ruh haliniz, onların nazik doğasıyla güzel bir şekilde eşleşiyor ve sakin bir arkadaşlık yaratıyor.';
    description.es = 'Tu estado de ánimo reflexivo se combina maravillosamente con su naturaleza gentil, creando una compañía reconfortante.';
    description.fr = 'Votre humeur réfléchie se marie à merveille avec leur nature douce, créant une compagnie apaisante.';
    description.de = 'Deine nachdenkliche Stimmung passt wunderbar zu ihrer sanften Natur und schafft eine beruhigende Gesellschaft.';
    recommendation.uk = 'Spend quiet moments together, like relaxing on the couch, to nurture your calming connection.';
    recommendation.tr = 'Sakin bağlantınızı beslemek için koltukta dinlenmek gibi sessiz anlar geçirin.';
    recommendation.es = 'Pasa momentos tranquilos juntos, como relajarte en el sofá, para nutrir tu conexión calmante.';
    recommendation.fr = 'Passez des moments calmes ensemble, comme vous détendre sur le canapé, pour nourrir votre connexion apaisante.';
    recommendation.de = 'Verbringt ruhige Momente zusammen, wie Entspannen auf der Couch, um eure beruhigende Verbindung zu pflegen.';
  } else if (dominantExpression === 'angry' && ['protective', 'serious', 'bold'].includes(dogTemperament)) {
    score = 80;
    description.uk = 'Your strong emotions resonate with their bold personality, forming a powerful and protective bond.';
    description.tr = 'Güçlü duygularınız, onların cesur kişiliğiyle yankılanıyor ve güçlü, koruyucu bir bağ oluşturuyor.';
    description.es = 'Tus emociones fuertes resuenan con su personalidad audaz, formando un vínculo poderoso y protector.';
    description.fr = 'Vos émotions fortes résonnent avec leur personnalité audacieuse, formant un lien puissant et protecteur.';
    description.de = 'Deine starken Emotionen schwingen mit ihrer mutigen Persönlichkeit mit und bilden eine kraftvolle und schützende Bindung.';
    recommendation.uk = 'Channel your intensity into training sessions—they’ll respect your leadership and thrive under your guidance.';
    recommendation.tr = 'Yoğunluğunuzu eğitim seanslarına yönlendirin—liderliğinize saygı duyacaklar ve rehberliğiniz altında gelişecekler.';
    recommendation.es = 'Dirige tu intensidad a sesiones de entrenamiento: respetarán tu liderazgo y prosperarán bajo tu guía.';
    recommendation.fr = 'Canalisez votre intensité dans des séances d’entraînement : ils respecteront votre leadership et prospéreront sous votre guidance.';
    recommendation.de = 'Lenke deine Intensität in Trainingseinheiten – sie werden deine Führung respektieren und unter deiner Anleitung gedeihen.';
  } else {
    score = 60;
    description.uk = 'Your emotional tones differ slightly, which might require some understanding to align better.';
    description.tr = 'Duygusal tonlarınız biraz farklı, bu da daha iyi uyum sağlamak için biraz anlayış gerektirebilir.';
    description.es = 'Tus tonos emocionales difieren ligeramente, lo que podría requerir algo de comprensión para alinearse mejor.';
    description.fr = 'Vos tons émotionnels diffèrent légèrement, ce qui pourrait nécessiter un peu de compréhension pour mieux s’aligner.';
    description.de = 'Eure emotionalen Töne unterscheiden sich leicht, was etwas Verständnis erfordern könnte, um sich besser abzustimmen.';
    recommendation.uk = 'Take time to understand each other’s moods—shared activities like a calm walk can help bridge the gap.';
    recommendation.tr = 'Birbirinizin ruh hallerini anlamak için zaman ayırın—sakin bir yürüyüş gibi ortak aktiviteler bu farkı kapatabilir.';
    recommendation.es = 'Tómate el tiempo para entender los estados de ánimo de cada uno: actividades compartidas como un paseo tranquilo pueden ayudar a cerrar la brecha.';
    recommendation.fr = 'Prenez le temps de comprendre les humeurs de chacun – des activités partagées comme une promenade calme peuvent aider à combler l’écart.';
    recommendation.de = 'Nimm dir Zeit, um die Stimmungen des anderen zu verstehen – gemeinsame Aktivitäten wie ein ruhiger Spaziergang können die Kluft überbrücken.';
  }

  if (hobbyTime === "3+") {
    score += 5;
    recommendation.uk += ' Your extra hobby time can be used to engage in activities that match their temperament!';
    recommendation.tr += ' Ekstra hobi zamanınızı, onların mizacına uygun aktivitelerde bulunmak için kullanabilirsiniz!';
    recommendation.es += ' ¡Tu tiempo extra para hobbies puede usarse para participar en actividades que coincidan con su temperamento!';
    recommendation.fr += ' Votre temps supplémentaire pour les loisirs peut être utilisé pour participer à des activités correspondant à leur tempérament !';
    recommendation.de += ' Deine zusätzliche Freizeit für Hobbys kann genutzt werden, um an Aktivitäten teilzunehmen, die zu ihrem Temperament passen!';
  } else if (hobbyTime === "lessThan1") {
    score -= 5;
    recommendation.uk += ' With limited hobby time, focus on small, meaningful interactions to build emotional closeness.';
    recommendation.tr += ' Sınırlı hobi zamanınızla, duygusal yakınlık kurmak için küçük, anlamlı etkileşimlere odaklanın.';
    recommendation.es += ' Con un tiempo limitado para hobbies, concéntrate en interacciones pequeñas y significativas para construir cercanía emocional.';
    recommendation.fr += ' Avec un temps limité pour les loisirs, concentrez-vous sur des interactions petites mais significatives pour renforcer la proximité émotionnelle.';
    recommendation.de += ' Bei begrenzter Freizeit für Hobbys konzentriere dich auf kleine, bedeutungsvolle Interaktionen, um emotionale Nähe aufzubauen.';
  }

  score = addRandomFactor(score, 3);
  return { score, description, recommendation };
}

// Çevresel Uyum
function calculateEnvironmentCompatibility(dogData, userQuestions, age, dominantExpression) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  // Soru 1: Bahçeli ev
  if (dogData.spaceRequirement === "high" && userQuestions.hasLargeSpace) {
    score += 20;
    description.uk = 'Your spacious home is a dream for an active pet! They’ll love having room to explore.';
    description.tr = 'Geniş eviniz, aktif bir evcil hayvan için bir rüya! Keşfetmek için alana sahip olmayı sevecekler.';
    description.es = '¡Tu hogar espacioso es un sueño para una mascota activa! Les encantará tener espacio para explorar.';
    description.fr = 'Votre maison spacieuse est un rêve pour un animal actif ! Ils adoreront avoir de l’espace pour explorer.';
    description.de = 'Dein geräumiges Zuhause ist ein Traum für ein aktives Haustier! Sie werden es lieben, Platz zum Erkunden zu haben.';
    recommendation.uk = 'Maximize your space by setting up a play area or obstacle course for your pet to enjoy.';
    recommendation.tr = 'Evinizi en iyi şekilde kullanarak, evcil hayvanınızın keyif alacağı bir oyun alanı veya engel parkuru kurun.';
    recommendation.es = 'Aprovecha al máximo tu espacio configurando un área de juego o un circuito de obstáculos para que tu mascota disfrute.';
    recommendation.fr = 'Maximisez votre espace en aménageant une aire de jeu ou un parcours d’obstacles pour que votre animal en profite.';
    recommendation.de = 'Nutze deinen Raum optimal, indem du einen Spielbereich oder einen Hindernisparcours für dein Haustier einrichtest.';
  } else if (dogData.spaceRequirement === "low" && !userQuestions.hasLargeSpace) {
    score += 15;
    description.uk = 'Your cozy space is perfect for a pet that doesn’t need much room. You’ll both enjoy the snug environment.';
    description.tr = 'Küçük alanınız, fazla yere ihtiyaç duymayan bir evcil hayvan için mükemmel. İkiniz de bu sıcak ortamdan keyif alacaksınız.';
    description.es = 'Tu espacio acogedor es perfecto para una mascota que no necesita mucho espacio. Ambos disfrutarán del ambiente íntimo.';
    description.fr = 'Votre espace confortable est parfait pour un animal qui n’a pas besoin de beaucoup de place. Vous apprécierez tous les deux cet environnement chaleureux.';
    description.de = 'Dein gemütlicher Raum ist perfekt für ein Haustier, das nicht viel Platz braucht. Ihr werdet beide die kuschelige Umgebung genießen.';
    recommendation.uk = 'Create a comfy corner with a bed or blanket to make your pet feel at home in your cozy space.';
    recommendation.tr = 'Evcil hayvanınızın küçük alanınızda kendini evinde hissetmesi için bir yatak veya battaniye ile rahat bir köşe oluşturun.';
    recommendation.es = 'Crea un rincón cómodo con una cama o manta para que tu mascota se sienta como en casa en tu espacio acogedor.';
    recommendation.fr = 'Créez un coin confortable avec un lit ou une couverture pour que votre animal se sente chez lui dans votre espace douillet.';
    recommendation.de = 'Schaffe eine gemütliche Ecke mit einem Bett oder einer Decke, damit sich dein Haustier in deinem kuscheligen Raum wie zu Hause fühlt.';
  } else {
    score -= 5;
    description.uk = 'Your living space might need some adjustments to fully suit your pet’s needs.';
    description.tr = 'Yaşam alanınız, evcil hayvanınızın ihtiyaçlarını tam olarak karşılamak için bazı ayarlamalara ihtiyaç duyabilir.';
    description.es = 'Tu espacio habitable podría necesitar algunos ajustes para adaptarse completamente a las necesidades de tu mascota.';
    description.fr = 'Votre espace de vie pourrait nécessiter quelques ajustements pour répondre pleinement aux besoins de votre animal.';
    description.de = 'Dein Wohnraum könnte einige Anpassungen benötigen, um den Bedürfnissen deines Haustiers vollständig gerecht zu werden.';
    recommendation.uk = 'Consider creating a dedicated space for your pet, even if small, to help them feel more comfortable.';
    recommendation.tr = 'Evcil hayvanınız için, küçük olsa bile, özel bir alan yaratmayı düşünün, böylece daha rahat hissedebilirler.';
    recommendation.es = 'Considera crear un espacio dedicado para tu mascota, aunque sea pequeño, para ayudarla a sentirse más cómoda.';
    recommendation.fr = 'Envisagez de créer un espace dédié pour votre animal, même petit, pour l’aider à se sentir plus à l’aise.';
    recommendation.de = 'Überlege, einen eigenen Bereich für dein Haustier zu schaffen, auch wenn er klein ist, damit es sich wohler fühlt.';
  }

  // Soru 2: Evde geçirilen süre
  if (dogData.socialNeed > 70 && userQuestions.hoursAtHome === "8+") {
    score += 15;
    description.uk += ' Your ample time at home ensures your pet gets the social interaction they crave!';
    description.tr += ' Evde geçirdiğiniz bol zaman, evcil hayvanınızın arzuladığı sosyal etkileşimi almasını sağlıyor!';
    description.es += ' ¡El tiempo abundante que pasas en casa asegura que tu mascota reciba la interacción social que anhela!';
    description.fr += ' Le temps abondant que vous passez à la maison garantit que votre animal reçoit l’interaction sociale qu’il désire !';
    description.de += ' Die reichliche Zeit, die du zu Hause verbringst, stellt sicher, dass dein Haustier die soziale Interaktion bekommt, die es sich wünscht!';
    recommendation.uk += ' Use this time to engage in bonding activities like training or play to strengthen your relationship.';
    recommendation.tr += ' Bu zamanı, ilişkinizi güçlendirmek için eğitim veya oyun gibi bağ kurma aktivitelerine katılmak için kullanın.';
    recommendation.es += ' Usa este tiempo para participar en actividades de vínculo como entrenamiento o juego para fortalecer tu relación.';
    recommendation.fr += ' Utilisez ce temps pour participer à des activités de lien comme l’entraînement ou le jeu pour renforcer votre relation.';
    recommendation.de += ' Nutze diese Zeit, um an Bindungsaktivitäten wie Training oder Spiel teilzunehmen, um eure Beziehung zu stärken.';
  } else if (dogData.independence > 70 && userQuestions.hoursAtHome === "0-4") {
    score += 10;
    description.uk += ' Your busy schedule aligns well with their independent nature—they’re happy to have their own space!';
    description.tr += ' Yoğun programınız, onların bağımsız doğasıyla iyi bir uyum sağlıyor—kendi alanlarına sahip olmaktan mutlular!';
    description.es += ' ¡Tu agenda ocupada se alinea bien con su naturaleza independiente: están felices de tener su propio espacio!';
    description.fr += ' Votre emploi du temps chargé s’aligne bien avec leur nature indépendante – ils sont heureux d’avoir leur propre espace !';
    description.de += ' Dein voller Terminkalender passt gut zu ihrer unabhängigen Natur – sie sind froh, ihren eigenen Raum zu haben!';
    recommendation.uk += ' Ensure they have a safe, comfortable space to relax while you’re away.';
    recommendation.tr += ' Siz yokken rahatlayabilecekleri güvenli, konforlu bir alanları olduğundan emin olun.';
    recommendation.es += ' Asegúrate de que tengan un espacio seguro y cómodo para relajarse mientras estás fuera.';
    recommendation.fr += ' Assurez-vous qu’ils aient un espace sûr et confortable pour se détendre pendant votre absence.';
    recommendation.de += ' Stelle sicher, dass sie einen sicheren, komfortablen Raum zum Entspannen haben, während du weg bist.';
  }

  // Soru 3: Aktif günler
  if (dogData.activityPreference === "outdoor" && userQuestions.activeDays === "6-7" && age < 30) {
    score += 20;
    description.uk += ' Your youthful energy and love for outdoor activities make you a perfect match for an adventurous pet!';
    description.tr += ' Genç enerjiniz ve açık hava aktivitelerine olan sevginiz, sizi maceracı bir evcil hayvan için mükemmel bir eşleşme yapıyor!';
    description.es += ' ¡Tu energía juvenil y amor por las actividades al aire libre te convierten en una pareja perfecta para una mascota aventurera!';
    description.fr += ' Votre énergie juvénile et votre amour pour les activités en plein air font de vous un match parfait pour un animal aventureux !';
    description.de += ' Deine jugendliche Energie und deine Liebe zu Outdoor-Aktivitäten machen dich zum perfekten Partner für ein abenteuerlustiges Haustier!';
    recommendation.uk += ' Plan regular outdoor adventures like hiking or park visits to keep your pet happy and active.';
    recommendation.tr += ' Evcil hayvanınızı mutlu ve aktif tutmak için düzenli açık hava maceraları, örneğin yürüyüş veya park ziyaretleri planlayın.';
    recommendation.es += ' Planea aventuras al aire libre regulares como caminatas o visitas al parque para mantener a tu mascota feliz y activa.';
    recommendation.fr += ' Planifiez des aventures en plein air régulières comme des randonnées ou des visites au parc pour garder votre animal heureux et actif.';
    recommendation.de += ' Plane regelmäßige Outdoor-Abenteuer wie Wanderungen oder Parkbesuche, um dein Haustier glücklich und aktiv zu halten.';
  } else if (dogData.activityPreference === "indoor" && userQuestions.activeDays === "0-2") {
    score += 15;
    description.uk += ' Your preference for indoor activities aligns perfectly with their love for a cozy, calm environment.';
    description.tr += ' İç mekan aktivitelerine olan tercihiniz, onların sıcak, sakin bir ortam sevgisiyle mükemmel bir uyum sağlıyor.';
    description.es += ' Tu preferencia por actividades en interiores se alinea perfectamente con su amor por un ambiente acogedor y tranquilo.';
    description.fr += ' Votre préférence pour les activités en intérieur s’aligne parfaitement avec leur amour pour un environnement chaleureux et calme.';
    description.de += ' Deine Vorliebe für Indoor-Aktivitäten passt perfekt zu ihrer Liebe für eine gemütliche, ruhige Umgebung.';
    recommendation.uk += ' Set up indoor play areas with toys or puzzles to keep them entertained at home.';
    recommendation.tr += ' Evde eğlenmelerini sağlamak için oyuncaklar veya bulmacalarla iç mekan oyun alanları kurun.';
    recommendation.es += ' Configura áreas de juego en interiores con juguetes o rompecabezas para mantenerlos entretenidos en casa.';
    recommendation.fr += ' Aménagez des aires de jeu en intérieur avec des jouets ou des puzzles pour les divertir à la maison.';
    recommendation.de += ' Richte Indoor-Spielbereiche mit Spielzeug oder Puzzles ein, um sie zu Hause zu unterhalten.';
  }

  // Soru 4: Hobiler ve bakım
  if (dogData.groomingNeed > 50 && userQuestions.hobbyTime === "3+") {
    score += 10;
    description.uk += ' Your dedication to hobbies suggests you’ll enjoy the detailed care they need!';
    description.tr += ' Hobilerinize olan bağlılığınız, onların ihtiyaç duyduğu detaylı bakımı yapmaktan keyif alacağınızı gösteriyor!';
    description.es += ' ¡Tu dedicación a los pasatiempos sugiere que disfrutarás del cuidado detallado que necesitan!';
    description.fr += ' Votre dévouement aux loisirs suggère que vous apprécierez les soins détaillés dont ils ont besoin !';
    description.de += ' Deine Hingabe an Hobbys deutet darauf hin, dass du die detaillierte Pflege, die sie benötigen, genießen wirst!';
    recommendation.uk += ' Incorporate grooming into your routine—it can be a bonding experience for both of you.';
    recommendation.tr += ' Bakımı rutininize dahil edin—bu, ikiniz için de bir bağ kurma deneyimi olabilir.';
    recommendation.es += ' Incorpora el aseo en tu rutina: puede ser una experiencia de vínculo para ambos.';
    recommendation.fr += ' Intégrez le toilettage dans votre routine – cela peut être une expérience de lien pour vous deux.';
    recommendation.de += ' Integriere die Pflege in deine Routine – es kann eine Bindungserfahrung für euch beide sein.';
  } else if (dogData.groomingNeed < 30 && userQuestions.hobbyTime === "lessThan1") {
    score += 5;
    description.uk += ' You both prefer a low-maintenance lifestyle, which makes daily care a breeze!';
    description.tr += ' İkiniz de düşük bakım gerektiren bir yaşam tarzını tercih ediyorsunuz, bu da günlük bakımı çok kolaylaştırıyor!';
    description.es += ' ¡Ambos prefieren un estilo de vida de bajo mantenimiento, lo que hace que el cuidado diario sea muy fácil!';
    description.fr += ' Vous préférez tous les deux un style de vie nécessitant peu d’entretien, ce qui rend les soins quotidiens très faciles !';
    description.de += ' Ihr bevorzugt beide einen pflegeleichten Lebensstil, was die tägliche Pflege zum Kinderspiel macht!';
    recommendation.uk += ' Keep their care simple with quick grooming sessions to maintain their comfort.';
    recommendation.tr += ' Bakımlarını basit tutun, hızlı bakım seanslarıyla konforlarını koruyun.';
    recommendation.es += ' Mantén su cuidado simple con sesiones rápidas de aseo para mantener su comodidad.';
    recommendation.fr += ' Gardez leurs soins simples avec des séances de toilettage rapides pour maintenir leur confort.';
    recommendation.de += ' Halte ihre Pflege einfach mit kurzen Pflegesitzungen, um ihren Komfort zu erhalten.';
  }

  // Soru 5: Evdeki bireyler
  if (dogData.socialNeed > 70 && userQuestions.livingWith !== "Yalnız yaşıyorum" && dominantExpression === "happy") {
    score += 10;
    description.uk += ' Your lively household and positive mood create a warm, social environment they’ll thrive in!';
    description.tr += ' Canlı eviniz ve pozitif ruh haliniz, onların gelişeceği sıcak, sosyal bir ortam yaratıyor!';
    description.es += ' ¡Tu hogar animado y tu estado de ánimo positivo crean un ambiente cálido y social en el que prosperarán!';
    description.fr += ' Votre foyer animé et votre humeur positive créent un environnement chaleureux et social dans lequel ils prospéreront !';
    description.de += ' Dein lebhafter Haushalt und deine positive Stimmung schaffen eine warme, soziale Umgebung, in der sie gedeihen werden!';
    recommendation.uk += ' Involve your household in playtime to make your pet feel like part of the family.';
    recommendation.tr += ' Evcil hayvanınızın ailenin bir parçası gibi hissetmesi için ev halkını oyun zamanına dahil edin.';
    recommendation.es += ' Involucra a tu hogar en el tiempo de juego para que tu mascota se sienta parte de la familia.';
    recommendation.fr += ' Impliquez votre foyer dans le temps de jeu pour que votre animal se sente comme un membre de la famille.';
    recommendation.de += ' Beteilige deinen Haushalt an der Spielzeit, damit sich dein Haustier wie ein Teil der Familie fühlt.';
  } else if (dogData.independence > 70 && userQuestions.livingWith === "Yalnız yaşıyorum") {
    score += 5;
    description.uk += ' Your solo living suits their independent nature—they’ll enjoy the calm and quiet with you.';
    description.tr += ' Yalnız yaşamınız, onların bağımsız doğasına uyuyor—sizinle sakin ve sessiz ortamdan keyif alacaklar.';
    description.es += ' Tu vida en solitario se adapta a su naturaleza independiente: disfrutarán de la calma y el silencio contigo.';
    description.fr += ' Votre vie en solo convient à leur nature indépendante – ils apprécieront le calme et la tranquillité avec vous.';
    description.de += ' Dein Alleinleben passt zu ihrer unabhängigen Natur – sie werden die Ruhe und Stille mit dir genießen.';
    recommendation.uk += ' Give them their own space to retreat to when they need alone time.';
    recommendation.tr += ' Yalnız kalmak istediklerinde çekilebilecekleri kendi alanlarını verin.';
    recommendation.es += ' Dales su propio espacio para retirarse cuando necesiten tiempo a solas.';
    recommendation.fr += ' Donnez-leur leur propre espace pour se retirer lorsqu’ils ont besoin de temps seuls.';
    recommendation.de += ' Gib ihnen ihren eigenen Raum, in den sie sich zurückziehen können, wenn sie Alleinzeit brauchen.';
  }

  score = addRandomFactor(score, 3);
  return { score: Math.min(score, 100), description, recommendation };
}

// Yeni Kategori: Bakım ve İlgi Uyumu
function calculateCareCompatibility(dogData, userQuestions) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const hobbyTime = userQuestions.hobbyTime || "1-3";
  const hoursAtHome = userQuestions.hoursAtHome || "4-8";

  if (dogData.groomingNeed > 70 && hobbyTime === "3+" && hoursAtHome === "8+") {
    score += 20;
    description.uk = 'Your dedication to hobbies and time at home make you a perfect match for their high care needs!';
    description.tr = 'Hobilerinize olan bağlılığınız ve evde geçirdiğiniz zaman, onların yüksek bakım ihtiyaçları için sizi mükemmel bir eşleşme yapıyor!';
    description.es = '¡Tu dedicación a los pasatiempos y el tiempo en casa te convierten en una pareja perfecta para sus altas necesidades de cuidado!';
    description.fr = 'Votre dévouement aux loisirs et le temps passé à la maison font de vous un match parfait pour leurs besoins élevés en soins !';
    description.de = 'Deine Hingabe an Hobbys und die Zeit zu Hause machen dich zum perfekten Partner für ihre hohen Pflegebedürfnisse!';
    recommendation.uk = 'Set up a grooming schedule to keep them looking their best—it’ll be a rewarding bonding experience.';
    recommendation.tr = 'En iyi şekilde görünmelerini sağlamak için bir bakım programı oluşturun—bu ödüllendirici bir bağ kurma deneyimi olacak.';
    recommendation.es = 'Establece un horario de aseo para mantenerlos con su mejor apariencia: será una experiencia de vínculo gratificante.';
    recommendation.fr = 'Établissez un programme de toilettage pour qu’ils aient toujours l’air au mieux – ce sera une expérience de lien gratifiante.';
    recommendation.de = 'Richte einen Pflegeplan ein, um sie in Bestform zu halten – es wird eine lohnende Bindungserfahrung sein.';
  } else if (dogData.groomingNeed < 30 && (hobbyTime === "lessThan1" || hoursAtHome === "0-4")) {
    score += 15;
    description.uk = 'You both prefer a low-maintenance routine, making care effortless and stress-free!';
    description.tr = 'İkiniz de düşük bakım gerektiren bir rutini tercih ediyorsunuz, bu da bakımı zahmetsiz ve stressiz hale getiriyor!';
    description.es = '¡Ambos prefieren una rutina de bajo mantenimiento, haciendo que el cuidado sea fácil y sin estrés!';
    description.fr = 'Vous préférez tous les deux une routine nécessitant peu d’entretien, rendant les soins faciles et sans stress !';
    description.de = 'Ihr bevorzugt beide eine pflegeleichte Routine, was die Pflege mühelos und stressfrei macht!';
    recommendation.uk = 'Keep their care simple with occasional grooming to maintain their comfort without overwhelming your schedule.';
    recommendation.tr = 'Bakımlarını basit tutun, ara sıra bakım yaparak programınızı zorlamadan konforlarını koruyun.';
    recommendation.es = 'Mantén su cuidado simple con un aseo ocasional para mantener su comodidad sin abrumar tu horario.';
    recommendation.fr = 'Gardez leurs soins simples avec un toilettage occasionnel pour maintenir leur confort sans surcharger votre emploi du temps.';
    recommendation.de = 'Halte ihre Pflege einfach mit gelegentlichem Pflegen, um ihren Komfort zu erhalten, ohne deinen Zeitplan zu überlasten.';
  } else {
    score -= 5;
    description.uk = 'Your care routines might need some alignment to meet their grooming needs effectively.';
    description.tr = 'Bakım rutinleriniz, onların bakım ihtiyaçlarını etkin bir şekilde karşılamak için biraz uyum gerektirebilir.';
    description.es = 'Tus rutinas de cuidado podrían necesitar algo de alineación para satisfacer sus necesidades de aseo de manera efectiva.';
    description.fr = 'Vos routines de soins pourraient nécessiter un certain alignement pour répondre efficacement à leurs besoins en toilettage.';
    description.de = 'Deine Pflegeroutinen könnten etwas Anpassung benötigen, um ihre Pflegebedürfnisse effektiv zu erfüllen.';
    recommendation.uk = 'Adjust your schedule to include regular grooming sessions that fit both your lifestyles.';
    recommendation.tr = 'Her ikinizin yaşam tarzına uygun düzenli bakım seanslarını içerecek şekilde programınızı ayarlayın.';
    recommendation.es = 'Ajusta tu horario para incluir sesiones de aseo regulares que se adapten a ambos estilos de vida.';
    recommendation.fr = 'Ajustez votre emploi du temps pour inclure des séances de toilettage régulières qui conviennent à vos deux styles de vie.';
    recommendation.de = 'Passe deinen Zeitplan an, um regelmäßige Pflegesitzungen einzubauen, die zu euren beiden Lebensstilen passen.';
  }

  score = addRandomFactor(score, 3);
  return { score: Math.min(score, 100), description, recommendation };
}


// Yeni Kategori: Aktivite Tercih Uyumu (Devam)
function calculateActivityPreferenceCompatibility(dogData, userQuestions, age) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const activeDays = userQuestions.activeDays || "3-5";
  const hobbyTime = userQuestions.hobbyTime || "1-3";

  if (dogData.activityPreference === "outdoor" && activeDays === "6-7" && hobbyTime === "3+") {
    score += 20;
    description.uk = 'Your love for outdoor activities and ample free time make you a perfect match for their adventurous spirit!';
    description.tr = 'Açık hava aktivitelerine olan sevginiz ve bol boş zamanınız, sizi onların maceracı ruhu için mükemmel bir eşleşme yapıyor!';
    description.es = '¡Tu amor por las actividades al aire libre y tu amplio tiempo libre te convierten en una pareja perfecta para su espíritu aventurero!';
    description.fr = 'Votre amour pour les activités en plein air et votre temps libre abondant font de vous un match parfait pour leur esprit aventureux !';
    description.de = 'Deine Liebe zu Outdoor-Aktivitäten und deine reichliche Freizeit machen dich zum perfekten Partner für ihren abenteuerlustigen Geist!';
    recommendation.uk = 'Plan weekly outdoor adventures like hiking, running, or trips to the park to keep their adventurous spirit alive.';
    recommendation.tr = 'Maceracı ruhlarını canlı tutmak için haftalık açık hava maceraları planlayın; yürüyüş, koşu veya parka geziler gibi.';
    recommendation.es = 'Planea aventuras al aire libre semanales como caminatas, carreras o viajes al parque para mantener vivo su espíritu aventurero.';
    recommendation.fr = 'Planifiez des aventures en plein air hebdomadaires comme des randonnées, des courses ou des sorties au parc pour garder leur esprit aventureux vivant.';
    recommendation.de = 'Plane wöchentliche Outdoor-Abenteuer wie Wandern, Laufen oder Ausflüge in den Park, um ihren abenteuerlustigen Geist lebendig zu halten.';
  } else if (dogData.activityPreference === "indoor" && activeDays === "0-2" && hobbyTime === "lessThan1") {
    score += 15;
    description.uk = 'Your preference for a calm, indoor lifestyle aligns perfectly with their love for cozy, low-key activities.';
    description.tr = 'Sakin, iç mekan yaşam tarzı tercihiniz, onların sıcak, düşük tempolu aktiviteleri sevmesiyle mükemmel bir uyum sağlıyor.';
    description.es = 'Tu preferencia por un estilo de vida tranquilo e interior se alinea perfectamente con su amor por actividades acogedoras y de bajo perfil.';
    description.fr = 'Votre préférence pour un style de vie calme et intérieur s’aligne parfaitement avec leur amour pour des activités douillettes et discrètes.';
    description.de = 'Deine Vorliebe für einen ruhigen, indoor-orientierten Lebensstil passt perfekt zu ihrer Liebe für gemütliche, entspannte Aktivitäten.';
    recommendation.uk = 'Create a cozy indoor play area with toys or puzzles to keep them entertained during your downtime.';
    recommendation.tr = 'Boş zamanlarınızda onları eğlendirmek için oyuncaklar veya bulmacalarla sıcak bir iç mekan oyun alanı oluşturun.';
    recommendation.es = 'Crea un área de juego interior acogedora con juguetes o rompecabezas para mantenerlos entretenidos durante tu tiempo libre.';
    recommendation.fr = 'Créez une aire de jeu intérieure confortable avec des jouets ou des puzzles pour les divertir pendant votre temps libre.';
    recommendation.de = 'Richte einen gemütlichen Indoor-Spielbereich mit Spielzeug oder Puzzles ein, um sie während deiner Freizeit zu unterhalten.';
  } else {
    score -= 5;
    description.uk = 'Your activity preferences differ slightly, which might require some adjustments to find a shared rhythm.';
    description.tr = 'Aktivite tercihleriniz biraz farklı, bu da ortak bir ritim bulmak için bazı ayarlamalar gerektirebilir.';
    description.es = 'Tus preferencias de actividad difieren ligeramente, lo que podría requerir algunos ajustes para encontrar un ritmo compartido.';
    description.fr = 'Vos préférences d’activité diffèrent légèrement, ce qui pourrait nécessiter quelques ajustements pour trouver un rythme commun.';
    description.de = 'Eure Aktivitätsvorlieben unterscheiden sich leicht, was einige Anpassungen erfordern könnte, um einen gemeinsamen Rhythmus zu finden.';
    recommendation.uk = 'Try a mix of indoor and outdoor activities to find a balance that suits both of you, like a short walk followed by indoor play.';
    recommendation.tr = 'İkinize de uygun bir denge bulmak için iç ve dış mekan aktivitelerini karıştırarak deneyin, örneğin kısa bir yürüyüşün ardından iç mekan oyunu.';
    recommendation.es = 'Prueba una mezcla de actividades interiores y exteriores para encontrar un equilibrio que les convenga a ambos, como un paseo corto seguido de juego en interiores.';
    recommendation.fr = 'Essayez un mélange d’activités intérieures et extérieures pour trouver un équilibre qui vous convienne à tous les deux, comme une courte promenade suivie d’un jeu à l’intérieur.';
    recommendation.de = 'Probiere eine Mischung aus Indoor- und Outdoor-Aktivitäten, um ein Gleichgewicht zu finden, das euch beiden passt, wie ein kurzer Spaziergang gefolgt von Indoor-Spiel.';
  }

  if (age < 30 && dogData.activityPreference === "outdoor") {
    score += 5;
    description.uk += ' Your youthful energy enhances your compatibility for outdoor fun!';
    description.tr += ' Genç enerjiniz, açık hava eğlencesi için uyumluluğunuzu artırıyor!';
    description.es += ' ¡Tu energía juvenil mejora tu compatibilidad para la diversión al aire libre!';
    description.fr += ' Votre énergie juvénile renforce votre compatibilité pour le plaisir en plein air !';
    description.de += ' Deine jugendliche Energie steigert eure Kompatibilität für Outdoor-Spaß!';
    recommendation.uk += ' Leverage your energy for more outdoor activities to keep them engaged.';
    recommendation.tr += ' Onları meşgul tutmak için enerjinizi daha fazla açık hava aktivitesi için kullanın.';
    recommendation.es += ' Aprovecha tu energía para más actividades al aire libre y mantenerlos comprometidos.';
    recommendation.fr += ' Utilisez votre énergie pour plus d’activités en plein air afin de les garder engagés.';
    recommendation.de += ' Nutze deine Energie für mehr Outdoor-Aktivitäten, um sie zu beschäftigen.';
  } else if (age > 50 && dogData.activityPreference === "indoor") {
    score += 5;
    description.uk += ' Your preference for a calmer pace suits their love for indoor relaxation.';
    description.tr += ' Daha sakin bir tempo tercihiniz, onların iç mekan rahatlamasını sevmesiyle uyumlu.';
    description.es += ' Tu preferencia por un ritmo más tranquilo se adapta a su amor por la relajación en interiores.';
    description.fr += ' Votre préférence pour un rythme plus calme convient à leur amour pour la détente en intérieur.';
    description.de += ' Deine Vorliebe für ein ruhigeres Tempo passt zu ihrer Liebe für Indoor-Entspannung.';
    recommendation.uk += ' Focus on calm, indoor bonding activities to strengthen your connection.';
    recommendation.tr += ' Bağınızı güçlendirmek için sakin, iç mekan bağ kurma aktivitelerine odaklanın.';
    recommendation.es += ' Concéntrate en actividades de vínculo tranquilas en interiores para fortalecer tu conexión.';
    recommendation.fr += ' Concentrez-vous sur des activités de lien calmes en intérieur pour renforcer votre connexion.';
    recommendation.de += ' Konzentriere dich auf ruhige, Indoor-Bindungsaktivitäten, um eure Verbindung zu stärken.';
  }

  score = addRandomFactor(score, 3);
  return { score: Math.min(score, 100), description, recommendation };
}

// Yeni Kategori: Sosyal Uyum
function calculateSocialCompatibility(dogData, userQuestions, dominantExpression) {
  let score = 50;
  let description = { uk: '', tr: '', es: '', fr: '', de: '' };
  let recommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  const livingWith = userQuestions.livingWith || "Yalnız yaşıyorum";
  const hoursAtHome = userQuestions.hoursAtHome || "4-8";

  if (dogData.socialNeed > 70 && livingWith !== "Yalnız yaşıyorum" && hoursAtHome === "8+") {
    score += 20;
    description.uk = 'Your lively household and ample time at home create a perfect social environment for their outgoing nature!';
    description.tr = 'Canlı eviniz ve evde geçirdiğiniz bol zaman, onların dışa dönük doğası için mükemmel bir sosyal ortam yaratıyor!';
    description.es = '¡Tu hogar animado y el tiempo abundante en casa crean un entorno social perfecto para su naturaleza extrovertida!';
    description.fr = 'Votre foyer animé et le temps abondant passé à la maison créent un environnement social parfait pour leur nature extravertie !';
    description.de = 'Dein lebhafter Haushalt und die reichliche Zeit zu Hause schaffen eine perfekte soziale Umgebung für ihre aufgeschlossene Natur!';
    recommendation.uk = 'Organize family playdates or social outings to keep their social needs met and strengthen your bond.';
    recommendation.tr = 'Sosyal ihtiyaçlarını karşılamak ve bağınızı güçlendirmek için aile oyun günleri veya sosyal geziler düzenleyin.';
    recommendation.es = 'Organiza citas de juego familiares o salidas sociales para satisfacer sus necesidades sociales y fortalecer tu vínculo.';
    recommendation.fr = 'Organisez des rencontres familiales ou des sorties sociales pour répondre à leurs besoins sociaux et renforcer votre lien.';
    recommendation.de = 'Organisiere Familien-Spieltreffen oder soziale Ausflüge, um ihre sozialen Bedürfnisse zu erfüllen und eure Bindung zu stärken.';
  } else if (dogData.independence > 70 && livingWith === "Yalnız yaşıyorum" && hoursAtHome === "0-4") {
    score += 15;
    description.uk = 'Your solo lifestyle and busy schedule align perfectly with their independent nature—they thrive in a calm, quiet setting.';
    description.tr = 'Yalnız yaşam tarzınız ve yoğun programınız, onların bağımsız doğasıyla mükemmel bir uyum sağlıyor—sakin, sessiz bir ortamda gelişiyorlar.';
    description.es = 'Tu estilo de vida en solitario y tu agenda ocupada se alinean perfectamente con su naturaleza independiente: prosperan en un entorno tranquilo y silencioso.';
    description.fr = 'Votre style de vie en solo et votre emploi du temps chargé s’alignent parfaitement avec leur nature indépendante – ils prospèrent dans un cadre calme et silencieux.';
    description.de = 'Dein Alleinleben und dein voller Terminkalender passen perfekt zu ihrer unabhängigen Natur – sie gedeihen in einer ruhigen, stillen Umgebung.';
    recommendation.uk = 'Provide a safe, quiet space for them to retreat to when you’re away, ensuring they feel secure.';
    recommendation.tr = 'Siz yokken çekilebilecekleri güvenli, sessiz bir alan sağlayın, böylece kendilerini güvende hissederler.';
    recommendation.es = 'Proporciónales un espacio seguro y tranquilo para retirarse cuando estés fuera, asegurándote de que se sientan seguros.';
    recommendation.fr = 'Fournissez-leur un espace sûr et calme pour se retirer lorsque vous êtes absent, en vous assurant qu’ils se sentent en sécurité.';
    recommendation.de = 'Biete ihnen einen sicheren, ruhigen Raum, in den sie sich zurückziehen können, wenn du weg bist, um sicherzustellen, dass sie sich sicher fühlen.';
  } else {
    score -= 5;
    description.uk = 'Your social environment might need some adjustments to fully meet their social or independent needs.';
    description.tr = 'Sosyal ortamınız, onların sosyal veya bağımsız ihtiyaçlarını tam olarak karşılamak için bazı ayarlamalara ihtiyaç duyabilir.';
    description.es = 'Tu entorno social podría necesitar algunos ajustes para satisfacer completamente sus necesidades sociales o independientes.';
    description.fr = 'Votre environnement social pourrait nécessiter quelques ajustements pour répondre pleinement à leurs besoins sociaux ou indépendants.';
    description.de = 'Deine soziale Umgebung könnte einige Anpassungen benötigen, um ihre sozialen oder unabhängigen Bedürfnisse vollständig zu erfüllen.';
    recommendation.uk = 'Balance their social needs by scheduling regular interactions or ensuring they have a quiet space to retreat to.';
    recommendation.tr = 'Sosyal ihtiyaçlarını dengelemek için düzenli etkileşimler planlayın veya çekilebilecekleri sessiz bir alanları olduğundan emin olun.';
    recommendation.es = 'Equilibra sus necesidades sociales programando interacciones regulares o asegurándote de que tengan un espacio tranquilo para retirarse.';
    recommendation.fr = 'Équilibrez leurs besoins sociaux en planifiant des interactions régulières ou en vous assurant qu’ils ont un espace calme pour se retirer.';
    recommendation.de = 'Gleiche ihre sozialen Bedürfnisse aus, indem du regelmäßige Interaktionen planst oder sicherstellst, dass sie einen ruhigen Rückzugsort haben.';
  }

  if (dominantExpression === "happy" && dogData.socialNeed > 50) {
    score += 5;
    description.uk += ' Your cheerful mood enhances their social experience, making interactions even more enjoyable!';
    description.tr += ' Neşeli ruh haliniz, onların sosyal deneyimini zenginleştiriyor ve etkileşimleri daha keyifli hale getiriyor!';
    description.es += ' ¡Tu estado de ánimo alegre mejora su experiencia social, haciendo que las interacciones sean aún más agradables!';
    description.fr += ' Votre humeur joyeuse enrichit leur expérience sociale, rendant les interactions encore plus agréables !';
    description.de += ' Deine fröhliche Stimmung bereichert ihre soziale Erfahrung und macht Interaktionen noch angenehmer!';
    recommendation.uk += ' Keep spreading positivity during social interactions to make them feel loved and appreciated.';
    recommendation.tr += ' Sosyal etkileşimler sırasında pozitifliği yaymaya devam edin, böylece kendilerini sevildiğini ve değer gördüğünü hissederler.';
    recommendation.es += ' Sigue difundiendo positividad durante las interacciones sociales para que se sientan amados y apreciados.';
    recommendation.fr += ' Continuez à répandre de la positivité lors des interactions sociales pour qu’ils se sentent aimés et appréciés.';
    recommendation.de += ' Verbreite weiterhin Positivität bei sozialen Interaktionen, damit sie sich geliebt und geschätzt fühlen.';
  }

  score = addRandomFactor(score, 3);
  return { score: Math.min(score, 100), description, recommendation };
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
        de: 'Der Kompatibilitätswert konnte nicht berechnet werden. Fehlende Analyseergebnisse.',
      },
      details: [],
      color: 'gray',
      overallRecommendation: { uk: '', tr: '', es: '', fr: '', de: '' },
    };
  }

  const dogBreed = petResult.predicted_label || "Unknown";
  const dogData = dogTraits[dogBreed] || dogTraits["Unknown"];

  const age = faceResult[0].age || 30;
  const expressions = faceResult[0].expressions || {
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
    neutral: 0,
  };
  const dominantExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
  const happinessScore = (expressions.happy || 0) * 100;

  const { score: eScore, description: eDesc, recommendation: eRec } = calculateEnergyHappinessCompatibility(
    dogData.energy,
    happinessScore,
    userQuestions
  );
  const { score: aScore, description: aDesc, recommendation: aRec } = calculateAgeCompatibility(
    dogData.energy,
    age,
    dogData.agePreference || 30,
    userQuestions
  );
  const { score: emScore, description: emDesc, recommendation: emRec } = calculateEmotionCompatibility(
    dogData.temperament,
    dominantExpression,
    dogData.socialNeed,
    userQuestions
  );
  const { score: envScore, description: envDesc, recommendation: envRec } = calculateEnvironmentCompatibility(
    dogData,
    userQuestions,
    age,
    dominantExpression
  );
  const { score: careScore, description: careDesc, recommendation: careRec } = calculateCareCompatibility(
    dogData,
    userQuestions
  );
  const { score: actScore, description: actDesc, recommendation: actRec } = calculateActivityPreferenceCompatibility(
    dogData,
    userQuestions,
    age
  );
  const { score: socScore, description: socDesc, recommendation: socRec } = calculateSocialCompatibility(
    dogData,
    userQuestions,
    dominantExpression
  );

  // Dynamic weighting based on user and dog traits
  const weights = {
    energy: happinessScore > 70 ? 0.20 : 0.15,
    age: age < 30 || age > 50 ? 0.15 : 0.10,
    emotion: ['happy', 'sad'].includes(dominantExpression) ? 0.15 : 0.10,
    environment: userQuestions.hasLargeSpace ? 0.20 : 0.15,
    care: dogData.groomingNeed > 50 ? 0.15 : 0.10,
    activity: dogData.activityPreference === "outdoor" ? 0.15 : 0.10,
    social: dogData.socialNeed > 50 ? 0.15 : 0.10,
  };

  const finalScore = Math.round(
    weights.energy * eScore +
    weights.age * aScore +
    weights.emotion * emScore +
    weights.environment * envScore +
    weights.care * careScore +
    weights.activity * actScore +
    weights.social * socScore
  );

  let color = 'red';
  if (finalScore >= 85) color = 'green';
  else if (finalScore >= 70) color = 'orange';
  else if (finalScore >= 50) color = 'yellow';

  const details = [
    {
      title: {
        uk: 'Energy and Happiness Compatibility',
        tr: 'Enerji ve Mutluluk Uyumu',
        es: 'Compatibilidad de Energía y Felicidad',
        fr: 'Compatibilité Énergie et Bonheur',
        de: 'Energie- und Glückskompatibilität',
      },
      score: eScore,
      description: eDesc,
      recommendation: eRec,
    },
    {
      title: {
        uk: 'Age Compatibility',
        tr: 'Yaş Uyumu',
        es: 'Compatibilidad de Edad',
        fr: 'Compatibilité d’Âge',
        de: 'Alterskompatibilität',
      },
      score: aScore,
      description: aDesc,
      recommendation: aRec,
    },
    {
      title: {
        uk: 'Emotion and Expression Compatibility',
        tr: 'Duygu ve İfade Uyumu',
        es: 'Compatibilidad de Emoción y Expresión',
        fr: 'Compatibilité Émotion et Expression',
        de: 'Emotions- und Ausdrucks-Kompatibilität',
      },
      score: emScore,
      description: emDesc,
      recommendation: emRec,
    },
    {
      title: {
        uk: 'Environment Compatibility',
        tr: 'Çevresel Uyum',
        es: 'Compatibilidad Ambiental',
        fr: 'Compatibilité Environnementale',
        de: 'Umgebungskompatibilität',
      },
      score: envScore,
      description: envDesc,
      recommendation: envRec,
    },
    {
      title: {
        uk: 'Care and Attention Compatibility',
        tr: 'Bakım ve İlgi Uyumu',
        es: 'Compatibilidad de Cuidado y Atención',
        fr: 'Compatibilité Soins et Attention',
        de: 'Pflege- und Aufmerksamkeits-Kompatibilität',
      },
      score: careScore,
      description: careDesc,
      recommendation: careRec,
    },
    {
      title: {
        uk: 'Activity Preference Compatibility',
        tr: 'Aktivite Tercih Uyumu',
        es: 'Compatibilidad de Preferencia de Actividad',
        fr: 'Compatibilité des Préférences d’Activité',
        de: 'Aktivitätspräferenz-Kompatibilität',
      },
      score: actScore,
      description: actDesc,
      recommendation: actRec,
    },
    {
      title: {
        uk: 'Social Compatibility',
        tr: 'Sosyal Uyum',
        es: 'Compatibilidad Social',
        fr: 'Compatibilité Sociale',
        de: 'Soziale Kompatibilität',
      },
      score: socScore,
      description: socDesc,
      recommendation: socRec,
    },
  ];

  let message = { uk: '', tr: '', es: '', fr: '', de: '' };
  let overallRecommendation = { uk: '', tr: '', es: '', fr: '', de: '' };

  if (finalScore >= 85) {
    message.uk = `Perfect match! You and ${dogBreed} are a dream team, destined for a lifetime of joy and companionship!`;
    message.tr = `Mükemmel eşleşme! Sen ve ${dogBreed} harika bir ikilisiniz, ömür boyu neşe ve arkadaşlık için kaderiniz bir!`;
    message.es = `¡Combinación perfecta! ¡Tú y ${dogBreed} son un equipo de ensueño, destinados a una vida de alegría y compañía!`;
    message.fr = `Match parfait ! Vous et ${dogBreed} formez une équipe de rêve, destinés à une vie de joie et de compagnie !`;
    message.de = `Perfekte Übereinstimmung! Du und ${dogBreed} seid ein Dreamteam, bestimmt für ein Leben voller Freude und Gesellschaft!`;
    overallRecommendation.uk = `You’re already a fantastic match! To keep your bond strong, maintain a balanced routine that includes both playtime and relaxation. Celebrate your connection with special activities like a weekend adventure or a cozy night in.`;
    overallRecommendation.tr = `Zaten harika bir eşleşmesiniz! Bağınızı güçlü tutmak için hem oyun zamanı hem de dinlenme içeren dengeli bir rutin sürdürün. Bağlantınızı, hafta sonu macerası veya evde geçirilen sıcak bir gece gibi özel aktivitelerle kutlayın.`;
    overallRecommendation.es = `¡Ya son una pareja fantástica! Para mantener su vínculo fuerte, mantén una rutina equilibrada que incluya tanto tiempo de juego como relajación. Celebra tu conexión con actividades especiales como una aventura de fin de semana o una noche acogedora en casa.`;
    overallRecommendation.fr = `Vous êtes déjà un couple fantastique ! Pour maintenir votre lien fort, conservez une routine équilibrée qui inclut à la fois du temps de jeu et de la détente. Célébrez votre connexion avec des activités spéciales comme une aventure de week-end ou une soirée cosy à la maison.`;
    overallRecommendation.de = `Ihr seid bereits ein fantastisches Paar! Um eure Bindung stark zu halten, halte eine ausgewogene Routine ein, die sowohl Spielzeit als auch Entspannung umfasst. Feiert eure Verbindung mit besonderen Aktivitäten wie einem Wochenendabenteuer oder einem gemütlichen Abend zu Hause.`;
  } else if (finalScore >= 70) {
    message.uk = `Great compatibility! You and ${dogBreed} can build a strong bond with a little effort and understanding.`;
    message.tr = `Harika bir uyum! Sen ve ${dogBreed} biraz çaba ve anlayışla güçlü bir bağ kurabilirsiniz.`;
    message.es = `¡Gran compatibilidad! Tú y ${dogBreed} pueden construir un vínculo fuerte con un poco de esfuerzo y comprensión.`;
    message.fr = `Grande compatibilité ! Vous et ${dogBreed} pouvez créer un lien fort avec un peu d’effort et de compréhension.`;
    message.de = `Große Kompatibilität! Du und ${dogBreed} könnt mit etwas Aufwand und Verständnis eine starke Bindung aufbauen.`;
    overallRecommendation.uk = `You’re on the right track! Focus on the recommendations provided in each category to enhance your compatibility. Small adjustments, like scheduling regular activities or creating a comfortable space, can make a big difference.`;
    overallRecommendation.tr = `Doğru yoldasınız! Uyumluluğunuzu artırmak için her kategoride verilen önerilere odaklanın. Düzenli aktiviteler planlamak veya rahat bir alan yaratmak gibi küçük ayarlamalar büyük bir fark yaratabilir.`;
    overallRecommendation.es = `¡Estás en el camino correcto! Concéntrate en las recomendaciones proporcionadas en cada categoría para mejorar tu compatibilidad. Pequeños ajustes, como programar actividades regulares o crear un espacio cómodo, pueden marcar una gran diferencia.`;
    overallRecommendation.fr = `Vous êtes sur la bonne voie ! Concentrez-vous sur les recommandations fournies dans chaque catégorie pour améliorer votre compatibilité. De petits ajustements, comme planifier des activités régulières ou créer un espace confortable, peuvent faire une grande différence.`;
    overallRecommendation.de = `Ihr seid auf dem richtigen Weg! Konzentriert euch auf die Empfehlungen in jeder Kategorie, um eure Kompatibilität zu verbessern. Kleine Anpassungen, wie das Planen regelmäßiger Aktivitäten oder das Schaffen eines komfortablen Raums, können einen großen Unterschied machen.`;
  } else if (finalScore >= 50) {
    message.uk = `Moderate compatibility. You and ${dogBreed} may need some adjustments to get along well, but with effort, you can create a harmonious bond.`;
    message.tr = `Orta düzey uyum. Sen ve ${dogBreed} iyi anlaşmak için bazı ayarlamalar yapmanız gerekebilir, ancak çabayla uyumlu bir bağ oluşturabilirsiniz.`;
    message.es = `Compatibilidad moderada. Tú y ${dogBreed} podrían necesitar algunos ajustes para llevarse bien, pero con esfuerzo, pueden crear un vínculo armonioso.`;
    message.fr = `Compatibilité modérée. Vous et ${dogBreed} devrez peut-être faire des ajustements pour bien vous entendre, mais avec de l’effort, vous pouvez créer un lien harmonieux.`;
    message.de = `Moderate Kompatibilität. Du und ${dogBreed} müsst vielleicht einige Anpassungen vornehmen, um gut miteinander auszukommen, aber mit Mühe könnt ihr eine harmonische Bindung schaffen.`;
    overallRecommendation.uk = `There’s potential for a great relationship! Pay close attention to the recommendations in each category to bridge any gaps. Consistency and understanding will help you build a stronger connection over time.`;
    overallRecommendation.tr = `Harika bir ilişki için potansiyel var! Her kategorideki önerilere dikkat ederek boşlukları kapatın. Tutarlılık ve anlayış, zamanla daha güçlü bir bağ kurmanıza yardımcı olacaktır.`;
    overallRecommendation.es = `¡Hay potencial para una gran relación! Presta mucha atención a las recomendaciones en cada categoría para cerrar cualquier brecha. La consistencia y la comprensión te ayudarán a construir una conexión más fuerte con el tiempo.`;
    overallRecommendation.fr = `Il y a du potentiel pour une belle relation ! Prêtez une attention particulière aux recommandations dans chaque catégorie pour combler les écarts. La constance et la compréhension vous aideront à construire une connexion plus forte avec le temps.`;
    overallRecommendation.de = `Es gibt Potenzial für eine großartige Beziehung! Achte genau auf die Empfehlungen in jeder Kategorie, um Lücken zu schließen. Beständigkeit und Verständnis werden euch helfen, mit der Zeit eine stärkere Verbindung aufzubauen.`;
  } else {
    message.uk = `Low compatibility. You and ${dogBreed} might find it challenging to connect, but with dedication, you can still build a meaningful relationship.`;
    message.tr = `Düşük uyum. Sen ve ${dogBreed} bağlantı kurmakta zorlanabilirsiniz, ancak özveriyle yine de anlamlı bir ilişki kurabilirsiniz.`;
    message.es = `Baja compatibilidad. Tú y ${dogBreed} podrían encontrar difícil conectar, pero con dedicación, aún pueden construir una relación significativa.`;
    message.fr = `Faible compatibilité. Vous et ${dogBreed} pourriez avoir du mal à vous connecter, mais avec du dévouement, vous pouvez quand même construire une relation significative.`;
    message.de = `Geringe Kompatibilität. Du und ${dogBreed} könntet Schwierigkeiten haben, eine Verbindung aufzubauen, aber mit Hingabe könnt ihr dennoch eine bedeutungsvolle Beziehung aufbauen.`;
    overallRecommendation.uk = `It might take extra effort, but don’t give up! Follow the recommendations in each category to improve your compatibility. Start with small, consistent steps to build trust and understanding.`;
    overallRecommendation.tr = `Ekstra çaba gerekebilir, ama pes etmeyin! Uyumluluğunuzu artırmak için her kategorideki önerileri takip edin. Güven ve anlayışı inşa etmek için küçük, tutarlı adımlarla başlayın.`;
    overallRecommendation.es = `Puede requerir un esfuerzo adicional, ¡pero no te rindas! Sigue las recomendaciones en cada categoría para mejorar tu compatibilidad. Comienza con pasos pequeños y consistentes para construir confianza y comprensión.`;
    overallRecommendation.fr = `Cela peut demander un effort supplémentaire, mais ne baissez pas les bras ! Suivez les recommandations dans chaque catégorie pour améliorer votre compatibilité. Commencez par de petits pas cohérents pour établir la confiance et la compréhension.`;
    overallRecommendation.de = `Es könnte zusätzlichen Aufwand erfordern, aber gib nicht auf! Folge den Empfehlungen in jeder Kategorie, um eure Kompatibilität zu verbessern. Beginne mit kleinen, beständigen Schritten, um Vertrauen und Verständnis aufzubauen.`;
  }

  return {
    score: finalScore,
    message,
    details,
    color,
    overallRecommendation,
  };
}