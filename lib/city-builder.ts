import * as THREE from 'three';

export const ROAD_GRID_SPACING = 120;
export const ROAD_WIDTH = 18;
export const ROAD_HALF_WIDTH = 9;
export const CAR_ROAD_BOUNDARY = 7.8; // Keeps car wheels strictly on the 18m asphalt road

export interface TrafficLightNode {
  key: string;
  mesh: THREE.Group;
  bulbRedMat: THREE.MeshBasicMaterial;
  bulbYellowMat: THREE.MeshBasicMaterial;
  bulbGreenMat: THREE.MeshBasicMaterial;
  stopLineMat: THREE.MeshBasicMaterial;
  state: 'red' | 'yellow' | 'green';
  timer: number;
  cycleDuration: number;
  position: THREE.Vector3;
}

export interface NpcVehicle {
  mesh: THREE.Group;
  wheels: THREE.Group[];
  position: THREE.Vector3;
  axis: 'x' | 'z';
  roadCoord: number;
  dirSign: 1 | -1;
  speed: number;
  color: THREE.Color;
}

export interface HumanHindiDialogue {
  speaker: string;
  hindi: string;
  hinglish: string;
  mood: 'ambient' | 'horn' | 'fast' | 'praise' | 'angry';
}

export const HINDI_HUMAN_DIALOGUES: Record<HumanHindiDialogue['mood'], HumanHindiDialogue[]> = {
  ambient: [
    {
      speaker: 'राहुल (Rahul)',
      hindi: 'वाह भाई! क्या मस्त गाड़ी है, एकदम कड़क! 🔥',
      hinglish: 'Wah bhai! Kya mast gaadi hai, ekdam kadak!',
      mood: 'ambient',
    },
    {
      speaker: 'शर्मा जी (Sharma Ji)',
      hindi: 'बेटा आराम से चलाओ, आगे ट्रैफिक सिग्नल है! 🚦',
      hinglish: 'Beta aaram se chalao, aage traffic signal hai!',
      mood: 'ambient',
    },
    {
      speaker: 'प्रिया (Priya)',
      hindi: 'अरे देखो! ये कार कितनी शानदार चमक रही है! ✨',
      hinglish: 'Are dekho! Ye car kitni shandar chamak rahi hai!',
      mood: 'ambient',
    },
    {
      speaker: 'रोहित (Rohit)',
      hindi: 'भाई हाईवे पकड़ो, वहाँ 180 की स्पीड में भगाओ! 🛣️',
      hinglish: 'Bhai highway pakdo, wahan 180 ki speed mein bhagao!',
      mood: 'ambient',
    },
    {
      speaker: 'चाचा जी (Chacha Ji)',
      hindi: 'ज़ेब्रा क्रॉसिंग देखकर ही गाड़ी आगे बढ़ाना भाई! 🚶',
      hinglish: 'Zebra crossing dekhkar hi gaadi aage badhana bhai!',
      mood: 'ambient',
    },
    {
      speaker: 'विक्रम (Vikram)',
      hindi: 'क्या इंजन की आवाज़ है भाई, एकदम रेसिंग कार! 🏎️',
      hinglish: 'Kya engine ki aawaz hai bhai, ekdam racing car!',
      mood: 'ambient',
    },
    {
      speaker: 'नेहा (Neha)',
      hindi: 'शहर का मौसम आज ड्राइविंग के लिए एकदम बढ़िया है! 🌤️',
      hinglish: 'Shahar ka mausam aaj driving ke liye ekdam badhiya hai!',
      mood: 'ambient',
    },
    {
      speaker: 'सोनू (Sonu)',
      hindi: 'भाई एक राउंड हमें भी घुमा दो अपनी कार में! 😄',
      hinglish: 'Bhai ek round humein bhi ghuma do apni car mein!',
      mood: 'ambient',
    },
    {
      speaker: 'दीपक (Deepak)',
      hindi: 'रेड लाइट पर रुकोगे तो +2 कॉइन मिलेंगे भाई! 🪙',
      hinglish: 'Red light par rukoge toh +2 coin milenge bhai!',
      mood: 'ambient',
    },
    {
      speaker: 'कबीर (Kabir)',
      hindi: 'भाई गियर शिफ्टिंग एकदम टाइम पर करना! ⚙️',
      hinglish: 'Bhai gear shifting ekdam time par karna!',
      mood: 'ambient',
    },
    {
      speaker: 'गार्ड राजवीर (Embassy Guard)',
      hindi: 'नमस्ते सर! एम्बेसी प्लाज़ा में आपका स्वागत है! 🏛️',
      hinglish: 'Namaste Sir! Embassy Plaza mein aapka swagat hai!',
      mood: 'ambient',
    },
    {
      speaker: 'अमन (Aman)',
      hindi: 'Rebel Ride के ड्राइवर का पूरे शहर में जलवा है! ⭐',
      hinglish: 'Rebel Ride ke driver ka poore shahar mein jalwa hai!',
      mood: 'ambient',
    },
    {
      speaker: 'गोलू भाई (Golu Bhai)',
      hindi: 'भाई ये गाड़ी कितने की ली? शोरूम से अभी निकाली है क्या? 🤩',
      hinglish: 'Bhai ye gaadi kitne ki li? Showroom se abhi nikali hai kya?',
      mood: 'ambient',
    },
    {
      speaker: 'आंटी जी (Aunty Ji)',
      hindi: 'बेटा साइड मिरर और बैक मिरर देखकर ही मोड़ना! 👀',
      hinglish: 'Beta side mirror aur back mirror dekhkar hi modna!',
      mood: 'ambient',
    },
    {
      speaker: 'पिंटू (Pintu)',
      hindi: 'ओए होए! अलॉय व्हील्स तो देखो इसके, क्या चमक रहे हैं! 🛞',
      hinglish: 'Oye hoye! Alloy wheels toh dekho iske, kya chamak rahe hain!',
      mood: 'ambient',
    },
    {
      speaker: 'अंजलि (Anjali)',
      hindi: 'भैया सेल्फी लेने दो ना आपकी सुपरकार के साथ! 📸',
      hinglish: 'Bhaiya selfie lene do na aapki supercar ke saath!',
      mood: 'ambient',
    },
    {
      speaker: 'चौधरी साहब (Chaudhary Sahab)',
      hindi: 'भाई क्लच दबाकर गियर बदलना, गाड़ी मक्खन चलेगी! 🧈',
      hinglish: 'Bhai clutch dabakar gear badalna, gaadi makkhan chalegi!',
      mood: 'ambient',
    },
    {
      speaker: 'मोनू मैकेनिक (Monu Mechanic)',
      hindi: 'इंजन एकदम टनाटन बोल रहा है भाई, फुल रेस दो! 🔧',
      hinglish: 'Engine ekdam tanatan bol raha hai bhai, full race do!',
      mood: 'ambient',
    },
    {
      speaker: 'रिया (Riya)',
      hindi: 'नाइट मोड में तो इस गाड़ी की हेडलाइट कमाल लगती है! 🌙',
      hinglish: 'Night mode mein toh is gaadi ki headlight kamaal lagti hai!',
      mood: 'ambient',
    },
    {
      speaker: 'गुड्डू (Guddu)',
      hindi: 'भाई अगली बार Valkyrie Hyper-X लेकर आना सड़क पर! 🚀',
      hinglish: 'Bhai agli baar Valkyrie Hyper-X lekar aana sadak par!',
      mood: 'ambient',
    },
    {
      speaker: 'मिश्रा जी (Mishra Ji)',
      hindi: 'इस शहर की सड़कें और एक्सप्रेस हाईवे एकदम फर्स्ट क्लास हैं! 🏙️',
      hinglish: 'Is shahar ki sadkein aur express highway ekdam first class hain!',
      mood: 'ambient',
    },
    {
      speaker: 'तनु (Tanu)',
      hindi: 'वाह! गाड़ी का कलर तो दिल जीत रहा है! ❤️',
      hinglish: 'Wah! Gaadi ka color toh dil jeet raha hai!',
      mood: 'ambient',
    },
    {
      speaker: 'सनी (Sunny)',
      hindi: 'भाई छठे गियर में डालकर देखो, रॉकेट बन जाएगी कार! 🔥',
      hinglish: 'Bhai chhathe gear mein daalkar dekho, rocket ban jayegi car!',
      mood: 'ambient',
    },
    {
      speaker: 'दादा जी (Dada Ji)',
      hindi: 'जीते रहो बेटा! हमेशा सीट बेल्ट और नियम का ध्यान रखो! 🙌',
      hinglish: 'Jeete raho beta! Hamesha seatbelt aur niyam ka dhyan rakho!',
      mood: 'ambient',
    },
  ],
  horn: [
    {
      speaker: 'राजू (Raju)',
      hindi: 'अरे भाई! कान फोड़ोगे क्या? फुटपाथ पर ही तो चल रहे हैं! 📢',
      hinglish: 'Are bhai! Kaan phodoge kya? Footpath par hi toh chal rahe hain!',
      mood: 'horn',
    },
    {
      speaker: 'अंकल वर्मा (Verma Ji)',
      hindi: 'हाँ भाई हाँ! हट रहे हैं, इतना हॉर्न मत बजाओ! 🙌',
      hinglish: 'Haan bhai haan! Hat rahe hain, itna horn mat bajao!',
      mood: 'horn',
    },
    {
      speaker: 'बंटी (Bunty)',
      hindi: 'ओ भाई! सड़क खाली है, आराम से निकल जाओ! 🚗',
      hinglish: 'O bhai! Sadak khali hai, aaram se nikal jao!',
      mood: 'horn',
    },
    {
      speaker: 'छोटू (Chotu)',
      hindi: 'अरे बाप रे! हॉर्न बजाकर तो डरा ही दिया भैया! 😅',
      hinglish: 'Are baap re! Horn bajakar toh dara hi diya bhaiya!',
      mood: 'horn',
    },
    {
      speaker: 'मौसी जी (Mausi Ji)',
      hindi: 'अरे बेटा! बारात निकली है क्या जो इतना पों-पों कर रहे हो?! 🎺',
      hinglish: 'Are beta! Baraat nikli hai kya jo itna pon-pon kar rahe ho?!',
      mood: 'horn',
    },
    {
      speaker: 'लकी (Lucky)',
      hindi: 'भाई कार है या ट्रेन का इंजन? कितना तेज़ हॉर्न है! 🚂',
      hinglish: 'Bhai car hai ya train ka engine? Kitna tez horn hai!',
      mood: 'horn',
    },
    {
      speaker: 'मुन्ना भाई (Munna Bhai)',
      hindi: 'शांत रहो मामू! रास्ता पूरा खाली है, लेकर निकलो गाड़ी! 😎',
      hinglish: 'Shaant raho mamu! Rasta poora khali hai, lekar niklo gaadi!',
      mood: 'horn',
    },
    {
      speaker: 'काका जी (Kaka Ji)',
      hindi: 'अरे भाई सुन लिया! आगे बढ़ो, कोई नहीं है सामने! 👋',
      hinglish: 'Are bhai sun liya! Aage badho, koi nahi hai saamne!',
      mood: 'horn',
    },
  ],
  fast: [
    {
      speaker: 'ताऊ जी (Tau Ji)',
      hindi: 'ओ भाई धीरे चला! ये सड़क है या रेस ट्रैक?! 🏎️💨',
      hinglish: 'O bhai dheere chala! Ye sadak hai ya race track?!',
      mood: 'fast',
    },
    {
      speaker: 'समीर (Sameer)',
      hindi: 'अरे बाप रे! कितनी तेज़ हवा की तरह उड़ा के ले गया! ⚡',
      hinglish: 'Are baap re! Kitni tez hawa ki tarah uda ke le gaya!',
      mood: 'fast',
    },
    {
      speaker: 'बबलू (Bablu)',
      hindi: 'ओए हीरो! पायलट बन रहा है क्या? ज़मीन पर ही चला ले! ✈️',
      hinglish: 'Oye hero! Pilot ban raha hai kya? Zameen par hi chala le!',
      mood: 'fast',
    },
    {
      speaker: 'तिवारी जी (Tiwari Ji)',
      hindi: 'अरे भाई! शहर में 105 की लिमिट है, चालान कट जाएगा! 🚨',
      hinglish: 'Are bhai! Shahar mein 105 ki limit hai, challan kat jayega!',
      mood: 'fast',
    },
    {
      speaker: 'रॉकी (Rocky)',
      hindi: 'वाह भाई वाह! धूम मचाले वाली स्पीड पकड़ रखी है! 🔥',
      hinglish: 'Wah bhai wah! Dhoom machale wali speed pakad rakhi hai!',
      mood: 'fast',
    },
    {
      speaker: 'कल्लू भाई (Kallu Bhai)',
      hindi: 'अरे मेरी टोपी उड़ गई भाई तेरी गाड़ी की हवा से! 🧢💨',
      hinglish: 'Are meri topi ud gayi bhai teri gaadi ki hawa se!',
      mood: 'fast',
    },
    {
      speaker: 'इंस्पेक्टर राठौड़ (Rathore)',
      hindi: 'तेज़ भगाना है तो एक्सप्रेस हाईवे पर जाओ, वहाँ 180 तक छूट है! 🛣️',
      hinglish: 'Tez bhagana hai toh Express Highway par jao, wahan 180 tak chhoot hai!',
      mood: 'fast',
    },
  ],
  praise: [
    {
      speaker: 'शर्मा जी (Sharma Ji)',
      hindi: 'शाबाश भाई! ज़ेब्रा क्रॉसिंग पर रुकने के लिए शुक्रिया! 🙏',
      hinglish: 'Shabash bhai! Zebra crossing par rukne ke liye shukriya!',
      mood: 'praise',
    },
    {
      speaker: 'सुनीता जी (Sunita Ji)',
      hindi: 'वाह! नियम मानने वाले ऐसे समझदार ड्राइवर बहुत कम मिलते हैं! 👏',
      hinglish: 'Wah! Niyam maanne wale aise samajhdar driver bahut kam milte hain!',
      mood: 'praise',
    },
    {
      speaker: 'मास्टर जी (Master Ji)',
      hindi: '10 में से 10 नंबर भाई! क्या शानदार और सुरक्षित ड्राइविंग है! 🏆',
      hinglish: '10 mein se 10 number bhai! Kya shandar aur surakshit driving hai!',
      mood: 'praise',
    },
    {
      speaker: 'दादी माँ (Dadi Maa)',
      hindi: 'खुश रहो बेटा! पैदल चलने वालों का ऐसे ही ध्यान रखना! ❤️',
      hinglish: 'Khush raho beta! Paidal chalne walon ka aise hi dhyan rakhna!',
      mood: 'praise',
    },
    {
      speaker: 'अजय (Ajay)',
      hindi: 'एकदम वीआईपी ड्राइवर हो भाई, ब्रेक भी बिल्कुल सही जगह लगाया! 👍',
      hinglish: 'Ekdam VIP driver ho bhai, brake bhi bilkul sahi jagah lagaya!',
      mood: 'praise',
    },
    {
      speaker: 'कविता (Kavita)',
      hindi: 'थैंक यू भैया! आराम से सड़क पार करने देने के लिए! 🌸',
      hinglish: 'Thank you bhaiya! Aaram se sadak paar karne dene ke liye!',
      mood: 'praise',
    },
  ],
  angry: [
    {
      speaker: 'रमेश (Ramesh)',
      hindi: 'अरे बचाओ! अंधा है क्या भाई?! देखकर गाड़ी चला! 😡',
      hinglish: 'Are bachao! Andha hai kya bhai?! Dekhkar gaadi chala!',
      mood: 'angry',
    },
    {
      speaker: 'पप्पू (Pappu)',
      hindi: 'अरे बाप रे! अभी तो टक्कर लग जाती, ब्रेक लगा भाई! 😱',
      hinglish: 'Are baap re! Abhi toh takkar lag jaati, brake laga bhai!',
      mood: 'angry',
    },
    {
      speaker: 'भीम भाई (Bheem Bhai)',
      hindi: 'ओ भाई! लाइसेंस किसने दिया तुझे?! फुटपाथ पर चढ़ाएगा क्या?! 🤬',
      hinglish: 'O bhai! License kisne diya tujhe?! Footpath par chadhayega kya?!',
      mood: 'angry',
    },
    {
      speaker: 'चंदू (Chandu)',
      hindi: 'अरे मरवाएगा क्या भाई?! ब्रेक कहाँ है तेरी गाड़ी का?! 🛑',
      hinglish: 'Are marwayega kya bhai?! Brake kahan hai teri gaadi ka?!',
      mood: 'angry',
    },
    {
      speaker: 'गुप्ता जी (Gupta Ji)',
      hindi: 'हे भगवान! ज़रा संभल के भाई, अभी हाथ-पैर टूट जाते! 🤕',
      hinglish: 'Hey Bhagwan! Zara sambhal ke bhai, abhi haath-pair toot jaate!',
      mood: 'angry',
    },
    {
      speaker: 'टिल्लू (Tillu)',
      hindi: 'अरे भाई! कार चला रहा है या बुलडोज़र?! देखकर चल! ⚠️',
      hinglish: 'Are bhai! Car chala raha hai ya bulldozer?! Dekhkar chal!',
      mood: 'angry',
    },
  ],
};

export interface NpcPedestrian {
  mesh: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  speechSprite: THREE.Sprite;
  dialogue: HumanHindiDialogue;
  position: THREE.Vector3;
  axis: 'x' | 'z';
  roadCoord: number;
  sideOffset: number;
  dirSign: 1 | -1;
  speed: number;
  walkPhase: number;
  isCrosswalkWalker: boolean;
  crosswalkCenterCoord: number;
}

export interface ParkingZone {
  mesh: THREE.Group;
  box: THREE.Box3;
  position: THREE.Vector3;
  isOccupied: boolean;
}

interface CityChunk {
  key: string;
  ix: number;
  iz: number;
  group: THREE.Group;
  trafficLight: TrafficLightNode;
}

export class CityMap {
  public scene: THREE.Scene;
  public groundMesh!: THREE.Mesh;
  public chunks: Map<string, CityChunk> = new Map();
  public npcVehicles: NpcVehicle[] = [];
  public npcPedestrians: NpcPedestrian[] = [];
  public parkingZones: ParkingZone[] = [];

  private currentCenterCellX = 999999;
  private currentCenterCellZ = 999999;

  // Shared Materials for fast infinite chunk streaming
  private roadMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.65,
    metalness: 0.2,
  });
  private yellowCenterMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  private whiteDashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  private zebraMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  private sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.85,
  });
  private curbRedMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.5,
  });
  private curbWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
  });
  private parkGrassMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.85,
  });
  private trunkMat = new THREE.MeshStandardMaterial({
    color: 0x542605,
    roughness: 0.9,
  });
  private foliageMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.55,
  });
  private poleMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.2,
  });
  private signalBoxMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.4,
  });
  private windowStripMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });
  private windowCoolMat = new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
  });

  // 16 Distinct, Vibrant Architectural Building Materials (so adjacent buildings never share the same color)
  private buildingMaterials: THREE.MeshStandardMaterial[] = [
    new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.45, metalness: 0.25 }), // Terracotta Orange-Red
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.3 }),   // Warm Amber Sandstone
    new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.35, metalness: 0.45 }), // Emerald Green Tower
    new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.35, metalness: 0.4 }),  // Royal Amethyst Purple
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.45, metalness: 0.25 }), // Crimson Brick
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.55 }),  // Cobalt Sapphire Blue
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.2 }),   // Limestone Ivory White
    new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.38, metalness: 0.35 }), // Rose Quartz Magenta
    new THREE.MeshStandardMaterial({ color: 0x0e7490, roughness: 0.32, metalness: 0.5 }),  // Teal Cyan Glass
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5, metalness: 0.25 }),  // Copper Bronze Brown
    new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.35, metalness: 0.45 }), // Deep Indigo Plaza
    new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.45, metalness: 0.25 }), // Olive Eco Tower
    new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4, metalness: 0.3 }),   // Sunset Coral
    new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35, metalness: 0.45 }), // Mint Jade
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.42, metalness: 0.3 }),  // Golden Ochre
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.6 }),  // Graphite Steel
  ];

  // Embassy Materials
  private embassyMarbleMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.35,
    metalness: 0.15,
  });
  private embassyGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.8,
  });
  private embassyRoofMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    roughness: 0.3,
    metalness: 0.5,
  });

  // Highway Materials & Sign Texture Cache
  private highwayRoadMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.5,
    metalness: 0.3,
  });
  private highwayChevronMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
  });
  private highwayGuardrailMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.25,
  });
  private signTextureCache: Map<string, THREE.CanvasTexture> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  private hash2D(ix: number, iz: number, salt = 0): number {
    const n = Math.sin(ix * 127.1 + iz * 311.7 + salt * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  public static isHighwayNS(ix: number): boolean {
    return Math.abs(ix) % 2 === 1;
  }

  public static isHighwayEW(iz: number): boolean {
    return Math.abs(iz) % 2 === 1;
  }

  public static getNSRoadName(ix: number): string {
    if (ix === 0) return 'Embassy Central Ave';
    if (ix === 1) return 'NH-1 East Express Highway';
    if (ix === -1) return 'NH-2 West Express Highway';
    if (CityMap.isHighwayNS(ix)) {
      const hwyNum = Math.abs(ix) * 12 + (ix > 0 ? 24 : 36);
      return `NH-${hwyNum} Skyline Express Highway`;
    }
    const names = [
      'Embassy Central Ave',
      'Grand Diplomatic Blvd',
      'Sapphire Park Ave',
      'Victoria Broadway',
      'Emerald Plaza Ave',
      'Royal Heritage Ave',
    ];
    return names[Math.abs(ix) % names.length];
  }

  public static getEWRoadName(iz: number): string {
    if (iz === 0) return 'Capitol Cross St';
    if (iz === 1) return 'I-90 North City Highway';
    if (iz === -1) return 'I-80 South Beltway Highway';
    if (CityMap.isHighwayEW(iz)) {
      const hwyNum = Math.abs(iz) * 10 + (iz > 0 ? 60 : 50);
      return `I-${hwyNum} Inter-City Highway`;
    }
    const names = [
      'Capitol Cross St',
      'Parliament Cross St',
      'Liberty Market Rd',
      'Golden Gate Pkwy',
      'Sunset Gallery St',
      'Harbor View Rd',
    ];
    return names[Math.abs(iz) % names.length];
  }

  public static getCityDistrictName(ix: number, iz: number): string {
    if (Math.abs(ix) <= 1 && Math.abs(iz) <= 1) return 'Capital Embassy City';
    if (iz >= 2 && Math.abs(ix) <= iz) return 'Metro Cyber City';
    if (iz <= -2 && Math.abs(ix) <= Math.abs(iz)) return 'Sunset Valley City';
    if (ix >= 2) return 'Harbor Port City';
    return 'Westgate Industrial City';
  }

  public static getConnectedCitiesLabel(ix: number, iz: number): string {
    const northCity = iz >= 1 ? 'METRO CYBER CITY' : 'CAPITAL EMBASSY CITY';
    const eastCity = ix >= 1 ? 'HARBOR PORT CITY' : 'WESTGATE CITY';
    return `↑ ${northCity}  •  ${eastCity} →`;
  }

  public static getRoadInfo(carX: number, carZ: number): {
    roadName: string;
    crossRoadName: string;
    cityName: string;
    isHighway: boolean;
    speedLimitKmH: number;
  } {
    const ix = Math.round(carX / ROAD_GRID_SPACING);
    const iz = Math.round(carZ / ROAD_GRID_SPACING);
    const dx = Math.abs(carX - ix * ROAD_GRID_SPACING);
    const dz = Math.abs(carZ - iz * ROAD_GRID_SPACING);

    const onNS = dx <= dz;
    const nsName = CityMap.getNSRoadName(ix);
    const ewName = CityMap.getEWRoadName(iz);
    const isHwy = onNS ? CityMap.isHighwayNS(ix) : CityMap.isHighwayEW(iz);

    return {
      roadName: onNS ? nsName : ewName,
      crossRoadName: onNS ? ewName : nsName,
      cityName: CityMap.getCityDistrictName(ix, iz),
      isHighway: isHwy,
      speedLimitKmH: isHwy ? 180 : 105,
    };
  }

  private getSignTexture(
    badge: string,
    title: string,
    subtitle: string,
    theme: 'highway' | 'street' | 'city'
  ): THREE.CanvasTexture {
    const cacheKey = `${theme}|${badge}|${title}|${subtitle}`;
    const existing = this.signTextureCache.get(cacheKey);
    if (existing) return existing;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background fill
      const bg =
        theme === 'highway'
          ? '#065f46'
          : theme === 'city'
            ? '#1e3a8a'
            : '#0f766e';
      const border =
        theme === 'highway'
          ? '#34d399'
          : theme === 'city'
            ? '#fbbf24'
            : '#f8fafc';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 192);

      // Reflective outer border
      ctx.strokeStyle = border;
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 496, 176);

      // Top Badge Pill
      ctx.fillStyle = theme === 'highway' ? '#047857' : '#0f172a';
      ctx.fillRect(22, 20, 468, 40);
      ctx.fillStyle = theme === 'city' ? '#fbbf24' : '#a7f3d0';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badge.toUpperCase(), 256, 48);

      // Main Road / Highway Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(title.toUpperCase(), 256, 108);

      // Subtitle (Connected Cities / Speed Limit / Cross Street)
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 23px sans-serif';
      ctx.fillText(subtitle.toUpperCase(), 256, 154);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    this.signTextureCache.set(cacheKey, tex);
    return tex;
  }

  private createRoadSignBoard(
    badge: string,
    title: string,
    subtitle: string,
    theme: 'highway' | 'street' | 'city',
    width = 6.2,
    height = 2.2
  ): THREE.Group {
    const signGroup = new THREE.Group();
    const tex = this.getSignTexture(badge, title, subtitle, theme);
    const faceMat = new THREE.MeshBasicMaterial({ map: tex });

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.16),
      this.poleMat
    );
    signGroup.add(backing);

    const planeGeo = new THREE.PlaneGeometry(width, height);
    const frontFace = new THREE.Mesh(planeGeo, faceMat);
    frontFace.position.z = 0.09;
    signGroup.add(frontFace);

    const backFace = new THREE.Mesh(planeGeo, faceMat);
    backFace.position.z = -0.09;
    backFace.rotation.y = Math.PI;
    signGroup.add(backFace);

    return signGroup;
  }

  public static isParkBlock(ix: number, iz: number): boolean {
    if (ix === 0 && iz === 0) return false; // (0,0) is reserved for the Grand Embassy
    const h = Math.abs((ix * 73856093) ^ (iz * 19349663)) % 6;
    return h === 0;
  }

  public static isEmbassyBlock(ix: number, iz: number): boolean {
    if (ix === 0 && iz === 0) return true; // Main Embassy right on Central Ave
    const h = Math.abs((ix * 39349663) ^ (iz * 83492791)) % 5;
    return h === 1;
  }

  public generateCity() {
    // 1. Infinite-following Base Ground Plane
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.95,
      metalness: 0.05,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // 2. Roadside Yellow Parking Bay on Central Avenue (x = 6.5, z = 165)
    this.createParkingBay(6.5, 0.045, 165);

    // 3. Initial Chunk Stream around origin (0, 0)
    this.updateStreamingChunks(0, 0);

    // 4. Spawn AI Traffic & Walking Humans (Pedestrians) on the road & sidewalk grid
    this.createNpcTraffic();
    this.createNpcPedestrians();
  }

  public updateStreamingChunks(carX: number, carZ: number) {
    const cellX = Math.round(carX / ROAD_GRID_SPACING);
    const cellZ = Math.round(carZ / ROAD_GRID_SPACING);

    if (this.groundMesh) {
      this.groundMesh.position.set(cellX * ROAD_GRID_SPACING, 0, cellZ * ROAD_GRID_SPACING);
    }

    if (cellX === this.currentCenterCellX && cellZ === this.currentCenterCellZ) {
      return;
    }
    this.currentCenterCellX = cellX;
    this.currentCenterCellZ = cellZ;

    const RADIUS = 2;

    for (const [key, chunk] of this.chunks.entries()) {
      if (
        Math.abs(chunk.ix - cellX) > RADIUS ||
        Math.abs(chunk.iz - cellZ) > RADIUS
      ) {
        this.scene.remove(chunk.group);
        this.chunks.delete(key);
      }
    }

    for (let ix = cellX - RADIUS; ix <= cellX + RADIUS; ix++) {
      for (let iz = cellZ - RADIUS; iz <= cellZ + RADIUS; iz++) {
        const key = `${ix},${iz}`;
        if (!this.chunks.has(key)) {
          const chunk = this.buildChunk(ix, iz);
          this.chunks.set(key, chunk);
          this.scene.add(chunk.group);
        }
      }
    }
  }

  private buildHumanFigure(
    shirtHex: number,
    pantsHex: number,
    skinHex: number,
    hairHex: number
  ): {
    root: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
  } {
    const root = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtHex, roughness: 0.5 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    // Torso / Jacket
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.68, 0.26), shirtMat);
    torso.position.y = 1.12;
    torso.castShadow = true;
    root.add(torso);

    // Collar / Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 8), skinMat);
    neck.position.y = 1.5;
    root.add(neck);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), skinMat);
    head.position.y = 1.68;
    head.castShadow = true;
    root.add(head);

    // Hair / Cap Crown
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.58),
      hairMat
    );
    hair.position.y = 1.71;
    root.add(hair);

    // Left Leg Pivot at Hip (y = 0.78)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.13, 0.78, 0);
    const lLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.72, 0.18), pantsMat);
    lLegMesh.position.y = -0.36;
    lLegMesh.castShadow = true;
    leftLeg.add(lLegMesh);
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.26), shoeMat);
    lShoe.position.set(0, -0.73, 0.04);
    leftLeg.add(lShoe);
    root.add(leftLeg);

    // Right Leg Pivot at Hip (y = 0.78)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.13, 0.78, 0);
    const rLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.72, 0.18), pantsMat);
    rLegMesh.position.y = -0.36;
    rLegMesh.castShadow = true;
    rightLeg.add(rLegMesh);
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.26), shoeMat);
    rShoe.position.set(0, -0.73, 0.04);
    rightLeg.add(rShoe);
    root.add(rightLeg);

    // Left Arm Pivot at Shoulder (y = 1.40)
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.32, 1.4, 0);
    const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.56, 0.14), shirtMat);
    lArmMesh.position.y = -0.26;
    lArmMesh.castShadow = true;
    leftArm.add(lArmMesh);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
    lHand.position.y = -0.56;
    leftArm.add(lHand);
    root.add(leftArm);

    // Right Arm Pivot at Shoulder (y = 1.40)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.32, 1.4, 0);
    const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.56, 0.14), shirtMat);
    rArmMesh.position.y = -0.26;
    rArmMesh.castShadow = true;
    rightArm.add(rArmMesh);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
    rHand.position.y = -0.56;
    rightArm.add(rHand);
    root.add(rightArm);

    // Scale slightly so pedestrians are clearly visible at street level (approx 1.85m tall)
    root.scale.set(1.08, 1.08, 1.08);

    return { root, leftLeg, rightLeg, leftArm, rightArm };
  }

  private buildEmbassyLandmark(group: THREE.Group, blockCenterX: number, blockCenterZ: number) {
    const embassyGroup = new THREE.Group();
    embassyGroup.position.set(blockCenterX, 0.42, blockCenterZ);

    // 1. Grand Classical Podium & Steps
    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(74, 2.2, 68),
      this.embassyMarbleMat
    );
    podium.position.y = 1.1;
    podium.receiveShadow = true;
    embassyGroup.add(podium);

    // Red Carpet Entrance Walkway facing West (Central Avenue) and South
    const carpet = new THREE.Mesh(
      new THREE.BoxGeometry(88, 0.15, 8),
      this.curbRedMat
    );
    carpet.position.set(0, 2.22, 0);
    embassyGroup.add(carpet);

    // 2. Main Neoclassical Embassy Palace Hall
    const mainHall = new THREE.Mesh(
      new THREE.BoxGeometry(52, 22, 48),
      this.embassyMarbleMat
    );
    mainHall.position.y = 13.2;
    mainHall.castShadow = true;
    mainHall.receiveShadow = true;
    embassyGroup.add(mainHall);

    // Golden Roof Cornice Trim
    const cornice = new THREE.Mesh(
      new THREE.BoxGeometry(55, 1.8, 51),
      this.embassyGoldMat
    );
    cornice.position.y = 24.5;
    embassyGroup.add(cornice);

    // 3. Classical Marble Pillars along West & South Facades
    const colGeo = new THREE.CylinderGeometry(1.1, 1.25, 20, 12);
    for (let i = -20; i <= 20; i += 8) {
      const colWest = new THREE.Mesh(colGeo, this.curbWhiteMat);
      colWest.position.set(-28, 12.2, i);
      colWest.castShadow = true;
      embassyGroup.add(colWest);

      const colSouth = new THREE.Mesh(colGeo, this.curbWhiteMat);
      colSouth.position.set(i, 12.2, -26);
      colSouth.castShadow = true;
      embassyGroup.add(colSouth);
    }

    // 4. Grand Royal Blue & Gold Embassy Dome on Roof
    const domeBase = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 15, 5, 20),
      this.embassyMarbleMat
    );
    domeBase.position.y = 27.5;
    embassyGroup.add(domeBase);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(13.5, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      this.embassyRoofMat
    );
    dome.position.y = 30.0;
    embassyGroup.add(dome);

    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.8, 7, 8),
      this.embassyGoldMat
    );
    spire.position.y = 46;
    embassyGroup.add(spire);

    // 5. Three Diplomatic Flagpoles in Front Courtyard
    const flagColors = [0xf97316, 0x22c55e, 0x3b82f6];
    [-12, 0, 12].forEach((fz, idx) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.25, 18, 8),
        this.embassyGoldMat
      );
      pole.position.set(-38, 9, fz);
      embassyGroup.add(pole);

      const flag = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 2.6, 4.5),
        new THREE.MeshBasicMaterial({ color: flagColors[idx] })
      );
      flag.position.set(-38, 16.2, fz + 2.2);
      embassyGroup.add(flag);
    });

    // 6. Embassy Honor Guards & Diplomatic Officials along the Red Carpet Entrance with Hindi Welcome Bubbles
    [-4.5, 4.5].forEach((gz, gIdx) => {
      const guard = this.buildHumanFigure(0x1e3a8a, 0x0f172a, 0xf1c27d, 0xf59e0b);
      const guardDialogue: HumanHindiDialogue =
        gIdx === 0
          ? {
              speaker: 'गार्ड राजवीर (Embassy Guard)',
              hindi: 'नमस्ते सर! एम्बेसी प्लाज़ा में आपका स्वागत है! 🏛️',
              hinglish: 'Namaste Sir! Embassy Plaza mein aapka swagat hai!',
              mood: 'ambient',
            }
          : {
              speaker: 'अधिकारी विक्रम (Diplomat)',
              hindi: 'यहाँ ट्रैफिक नियमों का पालन करें और कॉइन कमाएँ! 🪙',
              hinglish: 'Yahan traffic niyamon ka paalan karein aur coin kamayein!',
              mood: 'ambient',
            };
      const bubble = this.createHindiSpeechSprite(guardDialogue);
      bubble.position.set(0, 2.35, 0);
      guard.root.add(bubble);
      guard.root.position.set(-34, 2.3, gz);
      guard.root.rotation.y = -Math.PI / 2;
      embassyGroup.add(guard.root);
    });

    group.add(embassyGroup);
  }

  private createHindiSpeechSprite(dialogue: HumanHindiDialogue): THREE.Sprite {
    const cacheKey = `speech_${dialogue.speaker}_${dialogue.hindi}_${dialogue.mood}`;
    let tex = this.signTextureCache.get(cacheKey);
    if (!tex && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const borderColors: Record<HumanHindiDialogue['mood'], string> = {
          ambient: '#38bdf8',
          horn: '#f59e0b',
          fast: '#f97316',
          praise: '#10b981',
          angry: '#ef4444',
        };
        const accent = borderColors[dialogue.mood];

        // Speech bubble rounded box
        ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
        ctx.strokeStyle = accent;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(12, 10, 488, 118, 22);
        ctx.fill();
        ctx.stroke();

        // Bottom pointer triangle pointing to the pedestrian's head
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(238, 128);
        ctx.lineTo(256, 152);
        ctx.lineTo(274, 128);
        ctx.closePath();
        ctx.fill();

        // Speaker Name Tag
        ctx.fillStyle = accent;
        ctx.font = 'bold 21px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🗣 ${dialogue.speaker}`, 256, 42);

        // Main Hindi Dialogue Line
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(dialogue.hindi, 256, 80, 464);

        // Hinglish Subtitle
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 18px sans-serif';
        ctx.fillText(dialogue.hinglish, 256, 110, 464);
      }
      tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      this.signTextureCache.set(cacheKey, tex);
    }

    const mat = new THREE.SpriteMaterial({
      map: tex || undefined,
      transparent: true,
      depthTest: true,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.4, 1.06, 1);
    return sprite;
  }

  public updatePedestrianDialogue(ped: NpcPedestrian, dialogue: HumanHindiDialogue) {
    if (ped.dialogue.hindi === dialogue.hindi) return;
    ped.dialogue = dialogue;
    const newSprite = this.createHindiSpeechSprite(dialogue);
    if (newSprite.material.map) {
      ped.speechSprite.material.map = newSprite.material.map;
      ped.speechSprite.material.needsUpdate = true;
    }
  }

  private buildChunk(ix: number, iz: number): CityChunk {
    const group = new THREE.Group();
    const roadX = ix * ROAD_GRID_SPACING;
    const roadZ = iz * ROAD_GRID_SPACING;

    const isNS_Hwy = CityMap.isHighwayNS(ix);
    const isEW_Hwy = CityMap.isHighwayEW(iz);
    const nsRoadName = CityMap.getNSRoadName(ix);
    const ewRoadName = CityMap.getEWRoadName(iz);
    const cityName = CityMap.getCityDistrictName(ix, iz);
    const connectedLabel = CityMap.getConnectedCitiesLabel(ix, iz);

    // 1. North-South 4-Lane Road / Express Highway Segment
    const nsRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_GRID_SPACING),
      isNS_Hwy ? this.highwayRoadMat : this.roadMat
    );
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.set(roadX, 0.02, roadZ + ROAD_GRID_SPACING / 2);
    nsRoad.receiveShadow = true;
    group.add(nsRoad);

    const nonIntersectionLen = ROAD_GRID_SPACING - ROAD_WIDTH;
    const nsLineL = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, nonIntersectionLen),
      this.yellowCenterMat
    );
    nsLineL.rotation.x = -Math.PI / 2;
    nsLineL.position.set(roadX - 0.22, 0.03, roadZ + ROAD_GRID_SPACING / 2);
    group.add(nsLineL);

    const nsLineR = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, nonIntersectionLen),
      this.yellowCenterMat
    );
    nsLineR.rotation.x = -Math.PI / 2;
    nsLineR.position.set(roadX + 0.22, 0.03, roadZ + ROAD_GRID_SPACING / 2);
    group.add(nsLineR);

    for (let dz = 16; dz <= ROAD_GRID_SPACING - 16; dz += 14) {
      const dashL = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 5), this.whiteDashMat);
      dashL.rotation.x = -Math.PI / 2;
      dashL.position.set(roadX - 4.5, 0.035, roadZ + dz);
      group.add(dashL);

      const dashR = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 5), this.whiteDashMat);
      dashR.rotation.x = -Math.PI / 2;
      dashR.position.set(roadX + 4.5, 0.035, roadZ + dz);
      group.add(dashR);

      // Express Highway Fast-Lane Emerald Guide Stripes
      if (isNS_Hwy) {
        [-2.4, 2.4].forEach((lx) => {
          const fastMark = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 2.6),
            this.highwayChevronMat
          );
          fastMark.rotation.x = -Math.PI / 2;
          fastMark.position.set(roadX + lx, 0.038, roadZ + dz);
          group.add(fastMark);
        });
      }
    }

    // Full-Span Overhead Express Highway Gantry Sign Bridge on North-South Highways
    if (isNS_Hwy) {
      const hwyBridge = new THREE.Group();
      hwyBridge.position.set(roadX, 0, roadZ + ROAD_GRID_SPACING / 2);

      // Left & Right Steel Highway Truss Pillars
      [-9.8, 9.8].forEach((px) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.34, 8.2, 10),
          this.highwayGuardrailMat
        );
        pillar.position.set(px, 4.1, 0);
        hwyBridge.add(pillar);
      });

      // Overhead Steel Cross-Beam spanning entire 18m Highway
      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(20.4, 0.45, 0.45),
        this.highwayGuardrailMat
      );
      crossBeam.position.set(0, 7.6, 0);
      hwyBridge.add(crossBeam);

      // Left Overhead Highway Sign: Highway Name & 180 KM/H Fast Limit
      const hwySignLeft = this.createRoadSignBoard(
        'EXPRESS HIGHWAY • FAST LIMIT 180 KM/H',
        nsRoadName,
        'FAST INTER-CITY CORRIDOR ↑↑',
        'highway',
        8.2,
        2.5
      );
      hwySignLeft.position.set(-4.6, 7.6, 0);
      hwyBridge.add(hwySignLeft);

      // Right Overhead City Connector Sign: Connected Cities
      const hwySignRight = this.createRoadSignBoard(
        `WELCOME TO ${cityName}`,
        connectedLabel,
        `EXIT AT ${ewRoadName}`,
        'city',
        8.2,
        2.5
      );
      hwySignRight.position.set(4.6, 7.6, 0);
      hwyBridge.add(hwySignRight);

      group.add(hwyBridge);
    }

    // 2. East-West 4-Lane Road / Express Highway Segment
    const ewRoad = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_GRID_SPACING, ROAD_WIDTH),
      isEW_Hwy ? this.highwayRoadMat : this.roadMat
    );
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.set(roadX + ROAD_GRID_SPACING / 2, 0.022, roadZ);
    ewRoad.receiveShadow = true;
    group.add(ewRoad);

    const ewLineT = new THREE.Mesh(
      new THREE.PlaneGeometry(nonIntersectionLen, 0.26),
      this.yellowCenterMat
    );
    ewLineT.rotation.x = -Math.PI / 2;
    ewLineT.position.set(roadX + ROAD_GRID_SPACING / 2, 0.032, roadZ - 0.22);
    group.add(ewLineT);

    const ewLineB = new THREE.Mesh(
      new THREE.PlaneGeometry(nonIntersectionLen, 0.26),
      this.yellowCenterMat
    );
    ewLineB.rotation.x = -Math.PI / 2;
    ewLineB.position.set(roadX + ROAD_GRID_SPACING / 2, 0.032, roadZ + 0.22);
    group.add(ewLineB);

    for (let dx = 16; dx <= ROAD_GRID_SPACING - 16; dx += 14) {
      const dashT = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.28), this.whiteDashMat);
      dashT.rotation.x = -Math.PI / 2;
      dashT.position.set(roadX + dx, 0.036, roadZ - 4.5);
      group.add(dashT);

      const dashB = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.28), this.whiteDashMat);
      dashB.rotation.x = -Math.PI / 2;
      dashB.position.set(roadX + dx, 0.036, roadZ + 4.5);
      group.add(dashB);

      if (isEW_Hwy) {
        [-2.4, 2.4].forEach((lz) => {
          const fastMark = new THREE.Mesh(
            new THREE.PlaneGeometry(2.6, 1.1),
            this.highwayChevronMat
          );
          fastMark.rotation.x = -Math.PI / 2;
          fastMark.position.set(roadX + dx, 0.039, roadZ + lz);
          group.add(fastMark);
        });
      }
    }

    // Full-Span Overhead Express Highway Gantry Sign Bridge on East-West Highways
    if (isEW_Hwy) {
      const ewBridge = new THREE.Group();
      ewBridge.position.set(roadX + ROAD_GRID_SPACING / 2, 0, roadZ);
      ewBridge.rotation.y = Math.PI / 2;

      [-9.8, 9.8].forEach((px) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.34, 8.2, 10),
          this.highwayGuardrailMat
        );
        pillar.position.set(px, 4.1, 0);
        ewBridge.add(pillar);
      });

      const crossBeam = new THREE.Mesh(
        new THREE.BoxGeometry(20.4, 0.45, 0.45),
        this.highwayGuardrailMat
      );
      crossBeam.position.set(0, 7.6, 0);
      ewBridge.add(crossBeam);

      const ewSignLeft = this.createRoadSignBoard(
        'EXPRESS HIGHWAY • FAST LIMIT 180 KM/H',
        ewRoadName,
        'INTER-CITY FAST CORRIDOR ↑↑',
        'highway',
        8.2,
        2.5
      );
      ewSignLeft.position.set(-4.6, 7.6, 0);
      ewBridge.add(ewSignLeft);

      const ewSignRight = this.createRoadSignBoard(
        `CONNECTING TO ${cityName}`,
        connectedLabel,
        `JUNCTION: ${nsRoadName}`,
        'city',
        8.2,
        2.5
      );
      ewSignRight.position.set(4.6, 7.6, 0);
      ewBridge.add(ewSignRight);

      group.add(ewBridge);
    }

    // 3. Intersection Zebra Crosswalks & High-Visibility Overhead Traffic Light + Road Name Gantries
    const stripeWidth = 0.95;
    const stripeLen = 4.2;
    [-11.5, 11.5].forEach((offset) => {
      for (let s = -6; s <= 6; s += 3) {
        const cwNS = new THREE.Mesh(new THREE.PlaneGeometry(stripeWidth, stripeLen), this.zebraMat);
        cwNS.rotation.x = -Math.PI / 2;
        cwNS.position.set(roadX + s, 0.04, roadZ + offset);
        group.add(cwNS);

        const cwEW = new THREE.Mesh(new THREE.PlaneGeometry(stripeLen, stripeWidth), this.zebraMat);
        cwEW.rotation.x = -Math.PI / 2;
        cwEW.position.set(roadX + offset, 0.04, roadZ + s);
        group.add(cwEW);
      }
    });

    // Shared Signal Bulb Materials for this intersection
    const bulbRedMat = new THREE.MeshBasicMaterial({ color: 0x450a0a });
    const bulbYellowMat = new THREE.MeshBasicMaterial({ color: 0x422006 });
    const bulbGreenMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const stopLineMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    // Glowing Stop-Line Strips across all 4 entrances of the intersection
    const stopLineNSGeo = new THREE.PlaneGeometry(ROAD_WIDTH - 1, 0.9);
    const stopLineNorth = new THREE.Mesh(stopLineNSGeo, stopLineMat);
    stopLineNorth.rotation.x = -Math.PI / 2;
    stopLineNorth.position.set(roadX, 0.045, roadZ - 14.2);
    group.add(stopLineNorth);

    const stopLineSouth = new THREE.Mesh(stopLineNSGeo, stopLineMat);
    stopLineSouth.rotation.x = -Math.PI / 2;
    stopLineSouth.position.set(roadX, 0.045, roadZ + 14.2);
    group.add(stopLineSouth);

    const stopLineEWGeo = new THREE.PlaneGeometry(0.9, ROAD_WIDTH - 1);
    const stopLineWest = new THREE.Mesh(stopLineEWGeo, stopLineMat);
    stopLineWest.rotation.x = -Math.PI / 2;
    stopLineWest.position.set(roadX - 14.2, 0.045, roadZ);
    group.add(stopLineWest);

    const stopLineEast = new THREE.Mesh(stopLineEWGeo, stopLineMat);
    stopLineEast.rotation.x = -Math.PI / 2;
    stopLineEast.position.set(roadX + 14.2, 0.045, roadZ);
    group.add(stopLineEast);

    // Overhead Cantilever Traffic Light + Road Name Sign Gantries on Both Corners of the Intersection
    const createTrafficGantry = (
      gx: number,
      gz: number,
      rotY: number,
      mainRoadTitle: string,
      crossRoadTitle: string,
      isMainHwy: boolean
    ) => {
      const gantry = new THREE.Group();
      gantry.position.set(gx, 0, gz);
      gantry.rotation.y = rotY;

      // Vertical Steel Post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 7.4, 10), this.poleMat);
      post.position.y = 3.7;
      gantry.add(post);

      // Horizontal Cantilever Beam extending over the road lanes
      const beam = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.24, 0.24), this.poleMat);
      beam.position.set(-4.4, 6.8, 0);
      gantry.add(beam);

      // Overhead Readable Road Name & City Direction Sign Board mounted on the Gantry Beam
      const overheadRoadSign = this.createRoadSignBoard(
        isMainHwy ? `HIGHWAY • MAX 180 KM/H` : `${cityName}`,
        mainRoadTitle,
        `↔ ${crossRoadTitle}`,
        isMainHwy ? 'highway' : 'street',
        5.2,
        1.75
      );
      overheadRoadSign.position.set(-2.1, 6.8, 0);
      gantry.add(overheadRoadSign);

      // Eye-Level Roadside Street Name Sign Plate (clearly readable in 1st-person cockpit view!)
      const eyeLevelRoadSign = this.createRoadSignBoard(
        cityName,
        mainRoadTitle,
        connectedLabel,
        isMainHwy ? 'highway' : 'street',
        3.4,
        1.15
      );
      eyeLevelRoadSign.position.set(-1.8, 4.45, 0);
      gantry.add(eyeLevelRoadSign);

      // Primary Overhead Signal Housing (right above the driving lane)
      const housing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.8, 0.7), this.signalBoxMat);
      housing.position.set(-5.8, 5.8, 0);
      gantry.add(housing);

      // Eye-Level Roadside Signal Housing (easily visible in 1st-person cockpit view!)
      const lowHousing = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.2, 0.55), this.signalBoxMat);
      lowHousing.position.set(0, 3.2, 0);
      gantry.add(lowHousing);

      const bulbGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const lowBulbGeo = new THREE.SphereGeometry(0.24, 10, 10);

      // Front & Back bulbs on overhead housing
      [-0.36, 0.36].forEach((bz) => {
        const rBulb = new THREE.Mesh(bulbGeo, bulbRedMat);
        rBulb.position.set(-5.8, 6.6, bz);
        gantry.add(rBulb);

        const yBulb = new THREE.Mesh(bulbGeo, bulbYellowMat);
        yBulb.position.set(-5.8, 5.8, bz);
        gantry.add(yBulb);

        const gBulb = new THREE.Mesh(bulbGeo, bulbGreenMat);
        gBulb.position.set(-5.8, 5.0, bz);
        gantry.add(gBulb);
      });

      // Front & Back bulbs on eye-level housing
      [-0.28, 0.28].forEach((bz) => {
        const rLow = new THREE.Mesh(lowBulbGeo, bulbRedMat);
        rLow.position.set(0, 3.85, bz);
        gantry.add(rLow);

        const yLow = new THREE.Mesh(lowBulbGeo, bulbYellowMat);
        yLow.position.set(0, 3.2, bz);
        gantry.add(yLow);

        const gLow = new THREE.Mesh(lowBulbGeo, bulbGreenMat);
        gLow.position.set(0, 2.55, bz);
        gantry.add(gLow);
      });

      return gantry;
    };

    const poleGroup = new THREE.Group();
    poleGroup.add(
      createTrafficGantry(roadX + 10.2, roadZ + 10.2, 0, nsRoadName, ewRoadName, isNS_Hwy)
    );
    poleGroup.add(
      createTrafficGantry(
        roadX - 10.2,
        roadZ - 10.2,
        Math.PI / 2,
        ewRoadName,
        nsRoadName,
        isEW_Hwy
      )
    );
    group.add(poleGroup);

    const initialTimer = this.hash2D(ix, iz, 9) * 18;
    const trafficLight: TrafficLightNode = {
      key: `${ix},${iz}`,
      mesh: poleGroup,
      bulbRedMat,
      bulbYellowMat,
      bulbGreenMat,
      stopLineMat,
      state: 'green',
      timer: initialTimer,
      cycleDuration: 18, // 8s Green, 2.5s Yellow, 7.5s Red
      position: new THREE.Vector3(roadX, 0, roadZ),
    };
    this.applyTrafficLightVisuals(trafficLight);

    // 4. City Block Content in [roadX + 9 .. roadX + 111, roadZ + 9 .. roadZ + 111]
    const blockCenterX = roadX + ROAD_GRID_SPACING / 2;
    const blockCenterZ = roadZ + ROAD_GRID_SPACING / 2;
    const blockSize = ROAD_GRID_SPACING - ROAD_WIDTH; // 102m x 102m

    // Raised Sidewalk & Curb Barrier
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, 0.42, blockSize),
      this.sidewalkMat
    );
    sidewalk.position.set(blockCenterX, 0.21, blockCenterZ);
    sidewalk.receiveShadow = true;
    group.add(sidewalk);

    // High-Visibility Red & White Road Edge Curbs
    const curbNorth = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, 0.46, 0.6),
      this.curbRedMat
    );
    curbNorth.position.set(blockCenterX, 0.23, blockCenterZ - blockSize / 2 + 0.3);
    group.add(curbNorth);

    const curbSouth = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, 0.46, 0.6),
      this.curbRedMat
    );
    curbSouth.position.set(blockCenterX, 0.23, blockCenterZ + blockSize / 2 - 0.3);
    group.add(curbSouth);

    const curbWest = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.46, blockSize),
      this.curbWhiteMat
    );
    curbWest.position.set(blockCenterX - blockSize / 2 + 0.3, 0.23, blockCenterZ);
    group.add(curbWest);

    const curbEast = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.46, blockSize),
      this.curbWhiteMat
    );
    curbEast.position.set(blockCenterX + blockSize / 2 - 0.3, 0.23, blockCenterZ);
    group.add(curbEast);

    if (CityMap.isEmbassyBlock(ix, iz)) {
      // Grand Embassy & Diplomatic Plaza Landmark
      this.buildEmbassyLandmark(group, blockCenterX, blockCenterZ);
    } else if (CityMap.isParkBlock(ix, iz)) {
      // Green Park Block with Trees
      const parkGrass = new THREE.Mesh(
        new THREE.BoxGeometry(blockSize - 8, 0.1, blockSize - 8),
        this.parkGrassMat
      );
      parkGrass.position.set(blockCenterX, 0.45, blockCenterZ);
      group.add(parkGrass);

      for (let t = 0; t < 10; t++) {
        const tx = blockCenterX + (this.hash2D(ix, iz, t * 2 + 1) - 0.5) * (blockSize - 22);
        const tz = blockCenterZ + (this.hash2D(ix, iz, t * 2 + 2) - 0.5) * (blockSize - 22);
        const treeGroup = new THREE.Group();

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 4.2, 7), this.trunkMat);
        trunk.position.y = 2.1;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(new THREE.ConeGeometry(3.4, 7.5, 7), this.foliageMat);
        foliage.position.y = 6.5;
        treeGroup.add(foliage);

        treeGroup.position.set(tx, 0.42, tz);
        group.add(treeGroup);
      }
    } else {
      // 4 Distinct-Colored Buildings in the 4 Quadrants of the Block (Guaranteed Different Colors!)
      const quadOffsets = [
        { qx: -24, qz: -24 },
        { qx: 24, qz: -24 },
        { qx: -24, qz: 24 },
        { qx: 24, qz: 24 },
      ];

      const baseColorSeed = Math.abs(ix * 5 + iz * 11) % this.buildingMaterials.length;

      quadOffsets.forEach((quad, idx) => {
        const hRand = this.hash2D(ix, iz, 20 + idx);
        const wRand = this.hash2D(ix, iz, 30 + idx);
        const dRand = this.hash2D(ix, iz, 40 + idx);

        // Guarantee every building in the block (and neighboring blocks) has a different color!
        const matIdx = (baseColorSeed + idx * 4 + (ix + iz) * 3 + 1600) % this.buildingMaterials.length;
        const bMat = this.buildingMaterials[matIdx];

        const bWidth = 26 + wRand * 12;
        const bDepth = 26 + dRand * 12;
        const bHeight = 20 + hRand * 52;

        const bx = blockCenterX + quad.qx;
        const bz = blockCenterZ + quad.qz;

        const building = new THREE.Mesh(
          new THREE.BoxGeometry(bWidth, bHeight, bDepth),
          bMat
        );
        building.position.set(bx, bHeight / 2 + 0.42, bz);
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Architectural Stepped Crown / Rooftop Tier in contrasting trim
        const crownMat = this.buildingMaterials[(matIdx + 6) % this.buildingMaterials.length];
        const crown = new THREE.Mesh(
          new THREE.BoxGeometry(bWidth * 0.65, 4.5, bDepth * 0.65),
          crownMat
        );
        crown.position.set(bx, bHeight + 2.6, bz);
        group.add(crown);

        // Discrete Horizontal Floor Window Stripes (preserves the building's distinct primary color!)
        const stripMat = idx % 2 === 0 ? this.windowStripMat : this.windowCoolMat;
        const numBands = 3;
        for (let f = 1; f <= numBands; f++) {
          const bandY = (bHeight / (numBands + 1)) * f + 0.42;
          const band = new THREE.Mesh(
            new THREE.BoxGeometry(bWidth + 0.25, 1.35, bDepth + 0.25),
            stripMat
          );
          band.position.set(bx, bandY, bz);
          group.add(band);
        }
      });
    }

    // 5. Street Lamp Posts along the sidewalk edges
    [-40, 0, 40].forEach((offset) => {
      const lamp = new THREE.Group();
      const lPole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 7.0, 8), this.poleMat);
      lPole.position.y = 3.5;
      lamp.add(lPole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.12), this.poleMat);
      arm.position.set(-0.7, 6.8, 0);
      lamp.add(arm);

      lamp.position.set(roadX + 10.2, 0, blockCenterZ + offset);
      group.add(lamp);
    });

    return {
      key: `${ix},${iz}`,
      ix,
      iz,
      group,
      trafficLight,
    };
  }

  private applyTrafficLightVisuals(tl: TrafficLightNode) {
    if (tl.state === 'green') {
      tl.bulbGreenMat.color.setHex(0x22c55e);
      tl.bulbYellowMat.color.setHex(0x422006);
      tl.bulbRedMat.color.setHex(0x450a0a);
      tl.stopLineMat.color.setHex(0x22c55e);
    } else if (tl.state === 'yellow') {
      tl.bulbGreenMat.color.setHex(0x052e16);
      tl.bulbYellowMat.color.setHex(0xfacc15);
      tl.bulbRedMat.color.setHex(0x450a0a);
      tl.stopLineMat.color.setHex(0xfacc15);
    } else {
      tl.bulbGreenMat.color.setHex(0x052e16);
      tl.bulbYellowMat.color.setHex(0x422006);
      tl.bulbRedMat.color.setHex(0xff1111);
      tl.stopLineMat.color.setHex(0xff1111);
    }
  }

  public getNearestTrafficLight(carX: number, carZ: number): {
    node: TrafficLightNode | null;
    distanceMeters: number;
    secondsRemaining: number;
  } {
    const ix = Math.round(carX / ROAD_GRID_SPACING);
    const iz = Math.round(carZ / ROAD_GRID_SPACING);
    const chunk = this.chunks.get(`${ix},${iz}`);
    if (!chunk) {
      return { node: null, distanceMeters: 999, secondsRemaining: 0 };
    }
    const tl = chunk.trafficLight;
    const dist = Math.hypot(carX - tl.position.x, carZ - tl.position.z);
    let rem = 0;
    if (tl.state === 'green') rem = Math.max(1, Math.ceil(8 - tl.timer));
    else if (tl.state === 'yellow') rem = Math.max(1, Math.ceil(10.5 - tl.timer));
    else rem = Math.max(1, Math.ceil(18 - tl.timer));

    return { node: tl, distanceMeters: dist, secondsRemaining: rem };
  }

  public createParkingBay(x: number, y: number, z: number) {
    const bayGroup = new THREE.Group();

    const bay = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 10.5),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    bay.rotation.x = -Math.PI / 2;
    bay.position.set(0, y, 0);
    bayGroup.add(bay);

    const slot = new THREE.Mesh(
      new THREE.PlaneGeometry(3.7, 9.9),
      new THREE.MeshBasicMaterial({ color: 0x1e293b })
    );
    slot.rotation.x = -Math.PI / 2;
    slot.position.set(0, y + 0.005, 0);
    bayGroup.add(slot);

    bayGroup.position.set(x, 0, z);
    this.scene.add(bayGroup);

    this.parkingZones.push({
      mesh: bayGroup,
      box: new THREE.Box3().setFromObject(bay),
      position: new THREE.Vector3(x, 0, z),
      isOccupied: false,
    });
  }

  private createNpcTraffic() {
    const carColors = [
      0xef4444, // Racing Red
      0x2563eb, // Electric Sapphire Blue
      0x10b981, // Emerald Metallic
      0xf59e0b, // Solar Gold
      0x8b5cf6, // Ultra Violet
      0x06b6d4, // Cyber Cyan
      0xf8fafc, // Pearl White
      0xea580c, // Sunset Orange
    ];

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.5,
    });
    const glassCabinMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.08,
      metalness: 0.9,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
    });
    const alloyRimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.9,
    });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const drlAmberMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
    const plateMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    for (let i = 0; i < 8; i++) {
      const carGroup = new THREE.Group();
      const isSuv = i % 3 === 1;
      const bodyMat = new THREE.MeshStandardMaterial({
        color: carColors[i % carColors.length],
        roughness: 0.18,
        metalness: 0.82,
      });

      // 1. Lower Carbon Chassis & Side Skirts
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(2.06, 0.28, 4.65),
        darkTrimMat
      );
      chassis.position.set(0, 0.36, 0);
      chassis.castShadow = true;
      carGroup.add(chassis);

      // 2. Sculpted Main Painted Body
      const mainBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.02, isSuv ? 0.72 : 0.58, 4.48),
        bodyMat
      );
      mainBody.position.set(0, isSuv ? 0.78 : 0.70, 0);
      mainBody.castShadow = true;
      mainBody.receiveShadow = true;
      carGroup.add(mainBody);

      // 3. Aerodynamic Sloped Front Hood
      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.18, 1.35),
        bodyMat
      );
      hood.position.set(0, isSuv ? 1.12 : 0.98, 1.48);
      hood.rotation.x = 0.08;
      carGroup.add(hood);

      // 4. Tinted Glass Cabin Greenhouse + Sloped Front & Rear Windshields
      const cabinHeight = isSuv ? 0.68 : 0.56;
      const cabinLength = isSuv ? 2.55 : 2.15;
      const cabinZ = isSuv ? -0.25 : -0.15;
      const cabinY = isSuv ? 1.42 : 1.22;

      const cabinGlass = new THREE.Mesh(
        new THREE.BoxGeometry(1.74, cabinHeight, cabinLength),
        glassCabinMat
      );
      cabinGlass.position.set(0, cabinY, cabinZ);
      carGroup.add(cabinGlass);

      // Sloped Front Windshield
      const frontWindshield = new THREE.Mesh(
        new THREE.BoxGeometry(1.70, cabinHeight * 0.95, 0.65),
        glassCabinMat
      );
      frontWindshield.position.set(0, cabinY - 0.04, cabinZ + cabinLength / 2 + 0.16);
      frontWindshield.rotation.x = -0.52;
      carGroup.add(frontWindshield);

      // Painted Roof Panel on top of the glass cabin
      const roofPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.78, 0.1, cabinLength - 0.1),
        bodyMat
      );
      roofPanel.position.set(0, cabinY + cabinHeight / 2 + 0.02, cabinZ);
      carGroup.add(roofPanel);

      // 5. Front Radiator Grille, Front Splitter Bumper & Glowing LED Headlights
      const frontBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.34, 0.28),
        darkTrimMat
      );
      frontBumper.position.set(0, 0.44, 2.26);
      carGroup.add(frontBumper);

      const frontGrille = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.32, 0.1),
        darkTrimMat
      );
      frontGrille.position.set(0, 0.72, 2.25);
      carGroup.add(frontGrille);

      [-0.74, 0.74].forEach((hx) => {
        const hl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.12), headlightMat);
        hl.position.set(hx, 0.80, 2.24);
        carGroup.add(hl);

        const drl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.13), drlAmberMat);
        drl.position.set(hx, 0.68, 2.25);
        carGroup.add(drl);
      });

      // 6. Rear Diffuser Bumper, Full-Width LED Taillight Bar, License Plate & Sport Spoiler
      const rearBumper = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.36, 0.28),
        darkTrimMat
      );
      rearBumper.position.set(0, 0.44, -2.26);
      carGroup.add(rearBumper);

      const tailBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.88, 0.14, 0.1),
        taillightMat
      );
      tailBar.position.set(0, 0.84, -2.25);
      carGroup.add(tailBar);

      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.16, 0.08),
        plateMat
      );
      plate.position.set(0, 0.56, -2.36);
      carGroup.add(plate);

      if (!isSuv) {
        // Sporty Rear Wing Spoiler on Sedans/Coupes
        const spoilerBlade = new THREE.Mesh(
          new THREE.BoxGeometry(1.82, 0.07, 0.32),
          darkTrimMat
        );
        spoilerBlade.position.set(0, 1.18, -2.06);
        carGroup.add(spoilerBlade);

        [-0.6, 0.6].forEach((sx) => {
          const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.18), darkTrimMat);
          strut.position.set(sx, 1.06, -2.06);
          carGroup.add(strut);
        });
      }

      // 7. Side Wing Mirrors
      [-1.08, 1.08].forEach((mx) => {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.18), bodyMat);
        mirror.position.set(mx, 1.08, 0.68);
        carGroup.add(mirror);
      });

      // 8. Four Detailed 3D Wheels with Rubber Tires & Silver Alloy Rims
      const wheels: THREE.Group[] = [];
      const wheelCoords = [
        { x: -1.04, z: 1.42 },
        { x: 1.04, z: 1.42 },
        { x: -1.04, z: -1.42 },
        { x: 1.04, z: -1.42 },
      ];

      wheelCoords.forEach((wc) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(wc.x, 0.42, wc.z);

        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.42, 0.28, 16),
          tireMat
        );
        tire.rotation.z = Math.PI / 2;
        wheelGroup.add(tire);

        const rim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.27, 0.27, 0.30, 12),
          alloyRimMat
        );
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        const spokeBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.48, 0.08),
          darkTrimMat
        );
        wheelGroup.add(spokeBar);

        carGroup.add(wheelGroup);
        wheels.push(wheelGroup);
      });

      const isNS = i % 2 === 0;
      const dirSign: 1 | -1 = i % 4 < 2 ? 1 : -1;
      const roadIndex = (i % 3) - 1;
      const roadCoord = roadIndex * ROAD_GRID_SPACING;
      const laneOffset = dirSign === 1 ? -4.5 : 4.5;

      if (isNS) {
        carGroup.position.set(roadCoord + laneOffset, 0, (i - 3) * 55);
      } else {
        carGroup.position.set((i - 3) * 55, 0, roadCoord + laneOffset);
      }

      this.scene.add(carGroup);

      this.npcVehicles.push({
        mesh: carGroup,
        wheels,
        position: carGroup.position,
        axis: isNS ? 'z' : 'x',
        roadCoord,
        dirSign,
        speed: 10 + (i % 4) * 2.5,
        color: new THREE.Color(carColors[i % carColors.length]),
      });
    }
  }

  private createNpcPedestrians() {
    const shirtPalette = [
      0xef4444, // Red hoodie
      0x3b82f6, // Royal blue jacket
      0x10b981, // Emerald green shirt
      0xf59e0b, // Amber safety blazer
      0x8b5cf6, // Purple sweater
      0xec4899, // Pink cardigan
      0x06b6d4, // Cyan polo
      0xf8fafc, // Crisp white dress shirt
      0xea580c, // Coral windbreaker
      0x84cc16, // Lime athletic tee
    ];
    const pantsPalette = [0x1e293b, 0x0f172a, 0x334155, 0x1e3a8a, 0x422006, 0x374151];
    const skinPalette = [0xffdbac, 0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524];
    const hairPalette = [0x090d16, 0x451a03, 0x78350f, 0xca8a04, 0x991b1b, 0x334155];

    // 1. 12 Sidewalk Pedestrians walking along both sides of N-S and E-W streets
    for (let i = 0; i < 12; i++) {
      const fig = this.buildHumanFigure(
        shirtPalette[i % shirtPalette.length],
        pantsPalette[i % pantsPalette.length],
        skinPalette[i % skinPalette.length],
        hairPalette[i % hairPalette.length]
      );

      const isNS = i % 2 === 0;
      const dirSign: 1 | -1 = i % 4 < 2 ? 1 : -1;
      const roadIndex = (i % 3) - 1;
      const roadCoord = roadIndex * ROAD_GRID_SPACING;
      // Walk along the raised sidewalk (11.2m or -11.2m from the road center)
      const sideOffset = (i % 2 === 0 ? 1 : -1) * (10.8 + (i % 3) * 0.6);
      const alongCoord = ((i * 29) % 200) - 100;

      if (isNS) {
        fig.root.position.set(roadCoord + sideOffset, 0.42, alongCoord);
      } else {
        fig.root.position.set(alongCoord, 0.42, roadCoord + sideOffset);
      }

      const ambientList = HINDI_HUMAN_DIALOGUES.ambient;
      const pedDialogue = ambientList[i % ambientList.length];
      const speechSprite = this.createHindiSpeechSprite(pedDialogue);
      speechSprite.position.set(0, 2.32, 0);
      fig.root.add(speechSprite);

      this.scene.add(fig.root);

      this.npcPedestrians.push({
        mesh: fig.root,
        leftLeg: fig.leftLeg,
        rightLeg: fig.rightLeg,
        leftArm: fig.leftArm,
        rightArm: fig.rightArm,
        speechSprite,
        dialogue: pedDialogue,
        position: fig.root.position,
        axis: isNS ? 'z' : 'x',
        roadCoord,
        sideOffset,
        dirSign,
        speed: 1.55 + (i % 4) * 0.32,
        walkPhase: i * 1.1,
        isCrosswalkWalker: false,
        crosswalkCenterCoord: 0,
      });
    }

    // 2. 4 Zebra Crosswalk Pedestrians walking back and forth across intersection crosswalks
    for (let j = 0; j < 4; j++) {
      const fig = this.buildHumanFigure(
        shirtPalette[(j + 3) % shirtPalette.length],
        pantsPalette[(j + 2) % pantsPalette.length],
        skinPalette[(j + 1) % skinPalette.length],
        hairPalette[(j + 4) % hairPalette.length]
      );

      const isCrossingX = j % 2 === 0; // Crosses East-West across a North-South road zebra stripe
      const dirSign: 1 | -1 = j % 4 < 2 ? 1 : -1;
      const crosswalkOffset = j < 2 ? 11.5 : -11.5;
      const startWalkOffset = ((j % 4) - 1.5) * 4.5;

      if (isCrossingX) {
        fig.root.position.set(startWalkOffset, 0.05, crosswalkOffset);
      } else {
        fig.root.position.set(crosswalkOffset, 0.05, startWalkOffset);
      }

      const ambientList = HINDI_HUMAN_DIALOGUES.ambient;
      const cwDialogue = ambientList[(j + 4) % ambientList.length];
      const speechSprite = this.createHindiSpeechSprite(cwDialogue);
      speechSprite.position.set(0, 2.32, 0);
      fig.root.add(speechSprite);

      this.scene.add(fig.root);

      this.npcPedestrians.push({
        mesh: fig.root,
        leftLeg: fig.leftLeg,
        rightLeg: fig.rightLeg,
        leftArm: fig.leftArm,
        rightArm: fig.rightArm,
        speechSprite,
        dialogue: cwDialogue,
        position: fig.root.position,
        axis: isCrossingX ? 'x' : 'z',
        roadCoord: crosswalkOffset,
        sideOffset: crosswalkOffset,
        dirSign,
        speed: 1.75 + (j % 3) * 0.25,
        walkPhase: j * 1.7,
        isCrosswalkWalker: true,
        crosswalkCenterCoord: 0,
      });
    }
  }

  /**
   * Finds the closest pedestrian near the player's car and returns a context-aware Hindi dialogue
   */
  public checkHumanHindiDialogue(
    carPos: THREE.Vector3,
    speedKmH: number,
    hornActive: boolean,
    hitPedestrian: boolean
  ): { ped: NpcPedestrian; dialogue: HumanHindiDialogue; distance: number } | null {
    let closestPed: NpcPedestrian | null = null;
    let minDist = Infinity;

    for (const ped of this.npcPedestrians) {
      const d = Math.hypot(carPos.x - ped.position.x, carPos.z - ped.position.z);
      if (d < minDist) {
        minDist = d;
        closestPed = ped;
      }
    }

    if (!closestPed || minDist > 26) return null;

    if (hitPedestrian) {
      const angryList = HINDI_HUMAN_DIALOGUES.angry;
      const d = angryList[Math.floor(Math.random() * angryList.length)];
      this.updatePedestrianDialogue(closestPed, d);
      return { ped: closestPed, dialogue: d, distance: minDist };
    }

    if (hornActive && minDist < 24) {
      const hornList = HINDI_HUMAN_DIALOGUES.horn;
      const d = hornList[Math.floor(Math.random() * hornList.length)];
      this.updatePedestrianDialogue(closestPed, d);
      return { ped: closestPed, dialogue: d, distance: minDist };
    }

    if (speedKmH > 72 && minDist < 16) {
      const fastList = HINDI_HUMAN_DIALOGUES.fast;
      const d = fastList[Math.floor(Math.random() * fastList.length)];
      this.updatePedestrianDialogue(closestPed, d);
      return { ped: closestPed, dialogue: d, distance: minDist };
    }

    if (closestPed.isCrosswalkWalker && speedKmH < 2.5 && minDist < 15) {
      const praiseList = HINDI_HUMAN_DIALOGUES.praise;
      const d = praiseList[Math.floor(Math.random() * praiseList.length)];
      this.updatePedestrianDialogue(closestPed, d);
      return { ped: closestPed, dialogue: d, distance: minDist };
    }

    if (minDist < 19) {
      return { ped: closestPed, dialogue: closestPed.dialogue, distance: minDist };
    }

    return null;
  }

  public constrainCarToRoad(
    carPos: THREE.Vector3,
    carRotationY: number,
    speedMs: number
  ): { rotationY: number; speedMs: number; collided: boolean; hitPedestrian: boolean } {
    let newRotY = carRotationY;
    let newSpeed = speedMs;
    let collided = false;
    let hitPedestrian = false;

    const nearestRoadX = Math.round(carPos.x / ROAD_GRID_SPACING) * ROAD_GRID_SPACING;
    const nearestRoadZ = Math.round(carPos.z / ROAD_GRID_SPACING) * ROAD_GRID_SPACING;

    const dx = carPos.x - nearestRoadX;
    const dz = carPos.z - nearestRoadZ;

    const absDx = Math.abs(dx);
    const absDz = Math.abs(dz);

    if (absDx > CAR_ROAD_BOUNDARY && absDz > CAR_ROAD_BOUNDARY) {
      collided = true;

      if (absDx < absDz) {
        carPos.x = nearestRoadX + Math.sign(dx) * CAR_ROAD_BOUNDARY;
        newSpeed *= 0.72;
        const forwardZ = Math.cos(newRotY);
        const targetHeading = forwardZ >= 0 ? 0 : Math.PI;
        newRotY = THREE.MathUtils.lerp(newRotY, targetHeading, 0.25);
      } else {
        carPos.z = nearestRoadZ + Math.sign(dz) * CAR_ROAD_BOUNDARY;
        newSpeed *= 0.72;
        const forwardX = Math.sin(newRotY);
        const targetHeading = forwardX >= 0 ? Math.PI / 2 : -Math.PI / 2;
        newRotY = THREE.MathUtils.lerp(newRotY, targetHeading, 0.25);
      }
    }

    for (const npc of this.npcVehicles) {
      const distSq =
        (carPos.x - npc.position.x) * (carPos.x - npc.position.x) +
        (carPos.z - npc.position.z) * (carPos.z - npc.position.z);
      const minCollisionRadius = 3.8;
      if (distSq < minCollisionRadius * minCollisionRadius && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const pushX = (carPos.x - npc.position.x) / dist;
        const pushZ = (carPos.z - npc.position.z) / dist;
        carPos.x = npc.position.x + pushX * minCollisionRadius;
        carPos.z = npc.position.z + pushZ * minCollisionRadius;
        newSpeed = 0;
        collided = true;
      }
    }

    // Check collision with any Pedestrian on crosswalks/roads
    for (const ped of this.npcPedestrians) {
      const distSq =
        (carPos.x - ped.position.x) * (carPos.x - ped.position.x) +
        (carPos.z - ped.position.z) * (carPos.z - ped.position.z);
      const minPedRadius = 2.1;
      if (distSq < minPedRadius * minPedRadius && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const pushX = (ped.position.x - carPos.x) / dist;
        const pushZ = (ped.position.z - carPos.z) / dist;
        // Push pedestrian safely onto sidewalk edge out of harm's way and stop car
        ped.position.x += pushX * 2.8;
        ped.position.z += pushZ * 2.8;
        newSpeed = 0;
        collided = true;
        hitPedestrian = true;
      }
    }

    return { rotationY: newRotY, speedMs: newSpeed, collided, hitPedestrian };
  }

  public update(delta: number, playerX = 0, playerZ = 0) {
    this.updateStreamingChunks(playerX, playerZ);

    for (const chunk of this.chunks.values()) {
      const tl = chunk.trafficLight;
      tl.timer = (tl.timer + delta) % tl.cycleDuration;
      const nextState: 'green' | 'yellow' | 'red' =
        tl.timer < 8 ? 'green' : tl.timer < 10.5 ? 'yellow' : 'red';

      if (tl.state !== nextState) {
        tl.state = nextState;
        this.applyTrafficLightVisuals(tl);
      }
    }

    const nearestPlayerRoadX = Math.round(playerX / ROAD_GRID_SPACING) * ROAD_GRID_SPACING;
    const nearestPlayerRoadZ = Math.round(playerZ / ROAD_GRID_SPACING) * ROAD_GRID_SPACING;

    this.npcVehicles.forEach((npc, idx) => {
      const laneOffset = npc.dirSign === 1 ? -4.5 : 4.5;

      // Rotate all 4 wheels according to NPC vehicle speed
      const wheelSpin = (npc.speed / 0.42) * delta;
      npc.wheels.forEach((w) => {
        w.rotation.x += wheelSpin;
      });

      if (npc.axis === 'z') {
        npc.position.z += npc.dirSign * npc.speed * delta;
        npc.position.x = npc.roadCoord + laneOffset;
        npc.mesh.rotation.set(0, npc.dirSign === 1 ? 0 : Math.PI, 0);

        if (Math.abs(npc.position.z - playerZ) > 260 || Math.abs(npc.position.x - playerX) > 260) {
          npc.roadCoord = nearestPlayerRoadX + ((idx % 3) - 1) * ROAD_GRID_SPACING;
          npc.position.x = npc.roadCoord + laneOffset;
          npc.position.z = playerZ - npc.dirSign * 220;
        }
      } else {
        npc.position.x += npc.dirSign * npc.speed * delta;
        npc.position.z = npc.roadCoord + laneOffset;
        npc.mesh.rotation.set(0, npc.dirSign === 1 ? Math.PI / 2 : -Math.PI / 2, 0);

        if (Math.abs(npc.position.x - playerX) > 260 || Math.abs(npc.position.z - playerZ) > 260) {
          npc.roadCoord = nearestPlayerRoadZ + ((idx % 3) - 1) * ROAD_GRID_SPACING;
          npc.position.z = npc.roadCoord + laneOffset;
          npc.position.x = playerX - npc.dirSign * 220;
        }
      }
    });

    // Update & Animate All Walking Humans (Sidewalk & Crosswalk Pedestrians)
    this.npcPedestrians.forEach((ped, idx) => {
      ped.walkPhase += delta * ped.speed * 4.2;
      const swingAngle = Math.sin(ped.walkPhase) * 0.58;

      // Opposite arm & leg swing for realistic human stride
      ped.leftLeg.rotation.x = swingAngle;
      ped.rightLeg.rotation.x = -swingAngle;
      ped.leftArm.rotation.x = -swingAngle * 0.85;
      ped.rightArm.rotation.x = swingAngle * 0.85;

      if (ped.isCrosswalkWalker) {
        // Crosswalk pedestrians walk back and forth between the two sidewalks (-11.2m .. +11.2m)
        if (ped.axis === 'x') {
          ped.position.x += ped.dirSign * ped.speed * delta;
          ped.position.z = ped.roadCoord;
          const relX = ped.position.x - ped.crosswalkCenterCoord;
          const onSidewalk = Math.abs(relX) > 9.2;
          ped.position.y = (onSidewalk ? 0.42 : 0.04) + Math.abs(Math.cos(ped.walkPhase)) * 0.03;

          if (relX > 11.4) {
            ped.position.x = ped.crosswalkCenterCoord + 11.4;
            ped.dirSign = -1;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          } else if (relX < -11.4) {
            ped.position.x = ped.crosswalkCenterCoord - 11.4;
            ped.dirSign = 1;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          }
          ped.mesh.rotation.set(0, ped.dirSign === 1 ? Math.PI / 2 : -Math.PI / 2, 0);

          // Keep crosswalk pedestrians around the player's nearest intersection
          if (
            Math.abs(ped.crosswalkCenterCoord - nearestPlayerRoadX) > ROAD_GRID_SPACING ||
            Math.abs(ped.roadCoord - nearestPlayerRoadZ) > ROAD_GRID_SPACING
          ) {
            ped.crosswalkCenterCoord = nearestPlayerRoadX;
            ped.roadCoord = nearestPlayerRoadZ + (idx % 2 === 0 ? 11.5 : -11.5);
            ped.position.x = ped.crosswalkCenterCoord + ((idx % 3) - 1) * 5;
            ped.position.z = ped.roadCoord;
          }
        } else {
          ped.position.z += ped.dirSign * ped.speed * delta;
          ped.position.x = ped.roadCoord;
          const relZ = ped.position.z - ped.crosswalkCenterCoord;
          const onSidewalk = Math.abs(relZ) > 9.2;
          ped.position.y = (onSidewalk ? 0.42 : 0.04) + Math.abs(Math.cos(ped.walkPhase)) * 0.03;

          if (relZ > 11.4) {
            ped.position.z = ped.crosswalkCenterCoord + 11.4;
            ped.dirSign = -1;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          } else if (relZ < -11.4) {
            ped.position.z = ped.crosswalkCenterCoord - 11.4;
            ped.dirSign = 1;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          }
          ped.mesh.rotation.set(0, ped.dirSign === 1 ? 0 : Math.PI, 0);

          if (
            Math.abs(ped.roadCoord - nearestPlayerRoadX) > ROAD_GRID_SPACING ||
            Math.abs(ped.crosswalkCenterCoord - nearestPlayerRoadZ) > ROAD_GRID_SPACING
          ) {
            ped.roadCoord = nearestPlayerRoadX + (idx % 2 === 0 ? 11.5 : -11.5);
            ped.crosswalkCenterCoord = nearestPlayerRoadZ;
            ped.position.x = ped.roadCoord;
            ped.position.z = ped.crosswalkCenterCoord + ((idx % 3) - 1) * 5;
          }
        }
      } else {
        // Sidewalk pedestrians stroll along the sidewalks around the player
        ped.position.y = 0.42 + Math.abs(Math.cos(ped.walkPhase)) * 0.03;

        if (ped.axis === 'z') {
          ped.position.z += ped.dirSign * ped.speed * delta;
          ped.position.x = ped.roadCoord + ped.sideOffset;
          ped.mesh.rotation.set(0, ped.dirSign === 1 ? 0 : Math.PI, 0);

          if (Math.abs(ped.position.z - playerZ) > 190 || Math.abs(ped.position.x - playerX) > 190) {
            ped.roadCoord = nearestPlayerRoadX + ((idx % 3) - 1) * ROAD_GRID_SPACING;
            ped.position.x = ped.roadCoord + ped.sideOffset;
            ped.position.z = playerZ + ((idx % 7) - 3) * 45;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          }
        } else {
          ped.position.x += ped.dirSign * ped.speed * delta;
          ped.position.z = ped.roadCoord + ped.sideOffset;
          ped.mesh.rotation.set(0, ped.dirSign === 1 ? Math.PI / 2 : -Math.PI / 2, 0);

          if (Math.abs(ped.position.x - playerX) > 190 || Math.abs(ped.position.z - playerZ) > 190) {
            ped.roadCoord = nearestPlayerRoadZ + ((idx % 3) - 1) * ROAD_GRID_SPACING;
            ped.position.z = ped.roadCoord + ped.sideOffset;
            ped.position.x = playerX + ((idx % 7) - 3) * 45;
            const ambient = HINDI_HUMAN_DIALOGUES.ambient;
            this.updatePedestrianDialogue(
              ped,
              ambient[Math.floor(Math.random() * ambient.length)]
            );
          }
        }
      }
    });
  }
}
