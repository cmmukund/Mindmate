/**
 * MINDMATE Cultural Content Packs
 * Modular language and culturally familiar assets for all supported languages.
 * Designed so local elders, caregivers, and language speakers can review and extend content.
 */

export const contentPacks = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechLang: 'en-IN',
    routine: [
      { step: 1, title: 'Wake up & Water', icon: '🌅', desc: 'Start the day with warm water.' },
      { step: 2, title: 'Morning Walk & Sunlight', icon: '🚶', desc: 'Gentle walk in the morning light.' },
      { step: 3, title: 'Nutritious Breakfast', icon: '🥣', desc: 'Enjoy fresh healthy breakfast.' },
      { step: 4, title: 'Morning Medicine', icon: '💊', desc: 'Take prescribed morning medication.' },
      { step: 5, title: 'Afternoon Rest & Reading', icon: '📖', desc: 'Quiet relaxation and hydration.' }
    ],
    objects: [
      { id: 'gamocha', name: 'Gamocha Cloth', icon: '🧣' },
      { id: 'bamboo', name: 'Bamboo Basket', icon: '🧺' },
      { id: 'clock', name: 'Wall Clock', icon: '🕐' },
      { id: 'tea', name: 'Assam Tea', icon: '🍵' },
      { id: 'cane', name: 'Walking Stick', icon: '🦯' },
      { id: 'loom', name: 'Handloom Weave', icon: '🧶' }
    ],
    story: {
      title: 'A Calm Morning Near the Tea Garden',
      text: 'Early this morning, grandfather sat near the bamboo veranda with a warm cup of Assam tea. A small bird rested on the jackfruit tree while a gentle breeze moved through the tea leaves. Grandmother folded a gamocha before the family began the day.',
      question: 'Where did the small bird rest?',
      options: ['On the jackfruit tree', 'In the kitchen', 'By the river'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'Feeling peaceful and good' },
      { icon: '🙂', label: 'Calm and steady' },
      { icon: '😌', label: 'Preferring a gentle, quiet day' },
      { icon: '🌸', label: 'Grateful for family and friends' }
    ],
    domainTitles: {
      memory: 'Memory Recall',
      attention: 'Visual Focus',
      routine: 'Daily Routine',
      recognition: 'Pattern & Object Match',
      engagement: 'Story & Reflection'
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechLang: 'hi-IN',
    routine: [
      { step: 1, title: 'सुबह का पानी व पूजा', icon: '🌅', desc: 'सुबह उठकर गुनगुना पानी और ध्यान।' },
      { step: 2, title: 'सुबह की सैर', icon: '🚶', desc: 'हल्की धूप में ताज़ा हवा का आनंद।' },
      { step: 3, title: 'पौष्टिक नाश्ता', icon: '🥣', desc: 'स्वादिष्ट और पौष्टिक सुबह का भोजन।' },
      { step: 4, title: 'दवा का समय', icon: '💊', desc: 'नियमित सुबह की आवश्यक गोलियाँ।' },
      { step: 5, title: 'दोपहर का विश्राम', icon: '📖', desc: 'शांतिपूर्ण आराम और पढ़ना।' }
    ],
    objects: [
      { id: 'lamp', name: 'दीया', icon: '🪔' },
      { id: 'book', name: 'किताब', icon: '📖' },
      { id: 'clock', name: 'घड़ी', icon: '🕐' },
      { id: 'tea', name: 'चाय', icon: '🍵' },
      { id: 'cane', name: 'छड़ी', icon: '🦯' },
      { id: 'bell', name: 'घंटी', icon: '🔔' }
    ],
    story: {
      title: 'आँगन की सुनहरी सुबह',
      text: 'आज सुबह आँगन में गेंदे के फूल खिले थे और ठंडी हवा बह रही थी। एक छोटी गौरैया मिट्टी के सकोरे से पानी पीकर नीम के पेड़ की तरफ उड़ गई। दादाजी ने धूप में बैठकर गर्म अदरक वाली चाय की चुस्की ली।',
      question: 'गौरैया ने कहाँ से पानी पिया?',
      options: ['मिट्टी के सकोरे से', 'छत की टंकी से', 'तालाब से'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'मन प्रसन्न और अच्छा है' },
      { icon: '🙂', label: 'शांत और सहज' },
      { icon: '😌', label: 'धीमी और शांत दिनचर्या पसंद है' },
      { icon: '🌸', label: 'परिवार के साथ सुखद' }
    ],
    domainTitles: {
      memory: 'स्मृति स्मरण',
      attention: 'ध्यान और एकाग्रता',
      routine: 'दिनचर्या क्रम',
      recognition: 'वस्तु व पैटर्न पहचान',
      engagement: 'कहानी और विचार'
    }
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechLang: 'ta-IN',
    routine: [
      { step: 1, title: 'காலை விழிப்பு & வெந்நீர்', icon: '🌅', desc: 'புத்துணர்ச்சியுடன் தொடங்கும் காலை.' },
      { step: 2, title: 'காலை நடைப்பயிற்சி', icon: '🚶', desc: 'இனிய காலைத் தென்றலில் சிறிய நடை.' },
      { step: 3, title: 'காலை உணவு', icon: '🥣', desc: 'சூடான சத்தான இட்லி அல்லது கஞ்சி.' },
      { step: 4, title: 'காலை மருந்து', icon: '💊', desc: 'மருத்துவர் கூறிய காலை மருந்துகள்.' },
      { step: 5, title: 'மதிய ஓய்வு', icon: '📖', desc: 'அமைதியான ஓய்வு மற்றும் வாசிப்பு.' }
    ],
    objects: [
      { id: 'lamp', name: 'விளக்கு', icon: '🪔' },
      { id: 'book', name: 'புத்தகம்', icon: '📖' },
      { id: 'clock', name: 'கடிகாரம்', icon: '🕐' },
      { id: 'tea', name: 'சூடான காபி/டீ', icon: '🍵' },
      { id: 'cane', name: 'கைத்தடி', icon: '🦯' },
      { id: 'bell', name: 'கோவில் மணி', icon: '🔔' }
    ],
    story: {
      title: 'முற்றத்து இனிய விடியல்',
      text: 'இன்று அதிகாலை முற்றத்தில் மல்லிகைப் பூக்கள் நறுமணம் வீசின. ஒரு சிறிய சிட்டுக்குருவி பாத்திரத்தில் இருந்த நீரைக் குடித்துவிட்டு மாமரத்தை நோக்கிப் பறந்தது. தாத்தா சூடான சுக்கு காபியைப் பருகியபடி அமைதியை ரசித்தார்.',
      question: 'சிட்டுக்குருவி எங்கிருந்து நீர் குடித்தது?',
      options: ['முற்றத்து பாத்திரத்திலிருந்து', 'கிணற்றில்', 'மரத்தின் மேல்'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'மனம் மகிழ்ச்சியாக உள்ளது' },
      { icon: '🙂', label: 'அமைதியாகவும் தெளிவாகவும்' },
      { icon: '😌', label: 'அமைதியான நாளாக இருக்க விரும்புகிறேன்' },
      { icon: '🌸', label: 'நன்றியுணர்வுடன்' }
    ],
    domainTitles: {
      memory: 'நினைவு மீட்டல்',
      attention: 'கவனக்குவிப்பு',
      routine: 'தினசரி வரிசை',
      recognition: 'பொருள் அடையாளம்',
      engagement: 'கதை மற்றும் சிந்தனை'
    }
  },
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    speechLang: 'as-IN',
    routine: [
      { step: 1, title: 'পুৱাৰ পানী আৰু প্ৰাৰ্থনা', icon: '🌅', desc: 'পুৱা সোনকালে উঠি কুহুমীয়া পানী খোৱা।' },
      { step: 2, title: 'পুৱাৰ খোজ কঢ়া', icon: '🚶', desc: 'বাৰীত বা আলিবাটত মুকলি বতাহ সেৱন।' },
      { step: 3, title: 'পুৱাৰ জলপান', icon: '🥣', desc: 'সুস্বাদু কোমল চাউল বা জা-জলপান।' },
      { step: 4, title: 'পুৱাৰ ঔষধ', icon: '💊', desc: 'সময়মতে নিৰ্ধাৰিত ঔষধ গ্ৰহণ।' },
      { step: 5, title: 'দুপৰীয়াৰ বিশ্ৰাম', icon: '📖', desc: 'শান্ত পৰিৱেশত জৰুৰী বিশ্ৰাম।' }
    ],
    objects: [
      { id: 'lamp', name: 'চাকি', icon: '🪔' },
      { id: 'book', name: 'কিতাপ', icon: '📖' },
      { id: 'clock', name: 'ঘড়ী', icon: '🕐' },
      { id: 'tea', name: 'ৰঙা চাহ', icon: '🍵' },
      { id: 'cane', name: 'লাঠি', icon: '🦯' },
      { id: 'bell', name: 'কাঁহ-ঘণ্টা', icon: '🔔' }
    ],
    story: {
      title: 'পুৱাৰ সেউজীয়া চোতাল',
      text: 'আজি পুৱা চোতালত শেৱালি ফুল সৰি আছিল। এহাল ভাটৌ চৰায়ে বকুল গছত পৰি মিঠা মাতেৰে মাতিছিল। ককাদেউতাই গৰম ৰঙা চাহৰ কাপ হাতত লৈ পুৱাৰ ৰিব্‌ৰিব্‌ বতাহজাক উপভোগ কৰিলে।',
      question: 'ভাটৌ চৰাইহাল ক’ত পৰিছিল?',
      options: ['বকুল গছত', 'ঘৰৰ চালত', 'চোতালৰ ঢাপত'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'মনটো ভাল আৰু আনন্দময়' },
      { icon: '🙂', label: 'শান্ত আৰু সুস্থিৰ' },
      { icon: '😌', label: 'ধীৰ-স্থিৰ পৰিৱেশ পছন্দ কৰোঁ' },
      { icon: '🌸', label: 'আপোনজনৰ প্ৰতি কৃতজ্ঞ' }
    ],
    domainTitles: {
      memory: 'স্মৃতি স্মৰণ',
      attention: 'মনোযোগ আৰু দৃষ্টি',
      routine: 'দৈনন্দিন ক্ৰম',
      recognition: 'বস্তু আৰু আৰ্হি চিনাক্তকৰণ',
      engagement: 'কাহিনী আৰু অনুভৱ'
    }
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechLang: 'ml-IN',
    routine: [
      { step: 1, title: 'പ്രഭാത ഉണർവും വെള്ളവും', icon: '🌅', desc: 'നേരത്തെ ഉണർന്ന് ചൂടുവെള്ളം കുടിക്കുക.' },
      { step: 2, title: 'പ്രഭാത നടത്തം', icon: '🚶', desc: 'മുറ്റത്തോ ഇടവഴിയിലോ ശുദ്ധവായു ശ്വസിക്കുക.' },
      { step: 3, title: 'പ്രഭാതഭക്ഷണം', icon: '🥣', desc: 'ആരോഗ്യകരമായ ലഘുഭക്ഷണം കഴിക്കുക.' },
      { step: 4, title: 'രാവിലത്തെ മരുന്ന്', icon: '💊', desc: 'സമയത്തിന് കൃത്യമായി മരുന്ന് കഴിക്കുക.' },
      { step: 5, title: 'ഉച്ചവിശ്രമം', icon: '📖', desc: 'ശാന്തമായി വായനയും വിശ്രമവും.' }
    ],
    objects: [
      { id: 'lamp', name: 'നിലവിളക്ക്', icon: '🪔' },
      { id: 'book', name: 'പുസ്തകം', icon: '📖' },
      { id: 'clock', name: 'ഘടികാരം', icon: '🕐' },
      { id: 'tea', name: 'ചായ', icon: '🍵' },
      { id: 'cane', name: 'വടി', icon: '🦯' },
      { id: 'bell', name: 'മണി', icon: '🔔' }
    ],
    story: {
      title: 'തൊടിയിലെ നല്ല പ്രഭാതം',
      text: 'ഇന്ന് രാവിലെ തൊടിയിൽ ചെമ്പകപ്പൂക്കൾ വിരിഞ്ഞു സുഗന്ധം പരത്തി. ഒരു കുരുവി കിണറ്റിൻകരയിലെ വെള്ളം കുടിച്ച് തെങ്ങിൻ തലപ്പിലേക്ക് പറന്നുപോയി. മുത്തശ്ശൻ വരാന്തയിലിരുന്ന് ചൂടുള്ള കട്ടൻചായ ആസ്വദിച്ചു.',
      question: 'കുരുവി എവിടെ നിന്നാണ് വെള്ളം കുടിച്ചത്?',
      options: ['കിണറ്റിൻകരയിൽ നിന്ന്', 'മരത്തിൽ നിന്ന്', 'വീടിനുള്ളിൽ നിന്ന്'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'മനസ്സ് സന്തോഷത്തിലാണ്' },
      { icon: '🙂', label: 'ശാന്തവും സുഖകരവും' },
      { icon: '😌', label: 'ശാന്തമായ സമയം ഇഷ്ടപ്പെടുന്നു' },
      { icon: '🌸', label: 'കുടുംബത്തോടൊപ്പം സമാധാനം' }
    ],
    domainTitles: {
      memory: 'ഓർമ്മ പരിശോധന',
      attention: 'ശ്രദ്ധയും നിരീക്ഷണവും',
      routine: 'ദിനചര്യ ക്രമം',
      recognition: 'വസ്തു തിരിച്ചറിയൽ',
      engagement: 'കഥയും ചിന്തയും'
    }
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechLang: 'te-IN',
    routine: [
      { step: 1, title: 'ఉదయం నిద్రలేవడం & నీరు', icon: '🌅', desc: 'గోరువెచ్చని నీటితో రోజును ప్రారంభించండి.' },
      { step: 2, title: 'ఉదయపు నడక', icon: '🚶', desc: 'స్వచ్ఛమైన గాలిలో కాసేపు నడక.' },
      { step: 3, title: 'పౌష్టిక అల్పాహారం', icon: '🥣', desc: 'ఆరోగ్యకరమైన ఉదయపు భోజనం.' },
      { step: 4, title: 'ఉదయపు మందులు', icon: '💊', desc: 'సమయానికి నిర్దేశించిన ఔషధాలు.' },
      { step: 5, title: 'మధ్యాహ్న విశ్రాంతి', icon: '📖', desc: 'ప్రశాంతమైన విశ్రాంతి మరియు పఠనం.' }
    ],
    objects: [
      { id: 'lamp', name: 'దీపం', icon: '🪔' },
      { id: 'book', name: 'పుస్తకం', icon: '📖' },
      { id: 'clock', name: 'గడియారం', icon: '🕐' },
      { id: 'tea', name: 'టీ', icon: '🍵' },
      { id: 'cane', name: 'చేతికర్ర', icon: '🦯' },
      { id: 'bell', name: 'గంట', icon: '🔔' }
    ],
    story: {
      title: 'వాకిట్లో అందమైన ఉదయం',
      text: 'ఈరోజు ఉదయాన్నే తోటలో మల్లెపూలు పరిమళాలు వెదజల్లాయి. ఒక చిన్న పిచ్చుక నీటి కుండ దగ్గర నీళ్లు తాగి వేప చెట్టు వైపు ఎగిరిపోయింది. తాతగారు వరండాలో కూర్చుని వేడి వేడి టీ తాగుతూ ఆహ్లాదకరమైన గాలిని ఆస్వాదించారు.',
      question: 'పిచ్చుక ఎక్కడ నీళ్లు తాగింది?',
      options: ['నీటి కుండ దగ్గర', 'పైకప్పు మీద', 'రోడ్డు పక్కన'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'మనస్సు ఉల్లాసంగా ఉంది' },
      { icon: '🙂', label: 'ప్రశాంతంగా మరియు హాయిగా' },
      { icon: '😌', label: 'నిమ్మళమైన రోజు కోరుకుంటున్నాను' },
      { icon: '🌸', label: 'ఆనందంగా ఉన్నాను' }
    ],
    domainTitles: {
      memory: 'జ్ఞాపకశక్తి పునరావృతం',
      attention: 'దృష్టి మరియు ఏకాగ్రత',
      routine: 'దినచర్య క్రమం',
      recognition: 'వస్తువుల గుర్తింపు',
      engagement: 'కథ మరియు ఆలోచన'
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechLang: 'kn-IN',
    routine: [
      { step: 1, title: 'ಮುಂಜಾನೆ ಎಚ್ಚರ ಮತ್ತು ನೀರು', icon: '🌅', desc: 'ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯುವುದು.' },
      { step: 2, title: 'ಬೆಳಗಿನ ನಡಿಗೆ', icon: '🚶', desc: 'ತಾಜಾ ಗಾಳಿಯಲ್ಲಿ ಹಿತಕರ ನಡಿಗೆ.' },
      { step: 3, title: 'ಪೌಷ್ಟಿಕ ಉಪಾಹಾರ', icon: '🥣', desc: 'ಹಿತಕರವಾದ ಬೆಳಗಿನ ತಿಂಡಿ.' },
      { step: 4, title: 'ಬೆಳಗಿನ ಔಷಧಿ', icon: '💊', desc: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಔಷಧಿ ಸೇವನೆ.' },
      { step: 5, title: 'ಮಧ್ಯಾಹ್ನದ ವಿಶ್ರಾಂತಿ', icon: '📖', desc: 'ಶಾಂತಿಯುತ ವಿಶ್ರಾಂತಿ ಮತ್ತು ಓದು.' }
    ],
    objects: [
      { id: 'lamp', name: 'ದೀಪ', icon: '🪔' },
      { id: 'book', name: 'ಪುಸ್ತಕ', icon: '📖' },
      { id: 'clock', name: 'ಗಡಿಯಾರ', icon: '🕐' },
      { id: 'tea', name: 'ಬಿಸಿ ಕಾಫಿ/ಚಹಾ', icon: '🍵' },
      { id: 'cane', name: 'ಊರುಗೋಲು', icon: '🦯' },
      { id: 'bell', name: 'ಗಂಟೆ', icon: '🔔' }
    ],
    story: {
      title: 'ಅಂಗಳದ ಮುಂಜಾನೆಯ ಸೊಬಗು',
      text: 'ಇಂದು ಮುಂಜಾನೆ ಅಂಗಳದಲ್ಲಿ ಸಂಪಿಗೆ ಹೂವುಗಳು ಪರಿಮಳ ಸೂಸುತ್ತಿದ್ದವು. ಒಂದು ಪುಟ್ಟ ಗುಬ್ಬಚ್ಚಿ ನೀರಿನ ಬಟ್ಟಲಿನಿಂದ ನೀರು ಕುಡಿದು ಮಾವಿನ ಮರಕ್ಕೆ ಹಾರಿತು. ಅಜ್ಜಯ್ಯನವರು ವರಾಂಡದಲ್ಲಿ ಕುಳಿತು ಬಿಸಿ ಕಾಫಿಯನ್ನು ಸವಿದರು.',
      question: 'ಗುಬ್ಬಚ್ಚಿ ಎಲ್ಲಿಂದ ನೀರು ಕುಡಿಯಿತು?',
      options: ['ನೀರಿನ ಬಟ್ಟಲಿನಿಂದ', 'ಬಾವಿಯಿಂದ', 'ಮನೆಯ ಒಳಗೆ'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'ಮನಸ್ಸು ಉತ್ಸಾಹದಲ್ಲಿದೆ' },
      { icon: '🙂', label: 'ಶಾಂತ ಮತ್ತು ನೆಮ್ಮದಿ' },
      { icon: '😌', label: 'ಪ್ರಶಾಂತ ದಿನದ ಇಷ್ಟ' },
      { icon: '🌸', label: 'ಸಂತೃಪ್ತಿ ಭಾವ' }
    ],
    domainTitles: {
      memory: 'ನೆನಪಿನ ಮರುಸ್ಥಾಪನೆ',
      attention: 'ಗಮನ ಮತ್ತು ಏಕಾಗ್ರತೆ',
      routine: 'ದಿನಚರಿಯ ಕ್ರಮ',
      recognition: 'ವಸ್ತು ಗುರುತಿಸುವಿಕೆ',
      engagement: 'ಕಥೆ ಮತ್ತು ಆಲೋಚನೆ'
    }
  },
  brx: {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर’',
    speechLang: 'hi-IN',
    routine: [
      { step: 1, title: 'फुंनि सिखारनाय आरो दै', icon: '🌅', desc: 'फुंआव सिखारनानै गुदुं दै लोंनाय।' },
      { step: 2, title: 'फुंनि हागामि', icon: '🚶', desc: 'गोरा बारआव फिसा हागामि।' },
      { step: 3, title: 'फुंनि नासथाय', icon: '🥣', desc: 'देहानि थाखाय मोजां नासथाय जानाय।' },
      { step: 4, title: 'फुंनि दावाइ', icon: '💊', desc: 'सम होनानै दावाइ लोंनाय।' },
      { step: 5, title: 'सानजौफुनि अराम', icon: '📖', desc: 'सान्थिजों फरायनाय आरो अराम लानाय।' }
    ],
    objects: [
      { id: 'lamp', name: 'साथि/दिया', icon: '🪔' },
      { id: 'book', name: 'बिलाइ/बिजाब', icon: '📖' },
      { id: 'clock', name: 'घड़ि', icon: '🕐' },
      { id: 'tea', name: 'साहा', icon: '🍵' },
      { id: 'cane', name: 'थिंथि/लाथि', icon: '🦯' },
      { id: 'bell', name: 'घण्टा', icon: '🔔' }
    ],
    story: {
      title: 'फुंनि साबसिन आँगन',
      text: 'दिनै फुंआव आँगनाव बिबारफोरा बारदोंमोन। मोनसे फिसा दाउआ दैयाव गाबखोनानै फुंनि गुदुं साहा लोंनाय आबौखौ नायहरबाय। फुंनि बारा जोबोद गोजोनथावमोन।',
      question: 'दाउआ मा नायहरदोंमोन?',
      options: ['आबौखौ', 'न’खौ', 'दंफांखौ'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'गोसोआ मोजां आरो गोजोन' },
      { icon: '🙂', label: 'सान्थि' },
      { icon: '😌', label: 'सुस्थ' },
      { icon: '🌸', label: 'खुसि' }
    ],
    domainTitles: {
      memory: 'मोनथिनाय',
      attention: 'नजर होनाय',
      routine: 'दिननि आदाब',
      recognition: 'सिनायथि',
      engagement: 'खोथा आरो बुजिनाय'
    }
  },
  mni: {
    code: 'mni',
    name: 'Meitei',
    nativeName: 'মৈতৈলোন',
    speechLang: 'bn-IN',
    routine: [
      { step: 1, title: 'অয়ুক্কী ঈশিং অমসুং লাই খুরুম্বা', icon: '🌅', desc: 'অয়ুক থুনা হৌগৎতুনা নুংঙাইবা ঈশিং থকপা।' },
      { step: 2, title: 'অয়ুক্কী খোঙচৎ', icon: '🚶', desc: 'অয়াংবা নুংশিৎ লোন্না খরা খোঙ চৎপা।' },
      { step: 3, title: 'অয়ুক্কী চাউ', icon: '🥣', desc: 'হকচাংগী কান্নবা অয়ুক্কী মচাক চা-থক।' },
      { step: 4, title: 'অয়ুক্কী হিদাক', icon: '💊', desc: 'মতম চানা হিদাক লৌখৎপা।' },
      { step: 5, title: 'নুমিৎ য়ুংবা মতমগী পোথাফম', icon: '📖', desc: 'লাইরিক পাবা অমসুং শান্তিনা পোথাবা।' }
    ],
    objects: [
      { id: 'lamp', name: 'থাগোল', icon: '🪔' },
      { id: 'book', name: 'লাইরিক', icon: '📖' },
      { id: 'clock', name: 'পুং/ঘড়ি', icon: '🕐' },
      { id: 'tea', name: 'চা', icon: '🍵' },
      { id: 'cane', name: 'চৈথেক', icon: '🦯' },
      { id: 'bell', name: 'ঘণ্টা', icon: '🔔' }
    ],
    story: {
      title: 'সুমংগী নুংঙাইরবা অয়ুক',
      text: 'ঙসি অয়ুক সুমংদা লৈরাং শাৎতুনা চন্দন মনম থোকখি। উচেক অমনা ঈশিং থক্তুনা পাম্বী মথক্তা পাইখি। ইপুথৌনা শাফবা চা কাপ থকপদা মন মনবা নুংশিৎ ফংখি।',
      question: 'উচেক অদু কদায়দা পাইখি?',
      options: ['পাম্বী মথক্তা', 'য়ুমথক্তা', 'লম্বীদা'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'পুক্নিং হরাওই' },
      { icon: '🙂', label: 'শান্তি ওই' },
      { icon: '😌', label: 'তপ্পা নুমিৎ পাম্মি' },
      { icon: '🌸', label: 'নুংশিবগা লোয়ননা' }
    ],
    domainTitles: {
      memory: 'মেমরি নীংশিংবা',
      attention: 'নজর থম্বা',
      routine: 'রুটিন মথং-মনাও',
      recognition: 'মচাক সিনায়থি',
      engagement: 'ৱারী অমসুং খন্নবা'
    }
  },
  lus: {
    code: 'lus',
    name: 'Mizo',
    nativeName: 'Mizo',
    speechLang: 'en-IN',
    routine: [
      { step: 1, title: 'Zing Thawh & Tui Lum', icon: '🌅', desc: 'Tui lum in in zing tan rawh.' },
      { step: 2, title: 'Zing Kar Boruak Thiang Kal', icon: '🚶', desc: 'Boruak thiang hip pahin tei kual rawh.' },
      { step: 3, title: 'Zing Chaw Eitur', icon: '🥣', desc: 'Chaw eitur tha leh hrisel ei rawh.' },
      { step: 4, title: 'Zing Damdawi Ei', icon: '💊', desc: 'Hunbi dik takah damdawi ei rawh.' },
      { step: 5, title: 'Chhun Chawlh & Lehkhabu', icon: '📖', desc: 'Hahchawl la, lehkhabu chhiar rawh.' }
    ],
    objects: [
      { id: 'lamp', name: 'Khawnvar', icon: '🪔' },
      { id: 'book', name: 'Lehkhabu', icon: '📖' },
      { id: 'clock', name: 'Sana', icon: '🕐' },
      { id: 'tea', name: 'Thingpui sa', icon: '🍵' },
      { id: 'cane', name: 'Tiang', icon: '🦯' },
      { id: 'bell', name: 'Dar', icon: '🔔' }
    ],
    story: {
      title: 'Tukchhuah Boruak Thiang',
      text: 'Zing karah pangpar mawi tak a lo vul a. Sava te an hram ral ral bawk. Pu-a chuan tualzawlah thingpui lum a in a, boruak vawt thiang tak chu a hip vang vang a ni.',
      question: 'Pu-a khan eng nge a in?',
      options: ['Thingpui lum', 'Tui vawt', 'Theitui'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'Ka hlim hle mai' },
      { icon: '🙂', label: 'Ka tha e' },
      { icon: '😌', label: 'Ni muanawm tak ka duh' },
      { icon: '🌸', label: 'Chhungkua chungah ka lawm' }
    ],
    domainTitles: {
      memory: 'Hriatna Hman',
      attention: 'Ngaihtuahna Pek',
      routine: 'Ni Tin Routine',
      recognition: 'Thil Hriat Hrang',
      engagement: 'Thawnthu & Ngaihtuah'
    }
  },
  kha: {
    code: 'kha',
    name: 'Khasi',
    nativeName: 'Khasi',
    speechLang: 'en-IN',
    routine: [
      { step: 1, title: 'Khyndiat ka Um ba Syaid', icon: '🌅', desc: 'Khyndiat ka um syaid ban sdang ia ka sngi.' },
      { step: 2, title: 'Ka Jingïaid Step', icon: '🚶', desc: 'Ïaid khyndiat ha ka lyer kaba pyngngad.' },
      { step: 3, title: 'Ka Ja Step', icon: '🥣', desc: 'Bam ka ja step kaba tei ia ka met.' },
      { step: 4, title: 'Ka Dawai Step', icon: '💊', desc: 'Dih ia ki dawai ha ka por kaba biang.' },
      { step: 5, title: 'Ka Jingthait ha ka Sngi', icon: '📖', desc: 'Shongthait bad pule kot ha ka jaka kaba jaiñ.' }
    ],
    objects: [
      { id: 'lamp', name: 'Sharak', icon: '🪔' },
      { id: 'book', name: 'Kot', icon: '📖' },
      { id: 'clock', name: 'Kti Baje', icon: '🕐' },
      { id: 'tea', name: 'Sha ba syaid', icon: '🍵' },
      { id: 'cane', name: 'Diengduh', icon: '🦯' },
      { id: 'bell', name: 'Baje', icon: '🔔' }
    ],
    story: {
      title: 'Ka Step Kaba Suk',
      text: 'Mynta ka step ki syntiew ki phuh bha ha phyllaw. Ka sim rit ka la wan dih um bad ka la her sha u dieng sohbrap. I Kpaieit i la shong dih sha syaid bad peit ia ka jingpyngngad ka lyer step.',
      question: 'Ka sim rit ka la her shano?',
      options: ['Sha u dieng sohbrap', 'Sha ka tnum ing', 'Sha phyllaw'],
      correctIndex: 0
    },
    moodChoices: [
      { icon: '😊', label: 'Nga sngewkmen bha' },
      { icon: '🙂', label: 'Jaiñ bad shngain' },
      { icon: '😌', label: 'Nga kwah ia ka sngi kaba jaiñ' },
      { icon: '🌸', label: 'Sngewnguh ia ka longing' }
    ],
    domainTitles: {
      memory: 'Ka Jingkynmaw',
      attention: 'Ka Jingmut',
      routine: 'Ka Rukom Trei Kam',
      recognition: 'Ka Jingithuh',
      engagement: 'Ka Jingïathuhkhana'
    }
  }
};

export function currentPack() {
  const lang = localStorage.getItem('mindmateLanguage') || 'en';
  return contentPacks[lang] || contentPacks.en;
}

export function getPack(langCode) {
  return contentPacks[langCode] || contentPacks.en;
}

export function listSupportedPacks() {
  return Object.values(contentPacks).map((p) => ({
    code: p.code,
    name: p.name,
    nativeName: p.nativeName,
    speechLang: p.speechLang
  }));
}
