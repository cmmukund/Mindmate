const N8N_AGENT_WEBHOOK_URL = 'https://cmmukund.app.n8n.cloud/webhook/mindmate-agent';
// Keep the elder-facing guide fast and dependable. The local guide is the default;
// a remote service must be explicitly enabled after privacy and reliability review.
const USE_EXTERNAL_AGENT = false;

const agentText = {
  en:{title:'MINDMATE Guide',subtitle:'A simple helper for your day.',eyebrow:'MINDMATE GUIDE',prompt:'What would you like help with?',journeyTitle:'Today’s Journey',journeySub:'Start or continue',remindersTitle:'My Reminders',remindersSub:'See what is due',progressTitle:'My Progress',progressSub:'See how I did',helpTitle:'Ask MINDMATE',helpSub:'Get simple help',contextHint:'Here to help',inputLabel:'Or type your question',placeholder:'For example: What do I do next?',send:'Send',thinking:'Thinking…',offline:'Offline mode — local help available',ready:'Ready',connected:'Connected',unavailable:'I’m working in local mode right now.',welcome:'Hello. I’m MINDMATE. I can help you with today’s journey, reminders, progress and routines.',quickJourney:'Plan my journey',quickReminders:'Show my reminders',quickProgress:'How did I do?',quickHelp:'What can you do?',context:'Use my recent MINDMATE activity',footer:'Simple help for activities, reminders and routines.',clear:'Clear',replyJourney:'Let’s look at today’s journey together.',replyReminders:'Here are your reminders for today.',replyProgress:'Let’s look at your recent activity together.',replyHelp:'I can help with your journey, reminders, progress and daily routines.'},
  ta:{title:'MINDMATE வழிகாட்டி',eyebrow:'MINDMATE வழிகாட்டி',prompt:'எதில் உதவி வேண்டும்?',journeyTitle:'இன்றைய பயணம்',journeySub:'தொடங்கவும் அல்லது தொடரவும்',remindersTitle:'என் நினைவூட்டல்கள்',remindersSub:'இப்போது செய்ய வேண்டியது',progressTitle:'என் முன்னேற்றம்',progressSub:'எப்படி செய்தேன் என்பதைப் பாருங்கள்',helpTitle:'MINDMATE-ஐ கேளுங்கள்',helpSub:'எளிய உதவியைப் பெறுங்கள்',contextHint:'உதவ நான் இங்கே இருக்கிறேன்',inputLabel:'அல்லது உங்கள் கேள்வியை எழுதுங்கள்',subtitle:'அறிவாற்றல் செயல்பாடுகள், தினசரி நடைமுறை, நினைவூட்டல்கள் மற்றும் பராமரிப்பு உதவிக்கான உங்கள் தனிப்பட்ட முகவர்.',placeholder:'MINDMATE-ஐ ஏதாவது கேளுங்கள்…',send:'அனுப்பு',thinking:'சிந்திக்கிறது…',offline:'ஆஃப்லைன் — உள்ளூர் உதவி கிடைக்கும்',ready:'தயார்',connected:'n8n முகவருடன் இணைக்கப்பட்டது',unavailable:'n8n முகவர் அணுக முடியவில்லை. உள்ளூர் உதவி பயன்படுத்தப்படுகிறது.',welcome:'வணக்கம். நான் உங்கள் MINDMATE AI முகவர். இன்றைய பயணம், நினைவூட்டல்கள், முன்னேற்றம், நடைமுறைகள் மற்றும் பராமரிப்பாளர் சுருக்கங்களுக்கு உதவுவேன்.',quickJourney:'என் பயணத்தைத் திட்டமிடு',quickReminders:'நினைவூட்டல்களை காட்டு',quickProgress:'எப்படி செயல்பட்டேன்?',quickHelp:'நீ என்ன செய்ய முடியும்?',context:'என் சமீபத்திய MINDMATE செயல்பாட்டைப் பயன்படுத்து',clear:'அழி'},
  hi:{title:'MINDMATE मार्गदर्शक',eyebrow:'MINDMATE मार्गदर्शक',prompt:'आप किस चीज़ में मदद चाहते हैं?',journeyTitle:'आज की यात्रा',journeySub:'शुरू करें या जारी रखें',remindersTitle:'मेरे रिमाइंडर',remindersSub:'क्या करना है देखें',progressTitle:'मेरी प्रगति',progressSub:'देखें मैंने कैसा किया',helpTitle:'MINDMATE से पूछें',helpSub:'सरल मदद पाएँ',contextHint:'मैं मदद के लिए यहाँ हूँ',inputLabel:'या अपना सवाल लिखें',subtitle:'संज्ञानात्मक गतिविधियों, दिनचर्या, रिमाइंडर और देखभाल सहायता के लिए आपका व्यक्तिगत एजेंट।',placeholder:'MINDMATE से कुछ पूछें…',send:'भेजें',thinking:'सोच रहा है…',offline:'ऑफ़लाइन — स्थानीय सहायता उपलब्ध',ready:'तैयार',connected:'n8n एजेंट से जुड़ा',unavailable:'n8n एजेंट उपलब्ध नहीं है। स्थानीय सहायता का उपयोग किया जा रहा है।',welcome:'नमस्ते। मैं आपका MINDMATE AI एजेंट हूँ। मैं आज की यात्रा, रिमाइंडर, प्रगति, दिनचर्या और देखभालकर्ता सारांश में मदद कर सकता हूँ।',quickJourney:'मेरी यात्रा योजना',quickReminders:'रिमाइंडर दिखाएँ',quickProgress:'मैंने कैसा किया?',quickHelp:'आप क्या कर सकते हैं?',context:'मेरी हाल की MINDMATE गतिविधि उपयोग करें',clear:'साफ़ करें'},
  ml:{title:'MINDMATE ഗൈഡ്',eyebrow:'MINDMATE ഗൈഡ്',prompt:'എന്തിൽ സഹായം വേണം?',journeyTitle:'ഇന്നത്തെ യാത്ര',journeySub:'തുടങ്ങുക അല്ലെങ്കിൽ തുടരുക',remindersTitle:'എന്റെ ഓർമ്മിപ്പിക്കലുകൾ',remindersSub:'എന്താണ് വേണ്ടത് കാണുക',progressTitle:'എന്റെ പുരോഗതി',progressSub:'ഞാൻ എങ്ങനെ ചെയ്തു എന്ന് കാണുക',helpTitle:'MINDMATE-നോട് ചോദിക്കൂ',helpSub:'ലളിതമായ സഹായം നേടൂ',contextHint:'സഹായിക്കാൻ ഞാൻ ഇവിടെ ഉണ്ട്',inputLabel:'അല്ലെങ്കിൽ നിങ്ങളുടെ ചോദ്യം എഴുതൂ',subtitle:'ബൗദ്ധിക പ്രവർത്തനങ്ങൾ, ദിനചര്യ, ഓർമ്മിപ്പിക്കലുകൾ, പരിചരണ സഹായം എന്നിവയ്ക്കുള്ള നിങ്ങളുടെ വ്യക്തിഗത ഏജന്റ്.',placeholder:'MINDMATE-നോട് ചോദിക്കൂ…',send:'അയയ്ക്കുക',thinking:'ചിന്തിക്കുന്നു…',offline:'ഓഫ്‌ലൈൻ — പ്രാദേശിക സഹായം ലഭ്യമാണ്',ready:'തയ്യാർ',connected:'n8n ഏജന്റുമായി ബന്ധിപ്പിച്ചു',unavailable:'n8n ഏജന്റ് ലഭ്യമല്ല. പ്രാദേശിക സഹായം ഉപയോഗിക്കുന്നു.',welcome:'നമസ്കാരം. ഞാൻ നിങ്ങളുടെ MINDMATE AI ഏജന്റാണ്. ഇന്നത്തെ യാത്ര, ഓർമ്മിപ്പിക്കലുകൾ, പുരോഗതി, ദിനചര്യ, പരിചരണസംക്ഷേപങ്ങൾ എന്നിവയിൽ സഹായിക്കാം.',quickJourney:'എന്റെ യാത്ര പ്ലാൻ ചെയ്യൂ',quickReminders:'ഓർമ്മിപ്പിക്കലുകൾ കാണിക്കൂ',quickProgress:'ഞാൻ എങ്ങനെ ചെയ്തു?',quickHelp:'നിങ്ങൾക്ക് എന്തുചെയ്യാം?',context:'എന്റെ സമീപകാല MINDMATE പ്രവർത്തനം ഉപയോഗിക്കുക',clear:'മായ്ക്കുക'},
  te:{title:'MINDMATE మార్గదర్శి',eyebrow:'MINDMATE మార్గదర్శి',prompt:'మీకు ఏ విషయంలో సహాయం కావాలి?',journeyTitle:'ఈరోజు ప్రయాణం',journeySub:'ప్రారంభించండి లేదా కొనసాగించండి',remindersTitle:'నా రిమైండర్లు',remindersSub:'ఏవి చేయాలో చూడండి',progressTitle:'నా పురోగతి',progressSub:'నేను ఎలా చేశానో చూడండి',helpTitle:'MINDMATE ను అడగండి',helpSub:'సులభమైన సహాయం పొందండి',contextHint:'సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను',inputLabel:'లేదా మీ ప్రశ్నను టైప్ చేయండి',subtitle:'జ్ఞాపకశక్తి కార్యకలాపాలు, దినచర్యలు, రిమైండర్లు మరియు సంరక్షణ సహాయం కోసం మీ వ్యక్తిగత ఏజెంట్.',placeholder:'MINDMATE ను ఏదైనా అడగండి…',send:'పంపండి',thinking:'ఆలోచిస్తోంది…',offline:'ఆఫ్‌లైన్ — స్థానిక సహాయం అందుబాటులో ఉంది',ready:'సిద్ధం',connected:'n8n ఏజెంట్‌కు కనెక్ట్ అయ్యింది',unavailable:'n8n ఏజెంట్ అందుబాటులో లేదు. స్థానిక సహాయం ఉపయోగిస్తోంది.',welcome:'నమస్తే. నేను మీ MINDMATE AI ఏజెంట్‌ని. ఈరోజు ప్రయాణం, రిమైండర్లు, పురోగతి, దినచర్యలు మరియు సంరక్షణ సారాంశాల్లో సహాయపడగలను.',quickJourney:'నా ప్రయాణాన్ని ప్లాన్ చేయండి',quickReminders:'నా రిమైండర్లు చూపండి',quickProgress:'నేను ఎలా చేశాను?',quickHelp:'మీరు ఏమి చేయగలరు?',context:'నా తాజా MINDMATE కార్యకలాపాన్ని ఉపయోగించు',clear:'తుడిచివేయి'},
  kn:{title:'MINDMATE ಮಾರ್ಗದರ್ಶಿ',eyebrow:'MINDMATE ಮಾರ್ಗದರ್ಶಿ',prompt:'ಯಾವ ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಬೇಕು?',journeyTitle:'ಇಂದಿನ ಪ್ರಯಾಣ',journeySub:'ಪ್ರಾರಂಭಿಸಿ ಅಥವಾ ಮುಂದುವರಿಸಿ',remindersTitle:'ನನ್ನ ಜ್ಞಾಪನೆಗಳು',remindersSub:'ಏನು ಮಾಡಬೇಕು ನೋಡಿ',progressTitle:'ನನ್ನ ಪ್ರಗತಿ',progressSub:'ನಾನು ಹೇಗೆ ಮಾಡಿದೆ ನೋಡಿ',helpTitle:'MINDMATE ಅನ್ನು ಕೇಳಿ',helpSub:'ಸರಳ ಸಹಾಯ ಪಡೆಯಿರಿ',contextHint:'ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ',inputLabel:'ಅಥವಾ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ',subtitle:'ಜ್ಞಾನಾತ್ಮಕ ಚಟುವಟಿಕೆಗಳು, ದಿನಚರಿ, ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಆರೈಕೆ ಸಹಾಯಕ್ಕಾಗಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಏಜೆಂಟ್.',placeholder:'MINDMATE ಅನ್ನು ಏನಾದರೂ ಕೇಳಿ…',send:'ಕಳುಹಿಸಿ',thinking:'ಚಿಂತಿಸುತ್ತಿದೆ…',offline:'ಆಫ್‌ಲೈನ್ — ಸ್ಥಳೀಯ ಸಹಾಯ ಲಭ್ಯ',ready:'ಸಿದ್ಧ',connected:'n8n ಏಜೆಂಟ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',unavailable:'n8n ಏಜೆಂಟ್ ಲಭ್ಯವಿಲ್ಲ. ಸ್ಥಳೀಯ ಸಹಾಯ ಬಳಸಲಾಗುತ್ತಿದೆ.',welcome:'ನಮಸ್ಕಾರ. ನಾನು ನಿಮ್ಮ MINDMATE AI ಏಜೆಂಟ್. ಇಂದಿನ ಪ್ರಯಾಣ, ಜ್ಞಾಪನೆಗಳು, ಪ್ರಗತಿ, ದಿನಚರಿ ಮತ್ತು ಆರೈಕೆ ಸಾರಾಂಶಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು.',quickJourney:'ನನ್ನ ಪ್ರಯಾಣವನ್ನು ಯೋಜಿಸಿ',quickReminders:'ಜ್ಞಾಪನೆಗಳನ್ನು ತೋರಿಸಿ',quickProgress:'ನಾನು ಹೇಗೆ ಮಾಡಿದೆ?',quickHelp:'ನೀವು ಏನು ಮಾಡಬಹುದು?',context:'ನನ್ನ ಇತ್ತೀಚಿನ MINDMATE ಚಟುವಟಿಕೆಯನ್ನು ಬಳಸಿ',clear:'ಅಳಿಸಿ'},
  as:{title:'MINDMATE গাইড',eyebrow:'MINDMATE গাইড',prompt:'আপুনি কিহত সহায় বিচাৰে?',journeyTitle:'আজিৰ যাত্ৰা',journeySub:'আৰম্ভ কৰক বা আগবাঢ়ক',remindersTitle:'মোৰ সোঁৱৰনিবোৰ',remindersSub:'কি কৰিব লাগিব চাওক',progressTitle:'মোৰ অগ্ৰগতি',progressSub:'মই কেনেকুৱা কৰিলোঁ চাওক',helpTitle:'MINDMATE-ক সুধক',helpSub:'সহজ সহায় লওক',contextHint:'সহায় কৰিবলৈ মই ইয়াত আছোঁ',inputLabel:'অথবা আপোনাৰ প্ৰশ্ন লিখক',subtitle:'জ্ঞানমূলক কাৰ্যকলাপ, দৈনন্দিন ৰুটিন, সোঁৱৰনি আৰু যত্ন সহায়ৰ বাবে আপোনাৰ ব্যক্তিগত এজেণ্ট।',placeholder:'MINDMATE-ক কিবা সুধক…',send:'পঠিয়াওক',thinking:'ভাৱি আছে…',offline:'অফলাইন — স্থানীয় সহায় উপলব্ধ',ready:'প্ৰস্তুত',connected:'n8n এজেণ্টৰ সৈতে সংযুক্ত',unavailable:'n8n এজেণ্ট উপলব্ধ নহয়। স্থানীয় সহায় ব্যৱহাৰ কৰা হৈছে।',welcome:'নমস্কাৰ। মই আপোনাৰ MINDMATE AI এজেণ্ট। আজিৰ যাত্ৰা, সোঁৱৰনি, অগ্ৰগতি, ৰুটিন আৰু যত্নদাতা সাৰাংশত সহায় কৰিব পাৰোঁ।',quickJourney:'মোৰ যাত্ৰা পৰিকল্পনা কৰক',quickReminders:'সোঁৱৰনিবোৰ দেখুৱাওক',quickProgress:'মই কেনেকুৱা কৰিলোঁ?',quickHelp:'আপুনি কি কৰিব পাৰে?',context:'মোৰ সাম্প্ৰতিক MINDMATE কাৰ্যকলাপ ব্যৱহাৰ কৰক',clear:'পৰিষ্কাৰ'},
  brx:{title:'MINDMATE गाइड',eyebrow:'MINDMATE गाइड',prompt:'नों माबा बाबो मदद नांगौ?',journeyTitle:'दानियावनि जर्नी',journeySub:'जाबाय बा बाराय',remindersTitle:'आंनि सोरखि',remindersSub:'माबा खालामनो हागोन',progressTitle:'आंनि जौगानाय',progressSub:'आं माबोरै खामानाय',helpTitle:'MINDMATE खौ खिन्था',helpSub:'सहल मदद मोन',contextHint:'मददनि थाखाय आं बेयाव दं',inputLabel:'एबा नोंनि सोंलु लिख',subtitle:'बुद्दि खामानि, दिननि आदाब, सोरखि आरो जाउगानिनि मददनि थाखाय नोंनि निजारि एजेन्ट।',placeholder:'MINDMATE खौ खिन्था जों…',send:'दां',thinking:'सुस्रां दं…',offline:'अफलाइन — थानाय मदद मोननो हायो',ready:'फोजों',connected:'n8n एजेन्टजों जाबोदों',unavailable:'n8n एजेन्ट मोननो हायाखै। थानाय मददखौ बाहायनाय जादों।',welcome:'नमस्कार। आं नोंनि MINDMATE AI एजेन्ट। आजनि जर्नी, सोरखि, प्रगति आरो रुटिननि मदद होनो हायो।',quickJourney:'आंनि जर्निखौ साजाय',quickReminders:'सोरखि देखाय',quickProgress:'आं माबोरै खामानाय?',quickHelp:'नों माबोरै मदद होनो हागोन?',context:'आंनि नायजोबनि MINDMATE खामानिखौ बाहाय',clear:'सुफा'},
  mni:{title:'MINDMATE গাইড',eyebrow:'MINDMATE গাইড',prompt:'কৰ্তব্য কিহত সহায় লাগে?',journeyTitle:'নিংথিজিং যাত্ৰা',journeySub:'হৌবা নহয় মখা লৈবা',remindersTitle:'ঈগী সোঁৱৰণিবোৰ',remindersSub:'করিবা হৈরিবা',progressTitle:'ঈগী চৎনপা',progressSub:'ঈনা কৰম কৰা',helpTitle:'MINDMATE দা সোদক',helpSub:'সোজা সহায় পাম',contextHint:'সহায় তৌনবা নং ইয়াই',inputLabel:'অথবা প্রশ্ন টাইপ তৌবিয়ু',subtitle:'মস্তিষ্কীয় কাৰ্য, দৈনিক ৰুটিন, সোঁৱৰণি আৰু যত্ন সহায়ৰ বাবে আপোনাৰ ব্যক্তিগত এজেন্ট।',placeholder:'MINDMATE লৈ কিবা সোধক…',send:'পঠাওক',thinking:'চিন্তা কৰি আছে…',offline:'অফলাইন — স্থানীয় সহায় উপলব্ধ',ready:'সাজু',connected:'n8n এজেন্টৰ সৈতে সংযুক্ত',unavailable:'n8n এজেন্ট উপলব্ধ নহয়। স্থানীয় সহায় ব্যৱহাৰ কৰা হৈছে।',welcome:'নমস্কাৰ। মই আপোনাৰ MINDMATE AI এজেন্ট। আজিৰ যাত্ৰা, সোঁৱৰণি, অগ্ৰগতি আৰু যত্নদাতা সাৰাংশত সহায় কৰিব পাৰোঁ।',quickJourney:'মোৰ যাত্ৰা সাজু কৰক',quickReminders:'সোঁৱৰণি দেখুৱাওক',quickProgress:'মই কেনেকুৱা কৰিলোঁ?',quickHelp:'আপুনি কি কৰিব পাৰে?',context:'মোৰ শেহতীয়া MINDMATE কাৰ্যকলাপ ব্যৱহাৰ কৰক',clear:'পৰিষ্কাৰ'},
  lus:{title:'MINDMATE Guide',eyebrow:'MINDMATE GUIDE',prompt:'Eng nge i mamawh?',journeyTitle:'Tuni Journey',journeySub:'Tan rawh emaw chhunzawm rawh',remindersTitle:'Ka Reminders',remindersSub:'Eng nge tih tur tih hria rawh',progressTitle:'Ka Progress',progressSub:'Engtin nge ka tih?',helpTitle:'MINDMATE zawn rawh',helpSub:'Tanpuina awlsam hmu rawh',contextHint:'Tanpui turin ka awm',inputLabel:'Emaw zawhna ziak rawh',subtitle:'I cognitive activities, routine, reminders leh caregiver support atan i personal agent.',placeholder:'MINDMATE hnenah zawt rawh…',send:'Thawn',thinking:'A ngaihtuah mek…',offline:'Offline — local support a awm',ready:'A inpeih',connected:'n8n agent nen a inpeih',unavailable:'n8n agent hman theih lo. Local support hman mek.',welcome:'Chibai. MINDMATE AI Agent ka ni. Tuni journey, reminders, progress leh routine ah ka tanpui thei.',quickJourney:'Ka journey ruat rawh',quickReminders:'Reminders min entir rawh',quickProgress:'Engtin nge ka tih?',quickHelp:'Eng nge i tih theih?',context:'Ka MINDMATE activity hnuhnung ber hmang rawh',clear:'Paih'},
  kha:{title:'MINDMATE Nongïarap',eyebrow:'MINDMATE NONGÏARAP',prompt:'Kaei kaba phi kwah jingïarap?',journeyTitle:'Ka Journey Mynta',journeySub:'Sdang lane bteng',remindersTitle:'Ki Reminders jong nga',remindersSub:'Pyni ïa kaba donkam',progressTitle:'Ka Progress jong nga',progressSub:'Pyni kumno nga la leh',helpTitle:'Kylli ïa MINDMATE',helpSub:'Ïoh jingïarap kaba suk',contextHint:'Nga don ban jingïarap',inputLabel:'Lane thoh ïa ka jingkylli jong phi',subtitle:'Ka agent jong phi na ka cognitive activities, routine, reminders bad jingïarap ïa ki caregiver.',placeholder:'Kylli ïa MINDMATE…',send:'Phah',thinking:'Aiñ pyrkhat…',offline:'Offline — ka jingïarap shnong ka don',ready:'La pynkhreh',connected:'La pynïasoh bad n8n agent',unavailable:'n8n agent ym lah ban ïoh. Ka jingïarap shnong ka pyndonkam.',welcome:'Khublei. Nga long u MINDMATE AI Agent. Nga lah ban ïarap ha ka journey mynta ka sngi, reminders, progress bad routine.',quickJourney:'Pynkhreh ïa ka journey jong nga',quickReminders:'Pyni ïa ki reminders',quickProgress:'Kumno nga la leh?',quickHelp:'Kaei kaba phi lah ban leh?',context:'Pyndonkam ïa ka MINDMATE activity kaba dang shen',clear:'Pynkhuid'}
};



const guideLocaleExtras = {
  en:{startJourney:'Open My Journey to begin today’s activities.',replyJourney:'Let’s look at today’s journey together.',replyReminders:'Here are your reminders for today.',replyProgress:'Let’s look at your recent activity together.',replyHelp:'I can help with your journey, reminders, progress and daily routines.',footer:'Simple help for activities, reminders and routines.'},
  ta:{startJourney:'இன்றைய செயல்பாடுகளைத் தொடங்க என் பயணத்தைத் திறக்கவும்.',replyJourney:'இன்றைய பயணத்தை ஒன்றாகப் பார்ப்போம்.',replyReminders:'இன்றைய உங்கள் நினைவூட்டல்கள் இங்கே உள்ளன.',replyProgress:'உங்கள் சமீபத்திய செயல்பாட்டைப் பார்ப்போம்.',replyHelp:'பயணம், நினைவூட்டல்கள், முன்னேற்றம் மற்றும் தினசரி நடைமுறைகளில் நான் உதவ முடியும்.',footer:'செயல்பாடுகள், நினைவூட்டல்கள் மற்றும் தினசரி நடைமுறைகளுக்கான எளிய உதவி.'},
  hi:{startJourney:'आज की गतिविधियाँ शुरू करने के लिए मेरी यात्रा खोलें।',replyJourney:'चलिए आज की यात्रा साथ में देखते हैं।',replyReminders:'आज के आपके रिमाइंडर ये हैं।',replyProgress:'चलिए आपकी हाल की गतिविधि देखते हैं।',replyHelp:'मैं यात्रा, रिमाइंडर, प्रगति और दिनचर्या में मदद कर सकता हूँ।',footer:'गतिविधियों, रिमाइंडर और दिनचर्या के लिए सरल मदद।'},
  ml:{startJourney:'ഇന്നത്തെ പ്രവർത്തനങ്ങൾ തുടങ്ങാൻ എന്റെ യാത്ര തുറക്കൂ.',replyJourney:'ഇന്നത്തെ യാത്ര നമുക്ക് ഒരുമിച്ച് നോക്കാം.',replyReminders:'ഇന്നത്തെ നിങ്ങളുടെ ഓർമ്മിപ്പിക്കലുകൾ ഇവയാണ്.',replyProgress:'നിങ്ങളുടെ സമീപകാല പ്രവർത്തനം നമുക്ക് നോക്കാം.',replyHelp:'യാത്ര, ഓർമ്മിപ്പിക്കലുകൾ, പുരോഗതി, ദിനചര്യ എന്നിവയിൽ ഞാൻ സഹായിക്കാം.',footer:'പ്രവർത്തനങ്ങൾ, ഓർമ്മിപ്പിക്കലുകൾ, ദിനചര്യകൾക്കുള്ള ലളിതമായ സഹായം.'},
  te:{startJourney:'ఈరోజు కార్యకలాపాలు ప్రారంభించడానికి నా ప్రయాణాన్ని తెరవండి.',replyJourney:'ఈరోజు ప్రయాణాన్ని కలిసి చూద్దాం.',replyReminders:'ఈరోజు మీ రిమైండర్లు ఇవి.',replyProgress:'మీ తాజా కార్యకలాపాన్ని కలిసి చూద్దాం.',replyHelp:'ప్రయాణం, రిమైండర్లు, పురోగతి మరియు దినచర్యల్లో నేను సహాయపడగలను.',footer:'కార్యకలాపాలు, రిమైండర్లు మరియు దినచర్యలకు సులభమైన సహాయం.'},
  kn:{startJourney:'ಇಂದಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ಆರಂಭಿಸಲು ನನ್ನ ಪ್ರಯಾಣವನ್ನು ತೆರೆಯಿರಿ.',replyJourney:'ಇಂದಿನ ಪ್ರಯಾಣವನ್ನು ಒಟ್ಟಿಗೆ ನೋಡೋಣ.',replyReminders:'ಇಂದಿನ ನಿಮ್ಮ ಜ್ಞಾಪನೆಗಳು ಇವು.',replyProgress:'ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಯನ್ನು ನೋಡೋಣ.',replyHelp:'ಪ್ರಯಾಣ, ಜ್ಞಾಪನೆಗಳು, ಪ್ರಗತಿ ಮತ್ತು ದಿನಚರಿಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು.',footer:'ಚಟುವಟಿಕೆಗಳು, ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ದಿನಚರಿಗಾಗಿ ಸರಳ ಸಹಾಯ.'},
  as:{startJourney:'আজিৰ কাৰ্যকলাপ আৰম্ভ কৰিবলৈ মোৰ যাত্ৰা খোলক।',replyJourney:'আহক, আজিৰ যাত্ৰাখন একেলগে চাওঁ।',replyReminders:'আজিৰ আপোনাৰ সোঁৱৰনিবোৰ এইবোৰ।',replyProgress:'আহক, আপোনাৰ শেহতীয়া কাৰ্যকলাপ চাওঁ।',replyHelp:'যাত্ৰা, সোঁৱৰনি, অগ্ৰগতি আৰু দৈনন্দিন ৰুটিনত মই সহায় কৰিব পাৰোঁ।',footer:'কাৰ্যকলাপ, সোঁৱৰনি আৰু ৰুটিনৰ বাবে সহজ সহায়।'},
  brx:{startJourney:'दानियावनि खामानिफोरखौ जागायनो आंनि जर्निखौ खेव।',replyJourney:'आसा दानियावनि जर्निखौ जोबोदां नायहर।',replyReminders:'दानियाव नोंनि सोरखिफोर बेफोर।',replyProgress:'आसा नोंनि नायजोबनि खामानिखौ नायहर।',replyHelp:'जर्नी, सोरखि, जौगानाय आरो दिननि आदाबाव आं मदद होनो हायो।',footer:'खामानि, सोरखि आरो दिननि आदाबनि थाखाय सहल मदद।'},
  mni:{startJourney:'নুংঙাইগী থবক ফংনবা ঈগী journey খুদক্না উত্লো।',replyJourney:'নুংঙাইগী journey অমসুং অমগা তাকপা ইয়নো।',replyReminders:'নুংঙাইগী সোঁৱৰণিবোৰ অসিগী ওই।',replyProgress:'নুংঙাইগী নুংসিৎলোনগী থবক তাকপা ইয়নো।',replyHelp:'Journey, sোঁৱৰণি, অগ্ৰগতি অমসুং নুংসিৎলোনগী নিয়মশিংদা ঐনা মতাং পী।',footer:'থবক, সোঁৱৰণি অমসুং দৈনিক নিয়মশিংগী সোজা মতাং।'},
  lus:{startJourney:'Tuni activities tanpui turin Ka Journey hawn rawh.',replyJourney:'Tuni Journey chu kan en ho ang.',replyReminders:'Tuni reminders hi hengte an ni.',replyProgress:'Ka activity hnuhnung ber chu kan en ho ang.',replyHelp:'Journey, reminders, progress leh routine-ah ka tanpui thei.',footer:'Activities, reminders leh routine atan tanpuina awlsam.'},
  kha:{startJourney:'Pynmih ia Ka Journey ban sdang ia ki kam mynta ka sngi.',replyJourney:'To ngin peitlang ïa ka Journey mynta ka sngi.',replyReminders:'Kine ki dei ki reminders jong phi mynta ka sngi.',replyProgress:'To ngin peitlang ïa ka kam ba phi la leh shen.',replyHelp:'Nga lah ban jingïarap ha ka Journey, reminders, progress bad routine.',footer:'Ka jingïarap kaba suk na ka bynta ki kam, reminders bad routine.'}
};
Object.keys(guideLocaleExtras).forEach(function(lang){Object.assign(agentText[lang],guideLocaleExtras[lang]);});

Object.keys(agentText).forEach(function(lang){
  const d=agentText[lang]; const e=agentText.en;
  ['eyebrow','prompt','journeyTitle','journeySub','remindersTitle','remindersSub','progressTitle','progressSub','helpTitle','helpSub','contextHint','inputLabel','footer','replyJourney','replyReminders','replyProgress','replyHelp'].forEach(function(k){ if(d[k]===undefined) d[k]=e[k]; });
});

function currentAgentLanguage(){
  return localStorage.getItem('mindmateLanguage') || 'en';
}
function at(key){
  const lang=currentAgentLanguage();
  return (agentText[lang] && agentText[lang][key]) || agentText.en[key];
}
function addAgentMessage(textContent, role){
  const log=document.getElementById('agentChatLog');
  if(!log) return;
  const bubble=document.createElement('div');
  bubble.className='agent-bubble '+(role==='user'?'user':'assistant');
  bubble.textContent=textContent;
  log.appendChild(bubble);
  log.scrollTop=log.scrollHeight;
}
function addAgentActions(actions=[]){
  const log=document.getElementById('agentChatLog');
  if(!log || !actions.length) return;
  const row=document.createElement('div');
  row.className='guide-suggestion-row';
  actions.forEach(({label,page,reply})=>{
    const btn=document.createElement('button');
    btn.type='button'; btn.className='guide-suggestion-btn'; btn.textContent=label;
    btn.onclick=()=>{
      if(page && typeof window.showPage==='function') window.showPage(page);
      if(reply) { addAgentMessage(reply,'assistant'); speakGuide(reply); }
    };
    row.appendChild(btn);
  });
  log.appendChild(row); log.scrollTop=log.scrollHeight;
}
function speakGuide(text){
  if(localStorage.getItem('mindmateAssistedMode')!=='true' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=({as:'as-IN',brx:'hi-IN',mni:'bn-IN',kha:'en-IN',lus:'en-IN'}[currentAgentLanguage()]||'en-IN');
  window.speechSynthesis.speak(utterance);
}
function agentContext(){
  const ctx={
    language:currentAgentLanguage(),
    page:document.querySelector('.page.active')?.id||'home',
    journey:window.mindmateJourneyState||null,
    score:document.getElementById('score')?.textContent||null,
    streak:document.getElementById('streak')?.textContent||null,
    reminderCount:document.getElementById('todayReminderCount')?.textContent||null,
    online:navigator.onLine
  };
  return ctx;
}
function localAgentReply(message,intent){
  const ctx=agentContext();
  const name=localStorage.getItem('mindmateName')||'';
  const prefix=name ? `Hello ${name}. ` : '';
  const actions={journey:[{label:'Start today’s journey',page:'journey'}],reminders:[{label:'Open reminders',page:'reminders'}],progress:[{label:'See my progress',page:'dashboard'}],games:[{label:'Choose an activity',page:'games'}]};
  if(intent==='journey') return {reply:prefix+at('replyJourney')+' Let us take one small activity at a time.',actions:actions.journey};
  if(intent==='reminders') return {reply:prefix+at('replyReminders')+' Open them to mark a task done, snooze it, or ask for help.',actions:actions.reminders};
  if(intent==='progress') return {reply:prefix+at('replyProgress')+' Your current local progress is '+(ctx.score||'not ready yet')+'.',actions:actions.progress};
  if(intent==='help') return {reply:'I can help you with four simple things: start an activity, check reminders, see progress, or take a calm break. Choose one below.',actions:[...actions.journey,...actions.reminders,...actions.progress,...actions.games]};
  const m=message.toLowerCase();
  if(/hello|hi\b|namaste|নমস্কার|vanakkam/.test(m)) return {reply:prefix+'I am here with you. Would you like to do an activity, check a reminder, or see your progress?',actions:[...actions.journey,...actions.reminders,...actions.progress]};
  if(/journey|यात्रा|பயணம்|യാത്ര|ప్రయాణ|ಪ್ರಯಾಣ|জাত্ৰা|जर्नি|tuni journey|ka journey/.test(m)) return {reply:at('replyJourney')+' A short five-part activity is ready when you are.',actions:actions.journey};
  if(/start|play|game|memory|activity|exercise|খেল/.test(m)) return {reply:'Let us choose one short activity. You can stop whenever you need a rest.',actions:actions.games};
  if(/medicine|tablet|medication|दवा|ঔষধ|dawai/.test(m)) return {reply:'Let us check your medicine reminder together. Please only mark it done after taking the medicine as prescribed.',actions:actions.reminders};
  if(/water|hydration|drink|पानी|পানী/.test(m)) return {reply:'A small glass of water can be a gentle next step. Let us check your hydration reminder.',actions:actions.reminders};
  if(/remind|reminder|நினைவூ|रिमाइंड|ഓർമ്മ|రిమైండ|ಜ್ಞಾಪ|সোঁৱৰ|सोरखи/.test(m)) return {reply:at('replyReminders')+' I will keep this simple.',actions:actions.reminders};
  if(/score|progress|performance|how did|எப்படி|कैसा|എങ്ങനെ|ఎలా|ಹೇಗೆ|অগ্ৰগতি|progress|chung/.test(m)) return {reply:at('replyProgress')+' This shows engagement only, not a medical diagnosis.',actions:actions.progress};
  if(/sad|worried|anxious|tired|lonely|upset|দুখ|চিন্তা/.test(m)) return {reply:'I am sorry this feels difficult. Let us pause for a calm breath and a quiet moment. If you feel unsafe or need urgent help, please contact your caregiver or local emergency support.',actions:[...actions.journey,{label:'View caregiver page',page:'caregiver'}]};
  return {reply:at('replyHelp'),actions:[...actions.journey,...actions.reminders,...actions.progress]};
}
async function sendToN8n(message,intent){
  if(!USE_EXTERNAL_AGENT) return {reply:localAgentReply(message,intent),connected:false};
  const payload={
    event:'agent_message',
    message,
    intent:intent||null,
    language:currentAgentLanguage(),
    context:agentContext(),
    source:'mindmate-web'
  };
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),9000);
  try{
    const res=await fetch(N8N_AGENT_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    const reply=data.recommendation||data.response||data.output||data.message||data.text;
    if(!reply) throw new Error('Empty agent response');
    return {reply:String(reply),connected:true};
  }catch(err){
    return {reply:localAgentReply(message,intent),connected:false};
  }finally{clearTimeout(timeout);}
}
async function sendAgentMessage(messageOverride,intentOverride){
  const input=document.getElementById('agentInput');
  const message=(messageOverride||input?.value||'').trim();
  if(!message) return;
  if(input && !messageOverride) input.value='';
  addAgentMessage(message,'user');
  const status=document.getElementById('agentStatus');
  if(status){status.textContent=at('thinking');status.dataset.state='thinking';}
  const result=await sendToN8n(message,intentOverride||null);
  const guideResult=typeof result.reply==='string'?{reply:result.reply,actions:[]}:result.reply;
  addAgentMessage(guideResult.reply,'assistant');
  addAgentActions(guideResult.actions);
  speakGuide(guideResult.reply);
  if(status){status.textContent=result.connected?at('connected'):'Local guide ready';status.dataset.state=result.connected?'connected':'offline';}
}
function refreshAgentLanguage(){
  const el=(id)=>document.getElementById(id);
  const set=(id,value)=>{const n=el(id); if(n) n.textContent=value;};
  set('agentEyebrow',at('eyebrow')); set('agentTitle',at('title')); set('agentSubtitle',at('subtitle')); set('agentPrompt',at('prompt'));
  set('journeyActionTitle',at('journeyTitle')); set('journeyActionSub',at('journeySub'));
  set('remindersActionTitle',at('remindersTitle')); set('remindersActionSub',at('remindersSub'));
  set('progressActionTitle',at('progressTitle')); set('progressActionSub',at('progressSub'));
  set('helpActionTitle',at('helpTitle')); set('helpActionSub',at('helpSub'));
  set('agentContextHint',at('contextHint')); set('agentInputLabel',at('inputLabel')); set('agentSendLabel',at('send')); set('agentClear',at('clear')); set('agentFooterNote',at('footer'));
  const input=el('agentInput'); if(input) {input.placeholder=at('placeholder'); input.setAttribute('aria-label',at('inputLabel'));}
  document.querySelectorAll('[data-agent-quick]').forEach(function(btn){btn.textContent=at(btn.dataset.agentQuick);});
  const status=el('agentStatus'); if(status && status.dataset.state!=='thinking') status.textContent=navigator.onLine?at('ready'):at('offline');
}
function clearAgentChat(){
  const log=document.getElementById('agentChatLog');
  if(log) log.replaceChildren();
  addAgentMessage(at('welcome')+' Choose a large button above, or simply ask for an activity, a reminder, or your progress.','assistant');
  addAgentActions([{label:'Start today’s journey',page:'journey'},{label:'Open reminders',page:'reminders'},{label:'See my progress',page:'dashboard'}]);
}
function initAgent(){
  const send=document.getElementById('agentSend');
  const input=document.getElementById('agentInput');
  const clear=document.getElementById('agentClear');
  if(!send||!input) return;
  send.addEventListener('click',()=>sendAgentMessage());
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAgentMessage();}});
  clear?.addEventListener('click',clearAgentChat);
  document.querySelectorAll('[data-agent-quick]').forEach(el=>el.addEventListener('click',()=>sendAgentMessage(at(el.dataset.agentQuick),el.dataset.agentIntent)));
  window.addEventListener('mindmate:languageChanged',refreshAgentLanguage);
  window.addEventListener('online',refreshAgentLanguage);
  window.addEventListener('offline',refreshAgentLanguage);
  refreshAgentLanguage();
  clearAgentChat();
}
window.mindmateAgent={send:sendAgentMessage,refresh:refreshAgentLanguage};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAgent,{once:true}); else initAgent();
const agentHomeLabels={
 en:{agent_home_title:'MINDMATE Guide',agent_home_desc:'A simple way to get help with your day.',agent_home_button:'Open MINDMATE Guide'},
 ta:{agent_home_title:'MINDMATE வழிகாட்டி',agent_home_desc:'உங்கள் நாளுக்கு எளிய உதவி பெறும் வழி.',agent_home_button:'MINDMATE வழிகாட்டியைத் திற'},
 hi:{agent_home_title:'MINDMATE मार्गदर्शक',agent_home_desc:'अपने दिन में सरल मदद पाने का आसान तरीका।',agent_home_button:'MINDMATE मार्गदर्शक खोलें'},
 ml:{agent_home_title:'MINDMATE ഗൈഡ്',agent_home_desc:'നിങ്ങളുടെ ദിവസത്തിന് ലളിതമായ സഹായം നേടാനുള്ള വഴി.',agent_home_button:'MINDMATE ഗൈഡ് തുറക്കുക'},
 te:{agent_home_title:'MINDMATE మార్గదర్శి',agent_home_desc:'మీ రోజుకు సులభమైన సహాయం పొందే మార్గం.',agent_home_button:'MINDMATE మార్గదర్శిని తెరవండి'},
 kn:{agent_home_title:'MINDMATE ಮಾರ್ಗದರ್ಶಿ',agent_home_desc:'ನಿಮ್ಮ ದಿನಕ್ಕೆ ಸರಳ ಸಹಾಯ ಪಡೆಯುವ ಮಾರ್ಗ.',agent_home_button:'MINDMATE ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ'},
 as:{agent_home_title:'MINDMATE গাইড',agent_home_desc:'আপোনাৰ দিনটোৰ বাবে সহজ সহায় লোৱাৰ এটা উপায়।',agent_home_button:'MINDMATE গাইড খোলক'},
 brx:{agent_home_title:'MINDMATE गाइड',agent_home_desc:'नोंनि दिननि मददमोननि थाखाय सहल पन्था।',agent_home_button:'MINDMATE गाइड खेव'},
 mni:{agent_home_title:'MINDMATE গাইড',agent_home_desc:'নুংঙাইগী নুংসিৎলোনগী মতাং লৌনবা অমগী সোজা ৱাহং।',agent_home_button:'MINDMATE গাইড খুদক'} ,
 lus:{agent_home_title:'MINDMATE Guide',agent_home_desc:'A simple way to get help every day.',agent_home_button:'Open MINDMATE Guide'},
 kha:{agent_home_title:'MINDMATE Nongïarap',agent_home_desc:'Ka rukom kaba suk ban ïoh jingïarap ha ka sngi jong phi.',agent_home_button:'Plie ïa MINDMATE Nongïarap'}
};
function refreshAgentHomeLabels(){
  const lang=currentAgentLanguage(); const d=agentHomeLabels[lang]||agentHomeLabels.en;
  document.querySelectorAll('[data-key="agent_home_title"],[data-key="agent_home_desc"],[data-key="agent_home_button"]').forEach(function(el){const k=el.getAttribute('data-key'); if(d[k]) el.textContent=d[k];});
}
window.addEventListener('mindmate:languageChanged',refreshAgentHomeLabels);
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',refreshAgentHomeLabels,{once:true}); else refreshAgentHomeLabels();
