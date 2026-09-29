

/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    document.getElementById(pageId)
        .classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   PROFILE PHOTO UPLOAD
===================================================== */

function uploadProfilePhoto(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        document.getElementById("profileImage")
            .src = e.target.result;

        localStorage.setItem(
            "mindmateProfilePhoto",
            e.target.result
        );
    };

    reader.readAsDataURL(file);
}


/* =====================================================
   FAMILY PHOTO UPLOAD
===================================================== */

function uploadFamilyPhoto(event, imageId) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        document.getElementById(imageId)
            .src = e.target.result;

        localStorage.setItem(
            "mindmate_" + imageId,
            e.target.result
        );
    };

    reader.readAsDataURL(file);
}


/* =====================================================
   SAVE PROFILE
===================================================== */

function saveProfile() {

    localStorage.setItem(
        "mindmateName",
        document.getElementById("nameInput").value
    );

    localStorage.setItem(
        "mindmateAge",
        document.getElementById("ageInput").value
    );

    localStorage.setItem(
        "mindmateEmergency",
        document.getElementById("emergencyInput").value
    );

    localStorage.setItem(
        "mindmateCaregiver",
        document.getElementById("caregiverInput").value
    );

    localStorage.setItem(
        "mindmateRelationship",
        document.getElementById("relationshipInput").value
    );

    localStorage.setItem(
        "mindmateCity",
        document.getElementById("cityInput").value
    );

    updateProfileDisplay();

    alert(t("alert_profile_saved"));
}


/* =====================================================
   DISPLAY PROFILE
===================================================== */

function updateProfileDisplay() {
    const profileDisplay = document.getElementById("profileDisplay");
    if (!profileDisplay) return;
    const values = {
        name: localStorage.getItem("mindmateName") || "",
        age: localStorage.getItem("mindmateAge") || "",
        emergency: localStorage.getItem("mindmateEmergency") || "",
        caregiver: localStorage.getItem("mindmateCaregiver") || "",
        relationship: localStorage.getItem("mindmateRelationship") || "",
        city: localStorage.getItem("mindmateCity") || ""
    };
    profileDisplay.replaceChildren();
    const hr = document.createElement("hr"); hr.style.margin = "20px 0"; profileDisplay.appendChild(hr);
    const h = document.createElement("h3"); h.textContent = t("saved_profile_title"); profileDisplay.appendChild(h);
    [["lbl_name","name"],["lbl_age","age"],["lbl_emergency","emergency"],["lbl_caregiver","caregiver"],["lbl_relationship","relationship"],["lbl_city","city"]].forEach(([label,key])=>{
        const p = document.createElement("p");
        const b = document.createElement("b"); b.textContent = t(label) + ": ";
        p.append(b, document.createTextNode(values[key])); profileDisplay.appendChild(p);
    });
}

/* =====================================================
   LOAD PROFILE
===================================================== */

function loadProfile() {

    document.getElementById("nameInput").value =
        localStorage.getItem("mindmateName") || "";

    document.getElementById("ageInput").value =
        localStorage.getItem("mindmateAge") || "";

    document.getElementById("emergencyInput").value =
        localStorage.getItem("mindmateEmergency") || "";

    document.getElementById("caregiverInput").value =
        localStorage.getItem("mindmateCaregiver") || "";

    document.getElementById("relationshipInput").value =
        localStorage.getItem("mindmateRelationship") || "";

    document.getElementById("cityInput").value =
        localStorage.getItem("mindmateCity") || "";

    const photo =
        localStorage.getItem("mindmateProfilePhoto");

    if (photo) {

        document.getElementById("profileImage")
            .src = photo;
    }

    updateProfileDisplay();
}


/* =====================================================
   SAVE FAMILY
===================================================== */

function saveFamily() {

    localStorage.setItem(
        "fatherName",
        document.getElementById("fatherName").value
    );

    localStorage.setItem(
        "motherName",
        document.getElementById("motherName").value
    );

    localStorage.setItem(
        "daughterName",
        document.getElementById("daughterName").value
    );

    localStorage.setItem(
        "sonName",
        document.getElementById("sonName").value
    );

    alert(t("alert_family_saved"));
}


/* =====================================================
   LOAD FAMILY
===================================================== */

function loadFamily() {

    document.getElementById("fatherName").value =
        localStorage.getItem("fatherName") || "";

    document.getElementById("motherName").value =
        localStorage.getItem("motherName") || "";

    document.getElementById("daughterName").value =
        localStorage.getItem("daughterName") || "";

    document.getElementById("sonName").value =
        localStorage.getItem("sonName") || "";

    const photos = [
        "fatherPhoto",
        "motherPhoto",
        "daughterPhoto",
        "sonPhoto"
    ];

    photos.forEach(id => {

        const photo =
            localStorage.getItem("mindmate_" + id);

        if (photo) {

            document.getElementById(id)
                .src = photo;
        }

    });
}


/* =====================================================
   DAILY LOGIN STREAK
===================================================== */

function getToday() {

    const date = new Date();

    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}


function getDateDifference(date1, date2) {

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return Math.floor(
        (d2 - d1) /
        (1000 * 60 * 60 * 24)
    );
}


function updateLoginStreak() {

    let streak =
        parseInt(
            localStorage.getItem("mindmateStreak")
        ) || 0;

    let lastLogin =
        localStorage.getItem("mindmateLastLogin");

    const today = getToday();


    if (!lastLogin) {

        streak = 1;

    }

    else if (lastLogin !== today) {

        const difference =
            getDateDifference(
                lastLogin,
                today
            );

        if (difference === 1) {

            streak++;

        }

        else if (difference > 1) {

            streak = 1;
        }
    }


    localStorage.setItem(
        "mindmateStreak",
        streak
    );

    localStorage.setItem(
        "mindmateLastLogin",
        today
    );


    document.getElementById("streak")
        .innerText = streak + " Days";

    document.getElementById("careStreak")
        .innerText = streak + " Days";
}


/* =====================================================
   CORRECT ANSWER STREAK
===================================================== */

let correctStreak =
    parseInt(
        localStorage.getItem(
            "mindmateCorrectStreak"
        )
    ) || 0;


/* =====================================================
   MEMORY GAME
===================================================== */

let currentAnswer = "";

let gameType = "";


function startMemoryGame() {

    gameType = "sequence";

    const numbers =
        Math.floor(
            1000 +
            Math.random() * 9000
        ).toString();

    currentAnswer = numbers;

    document.getElementById("sequence")
        .innerText = numbers;

    document.getElementById("gameResult")
        .innerText =
        t("game_remember_number");

    setTimeout(() => {

        document.getElementById("sequence")
            .innerText = "????";

    }, 3000);
}


/* =====================================================
   CHECK MEMORY ANSWER
===================================================== */

function checkAnswer() {

    const userAnswer =
        document.getElementById("gameInput")
            .value
            .trim();

    const result =
        document.getElementById("gameResult");


    if (
        userAnswer.toLowerCase() ===
        currentAnswer.toLowerCase()
    ) {

        correctStreak++;

        localStorage.setItem(
            "mindmateCorrectStreak",
            correctStreak
        );


        let score =
            parseInt(
                localStorage.getItem(
                    "mindmateScore"
                )
            ) || 72;

        score =
            Math.min(score + 2, 100);

        localStorage.setItem(
            "mindmateScore",
            score
        );


        result.innerText =
            "✅ " + t("msg_correct_prefix") + " " +
            correctStreak +
            " " + t("msg_correct_in_row");

    }

    else {

        correctStreak = 0;

        localStorage.setItem(
            "mindmateCorrectStreak",
            0
        );

        result.innerText =
            "❌ " + t("msg_wrong_reset_full");
    }


    document.getElementById("gameInput")
        .value = "";

    updateDashboard();
}


/* =====================================================
   OBJECT MEMORY GAME
===================================================== */

let objectAnswer =
    "apple book clock";


function startObjectGame() {

    objectAnswer =
        "apple book clock";

    document.getElementById("objects")
        .innerText =
        "🍎 Apple - 📖 Book - 🕐 Clock";

    document.getElementById("objectResult")
        .innerText =
        t("object_remember");


    setTimeout(() => {

        document.getElementById("objects")
            .innerText = "❓ ❓ ❓";

    }, 3000);
}


function checkObjectAnswer() {

    const answer =
        document.getElementById("objectInput")
            .value
            .toLowerCase()
            .trim();


    if (answer === objectAnswer) {

        correctStreak++;

        localStorage.setItem(
            "mindmateCorrectStreak",
            correctStreak
        );

        document.getElementById("objectResult")
            .innerText =
            "✅ " + t("msg_correct_prefix") + " " +
            correctStreak +
            " " + t("msg_correct_in_row");

    }

    else {

        correctStreak = 0;

        localStorage.setItem(
            "mindmateCorrectStreak",
            0
        );

        document.getElementById("objectResult")
            .innerText =
            "❌ " + t("msg_wrong_streak_reset");
    }


    document.getElementById("objectInput")
        .value = "";

    updateDashboard();
}


/* =====================================================
   DASHBOARD UPDATE
===================================================== */

function updateDashboard() {

    const score =
        parseInt(
            localStorage.getItem(
                "mindmateScore"
            )
        ) || 72;


    document.getElementById("score")
        .innerText =
        score + "%";

    document.getElementById("careScore")
        .innerText =
        score + "%";


    document.getElementById("performanceText")
        .innerText =
        score + "%";


    document.getElementById("performanceBar")
        .style.width =
        score + "%";


    const savedCorrectStreak =
        parseInt(
            localStorage.getItem(
                "mindmateCorrectStreak"
            )
        ) || 0;


    document.getElementById("correctStreak")
        .innerText =
        savedCorrectStreak;


    document.getElementById("careCorrect")
        .innerText =
        savedCorrectStreak;
}


/* =====================================================
   VOICE ASSISTANT
===================================================== */

let recognition = null;
let voiceActive = false;      // true while the assistant is in an ongoing conversation loop
let restartTimer = null;


const voiceLanguages = {

    en: "en-IN",
    ta: "ta-IN",
    hi: "hi-IN",
    ml: "ml-IN",
    te: "te-IN",
    kn: "kn-IN",
    as: "as-IN",
    brx: "br-IN",
    mni: "mni-IN",
    lus: "lus-IN",
    kha: "kha-IN"

};


/* ---------- Visual state helper: idle / listening / thinking / speaking ---------- */

function setVoiceState(state, label) {

    const orb = document.getElementById("micOrb");
    const box = document.getElementById("voiceBox");
    const statusEl = document.getElementById("voiceStatus");

    orb.classList.remove("idle", "listening", "thinking", "speaking");
    orb.classList.add(state);

    box.classList.toggle("is-listening", state === "listening");

    const icons = { idle: "🎤", listening: "🎙️", thinking: "🤔", speaking: "🔊" };
    orb.innerText = icons[state] || "🎤";

    if (statusEl && label) {
        statusEl.innerText = label;
    }
}


/* ---------- Chat log helper: adds a speech bubble and auto-scrolls ---------- */

function addChatBubble(role, text) {

    const log = document.getElementById("chatLog");

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + role;
    bubble.innerText = (role === "user" ? "🧓 " : "🤖 ") + text;

    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
}


/* ---------- Quick-tap chip: lets someone who can't speak just tap a command ---------- */

function sendQuickCommand(command) {

    addChatBubble("user", command);
    setVoiceState("thinking", "🤔 " + t("voice_listening"));

    setTimeout(function() {
        processVoiceCommand(command);
    }, 350);
}


function startVoiceAssistant() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        setVoiceState("idle", t("voice_not_supported"));
        return;
    }

    voiceActive = true;

    if (document.getElementById("chatLog").children.length === 0) {

        const greeting = t("v_greeting");
        addChatBubble("assistant", greeting);

        const language =
            localStorage.getItem("mindmateLanguage") || "en";

        /* the clip/speech's own onended handler calls listenOnce() once it
           finishes, so we don't start listening until the greeting is done */
        if (voiceClips[language]) {
            playVoiceClip(voiceClips[language], greeting);
        } else {
            speakReply(greeting);
        }

        return;
    }

    listenOnce();
}


function listenOnce() {

    if (!voiceActive) return;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();


    const language =
        localStorage.getItem(
            "mindmateLanguage"
        ) || "en";


    recognition.lang =
        voiceLanguages[language] || "en-IN";


    recognition.continuous = false;

    recognition.interimResults = false;


    setVoiceState("listening", "🎙️ " + t("voice_listening"));


    try {
        recognition.start();
    } catch (e) {
        /* recognition may already be starting - ignore */
    }


    recognition.onresult = function(event) {

        const text =
            event.results[0][0].transcript
                .toLowerCase();

        addChatBubble("user", text);

        setVoiceState("thinking", "🤔 " + t("voice_you_said") + " \"" + text + "\"");

        setTimeout(function() {
            processVoiceCommand(text);
        }, 400);
    };


    recognition.onerror = function() {

        if (!voiceActive) return;

        setVoiceState("idle", t("voice_not_understood"));

        restartTimer = setTimeout(function() {
            if (voiceActive) listenOnce();
        }, 1500);
    };


    recognition.onend = function() {
        /* onresult (success) or onerror already decide what happens next */
    };
}


function stopVoiceAssistant() {

    voiceActive = false;

    if (restartTimer) {
        clearTimeout(restartTimer);
        restartTimer = null;
    }

    if (recognition) {

        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
    }

    speechSynthesis.cancel();

    setVoiceState("idle", t("voice_stopped"));
}


/* =====================================================
   VOICE COMMAND PROCESSING
===================================================== */

function processVoiceCommand(command) {

    let reply = "";
    const locale = localStorage.getItem("mindmateLanguage") || "en";
    const aliases = nerCommandAliases[locale];
    if (aliases) {
      Object.keys(aliases).forEach(function(action){
        aliases[action].forEach(function(alias){
          const a = alias.toLowerCase();
          if (command === a || command.includes(a)) command += " " + action;
        });
      });
    }


    if (
        command.includes("hello") ||
        command.includes("hi ") ||
        command === "hi" ||
        command.includes("வணக்கம்")
    ) {

        reply = t("v_hello");

    }


    else if (
        command.includes("how are you")
    ) {

        reply = t("v_how_are_you");

    }


    else if (
        command.includes("thank")
    ) {

        reply = t("v_thanks");

    }


    else if (
        command.includes("bye") ||
        command.includes("goodbye")
    ) {

        reply = t("v_bye");

    }


    else if (
        command.includes("who are you") ||
        command.includes("your name")
    ) {

        reply = t("v_who_are_you");

    }


    else if (
        command.includes("time")
    ) {

        const now = new Date();

        const timeString = now.toLocaleTimeString(
            [], { hour: "2-digit", minute: "2-digit" }
        );

        reply = t("v_time_prefix") + " " + timeString + ".";

    }


    // Specific commands must be evaluated BEFORE generic commands
    if (
        command.includes("caregiver name")
    ) {
        const caregiver = localStorage.getItem("mindmateCaregiver") || t("v_not_saved");
        reply = t("v_caregiver_prefix") + " " + caregiver + ".";
    }

    else if (
        command.includes("start cognitive journey") ||
        command.includes("start my cognitive journey") ||
        command.includes("start journey") ||
        command.includes("my journey") ||
        command.includes("cognitive journey") ||
        command.includes("பயணம்") ||
        command.includes("यात्रा")
    ) {
        showPage("journey");
        const startBtn = document.getElementById("startJourneyBtn");
        if (startBtn) startBtn.click();
        reply = "Starting your personalized cognitive journey.";
    }

    else if (
        command.includes("start memory") ||
        command.includes("memory game") ||
        command.includes("play memory") ||
        command.includes("स्मृति खेल") ||
        command.includes("நினைவக விளையாட்டு")
    ) {
        showPage("games");
        if (window.launchGameDomain) {
            window.launchGameDomain("memory");
        } else {
            startMemoryGame();
        }
        reply = t("v_start_memory");
    }

    else if (
        command.includes("start attention") ||
        command.includes("attention game") ||
        command.includes("play attention") ||
        command.includes("ध्यान खेल") ||
        command.includes("கவன விளையாட்டு")
    ) {
        showPage("games");
        if (window.launchGameDomain) window.launchGameDomain("attention");
        reply = "Starting your attention and focus game.";
    }

    else if (
        command.includes("start routine") ||
        command.includes("routine game") ||
        command.includes("routine recall")
    ) {
        showPage("games");
        if (window.launchGameDomain) window.launchGameDomain("routine");
        reply = "Starting your routine recall activity.";
    }

    else if (
        command.includes("start recognition") ||
        command.includes("recognition game") ||
        command.includes("object game")
    ) {
        showPage("games");
        if (window.launchGameDomain) window.launchGameDomain("recognition");
        reply = "Starting your object recognition activity.";
    }

    else if (
        command.includes("remind me about my medicine") ||
        command.includes("medicine reminder") ||
        command.includes("दवा") ||
        command.includes("மருந்து")
    ) {
        showPage("reminders");
        reply = "Opening your medicine and hydration schedule.";
    }

    else if (
        command.includes("how did i perform today") ||
        command.includes("how did i do") ||
        command.includes("how was my performance")
    ) {
        showPage("dashboard");
        reply = "Opening your activity performance and personal baseline.";
    }

    else if (
        command.includes("what do i have today") ||
        command.includes("what is on my schedule")
    ) {
        showPage("reminders");
        reply = "Here is your routine schedule for today.";
    }

    else if (
        command.includes("health worker") ||
        command.includes("healthworker")
    ) {
        showPage("healthworker");
        reply = "Opening Health Worker monitoring view.";
    }

    else if (
        command.includes("caregiver") ||
        command.includes("கேர்கிவர்")
    ) {
        showPage("caregiver");
        reply = t("v_caregiver");
    }

    else if (
        command.includes("home") ||
        command.includes("முகப்பு")
    ) {
        showPage("home");
        reply = t("v_home");
    }

    else if (
        command.includes("dashboard") ||
        command.includes("டாஷ்போர்டு") ||
        command.includes("progress")
    ) {
        showPage("dashboard");
        reply = t("v_dashboard");
    }

    else if (
        command.includes("game") ||
        command.includes("விளையாட்டு") ||
        command.includes("games")
    ) {
        showPage("games");
        reply = t("v_games");
    }

    else if (
        command.includes("reminder") ||
        command.includes("நினைவூட்டல்")
    ) {
        showPage("reminders");
        reply = t("v_reminders");
    }

    else if (
        command.includes("streak") ||
        command.includes("ஸ்ட்ரீக்")
    ) {
        const streak = localStorage.getItem("mindmateStreak") || 0;
        reply = t("v_streak_prefix") + " " + streak + " " + t("v_days");
    }

    else if (
        command.includes("correct")
    ) {
        const streak = localStorage.getItem("mindmateCorrectStreak") || 0;
        reply = t("v_correct_prefix") + " " + streak + " " + t("v_correct_suffix");
    }

    else if (
        command.includes("score")
    ) {
        const score = localStorage.getItem("mindmateScore") || "Baseline pending";
        reply = t("v_score_prefix") + " " + score + " " + t("v_percent");
    }

    else if (
        command.includes("my name")
    ) {
        const name = localStorage.getItem("mindmateName") || t("v_name_not_saved");
        reply = t("v_name_prefix") + " " + name + ".";
    }

    else if (
        command.includes("my age")
    ) {
        const age = localStorage.getItem("mindmateAge") || t("v_not_saved");
        reply = t("v_age_prefix") + " " + age + ".";
    }

    else if (
        command.includes("help")
    ) {
        reply = t("v_help");
    }

    else {
        reply = t("v_not_understood");
    }


    addChatBubble("assistant", reply);

    speakReply(reply);
}


/* =====================================================
   VOICE OUTPUT
===================================================== */

/* Pre-recorded greeting clips for languages where a good local browser voice
   isn't available. Each plays instead of the browser TTS engine for the
   opening greeting in that language. */
const voiceClips = {
    hi: "assets/audio/voice-1.mp3",
    kn: "assets/audio/voice-2.mp3",
    ta: "assets/audio/voice-3.mp3",
    te: "assets/audio/voice-4.mp3",
    ml: "assets/audio/voice-5.mp3",
};

function playVoiceClip(dataUri, text) {

    setVoiceState("speaking", "🔊 " + text);

    const audio = new Audio(dataUri);

    audio.onended = function() {

        if (voiceActive) {

            setVoiceState("idle", t("voice_listening"));

            restartTimer = setTimeout(function() {
                if (voiceActive) listenOnce();
            }, 500);

        } else {

            setVoiceState("idle", t("voice_click_speak"));
        }
    };

    audio.onerror = function() {
        /* clip failed to play for some reason - fall back to normal TTS logic */
        speakReply(text);
    };

    audio.play().catch(function() {
        speakReply(text);
    });
}


let cachedVoices = [];

/* Voices load asynchronously in most browsers - this keeps cachedVoices fresh */
function refreshVoiceList() {
    if ("speechSynthesis" in window) {
        cachedVoices = speechSynthesis.getVoices();
    }
}

if ("speechSynthesis" in window) {
    refreshVoiceList();
    speechSynthesis.onvoiceschanged = refreshVoiceList;
}


/* Finds the best installed voice for a target language code (e.g. "ta-IN").
   Returns { voice, genuine } - genuine is false when we had to fall back to a
   different language entirely (that voice can't actually pronounce the text). */
function findBestVoice(targetLang) {

    if (!cachedVoices || cachedVoices.length === 0) {
        refreshVoiceList();
    }

    if (!cachedVoices || cachedVoices.length === 0) {
        return { voice: null, genuine: false };
    }

    const targetPrefix = targetLang.split("-")[0].toLowerCase();

    // 1) exact match, e.g. "ta-IN"
    let voice = cachedVoices.find(function(v) {
        return v.lang.toLowerCase() === targetLang.toLowerCase();
    });

    // 2) same language, any region, e.g. "ta-*"
    if (!voice) {
        voice = cachedVoices.find(function(v) {
            return v.lang.toLowerCase().startsWith(targetPrefix);
        });
    }

    if (voice) {
        return { voice: voice, genuine: true };
    }

    // No real voice for this language on this device - a different-language
    // voice cannot pronounce this script, so mark this as NOT genuine.
    let fallback = cachedVoices.find(function(v) {
        return v.lang.toLowerCase().startsWith("en");
    });

    if (!fallback) fallback = cachedVoices[0];

    return { voice: fallback, genuine: false };
}


function speakReply(text) {

    if (!("speechSynthesis" in window)) {
        setVoiceState("idle", t("voice_click_speak"));
        return;
    }


    const language =
        localStorage.getItem(
            "mindmateLanguage"
        ) || "en";

    const targetLang = voiceLanguages[language] || "en-IN";

    const match = findBestVoice(targetLang);


    /* No real voice installed for this language on this device - a mismatched
       voice would just produce silence trying to read this script. Instead of
       failing invisibly, show the reply as a "spoken" beat with a mute icon and
       move the conversation on, so the demo still flows. */
    if (!match.genuine) {

        setVoiceState("speaking", "🔇 " + text);

        const readingTime = Math.max(1200, Math.min(4500, text.length * 55));

        setTimeout(function() {

            if (voiceActive) {

                setVoiceState("idle", t("voice_listening"));

                restartTimer = setTimeout(function() {
                    if (voiceActive) listenOnce();
                }, 500);

            } else {

                setVoiceState("idle", t("voice_click_speak"));
            }

        }, readingTime);

        return;
    }


    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.voice = match.voice;
    utterance.lang = match.voice.lang;


    utterance.rate = 0.9;

    utterance.pitch = 1;


    utterance.onstart = function() {
        setVoiceState("speaking", "🔊 " + text);
    };


    /* If speech synthesis errors out anyway, don't leave the UI stuck - show
       the reply as text and keep the conversation going. */
    utterance.onerror = function() {
        setVoiceState("idle", "🔇 " + text);

        if (voiceActive) {
            restartTimer = setTimeout(function() {
                if (voiceActive) listenOnce();
            }, 700);
        }
    };


    utterance.onend = function() {

        if (voiceActive) {

            setVoiceState("idle", t("voice_listening"));

            /* brief pause so it feels like a natural back-and-forth, then listen again */
            restartTimer = setTimeout(function() {
                if (voiceActive) listenOnce();
            }, 700);

        } else {

            setVoiceState("idle", t("voice_click_speak"));
        }
    };


    speechSynthesis.cancel();

    speechSynthesis.speak(
        utterance
    );
}


/* =====================================================
   MULTI LANGUAGE
===================================================== */

const translations = {

    en: {
    lbl_caregiver_name:"Caregiver name",
        welcome: "Welcome to MINDMATE",
        subtitle: "Smart Cognitive Care and Family Support Platform",
        nav_home: "Home",
        nav_dashboard: "Dashboard",
        nav_games: "Brain Games",
        nav_reminders: "Reminders",
        nav_caregiver: "Caregiver",
        btn_open_dashboard: "Open Dashboard",
        profile_title: "👤 My Profile",
        ph_name: "Enter your name",
        ph_age: "Enter your age",
        ph_emergency: "Emergency contact",
        ph_caregiver_name: "Caregiver name",
        ph_relationship: "Relationship",
        ph_city: "City",
        btn_save_profile: "💾 Save Profile",
        btn_load_profile: "🔄 Load Profile",
        family_title: "👨‍👩‍👧‍👦 Family Members",
        lbl_father: "Father",
        lbl_mother: "Mother",
        lbl_daughter: "Daughter",
        lbl_son: "Son",
        ph_father_name: "Father name",
        ph_mother_name: "Mother name",
        ph_daughter_name: "Daughter name",
        ph_son_name: "Son name",
        btn_save_family: "💾 Save Family Details",
        voice_title: "🎤 MINDMATE Voice Assistant",
        voice_click_speak: "Click the button and speak",
        btn_start_voice: "🎤 Start Voice Assistant",
        btn_stop: "⏹ Stop",
        dashboard_title: "📊 Dashboard",
        card_cognitive_score: "🧠 Cognitive Score",
        card_current_streak: "🔥 Current Streak",
        card_correct_row: "🎯 Correct in a Row",
        card_reminders: "⏰ Reminders",
        card_offline_mode: "📴 Offline Mode",
        lbl_prototype_score: "Prototype game score",
        lbl_daily_streak: "Daily login streak",
        lbl_consecutive_correct: "Consecutive correct answers",
        lbl_today_reminders: "Today's reminders",
        lbl_browser_storage: "Browser data storage",
        status_on: "ON",
        performance_title: "Performance",
        games_title: "🧠 Brain Games",
        memory_seq_title: "🔢 Memory Sequence",
        memory_seq_desc: "Remember the number sequence.",
        press_start: "Press Start",
        btn_start_game: "Start Game",
        ph_enter_sequence: "Enter sequence",
        btn_check_answer: "Check Answer",
        object_memory_title: "🧩 Object Memory",
        object_memory_desc: "Remember these objects:",
        object_memory_list: "Apple - Book - Clock",
        btn_start_object_game: "Start Object Game",
        ph_enter_objects: "Enter the objects",
        reminders_title: "⏰ Reminders",
        reminder_medicine: "Medicine reminder",
        reminder_water: "Drink water",
        reminder_brain: "Brain exercise",
        caregiver_title: "👨‍⚕️ Caregiver Dashboard",
        card_correct_answers: "🎯 Correct Answers",
        footer_line1: "🧠 MINDMATE | SIH 26003 Prototype",
        footer_line2: "Smart Cognitive Care & Family Support",
        alert_profile_saved: "Profile saved successfully!",
        alert_family_saved: "Family details saved!",
        saved_profile_title: "Saved Profile",
        lbl_name: "Name",
        lbl_age: "Age",
        lbl_emergency: "Emergency Contact",
        lbl_caregiver: "Caregiver",
        lbl_relationship: "Relationship",
        lbl_city: "City",
        game_remember_number: "Remember the number!",
        msg_correct_prefix: "Correct!",
        msg_correct_in_row: "correct in a row!",
        msg_wrong_reset_full: "Wrong! Correct streak reset to 0.",
        msg_wrong_streak_reset: "Wrong! Streak reset.",
        object_remember: "Remember the objects!",
        voice_not_supported: "Voice recognition is not supported in this browser.",
        voice_listening: "Listening... Speak now",
        voice_you_said: "You said:",
        voice_not_understood: "Could not understand. Please try again.",
        voice_stopped: "Voice assistant stopped.",
        v_home: "Opening home page.",
        v_dashboard: "Opening dashboard.",
        v_games: "Opening brain games.",
        v_reminders: "Opening your reminders.",
        v_caregiver: "Opening caregiver dashboard.",
        v_start_memory: "Starting memory game.",
        v_streak_prefix: "Your daily login streak is",
        v_days: "days.",
        v_correct_prefix: "You have",
        v_correct_suffix: "correct answers in a row.",
        v_score_prefix: "Your current prototype score is",
        v_percent: "percent.",
        v_name_prefix: "Your name is",
        v_name_not_saved: "your name is not saved",
        v_age_prefix: "Your age is",
        v_not_saved: "not saved",
        v_caregiver_prefix: "Your caregiver is",
        v_help: "You can say home, dashboard, games, reminders, caregiver, start memory game, my name, my age, streak, correct answers, or score. You can also just say hello, or ask me the time.",
        v_not_understood: "Sorry, I did not understand. Please try again.",
        v_greeting: "Hello! I'm MindMate, your voice companion. Tap a button below or just speak to me — try saying 'help' to hear what I can do.",
        v_hello: "Hello there! It's lovely to hear from you. How can I help you today?",
        v_how_are_you: "I'm doing well, thank you for asking! More importantly, how are you feeling today?",
        v_thanks: "You're very welcome. I'm always here whenever you need me.",
        v_bye: "Goodbye for now! Take care of yourself, and remember to drink some water.",
        v_who_are_you: "I'm MindMate, your friendly voice assistant here to help with reminders, games, and company.",
        v_time_prefix: "The current time is",
        chip_hello: "👋 Say Hi",
        chip_score: "📊 My Score",
        chip_streak: "🔥 My Streak",
        chip_reminders: "⏰ Reminders",
        chip_game: "🧠 Play a Game",
        chip_help: "❓ Help"
    },

    ta: {
    lbl_caregiver_name:"பராமரிப்பாளர் பெயர்",
        welcome: "MINDMATE-க்கு வரவேற்கிறோம்",
        subtitle: "சிறந்த அறிவாற்றல் பராமரிப்பு மற்றும் குடும்ப ஆதரவு தளம்",
        nav_home: "முகப்பு",
        nav_dashboard: "டாஷ்போர்டு",
        nav_games: "மூளை விளையாட்டுகள்",
        nav_reminders: "நினைவூட்டல்கள்",
        nav_caregiver: "பராமரிப்பாளர்",
        btn_open_dashboard: "டாஷ்போர்டைத் திற",
        profile_title: "👤 எனது சுயவிவரம்",
        ph_name: "உங்கள் பெயரை உள்ளிடவும்",
        ph_age: "உங்கள் வயதை உள்ளிடவும்",
        ph_emergency: "அவசர தொடர்பு",
        ph_caregiver_name: "பராமரிப்பாளர் பெயர்",
        ph_relationship: "உறவு",
        ph_city: "நகரம்",
        btn_save_profile: "💾 சுயவிவரத்தை சேமி",
        btn_load_profile: "🔄 சுயவிவரத்தை ஏற்று",
        family_title: "👨‍👩‍👧‍👦 குடும்ப உறுப்பினர்கள்",
        lbl_father: "தந்தை",
        lbl_mother: "தாய்",
        lbl_daughter: "மகள்",
        lbl_son: "மகன்",
        ph_father_name: "தந்தையின் பெயர்",
        ph_mother_name: "தாயின் பெயர்",
        ph_daughter_name: "மகளின் பெயர்",
        ph_son_name: "மகனின் பெயர்",
        btn_save_family: "💾 குடும்ப விவரங்களை சேமி",
        voice_title: "🎤 MINDMATE குரல் உதவியாளர்",
        voice_click_speak: "பொத்தானை அழுத்தி பேசவும்",
        btn_start_voice: "🎤 குரல் உதவியாளரைத் தொடங்கு",
        btn_stop: "⏹ நிறுத்து",
        dashboard_title: "📊 டாஷ்போர்டு",
        card_cognitive_score: "🧠 அறிவாற்றல் மதிப்பெண்",
        card_current_streak: "🔥 தற்போதைய தொடர்ச்சி",
        card_correct_row: "🎯 தொடர்ச்சியான சரியானவை",
        card_reminders: "⏰ நினைவூட்டல்கள்",
        card_offline_mode: "📴 ஆஃப்லைன் முறை",
        lbl_prototype_score: "முன்மாதிரி விளையாட்டு மதிப்பெண்",
        lbl_daily_streak: "தினசரி உள்நுழைவு தொடர்ச்சி",
        lbl_consecutive_correct: "தொடர்ச்சியான சரியான பதில்கள்",
        lbl_today_reminders: "இன்றைய நினைவூட்டல்கள்",
        lbl_browser_storage: "உலாவி தரவு சேமிப்பு",
        status_on: "இயக்கத்தில்",
        performance_title: "செயல்திறன்",
        games_title: "🧠 மூளை விளையாட்டுகள்",
        memory_seq_title: "🔢 எண் வரிசை நினைவு",
        memory_seq_desc: "எண் வரிசையை நினைவில் வையுங்கள்.",
        press_start: "தொடங்கு அழுத்தவும்",
        btn_start_game: "விளையாட்டைத் தொடங்கு",
        ph_enter_sequence: "வரிசையை உள்ளிடவும்",
        btn_check_answer: "பதிலைச் சரிபார்",
        object_memory_title: "🧩 பொருள் நினைவு",
        object_memory_desc: "இந்த பொருட்களை நினைவில் வையுங்கள்:",
        object_memory_list: "ஆப்பிள் - புத்தகம் - கடிகாரம்",
        btn_start_object_game: "பொருள் விளையாட்டைத் தொடங்கு",
        ph_enter_objects: "பொருட்களை உள்ளிடவும்",
        reminders_title: "⏰ நினைவூட்டல்கள்",
        reminder_medicine: "மருந்து நினைவூட்டல்",
        reminder_water: "தண்ணீர் குடிக்கவும்",
        reminder_brain: "மூளை பயிற்சி",
        caregiver_title: "👨‍⚕️ பராமரிப்பாளர் டாஷ்போர்டு",
        card_correct_answers: "🎯 சரியான பதில்கள்",
        footer_line1: "🧠 MINDMATE | SIH 26003 முன்மாதிரி",
        footer_line2: "சிறந்த அறிவாற்றல் பராமரிப்பு & குடும்ப ஆதரவு",
        alert_profile_saved: "சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!",
        alert_family_saved: "குடும்ப விவரங்கள் சேமிக்கப்பட்டன!",
        saved_profile_title: "சேமிக்கப்பட்ட சுயவிவரம்",
        lbl_name: "பெயர்",
        lbl_age: "வயது",
        lbl_emergency: "அவசர தொடர்பு",
        lbl_caregiver: "பராமரிப்பாளர்",
        lbl_relationship: "உறவு",
        lbl_city: "நகரம்",
        game_remember_number: "எண்ணை நினைவில் வையுங்கள்!",
        msg_correct_prefix: "சரி!",
        msg_correct_in_row: "தொடர்ச்சியாக சரியானவை!",
        msg_wrong_reset_full: "தவறு! சரியான தொடர்ச்சி 0 ஆக மீட்டமைக்கப்பட்டது.",
        msg_wrong_streak_reset: "தவறு! தொடர்ச்சி மீட்டமைக்கப்பட்டது.",
        object_remember: "பொருட்களை நினைவில் வையுங்கள்!",
        voice_not_supported: "இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை.",
        voice_listening: "கேட்கிறது... இப்போது பேசவும்",
        voice_you_said: "நீங்கள் சொன்னது:",
        voice_not_understood: "புரியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        voice_stopped: "குரல் உதவியாளர் நிறுத்தப்பட்டது.",
        v_home: "முகப்புப் பக்கத்தைத் திறக்கிறேன்.",
        v_dashboard: "டாஷ்போர்டைத் திறக்கிறேன்.",
        v_games: "மூளை விளையாட்டுகளைத் திறக்கிறேன்.",
        v_reminders: "உங்கள் நினைவூட்டல்களைத் திறக்கிறேன்.",
        v_caregiver: "பராமரிப்பாளர் டாஷ்போர்டைத் திறக்கிறேன்.",
        v_start_memory: "நினைவு விளையாட்டைத் தொடங்குகிறேன்.",
        v_streak_prefix: "உங்கள் தினசரி உள்நுழைவு தொடர்ச்சி",
        v_days: "நாட்கள்.",
        v_correct_prefix: "உங்களிடம்",
        v_correct_suffix: "தொடர்ச்சியான சரியான பதில்கள் உள்ளன.",
        v_score_prefix: "உங்கள் தற்போதைய முன்மாதிரி மதிப்பெண்",
        v_percent: "சதவீதம்.",
        v_name_prefix: "உங்கள் பெயர்",
        v_name_not_saved: "உங்கள் பெயர் சேமிக்கப்படவில்லை",
        v_age_prefix: "உங்கள் வயது",
        v_not_saved: "சேமிக்கப்படவில்லை",
        v_caregiver_prefix: "உங்கள் பராமரிப்பாளர்",
        v_help: "முகப்பு, டாஷ்போர்டு, விளையாட்டுகள், நினைவூட்டல்கள், பராமரிப்பாளர், நினைவு விளையாட்டைத் தொடங்கு, எனது பெயர், எனது வயது, தொடர்ச்சி, சரியான பதில்கள் அல்லது மதிப்பெண் என்று சொல்லலாம். வணக்கம் என்றும் சொல்லலாம், அல்லது நேரம் என்ன என்று கேட்கலாம்.",
        v_not_understood: "மன்னிக்கவும், எனக்குப் புரியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        v_greeting: "வணக்கம்! நான் மைண்ட்மேட், உங்கள் குரல் துணை. கீழே உள்ள பொத்தானை அழுத்தவும் அல்லது என்னிடம் பேசவும் — நான் என்ன செய்ய முடியும் என்பதை அறிய 'உதவி' என்று சொல்லுங்கள்.",
        v_hello: "வணக்கம்! உங்களிடமிருந்து கேட்பது மகிழ்ச்சி அளிக்கிறது. இன்று நான் உங்களுக்கு எப்படி உதவலாம்?",
        v_how_are_you: "நான் நன்றாக இருக்கிறேன், கேட்டதற்கு நன்றி! நீங்கள் இன்று எப்படி உணர்கிறீர்கள்?",
        v_thanks: "மிக்க நன்றி. நான் எப்போதும் உங்களுக்கு உதவ இங்கே இருக்கிறேன்.",
        v_bye: "இப்போதைக்கு விடைபெறுகிறேன்! உங்களை கவனித்துக் கொள்ளுங்கள், தண்ணீர் குடிக்க மறக்காதீர்கள்.",
        v_who_are_you: "நான் மைண்ட்மேட், நினைவூட்டல்கள், விளையாட்டுகள் மற்றும் துணைக்காக இங்கே இருக்கும் உங்கள் நட்பு குரல் உதவியாளர்.",
        v_time_prefix: "தற்போதைய நேரம்",
        chip_hello: "👋 வணக்கம் சொல்லு",
        chip_score: "📊 எனது மதிப்பெண்",
        chip_streak: "🔥 எனது தொடர்ச்சி",
        chip_reminders: "⏰ நினைவூட்டல்கள்",
        chip_game: "🧠 விளையாட்டு விளையாடு",
        chip_help: "❓ உதவி"
    },

    hi: {
    lbl_caregiver_name:"देखभालकर्ता का नाम",
        welcome: "MINDMATE में आपका स्वागत है",
        subtitle: "स्मार्ट संज्ञानात्मक देखभाल और परिवार सहायता मंच",
        nav_home: "होम",
        nav_dashboard: "डैशबोर्ड",
        nav_games: "दिमागी खेल",
        nav_reminders: "रिमाइंडर",
        nav_caregiver: "देखभालकर्ता",
        btn_open_dashboard: "डैशबोर्ड खोलें",
        profile_title: "👤 मेरी प्रोफ़ाइल",
        ph_name: "अपना नाम दर्ज करें",
        ph_age: "अपनी उम्र दर्ज करें",
        ph_emergency: "आपातकालीन संपर्क",
        ph_caregiver_name: "देखभालकर्ता का नाम",
        ph_relationship: "रिश्ता",
        ph_city: "शहर",
        btn_save_profile: "💾 प्रोफ़ाइल सहेजें",
        btn_load_profile: "🔄 प्रोफ़ाइल लोड करें",
        family_title: "👨‍👩‍👧‍👦 परिवार के सदस्य",
        lbl_father: "पिता",
        lbl_mother: "माता",
        lbl_daughter: "बेटी",
        lbl_son: "बेटा",
        ph_father_name: "पिता का नाम",
        ph_mother_name: "माता का नाम",
        ph_daughter_name: "बेटी का नाम",
        ph_son_name: "बेटे का नाम",
        btn_save_family: "💾 परिवार विवरण सहेजें",
        voice_title: "🎤 MINDMATE वॉइस असिस्टेंट",
        voice_click_speak: "बटन दबाएँ और बोलें",
        btn_start_voice: "🎤 वॉइस असिस्टेंट शुरू करें",
        btn_stop: "⏹ रोकें",
        dashboard_title: "📊 डैशबोर्ड",
        card_cognitive_score: "🧠 संज्ञानात्मक स्कोर",
        card_current_streak: "🔥 वर्तमान स्ट्रीक",
        card_correct_row: "🎯 लगातार सही",
        card_reminders: "⏰ रिमाइंडर",
        card_offline_mode: "📴 ऑफ़लाइन मोड",
        lbl_prototype_score: "प्रोटोटाइप गेम स्कोर",
        lbl_daily_streak: "दैनिक लॉगिन स्ट्रीक",
        lbl_consecutive_correct: "लगातार सही उत्तर",
        lbl_today_reminders: "आज के रिमाइंडर",
        lbl_browser_storage: "ब्राउज़र डेटा स्टोरेज",
        status_on: "चालू",
        performance_title: "प्रदर्शन",
        games_title: "🧠 दिमागी खेल",
        memory_seq_title: "🔢 नंबर क्रम याद रखें",
        memory_seq_desc: "नंबर क्रम याद रखें।",
        press_start: "शुरू करें दबाएँ",
        btn_start_game: "खेल शुरू करें",
        ph_enter_sequence: "क्रम दर्ज करें",
        btn_check_answer: "उत्तर जांचें",
        object_memory_title: "🧩 वस्तु स्मृति",
        object_memory_desc: "इन वस्तुओं को याद रखें:",
        object_memory_list: "सेब - किताब - घड़ी",
        btn_start_object_game: "वस्तु खेल शुरू करें",
        ph_enter_objects: "वस्तुएं दर्ज करें",
        reminders_title: "⏰ रिमाइंडर",
        reminder_medicine: "दवा रिमाइंडर",
        reminder_water: "पानी पिएं",
        reminder_brain: "दिमागी व्यायाम",
        caregiver_title: "👨‍⚕️ देखभालकर्ता डैशबोर्ड",
        card_correct_answers: "🎯 सही उत्तर",
        footer_line1: "🧠 MINDMATE | SIH 26003 प्रोटोटाइप",
        footer_line2: "स्मार्ट संज्ञानात्मक देखभाल और परिवार सहायता",
        alert_profile_saved: "प्रोफ़ाइल सफलतापूर्वक सहेजी गई!",
        alert_family_saved: "परिवार का विवरण सहेजा गया!",
        saved_profile_title: "सहेजी गई प्रोफ़ाइल",
        lbl_name: "नाम",
        lbl_age: "उम्र",
        lbl_emergency: "आपातकालीन संपर्क",
        lbl_caregiver: "देखभालकर्ता",
        lbl_relationship: "रिश्ता",
        lbl_city: "शहर",
        game_remember_number: "नंबर याद रखें!",
        msg_correct_prefix: "सही!",
        msg_correct_in_row: "लगातार सही!",
        msg_wrong_reset_full: "गलत! सही स्ट्रीक 0 पर रीसेट हो गई।",
        msg_wrong_streak_reset: "गलत! स्ट्रीक रीसेट हो गई।",
        object_remember: "वस्तुओं को याद रखें!",
        voice_not_supported: "इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है।",
        voice_listening: "सुन रहा हूँ... अब बोलें",
        voice_you_said: "आपने कहा:",
        voice_not_understood: "समझ नहीं आया। कृपया फिर से प्रयास करें।",
        voice_stopped: "वॉइस असिस्टेंट बंद हो गया।",
        v_home: "होम पेज खोल रहा हूँ।",
        v_dashboard: "डैशबोर्ड खोल रहा हूँ।",
        v_games: "दिमागी खेल खोल रहा हूँ।",
        v_reminders: "आपके रिमाइंडर खोल रहा हूँ।",
        v_caregiver: "देखभालकर्ता डैशबोर्ड खोल रहा हूँ।",
        v_start_memory: "मेमोरी गेम शुरू कर रहा हूँ।",
        v_streak_prefix: "आपकी दैनिक लॉगिन स्ट्रीक है",
        v_days: "दिन।",
        v_correct_prefix: "आपके पास लगातार",
        v_correct_suffix: "सही उत्तर हैं।",
        v_score_prefix: "आपका वर्तमान प्रोटोटाइप स्कोर है",
        v_percent: "प्रतिशत।",
        v_name_prefix: "आपका नाम है",
        v_name_not_saved: "आपका नाम सहेजा नहीं गया है",
        v_age_prefix: "आपकी उम्र है",
        v_not_saved: "सहेजा नहीं गया",
        v_caregiver_prefix: "आपके देखभालकर्ता हैं",
        v_help: "आप होम, डैशबोर्ड, गेम्स, रिमाइंडर, केयरगिवर, स्टार्ट मेमोरी गेम, माय नेम, माय एज, स्ट्रीक, करेक्ट आंसर, या स्कोर कह सकते हैं। आप नमस्ते भी कह सकते हैं, या समय पूछ सकते हैं।",
        v_not_understood: "क्षमा करें, मुझे समझ नहीं आया। कृपया फिर से प्रयास करें।",
        v_greeting: "नमस्ते! मैं माइंडमेट हूं, आपका वॉइस साथी। नीचे कोई बटन दबाएं या मुझसे बात करें — मैं क्या कर सकता हूं यह जानने के लिए 'मदद' कहें।",
        v_hello: "नमस्ते! आपकी आवाज़ सुनकर अच्छा लगा। आज मैं आपकी कैसे मदद कर सकता हूं?",
        v_how_are_you: "मैं ठीक हूं, पूछने के लिए धन्यवाद! आप आज कैसा महसूस कर रहे हैं?",
        v_thanks: "आपका बहुत स्वागत है। मैं जब भी आपको ज़रूरत हो, यहां हूं।",
        v_bye: "अभी के लिए अलविदा! अपना ख्याल रखें, और पानी पीना न भूलें।",
        v_who_are_you: "मैं माइंडमेट हूं, आपका मित्रवत वॉइस असिस्टेंट जो रिमाइंडर, गेम्स और साथ देने के लिए यहां है।",
        v_time_prefix: "अभी समय है",
        chip_hello: "👋 नमस्ते कहें",
        chip_score: "📊 मेरा स्कोर",
        chip_streak: "🔥 मेरी स्ट्रीक",
        chip_reminders: "⏰ रिमाइंडर",
        chip_game: "🧠 खेल खेलें",
        chip_help: "❓ मदद"
    },

    ml: {
    lbl_caregiver_name:"പരിചരണക്കാരന്റെ പേര്",
        welcome: "MINDMATE-ലേക്ക് സ്വാഗതം",
        subtitle: "സ്മാർട്ട് കോഗ്നിറ്റീവ് കെയർ, കുടുംബ പിന്തുണ പ്ലാറ്റ്ഫോം",
        nav_home: "ഹോം",
        nav_dashboard: "ഡാഷ്ബോർഡ്",
        nav_games: "മസ്തിഷ്ക കളികൾ",
        nav_reminders: "ഓർമ്മപ്പെടുത്തലുകൾ",
        nav_caregiver: "പരിചാരകൻ",
        btn_open_dashboard: "ഡാഷ്ബോർഡ് തുറക്കുക",
        profile_title: "👤 എന്റെ പ്രൊഫൈൽ",
        ph_name: "നിങ്ങളുടെ പേര് നൽകുക",
        ph_age: "നിങ്ങളുടെ പ്രായം നൽകുക",
        ph_emergency: "അടിയന്തര ബന്ധപ്പെടൽ",
        ph_caregiver_name: "പരിചാരകന്റെ പേര്",
        ph_relationship: "ബന്ധം",
        ph_city: "നഗരം",
        btn_save_profile: "💾 പ്രൊഫൈൽ സേവ് ചെയ്യുക",
        btn_load_profile: "🔄 പ്രൊഫൈൽ ലോഡ് ചെയ്യുക",
        family_title: "👨‍👩‍👧‍👦 കുടുംബാംഗങ്ങൾ",
        lbl_father: "അച്ഛൻ",
        lbl_mother: "അമ്മ",
        lbl_daughter: "മകൾ",
        lbl_son: "മകൻ",
        ph_father_name: "അച്ഛന്റെ പേര്",
        ph_mother_name: "അമ്മയുടെ പേര്",
        ph_daughter_name: "മകളുടെ പേര്",
        ph_son_name: "മകന്റെ പേര്",
        btn_save_family: "💾 കുടുംബ വിവരങ്ങൾ സേവ് ചെയ്യുക",
        voice_title: "🎤 MINDMATE വോയ്സ് അസിസ്റ്റന്റ്",
        voice_click_speak: "ബട്ടൺ അമർത്തി സംസാരിക്കുക",
        btn_start_voice: "🎤 വോയ്സ് അസിസ്റ്റന്റ് ആരംഭിക്കുക",
        btn_stop: "⏹ നിർത്തുക",
        dashboard_title: "📊 ഡാഷ്ബോർഡ്",
        card_cognitive_score: "🧠 കോഗ്നിറ്റീവ് സ്കോർ",
        card_current_streak: "🔥 നിലവിലെ സ്ട്രീക്ക്",
        card_correct_row: "🎯 തുടർച്ചയായി ശരി",
        card_reminders: "⏰ ഓർമ്മപ്പെടുത്തലുകൾ",
        card_offline_mode: "📴 ഓഫ്‌ലൈൻ മോഡ്",
        lbl_prototype_score: "പ്രോട്ടോടൈപ്പ് ഗെയിം സ്കോർ",
        lbl_daily_streak: "ദിവസേനയുള്ള ലോഗിൻ സ്ട്രീക്ക്",
        lbl_consecutive_correct: "തുടർച്ചയായി ശരിയായ ഉത്തരങ്ങൾ",
        lbl_today_reminders: "ഇന്നത്തെ ഓർമ്മപ്പെടുത്തലുകൾ",
        lbl_browser_storage: "ബ്രൗസർ ഡാറ്റ സംഭരണം",
        status_on: "ഓൺ",
        performance_title: "പ്രകടനം",
        games_title: "🧠 മസ്തിഷ്ക കളികൾ",
        memory_seq_title: "🔢 നമ്പർ ക്രമം ഓർമ്മ",
        memory_seq_desc: "നമ്പർ ക്രമം ഓർത്തുവയ്ക്കുക.",
        press_start: "സ്റ്റാർട്ട് അമർത്തുക",
        btn_start_game: "ഗെയിം ആരംഭിക്കുക",
        ph_enter_sequence: "ക്രമം നൽകുക",
        btn_check_answer: "ഉത്തരം പരിശോധിക്കുക",
        object_memory_title: "🧩 വസ്തു ഓർമ്മ",
        object_memory_desc: "ഈ വസ്തുക്കൾ ഓർത്തുവയ്ക്കുക:",
        object_memory_list: "ആപ്പിൾ - പുസ്തകം - ക്ലോക്ക്",
        btn_start_object_game: "വസ്തു ഗെയിം ആരംഭിക്കുക",
        ph_enter_objects: "വസ്തുക്കൾ നൽകുക",
        reminders_title: "⏰ ഓർമ്മപ്പെടുത്തലുകൾ",
        reminder_medicine: "മരുന്ന് ഓർമ്മപ്പെടുത്തൽ",
        reminder_water: "വെള്ളം കുടിക്കുക",
        reminder_brain: "മസ്തിഷ്ക വ്യായാമം",
        caregiver_title: "👨‍⚕️ പരിചാരക ഡാഷ്ബോർഡ്",
        card_correct_answers: "🎯 ശരിയായ ഉത്തരങ്ങൾ",
        footer_line1: "🧠 MINDMATE | SIH 26003 പ്രോട്ടോടൈപ്പ്",
        footer_line2: "സ്മാർട്ട് കോഗ്നിറ്റീവ് കെയർ & കുടുംബ പിന്തുണ",
        alert_profile_saved: "പ്രൊഫൈൽ വിജയകരമായി സേവ് ചെയ്തു!",
        alert_family_saved: "കുടുംബ വിവരങ്ങൾ സേവ് ചെയ്തു!",
        saved_profile_title: "സേവ് ചെയ്ത പ്രൊഫൈൽ",
        lbl_name: "പേര്",
        lbl_age: "പ്രായം",
        lbl_emergency: "അടിയന്തര ബന്ധപ്പെടൽ",
        lbl_caregiver: "പരിചാരകൻ",
        lbl_relationship: "ബന്ധം",
        lbl_city: "നഗരം",
        game_remember_number: "നമ്പർ ഓർത്തുവയ്ക്കുക!",
        msg_correct_prefix: "ശരി!",
        msg_correct_in_row: "തുടർച്ചയായി ശരി!",
        msg_wrong_reset_full: "തെറ്റ്! ശരി സ്ട്രീക്ക് 0 ആയി പുനഃസജ്ജമാക്കി.",
        msg_wrong_streak_reset: "തെറ്റ്! സ്ട്രീക്ക് പുനഃസജ്ജമാക്കി.",
        object_remember: "വസ്തുക്കൾ ഓർത്തുവയ്ക്കുക!",
        voice_not_supported: "ഈ ബ്രൗസറിൽ വോയ്സ് തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല.",
        voice_listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
        voice_you_said: "നിങ്ങൾ പറഞ്ഞത്:",
        voice_not_understood: "മനസ്സിലായില്ല. വീണ്ടും ശ്രമിക്കുക.",
        voice_stopped: "വോയ്സ് അസിസ്റ്റന്റ് നിർത്തി.",
        v_home: "ഹോം പേജ് തുറക്കുന്നു.",
        v_dashboard: "ഡാഷ്ബോർഡ് തുറക്കുന്നു.",
        v_games: "മസ്തിഷ്ക കളികൾ തുറക്കുന്നു.",
        v_reminders: "നിങ്ങളുടെ ഓർമ്മപ്പെടുത്തലുകൾ തുറക്കുന്നു.",
        v_caregiver: "പരിചാരക ഡാഷ്ബോർഡ് തുറക്കുന്നു.",
        v_start_memory: "മെമ്മറി ഗെയിം ആരംഭിക്കുന്നു.",
        v_streak_prefix: "നിങ്ങളുടെ ദിവസേനയുള്ള ലോഗിൻ സ്ട്രീക്ക്",
        v_days: "ദിവസങ്ങൾ.",
        v_correct_prefix: "നിങ്ങൾക്ക്",
        v_correct_suffix: "തുടർച്ചയായി ശരിയായ ഉത്തരങ്ങൾ ഉണ്ട്.",
        v_score_prefix: "നിങ്ങളുടെ നിലവിലെ പ്രോട്ടോടൈപ്പ് സ്കോർ",
        v_percent: "ശതമാനം.",
        v_name_prefix: "നിങ്ങളുടെ പേര്",
        v_name_not_saved: "നിങ്ങളുടെ പേര് സേവ് ചെയ്തിട്ടില്ല",
        v_age_prefix: "നിങ്ങളുടെ പ്രായം",
        v_not_saved: "സേവ് ചെയ്തിട്ടില്ല",
        v_caregiver_prefix: "നിങ്ങളുടെ പരിചാരകൻ",
        v_help: "ഹോം, ഡാഷ്ബോർഡ്, ഗെയിംസ്, ഓർമ്മപ്പെടുത്തലുകൾ, കെയർഗിവർ, സ്റ്റാർട്ട് മെമ്മറി ഗെയിം, മൈ നെയിം, മൈ ഏജ്, സ്ട്രീക്ക്, കറക്ട് ആൻസേഴ്‌സ്, അല്ലെങ്കിൽ സ്കോർ എന്ന് പറയാം. നമസ്കാരം എന്നും പറയാം, അല്ലെങ്കിൽ സമയം എന്താണെന്ന് ചോദിക്കാം.",
        v_not_understood: "ക്ഷമിക്കണം, എനിക്ക് മനസ്സിലായില്ല. വീണ്ടും ശ്രമിക്കുക.",
        v_greeting: "നമസ്കാരം! ഞാൻ മൈൻഡ്മേറ്റ്, നിങ്ങളുടെ വോയ്സ് കൂട്ടുകാരൻ. താഴെയുള്ള ബട്ടൺ അമർത്തുക അല്ലെങ്കിൽ എന്നോട് സംസാരിക്കുക — എനിക്ക് എന്ത് ചെയ്യാൻ കഴിയുമെന്ന് അറിയാൻ 'സഹായം' എന്ന് പറയൂ.",
        v_hello: "നമസ്കാരം! നിങ്ങളിൽ നിന്ന് കേൾക്കുന്നത് സന്തോഷമാണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
        v_how_are_you: "ഞാൻ സുഖമായിരിക്കുന്നു, ചോദിച്ചതിന് നന്ദി! നിങ്ങൾക്ക് ഇന്ന് എങ്ങനെയുണ്ട്?",
        v_thanks: "സ്വാഗതം. നിങ്ങൾക്ക് ആവശ്യമുള്ളപ്പോഴെല്ലാം ഞാൻ ഇവിടെയുണ്ട്.",
        v_bye: "ഇപ്പോൾ വിട! സ്വയം ശ്രദ്ധിക്കുക, വെള്ളം കുടിക്കാൻ മറക്കരുത്.",
        v_who_are_you: "ഞാൻ മൈൻഡ്മേറ്റ് ആണ്, ഓർമ്മപ്പെടുത്തലുകൾ, ഗെയിമുകൾ, കൂട്ട് എന്നിവയ്ക്കായി ഇവിടെയുള്ള നിങ്ങളുടെ സൗഹൃദ വോയ്സ് അസിസ്റ്റന്റ്.",
        v_time_prefix: "ഇപ്പോഴത്തെ സമയം",
        chip_hello: "👋 ഹായ് പറയൂ",
        chip_score: "📊 എന്റെ സ്കോർ",
        chip_streak: "🔥 എന്റെ സ്ട്രീക്ക്",
        chip_reminders: "⏰ ഓർമ്മപ്പെടുത്തലുകൾ",
        chip_game: "🧠 ഗെയിം കളിക്കൂ",
        chip_help: "❓ സഹായം"
    },

    te: {
    lbl_caregiver_name:"సంరక్షకుడి పేరు",
        welcome: "MINDMATE కు స్వాగతం",
        subtitle: "స్మార్ట్ కాగ్నిటివ్ కేర్ మరియు కుటుంబ సహాయ వేదిక",
        nav_home: "హోమ్",
        nav_dashboard: "డాష్‌బోర్డ్",
        nav_games: "మెదడు ఆటలు",
        nav_reminders: "రిమైండర్లు",
        nav_caregiver: "సంరక్షకుడు",
        btn_open_dashboard: "డాష్‌బోర్డ్ తెరవండి",
        profile_title: "👤 నా ప్రొఫైల్",
        ph_name: "మీ పేరు నమోదు చేయండి",
        ph_age: "మీ వయస్సు నమోదు చేయండి",
        ph_emergency: "అత్యవసర సంప్రదింపు",
        ph_caregiver_name: "సంరక్షకుడి పేరు",
        ph_relationship: "సంబంధం",
        ph_city: "నగరం",
        btn_save_profile: "💾 ప్రొఫైల్ సేవ్ చేయండి",
        btn_load_profile: "🔄 ప్రొఫైల్ లోడ్ చేయండి",
        family_title: "👨‍👩‍👧‍👦 కుటుంబ సభ్యులు",
        lbl_father: "తండ్రి",
        lbl_mother: "తల్లి",
        lbl_daughter: "కూతురు",
        lbl_son: "కొడుకు",
        ph_father_name: "తండ్రి పేరు",
        ph_mother_name: "తల్లి పేరు",
        ph_daughter_name: "కూతురు పేరు",
        ph_son_name: "కొడుకు పేరు",
        btn_save_family: "💾 కుటుంబ వివరాలు సేవ్ చేయండి",
        voice_title: "🎤 MINDMATE వాయిస్ అసిస్టెంట్",
        voice_click_speak: "బటన్ నొక్కి మాట్లాడండి",
        btn_start_voice: "🎤 వాయిస్ అసిస్టెంట్ ప్రారంభించండి",
        btn_stop: "⏹ ఆపు",
        dashboard_title: "📊 డాష్‌బోర్డ్",
        card_cognitive_score: "🧠 కాగ్నిటివ్ స్కోర్",
        card_current_streak: "🔥 ప్రస్తుత స్ట్రీక్",
        card_correct_row: "🎯 వరుసగా సరైనవి",
        card_reminders: "⏰ రిమైండర్లు",
        card_offline_mode: "📴 ఆఫ్‌లైన్ మోడ్",
        lbl_prototype_score: "ప్రోటోటైప్ గేమ్ స్కోర్",
        lbl_daily_streak: "రోజువారీ లాగిన్ స్ట్రీక్",
        lbl_consecutive_correct: "వరుసగా సరైన సమాధానాలు",
        lbl_today_reminders: "నేటి రిమైండర్లు",
        lbl_browser_storage: "బ్రౌజర్ డేటా నిల్వ",
        status_on: "ఆన్",
        performance_title: "పనితీరు",
        games_title: "🧠 మెదడు ఆటలు",
        memory_seq_title: "🔢 సంఖ్య క్రమం జ్ఞాపకం",
        memory_seq_desc: "సంఖ్య క్రమాన్ని గుర్తుంచుకోండి.",
        press_start: "స్టార్ట్ నొక్కండి",
        btn_start_game: "ఆట ప్రారంభించండి",
        ph_enter_sequence: "క్రమాన్ని నమోదు చేయండి",
        btn_check_answer: "సమాధానం తనిఖీ చేయండి",
        object_memory_title: "🧩 వస్తువు జ్ఞాపకం",
        object_memory_desc: "ఈ వస్తువులను గుర్తుంచుకోండి:",
        object_memory_list: "ఆపిల్ - పుస్తకం - గడియారం",
        btn_start_object_game: "వస్తువు ఆట ప్రారంభించండి",
        ph_enter_objects: "వస్తువులను నమోదు చేయండి",
        reminders_title: "⏰ రిమైండర్లు",
        reminder_medicine: "మందు రిమైండర్",
        reminder_water: "నీరు తాగండి",
        reminder_brain: "మెదడు వ్యాయామం",
        caregiver_title: "👨‍⚕️ సంరక్షకుడి డాష్‌బోర్డ్",
        card_correct_answers: "🎯 సరైన సమాధానాలు",
        footer_line1: "🧠 MINDMATE | SIH 26003 ప్రోటోటైప్",
        footer_line2: "స్మార్ట్ కాగ్నిటివ్ కేర్ & కుటుంబ సహాయం",
        alert_profile_saved: "ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!",
        alert_family_saved: "కుటుంబ వివరాలు సేవ్ చేయబడ్డాయి!",
        saved_profile_title: "సేవ్ చేసిన ప్రొఫైల్",
        lbl_name: "పేరు",
        lbl_age: "వయస్సు",
        lbl_emergency: "అత్యవసర సంప్రదింపు",
        lbl_caregiver: "సంరక్షకుడు",
        lbl_relationship: "సంబంధం",
        lbl_city: "నగరం",
        game_remember_number: "సంఖ్యను గుర్తుంచుకోండి!",
        msg_correct_prefix: "సరైనది!",
        msg_correct_in_row: "వరుసగా సరైనవి!",
        msg_wrong_reset_full: "తప్పు! సరైన స్ట్రీక్ 0కి రీసెట్ చేయబడింది.",
        msg_wrong_streak_reset: "తప్పు! స్ట్రీక్ రీసెట్ చేయబడింది.",
        object_remember: "వస్తువులను గుర్తుంచుకోండి!",
        voice_not_supported: "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు మద్దతు లేదు.",
        voice_listening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
        voice_you_said: "మీరు చెప్పింది:",
        voice_not_understood: "అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        voice_stopped: "వాయిస్ అసిస్టెంట్ ఆగిపోయింది.",
        v_home: "హోమ్ పేజీని తెరుస్తున్నాను.",
        v_dashboard: "డాష్‌బోర్డ్‌ను తెరుస్తున్నాను.",
        v_games: "మెదడు ఆటలను తెరుస్తున్నాను.",
        v_reminders: "మీ రిమైండర్లను తెరుస్తున్నాను.",
        v_caregiver: "సంరక్షకుడి డాష్‌బోర్డ్‌ను తెరుస్తున్నాను.",
        v_start_memory: "మెమరీ గేమ్‌ను ప్రారంభిస్తున్నాను.",
        v_streak_prefix: "మీ రోజువారీ లాగిన్ స్ట్రీక్",
        v_days: "రోజులు.",
        v_correct_prefix: "మీకు వరుసగా",
        v_correct_suffix: "సరైన సమాధానాలు ఉన్నాయి.",
        v_score_prefix: "మీ ప్రస్తుత ప్రోటోటైప్ స్కోర్",
        v_percent: "శాతం.",
        v_name_prefix: "మీ పేరు",
        v_name_not_saved: "మీ పేరు సేవ్ చేయబడలేదు",
        v_age_prefix: "మీ వయస్సు",
        v_not_saved: "సేవ్ చేయబడలేదు",
        v_caregiver_prefix: "మీ సంరక్షకుడు",
        v_help: "మీరు హోమ్, డాష్‌బోర్డ్, గేమ్స్, రిమైండర్స్, కేర్‌గివర్, స్టార్ట్ మెమరీ గేమ్, మై నేమ్, మై ఏజ్, స్ట్రీక్, కరెక్ట్ ఆన్సర్స్, లేదా స్కోర్ అని చెప్పవచ్చు. నమస్కారం అని కూడా చెప్పవచ్చు, లేదా సమయం ఏమిటో అడగవచ్చు.",
        v_not_understood: "క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        v_greeting: "నమస్కారం! నేను మైండ్‌మేట్, మీ వాయిస్ సహచరుడు. కింద ఉన్న బటన్ నొక్కండి లేదా నాతో మాట్లాడండి — నేను ఏమి చేయగలనో తెలుసుకోవడానికి 'సహాయం' అని చెప్పండి.",
        v_hello: "నమస్కారం! మీ నుండి వినడం సంతోషంగా ఉంది. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
        v_how_are_you: "నేను బాగున్నాను, అడిగినందుకు ధన్యవాదాలు! మీరు ఈరోజు ఎలా అనిపిస్తున్నారు?",
        v_thanks: "మీకు స్వాగతం. మీకు అవసరమైనప్పుడు నేను ఎల్లప్పుడూ ఇక్కడ ఉంటాను.",
        v_bye: "ప్రస్తుతానికి వీడ్కోలు! మిమ్మల్ని మీరు జాగ్రత్తగా చూసుకోండి, నీరు తాగడం మర్చిపోవద్దు.",
        v_who_are_you: "నేను మైండ్‌మేట్, రిమైండర్లు, గేమ్‌లు మరియు తోడు కోసం ఇక్కడ ఉన్న మీ స్నేహపూర్వక వాయిస్ అసిస్టెంట్.",
        v_time_prefix: "ప్రస్తుత సమయం",
        chip_hello: "👋 హాయ్ చెప్పండి",
        chip_score: "📊 నా స్కోర్",
        chip_streak: "🔥 నా స్ట్రీక్",
        chip_reminders: "⏰ రిమైండర్లు",
        chip_game: "🧠 గేమ్ ఆడండి",
        chip_help: "❓ సహాయం"
    },

    kn: {
    lbl_caregiver_name:"ಆರೈಕೆದಾರರ ಹೆಸರು",
        welcome: "MINDMATE ಗೆ ಸ್ವಾಗತ",
        subtitle: "ಸ್ಮಾರ್ಟ್ ಕಾಗ್ನಿಟಿವ್ ಕೇರ್ ಮತ್ತು ಕುಟುಂಬ ಸಹಾಯ ವೇದಿಕೆ",
        nav_home: "ಮುಖಪುಟ",
        nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        nav_games: "ಮೆದುಳಿನ ಆಟಗಳು",
        nav_reminders: "ಜ್ಞಾಪನೆಗಳು",
        nav_caregiver: "ಆರೈಕೆದಾರ",
        btn_open_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
        profile_title: "👤 ನನ್ನ ಪ್ರೊಫೈಲ್",
        ph_name: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        ph_age: "ನಿಮ್ಮ ವಯಸ್ಸನ್ನು ನಮೂದಿಸಿ",
        ph_emergency: "ತುರ್ತು ಸಂಪರ್ಕ",
        ph_caregiver_name: "ಆರೈಕೆದಾರರ ಹೆಸರು",
        ph_relationship: "ಸಂಬಂಧ",
        ph_city: "ನಗರ",
        btn_save_profile: "💾 ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
        btn_load_profile: "🔄 ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಿ",
        family_title: "👨‍👩‍👧‍👦 ಕುಟುಂಬ ಸದಸ್ಯರು",
        lbl_father: "ತಂದೆ",
        lbl_mother: "ತಾಯಿ",
        lbl_daughter: "ಮಗಳು",
        lbl_son: "ಮಗ",
        ph_father_name: "ತಂದೆಯ ಹೆಸರು",
        ph_mother_name: "ತಾಯಿಯ ಹೆಸರು",
        ph_daughter_name: "ಮಗಳ ಹೆಸರು",
        ph_son_name: "ಮಗನ ಹೆಸರು",
        btn_save_family: "💾 ಕುಟುಂಬ ವಿವರಗಳನ್ನು ಉಳಿಸಿ",
        voice_title: "🎤 MINDMATE ಧ್ವನಿ ಸಹಾಯಕ",
        voice_click_speak: "ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ",
        btn_start_voice: "🎤 ಧ್ವನಿ ಸಹಾಯಕವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
        btn_stop: "⏹ ನಿಲ್ಲಿಸಿ",
        dashboard_title: "📊 ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        card_cognitive_score: "🧠 ಕಾಗ್ನಿಟಿವ್ ಸ್ಕೋರ್",
        card_current_streak: "🔥 ಪ್ರಸ್ತುತ ಸ್ಟ್ರೀಕ್",
        card_correct_row: "🎯 ಸತತ ಸರಿ",
        card_reminders: "⏰ ಜ್ಞಾಪನೆಗಳು",
        card_offline_mode: "📴 ಆಫ್‌ಲೈನ್ ಮೋಡ್",
        lbl_prototype_score: "ಪ್ರೋಟೋಟೈಪ್ ಆಟದ ಸ್ಕೋರ್",
        lbl_daily_streak: "ದೈನಂದಿನ ಲಾಗಿನ್ ಸ್ಟ್ರೀಕ್",
        lbl_consecutive_correct: "ಸತತ ಸರಿಯಾದ ಉತ್ತರಗಳು",
        lbl_today_reminders: "ಇಂದಿನ ಜ್ಞಾಪನೆಗಳು",
        lbl_browser_storage: "ಬ್ರೌಸರ್ ಡೇಟಾ ಸಂಗ್ರಹಣೆ",
        status_on: "ಆನ್",
        performance_title: "ಕಾರ್ಯಕ್ಷಮತೆ",
        games_title: "🧠 ಮೆದುಳಿನ ಆಟಗಳು",
        memory_seq_title: "🔢 ಸಂಖ್ಯೆ ಅನುಕ್ರಮ ನೆನಪು",
        memory_seq_desc: "ಸಂಖ್ಯೆ ಅನುಕ್ರಮವನ್ನು ನೆನಪಿಡಿ.",
        press_start: "ಪ್ರಾರಂಭಿಸಿ ಒತ್ತಿ",
        btn_start_game: "ಆಟ ಪ್ರಾರಂಭಿಸಿ",
        ph_enter_sequence: "ಅನುಕ್ರಮವನ್ನು ನಮೂದಿಸಿ",
        btn_check_answer: "ಉತ್ತರ ಪರಿಶೀಲಿಸಿ",
        object_memory_title: "🧩 ವಸ್ತು ನೆನಪು",
        object_memory_desc: "ಈ ವಸ್ತುಗಳನ್ನು ನೆನಪಿಡಿ:",
        object_memory_list: "ಸೇಬು - ಪುಸ್ತಕ - ಗಡಿಯಾರ",
        btn_start_object_game: "ವಸ್ತು ಆಟ ಪ್ರಾರಂಭಿಸಿ",
        ph_enter_objects: "ವಸ್ತುಗಳನ್ನು ನಮೂದಿಸಿ",
        reminders_title: "⏰ ಜ್ಞಾಪನೆಗಳು",
        reminder_medicine: "ಔಷಧಿ ಜ್ಞಾಪನೆ",
        reminder_water: "ನೀರು ಕುಡಿಯಿರಿ",
        reminder_brain: "ಮೆದುಳಿನ ವ್ಯಾಯಾಮ",
        caregiver_title: "👨‍⚕️ ಆರೈಕೆದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        card_correct_answers: "🎯 ಸರಿಯಾದ ಉತ್ತರಗಳು",
        footer_line1: "🧠 MINDMATE | SIH 26003 ಪ್ರೋಟೋಟೈಪ್",
        footer_line2: "ಸ್ಮಾರ್ಟ್ ಕಾಗ್ನಿಟಿವ್ ಕೇರ್ ಮತ್ತು ಕುಟುಂಬ ಬೆಂಬಲ",
        alert_profile_saved: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
        alert_family_saved: "ಕುಟುಂಬ ವಿವರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!",
        saved_profile_title: "ಉಳಿಸಿದ ಪ್ರೊಫೈಲ್",
        lbl_name: "ಹೆಸರು",
        lbl_age: "ವಯಸ್ಸು",
        lbl_emergency: "ತುರ್ತು ಸಂಪರ್ಕ",
        lbl_caregiver: "ಆರೈಕೆದಾರ",
        lbl_relationship: "ಸಂಬಂಧ",
        lbl_city: "ನಗರ",
        game_remember_number: "ಸಂಖ್ಯೆಯನ್ನು ನೆನಪಿಡಿ!",
        msg_correct_prefix: "ಸರಿ!",
        msg_correct_in_row: "ಸತತವಾಗಿ ಸರಿ!",
        msg_wrong_reset_full: "ತಪ್ಪು! ಸರಿಯಾದ ಸ್ಟ್ರೀಕ್ 0ಗೆ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.",
        msg_wrong_streak_reset: "ತಪ್ಪು! ಸ್ಟ್ರೀಕ್ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.",
        object_remember: "ವಸ್ತುಗಳನ್ನು ನೆನಪಿಡಿ!",
        voice_not_supported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಿಲ್ಲ.",
        voice_listening: "ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
        voice_you_said: "ನೀವು ಹೇಳಿದ್ದು:",
        voice_not_understood: "ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        voice_stopped: "ಧ್ವನಿ ಸಹಾಯಕ ನಿಲ್ಲಿಸಲಾಗಿದೆ.",
        v_home: "ಮುಖಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
        v_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
        v_games: "ಮೆದುಳಿನ ಆಟಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
        v_reminders: "ನಿಮ್ಮ ಜ್ಞಾಪನೆಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
        v_caregiver: "ಆರೈಕೆದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.",
        v_start_memory: "ಮೆಮೊರಿ ಆಟವನ್ನು ಪ್ರಾರಂಭಿಸುತ್ತಿದ್ದೇನೆ.",
        v_streak_prefix: "ನಿಮ್ಮ ದೈನಂದಿನ ಲಾಗಿನ್ ಸ್ಟ್ರೀಕ್",
        v_days: "ದಿನಗಳು.",
        v_correct_prefix: "ನಿಮ್ಮಲ್ಲಿ ಸತತವಾಗಿ",
        v_correct_suffix: "ಸರಿಯಾದ ಉತ್ತರಗಳಿವೆ.",
        v_score_prefix: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪ್ರೋಟೋಟೈಪ್ ಸ್ಕೋರ್",
        v_percent: "ಶೇಕಡಾ.",
        v_name_prefix: "ನಿಮ್ಮ ಹೆಸರು",
        v_name_not_saved: "ನಿಮ್ಮ ಹೆಸರನ್ನು ಉಳಿಸಲಾಗಿಲ್ಲ",
        v_age_prefix: "ನಿಮ್ಮ ವಯಸ್ಸು",
        v_not_saved: "ಉಳಿಸಲಾಗಿಲ್ಲ",
        v_caregiver_prefix: "ನಿಮ್ಮ ಆರೈಕೆದಾರ",
        v_help: "ನೀವು ಹೋಮ್, ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಗೇಮ್ಸ್, ರಿಮೈಂಡರ್ಸ್, ಕೇರ್‌ಗಿವರ್, ಸ್ಟಾರ್ಟ್ ಮೆಮೊರಿ ಗೇಮ್, ಮೈ ನೇಮ್, ಮೈ ಏಜ್, ಸ್ಟ್ರೀಕ್, ಕರೆಕ್ಟ್ ಆನ್ಸರ್ಸ್, ಅಥವಾ ಸ್ಕೋರ್ ಎಂದು ಹೇಳಬಹುದು. ನಮಸ್ಕಾರ ಎಂದೂ ಹೇಳಬಹುದು, ಅಥವಾ ಸಮಯ ಎಷ್ಟು ಎಂದು ಕೇಳಬಹುದು.",
        v_not_understood: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        v_greeting: "ನಮಸ್ಕಾರ! ನಾನು ಮೈಂಡ್‌ಮೇಟ್, ನಿಮ್ಮ ಧ್ವನಿ ಸಂಗಾತಿ. ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ ಅಥವಾ ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಿ — ನಾನು ಏನು ಮಾಡಬಲ್ಲೆ ಎಂದು ತಿಳಿಯಲು 'ಸಹಾಯ' ಎಂದು ಹೇಳಿ.",
        v_hello: "ನಮಸ್ಕಾರ! ನಿಮ್ಮಿಂದ ಕೇಳಲು ಸಂತೋಷವಾಗಿದೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        v_how_are_you: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಕೇಳಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು! ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ?",
        v_thanks: "ಸ್ವಾಗತ. ನಿಮಗೆ ಅಗತ್ಯವಿದ್ದಾಗಲೆಲ್ಲಾ ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.",
        v_bye: "ಸದ್ಯಕ್ಕೆ ವಿದಾಯ! ನಿಮ್ಮನ್ನು ನೀವು ನೋಡಿಕೊಳ್ಳಿ, ನೀರು ಕುಡಿಯಲು ಮರೆಯಬೇಡಿ.",
        v_who_are_you: "ನಾನು ಮೈಂಡ್‌ಮೇಟ್, ಜ್ಞಾಪನೆಗಳು, ಆಟಗಳು ಮತ್ತು ಒಡನಾಟಕ್ಕಾಗಿ ಇಲ್ಲಿರುವ ನಿಮ್ಮ ಸ್ನೇಹಪರ ಧ್ವನಿ ಸಹಾಯಕ.",
        v_time_prefix: "ಪ್ರಸ್ತುತ ಸಮಯ",
        chip_hello: "👋 ಹಾಯ್ ಹೇಳಿ",
        chip_score: "📊 ನನ್ನ ಸ್ಕೋರ್",
        chip_streak: "🔥 ನನ್ನ ಸ್ಟ್ರೀಕ್",
        chip_reminders: "⏰ ಜ್ಞಾಪನೆಗಳು",
        chip_game: "🧠 ಆಟ ಆಡಿ",
        chip_help: "❓ ಸಹಾಯ"
    }

};


/* =====================================================
   COMPLETE GLOBAL I18N SUPPLEMENT
   All remaining user-facing strings live here so language
   switching never depends on scattered hard-coded text.
===================================================== */
const uiExtraTranslations = {
  en: {
    time_am:"AM", time_pm:"PM",
    site_title:"MINDMATE - SIH 26003", language_label:"Choose language", main_navigation:"Main navigation", todays_status:"Today's status",
    language_english:"English", language_tamil:"Tamil", language_hindi:"Hindi", language_malayalam:"Malayalam", language_telugu:"Telugu", language_kannada:"Kannada", language_assamese:"Assamese", language_bodo:"Bodo", language_meitei:"Meitei", language_mizo:"Mizo", language_khasi:"Khasi",
    brand_sub:"Your cognitive care companion", eyebrow:"🌿 Simple. Supportive. Personal.", hero_start:"🧠 Start Today's Activity", talk_mindmate:"🎤 Talk to MINDMATE", one_step:"One step at a time",
    one_step_desc:"Play a short activity, check your reminders, or talk with MINDMATE. You don't need to learn a complicated app.", checkin_title:"Today's simple check-in", checkin_desc:"Everything important is kept in one place.",
    offline_ready:"Offline ready", saved_device:"Saved on device", what_do:"What would you like to do?", choose_action:"Choose one simple action.", play_game:"Play a Game", play_game_desc:"Short memory activities designed to be easy to follow.",
    talk_desc:"Speak naturally to ask about your score, reminders, or help.", my_reminders:"My Reminders", my_reminders_desc:"See today's medicine, water, and brain-activity reminders.", voice_help:"No typing needed. Tap the microphone and speak in your selected language.",
    change_photo:"📷 Change photo", family_desc:"Familiar faces can make the experience more personal.", games_desc:"Short activities for memory and recognition.", home:"← Home", memory_goal:"MEMORY", recognition_goal:"RECOGNITION",
    game_instruction_seq:"Press Start, remember the number, then enter it.", object_instruction:"Press Start and remember the objects.", demo_games:"Prototype note: the current score and game logic are demonstration mechanisms. They are not a clinical diagnosis or validated cognitive assessment.",
    reminders_desc:"Simple prompts for today's routine.", medicine_time:"8:00 AM · Medicine", water_time:"10:00 AM · Water", brain_time:"6:00 PM · Brain activity", appointment:"Appointment", appointment_desc:"Keep upcoming medical appointments easy to remember.",
    add_reminder:"➕ Add Reminder", custom_reminders:"Custom reminders", reminder_title_label:"Reminder title", reminder_title_placeholder:"Enter reminder name", reminder_time_label:"Time", save_reminder:"💾 Save Reminder", cancel:"Cancel", delete:"Delete", no_custom_reminders:"No custom reminders yet.",
    reminder_demo:"Reminder content shown here is part of the current prototype. Full scheduled notifications and completion syncing are not claimed unless implemented by the application.", reminder_required:"Please enter both a reminder title and time.", reminder_saved:"Reminder saved successfully!", reminder_deleted:"Reminder deleted.",
    dashboard_desc:"A simple view of activity recorded by this prototype.", practice_now:"🧠 Practice now", cognitive_activity:"🧠 Cognitive activity", current_streak:"🔥 Current streak", current_score:"Current score", performance_desc:"Your current prototype activity score.", keep_simple:"Keep it simple.",
    keep_simple_desc:"Short, regular activities are easier to follow than a crowded screen.", todays_focus:"Today's focus", activity_available:"Activity available", activity_available_desc:"Try one memory game when you're ready.", offline_storage:"Offline storage", offline_storage_desc:"Current prototype data is stored in this browser.",
    dashboard_demo:"Important: this dashboard shows prototype activity metrics. It should not be interpreted as a medical assessment or dementia diagnosis.", caregiver_desc:"A more information-focused view for family or care teams.", patient_view:"← Patient view", patient_overview:"Patient activity overview", patient_overview_desc:"Use the information below to understand engagement with the MINDMATE prototype.",
    recorded_correct:"Recorded correct answers", activity:"📅 Activity", today:"Today", latest_activity:"Latest local activity view", storage:"📴 Storage", local:"Local", storage_proto:"Browser storage in prototype", cognitive_desc:"Activity categories can be expanded as the project grows.",
    memory:"Memory", memory_desc:"Number-sequence activity is available.", recognition:"Recognition", recognition_desc:"Object-memory activity is available.", adaptive:"Adaptive difficulty", adaptive_desc:"Not currently implemented as production AI; keep any adaptive behavior labeled as prototype.", alerts_routine:"Alerts & routine", hydration:"Hydration", caregiver_demo:"Caregiver view is monitoring-oriented, but the current prototype does not establish clinical risk, diagnosis, or a real remote-sync service.",
    profile_desc:"Keep your basic details and family contacts available on this device.", shown_medicine:"8:00 AM reminder shown.", shown_hydration:"10:00 AM reminder shown.", shown_brain:"6:00 PM reminder shown.", brain_activity_label:"Brain activity", medicine_label:"Medicine", water_label:"Water",
    time_8am:"8:00 AM", time_10am:"10:00 AM", time_6pm:"6:00 PM", microphone_alt:"Voice assistant microphone", aria_enter_number:"Enter the remembered number", aria_enter_objects:"Enter the remembered objects", performance_aria:"Performance"
  },
  ta: {
    time_am:"காலை", time_pm:"மாலை",
    site_title:"MINDMATE - SIH 26003", language_label:"மொழியைத் தேர்ந்தெடுக்கவும்", main_navigation:"முதன்மை வழிசெலுத்தல்", todays_status:"இன்றைய நிலை",
    language_english:"ஆங்கிலம்", language_tamil:"தமிழ்", language_hindi:"இந்தி", language_malayalam:"மலையாளம்", language_telugu:"தெலுங்கு", language_kannada:"கன்னடம்",
    brand_sub:"உங்கள் அறிவாற்றல் பராமரிப்பு துணை", eyebrow:"🌿 எளிமை. ஆதரவு. தனிப்பட்டது.", hero_start:"🧠 இன்றைய செயல்பாட்டைத் தொடங்குங்கள்", talk_mindmate:"🎤 MINDMATE உடன் பேசுங்கள்", one_step:"ஒரு படியாக முன்னேறுங்கள்",
    one_step_desc:"சிறிய செயல்பாட்டை செய்யுங்கள், நினைவூட்டல்களைப் பாருங்கள் அல்லது MINDMATE உடன் பேசுங்கள். சிக்கலான செயலியை கற்றுக்கொள்ள தேவையில்லை.", checkin_title:"இன்றைய எளிய சரிபார்ப்பு", checkin_desc:"முக்கியமான அனைத்தும் ஒரே இடத்தில்.", offline_ready:"ஆஃப்லைனில் தயாராக உள்ளது", saved_device:"சாதனத்தில் சேமிக்கப்பட்டது", what_do:"நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?", choose_action:"ஒரு எளிய செயல்பாட்டைத் தேர்ந்தெடுக்கவும்.", play_game:"ஒரு விளையாட்டை விளையாடுங்கள்", play_game_desc:"எளிதாக பின்பற்றக்கூடிய சிறிய நினைவக செயல்பாடுகள்.", talk_desc:"மதிப்பெண், நினைவூட்டல்கள் அல்லது உதவி பற்றி இயல்பாகப் பேசுங்கள்.", my_reminders:"எனது நினைவூட்டல்கள்", my_reminders_desc:"இன்றைய மருந்து, தண்ணீர் மற்றும் மூளை செயல்பாட்டு நினைவூட்டல்களைப் பாருங்கள்.", voice_help:"தட்டச்சு தேவையில்லை. மைக்ரோஃபோனைத் தட்டி நீங்கள் தேர்ந்தெடுத்த மொழியில் பேசுங்கள்.", change_photo:"📷 புகைப்படத்தை மாற்று", family_desc:"பரிச்சயமான முகங்கள் அனுபவத்தை தனிப்பட்டதாக மாற்றலாம்.", games_desc:"நினைவு மற்றும் அடையாளம் காண சிறிய செயல்பாடுகள்.", home:"← முகப்பு", memory_goal:"நினைவு", recognition_goal:"அடையாளம் காணுதல்", game_instruction_seq:"தொடங்கு என்பதை அழுத்தி, எண்ணை நினைவில் வைத்து, பின்னர் உள்ளிடுங்கள்.", object_instruction:"தொடங்கு என்பதை அழுத்தி பொருட்களை நினைவில் வையுங்கள்.", demo_games:"முன்மாதிரி குறிப்பு: தற்போதைய மதிப்பெண் மற்றும் விளையாட்டு தர்க்கம் விளக்கத்திற்கானவை. இவை மருத்துவ நோயறிதல் அல்லது சரிபார்க்கப்பட்ட அறிவாற்றல் மதிப்பீடு அல்ல.", reminders_desc:"இன்றைய வழக்கத்திற்கான எளிய நினைவூட்டல்கள்.", medicine_time:"காலை 8:00 · மருந்து", water_time:"காலை 10:00 · தண்ணீர்", brain_time:"மாலை 6:00 · மூளை செயல்பாடு", appointment:"சந்திப்பு", appointment_desc:"வரவிருக்கும் மருத்துவ சந்திப்புகளை எளிதாக நினைவில் வைக்கவும்.", add_reminder:"➕ நினைவூட்டலைச் சேர்", custom_reminders:"தனிப்பயன் நினைவூட்டல்கள்", reminder_title_label:"நினைவூட்டல் தலைப்பு", reminder_title_placeholder:"நினைவூட்டல் பெயரை உள்ளிடவும்", reminder_time_label:"நேரம்", save_reminder:"💾 நினைவூட்டலைச் சேமி", cancel:"ரத்து செய்", delete:"நீக்கு", no_custom_reminders:"தனிப்பயன் நினைவூட்டல்கள் இன்னும் இல்லை.", reminder_demo:"இங்கு காட்டப்படும் நினைவூட்டல்கள் தற்போதைய முன்மாதிரியின் பகுதி. பயன்பாடு செயல்படுத்தாத முழு திட்டமிட்ட அறிவிப்புகள் அல்லது நிறைவு ஒத்திசைவு குறித்து எந்தக் கூற்றும் இல்லை.", reminder_required:"நினைவூட்டல் தலைப்பையும் நேரத்தையும் உள்ளிடவும்.", reminder_saved:"நினைவூட்டல் வெற்றிகரமாக சேமிக்கப்பட்டது!", reminder_deleted:"நினைவூட்டல் நீக்கப்பட்டது.", dashboard_desc:"இந்த முன்மாதிரி பதிவு செய்த செயல்பாடுகளின் எளிய காட்சி.", practice_now:"🧠 இப்போது பயிற்சி", cognitive_activity:"🧠 அறிவாற்றல் செயல்பாடு", current_streak:"🔥 தற்போதைய தொடர்ச்சி", current_score:"தற்போதைய மதிப்பெண்", performance_desc:"உங்கள் தற்போதைய முன்மாதிரி செயல்பாட்டு மதிப்பெண்.", keep_simple:"எளிமையாக வைத்துக்கொள்ளுங்கள்.", keep_simple_desc:"சிறிய, வழக்கமான செயல்பாடுகள் அதிகமாக நிரம்பிய திரையை விட எளிதாகப் பின்பற்றலாம்.", todays_focus:"இன்றைய கவனம்", activity_available:"செயல்பாடு உள்ளது", activity_available_desc:"தயாராக இருக்கும்போது ஒரு நினைவு விளையாட்டை முயற்சிக்கவும்.", offline_storage:"ஆஃப்லைன் சேமிப்பு", offline_storage_desc:"தற்போதைய முன்மாதிரி தரவு இந்த உலாவியில் சேமிக்கப்படுகிறது.", dashboard_demo:"முக்கியம்: இந்த டாஷ்போர்டு முன்மாதிரி செயல்பாட்டு அளவீடுகளைக் காட்டுகிறது. இதை மருத்துவ மதிப்பீடாகவோ டிமென்ஷியா நோயறிதலாகவோ கருத வேண்டாம்.", caregiver_desc:"குடும்பம் அல்லது பராமரிப்பு குழுக்களுக்கான தகவல் மையமான காட்சி.", patient_view:"← நோயாளி காட்சி", patient_overview:"நோயாளி செயல்பாட்டு கண்ணோட்டம்", patient_overview_desc:"MINDMATE முன்மாதிரியுடன் உள்ள ஈடுபாட்டைப் புரிந்துகொள்ள கீழே உள்ள தகவலைப் பயன்படுத்தவும்.", recorded_correct:"பதிவு செய்யப்பட்ட சரியான பதில்கள்", activity:"📅 செயல்பாடு", today:"இன்று", latest_activity:"சமீபத்திய உள்ளூர் செயல்பாட்டு காட்சி", storage:"📴 சேமிப்பு", local:"உள்ளூர்", storage_proto:"முன்மாதிரியில் உலாவி சேமிப்பு", cognitive_desc:"திட்டம் வளரும்போது செயல்பாட்டு வகைகளை விரிவுபடுத்தலாம்.", memory:"நினைவு", memory_desc:"எண் வரிசை செயல்பாடு உள்ளது.", recognition:"அடையாளம் காணுதல்", recognition_desc:"பொருள் நினைவு செயல்பாடு உள்ளது.", adaptive:"மாற்றியமைக்கும் சிரமம்", adaptive_desc:"தற்போது உற்பத்தி AI ஆக செயல்படுத்தப்படவில்லை; மாற்றியமைக்கும் செயல்பாடு முன்மாதிரி என குறிப்பிடப்பட வேண்டும்.", alerts_routine:"எச்சரிக்கைகள் & வழக்கம்", hydration:"நீர்ச்சத்து", caregiver_demo:"பராமரிப்பாளர் காட்சி கண்காணிப்புக்கானது; இது மருத்துவ ஆபத்து, நோயறிதல் அல்லது உண்மையான தொலைநிலை ஒத்திசைவு சேவையை உறுதி செய்யாது.", profile_desc:"உங்கள் அடிப்படை விவரங்களையும் குடும்ப தொடர்புகளையும் இந்த சாதனத்தில் வைத்திருக்கவும்.", shown_medicine:"காலை 8:00 நினைவூட்டல் காட்டப்படுகிறது.", shown_hydration:"காலை 10:00 நினைவூட்டல் காட்டப்படுகிறது.", shown_brain:"மாலை 6:00 நினைவூட்டல் காட்டப்படுகிறது.", brain_activity_label:"மூளை செயல்பாடு", medicine_label:"மருந்து", water_label:"தண்ணீர்", time_8am:"காலை 8:00", time_10am:"காலை 10:00", time_6pm:"மாலை 6:00", microphone_alt:"குரல் உதவியாளர் மைக்ரோஃபோன்", aria_enter_number:"நினைவில் வைத்த எண்ணை உள்ளிடவும்", aria_enter_objects:"நினைவில் வைத்த பொருட்களை உள்ளிடவும்", performance_aria:"செயல்திறன்"
  },
  hi: {
    time_am:"पूर्वाह्न", time_pm:"अपराह्न",
    site_title:"MINDMATE - SIH 26003", language_label:"भाषा चुनें", main_navigation:"मुख्य नेविगेशन", todays_status:"आज की स्थिति", language_english:"अंग्रेज़ी", language_tamil:"तमिल", language_hindi:"हिन्दी", language_malayalam:"मलयालम", language_telugu:"तेलुगु", language_kannada:"कन्नड़", brand_sub:"आपका संज्ञानात्मक देखभाल साथी", eyebrow:"🌿 सरल। सहायक। व्यक्तिगत।", hero_start:"🧠 आज की गतिविधि शुरू करें", talk_mindmate:"🎤 MINDMATE से बात करें", one_step:"एक कदम एक समय में", one_step_desc:"एक छोटी गतिविधि करें, रिमाइंडर देखें या MINDMATE से बात करें। आपको जटिल ऐप सीखने की जरूरत नहीं है।", checkin_title:"आज की आसान जाँच", checkin_desc:"जरूरी सब कुछ एक जगह रखा गया है।", offline_ready:"ऑफ़लाइन तैयार", saved_device:"डिवाइस पर सेव", what_do:"आप क्या करना चाहेंगे?", choose_action:"एक आसान गतिविधि चुनें।", play_game:"गेम खेलें", play_game_desc:"आसान छोटे स्मृति अभ्यास।", talk_desc:"अपने स्कोर, रिमाइंडर या मदद के बारे में स्वाभाविक रूप से पूछें।", my_reminders:"मेरे रिमाइंडर", my_reminders_desc:"आज के दवा, पानी और मस्तिष्क गतिविधि रिमाइंडर देखें।", voice_help:"टाइप करने की जरूरत नहीं। माइक्रोफोन दबाएँ और चुनी हुई भाषा में बोलें।", change_photo:"📷 फोटो बदलें", family_desc:"परिचित चेहरे अनुभव को अधिक व्यक्तिगत बना सकते हैं।", games_desc:"स्मृति और पहचान के लिए छोटे अभ्यास।", home:"← होम", memory_goal:"स्मृति", recognition_goal:"पहचान", game_instruction_seq:"स्टार्ट दबाएँ, संख्या याद रखें और फिर उसे दर्ज करें।", object_instruction:"स्टार्ट दबाएँ और वस्तुओं को याद रखें।", demo_games:"प्रोटोटाइप नोट: वर्तमान स्कोर और गेम लॉजिक प्रदर्शन के लिए हैं। यह चिकित्सा निदान या मान्य संज्ञानात्मक मूल्यांकन नहीं है।", reminders_desc:"आज की दिनचर्या के लिए सरल रिमाइंडर।", medicine_time:"सुबह 8:00 · दवा", water_time:"सुबह 10:00 · पानी", brain_time:"शाम 6:00 · मस्तिष्क गतिविधि", appointment:"अपॉइंटमेंट", appointment_desc:"आने वाली चिकित्सा अपॉइंटमेंट आसानी से याद रखें।", add_reminder:"➕ रिमाइंडर जोड़ें", custom_reminders:"कस्टम रिमाइंडर", reminder_title_label:"रिमाइंडर शीर्षक", reminder_title_placeholder:"रिमाइंडर नाम दर्ज करें", reminder_time_label:"समय", save_reminder:"💾 रिमाइंडर सेव करें", cancel:"रद्द करें", delete:"हटाएँ", no_custom_reminders:"अभी कोई कस्टम रिमाइंडर नहीं है।", reminder_demo:"यहाँ दिखाए गए रिमाइंडर वर्तमान प्रोटोटाइप का हिस्सा हैं। पूरी निर्धारित सूचनाएँ और पूर्णता सिंक तभी माने जाएँ जब ऐप में लागू हों।", reminder_required:"रिमाइंडर का नाम और समय दोनों दर्ज करें।", reminder_saved:"रिमाइंडर सफलतापूर्वक सेव हुआ!", reminder_deleted:"रिमाइंडर हटा दिया गया।", dashboard_desc:"इस प्रोटोटाइप द्वारा रिकॉर्ड की गई गतिविधि का सरल दृश्य।", practice_now:"🧠 अभी अभ्यास करें", cognitive_activity:"🧠 संज्ञानात्मक गतिविधि", current_streak:"🔥 वर्तमान स्ट्रीक", current_score:"वर्तमान स्कोर", performance_desc:"आपका वर्तमान प्रोटोटाइप गतिविधि स्कोर।", keep_simple:"इसे सरल रखें।", keep_simple_desc:"छोटी, नियमित गतिविधियाँ भीड़भरी स्क्रीन की तुलना में आसान होती हैं।", todays_focus:"आज का ध्यान", activity_available:"गतिविधि उपलब्ध", activity_available_desc:"जब तैयार हों तो एक स्मृति गेम आज़माएँ।", offline_storage:"ऑफ़लाइन स्टोरेज", offline_storage_desc:"वर्तमान प्रोटोटाइप डेटा इस ब्राउज़र में सेव है।", dashboard_demo:"महत्वपूर्ण: यह डैशबोर्ड प्रोटोटाइप गतिविधि मेट्रिक्स दिखाता है। इसे चिकित्सा मूल्यांकन या डिमेंशिया निदान न मानें।", caregiver_desc:"परिवार या देखभाल टीमों के लिए अधिक जानकारी-केंद्रित दृश्य।", patient_view:"← रोगी दृश्य", patient_overview:"रोगी गतिविधि अवलोकन", patient_overview_desc:"MINDMATE प्रोटोटाइप के साथ सहभागिता समझने के लिए नीचे की जानकारी का उपयोग करें।", recorded_correct:"रिकॉर्ड किए गए सही उत्तर", activity:"📅 गतिविधि", today:"आज", latest_activity:"नवीनतम स्थानीय गतिविधि दृश्य", storage:"📴 स्टोरेज", local:"स्थानीय", storage_proto:"प्रोटोटाइप में ब्राउज़र स्टोरेज", cognitive_desc:"प्रोजेक्ट बढ़ने पर गतिविधि श्रेणियाँ बढ़ाई जा सकती हैं।", memory:"स्मृति", memory_desc:"संख्या-अनुक्रम गतिविधि उपलब्ध है।", recognition:"पहचान", recognition_desc:"वस्तु-स्मृति गतिविधि उपलब्ध है।", adaptive:"अनुकूली कठिनाई", adaptive_desc:"अभी उत्पादन AI के रूप में लागू नहीं है; अनुकूली व्यवहार को प्रोटोटाइप के रूप में ही रखें।", alerts_routine:"अलर्ट और दिनचर्या", hydration:"जलयोजन", caregiver_demo:"देखभालकर्ता दृश्य निगरानी के लिए है; यह चिकित्सीय जोखिम, निदान या वास्तविक रिमोट सिंक सेवा स्थापित नहीं करता।", profile_desc:"अपनी बुनियादी जानकारी और परिवार के संपर्क इस डिवाइस पर रखें।", shown_medicine:"सुबह 8:00 का रिमाइंडर दिखाया गया है।", shown_hydration:"सुबह 10:00 का रिमाइंडर दिखाया गया है।", shown_brain:"शाम 6:00 का रिमाइंडर दिखाया गया है।", brain_activity_label:"मस्तिष्क गतिविधि", medicine_label:"दवा", water_label:"पानी", time_8am:"सुबह 8:00", time_10am:"सुबह 10:00", time_6pm:"शाम 6:00", microphone_alt:"वॉइस असिस्टेंट माइक्रोफोन", aria_enter_number:"याद की गई संख्या दर्ज करें", aria_enter_objects:"याद की गई वस्तुएँ दर्ज करें", performance_aria:"प्रदर्शन"
  },
  ml: {
    time_am:"AM", time_pm:"PM",
    site_title:"MINDMATE - SIH 26003", language_label:"ഭാഷ തിരഞ്ഞെടുക്കുക", main_navigation:"പ്രധാന നാവിഗേഷൻ", todays_status:"ഇന്നത്തെ നില", language_english:"ഇംഗ്ലീഷ്", language_tamil:"തമിഴ്", language_hindi:"ഹിന്ദി", language_malayalam:"മലയാളം", language_telugu:"തെലുങ്ക്", language_kannada:"കന്നഡ", brand_sub:"നിങ്ങളുടെ ബുദ്ധിശേഷി പരിചരണ കൂട്ടായി", eyebrow:"🌿 ലളിതം. പിന്തുണ. വ്യക്തിപരം.", hero_start:"🧠 ഇന്നത്തെ പ്രവർത്തനം ആരംഭിക്കുക", talk_mindmate:"🎤 MINDMATE-നോട് സംസാരിക്കുക", one_step:"ഒരു ഘട്ടം വീതം", one_step_desc:"ഒരു ചെറിയ പ്രവർത്തനം ചെയ്യുക, ഓർമ്മപ്പെടുത്തലുകൾ പരിശോധിക്കുക, അല്ലെങ്കിൽ MINDMATE-നോട് സംസാരിക്കുക. സങ്കീർണ്ണമായ ആപ്പ് പഠിക്കേണ്ടതില്ല.", checkin_title:"ഇന്നത്തെ ലളിതമായ പരിശോധന", checkin_desc:"പ്രധാനപ്പെട്ട എല്ലാം ഒരിടത്ത് സൂക്ഷിച്ചിരിക്കുന്നു.", offline_ready:"ഓഫ്‌ലൈൻ തയ്യാറാണ്", saved_device:"ഉപകരണത്തിൽ സംരക്ഷിച്ചു", what_do:"നിങ്ങൾ എന്ത് ചെയ്യാൻ ആഗ്രഹിക്കുന്നു?", choose_action:"ഒരു ലളിതമായ പ്രവർത്തനം തിരഞ്ഞെടുക്കുക.", play_game:"ഒരു ഗെയിം കളിക്കുക", play_game_desc:"എളുപ്പത്തിൽ പിന്തുടരാവുന്ന ചെറിയ ഓർമ്മ പ്രവർത്തനങ്ങൾ.", talk_desc:"നിങ്ങളുടെ സ്കോർ, ഓർമ്മപ്പെടുത്തലുകൾ അല്ലെങ്കിൽ സഹായം ചോദിക്കാൻ സ്വാഭാവികമായി സംസാരിക്കുക.", my_reminders:"എന്റെ ഓർമ്മപ്പെടുത്തലുകൾ", my_reminders_desc:"ഇന്നത്തെ മരുന്ന്, വെള്ളം, മസ്തിഷ്ക പ്രവർത്തന ഓർമ്മപ്പെടുത്തലുകൾ കാണുക.", voice_help:"ടൈപ്പ് ചെയ്യേണ്ടതില്ല. മൈക്രോഫോൺ അമർത്തി തിരഞ്ഞെടുത്ത ഭാഷയിൽ സംസാരിക്കുക.", change_photo:"📷 ഫോട്ടോ മാറ്റുക", family_desc:"പരിചിതമായ മുഖങ്ങൾ അനുഭവം കൂടുതൽ വ്യക്തിപരമാക്കാം.", games_desc:"ഓർമ്മയ്ക്കും തിരിച്ചറിയലിനുമുള്ള ചെറിയ പ്രവർത്തനങ്ങൾ.", home:"← ഹോം", memory_goal:"ഓർമ്മ", recognition_goal:"തിരിച്ചറിയൽ", game_instruction_seq:"ആരംഭിക്കുക അമർത്തി നമ്പർ ഓർമ്മിച്ച് പിന്നീട് നൽകുക.", object_instruction:"ആരംഭിക്കുക അമർത്തി വസ്തുക്കൾ ഓർമ്മിക്കുക.", demo_games:"പ്രോട്ടോടൈപ്പ് കുറിപ്പ്: നിലവിലെ സ്കോറും ഗെയിം ലൊജിക്കും പ്രദർശനത്തിനുള്ളതാണ്. ഇത് മെഡിക്കൽ രോഗനിർണയമോ സാധൂകരിച്ച ബുദ്ധിശേഷി വിലയിരുത്തലോ അല്ല.", reminders_desc:"ഇന്നത്തെ പതിവിനുള്ള ലളിതമായ ഓർമ്മപ്പെടുത്തലുകൾ.", medicine_time:"രാവിലെ 8:00 · മരുന്ന്", water_time:"രാവിലെ 10:00 · വെള്ളം", brain_time:"വൈകിട്ട് 6:00 · മസ്തിഷ്ക പ്രവർത്തനം", appointment:"അപ്പോയിന്റ്മെന്റ്", appointment_desc:"വരാനിരിക്കുന്ന മെഡിക്കൽ അപ്പോയിന്റ്മെന്റുകൾ എളുപ്പത്തിൽ ഓർമ്മിക്കുക.", add_reminder:"➕ ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക", custom_reminders:"ഇഷ്ടാനുസൃത ഓർമ്മപ്പെടുത്തലുകൾ", reminder_title_label:"ഓർമ്മപ്പെടുത്തൽ തലക്കെട്ട്", reminder_title_placeholder:"ഓർമ്മപ്പെടുത്തൽ പേര് നൽകുക", reminder_time_label:"സമയം", save_reminder:"💾 ഓർമ്മപ്പെടുത്തൽ സംരക്ഷിക്കുക", cancel:"റദ്ദാക്കുക", delete:"നീക്കം ചെയ്യുക", no_custom_reminders:"ഇപ്പോൾ ഇഷ്ടാനുസൃത ഓർമ്മപ്പെടുത്തലുകളില്ല.", reminder_demo:"ഇവിടെ കാണിക്കുന്ന ഓർമ്മപ്പെടുത്തലുകൾ നിലവിലെ പ്രോട്ടോടൈപ്പിന്റെ ഭാഗമാണ്. ആപ്പിൽ നടപ്പാക്കിയിട്ടില്ലെങ്കിൽ പൂർണ്ണ ഷെഡ്യൂൾ ചെയ്ത അറിയിപ്പുകളോ പൂർത്തീകരണ സിങ്കിംഗോ അവകാശപ്പെടുന്നില്ല.", reminder_required:"ഓർമ്മപ്പെടുത്തലിന്റെ പേരും സമയവും നൽകുക.", reminder_saved:"ഓർമ്മപ്പെടുത്തൽ വിജയകരമായി സംരക്ഷിച്ചു!", reminder_deleted:"ഓർമ്മപ്പെടുത്തൽ നീക്കം ചെയ്തു.", dashboard_desc:"ഈ പ്രോട്ടോടൈപ്പ് രേഖപ്പെടുത്തിയ പ്രവർത്തനത്തിന്റെ ലളിതമായ കാഴ്ച.", practice_now:"🧠 ഇപ്പോൾ പരിശീലിക്കുക", cognitive_activity:"🧠 ബുദ്ധിശേഷി പ്രവർത്തനം", current_streak:"🔥 നിലവിലെ തുടർച്ച", current_score:"നിലവിലെ സ്കോർ", performance_desc:"നിങ്ങളുടെ നിലവിലെ പ്രോട്ടോടൈപ്പ് പ്രവർത്തന സ്കോർ.", keep_simple:"ലളിതമായി സൂക്ഷിക്കുക.", keep_simple_desc:"ചെറിയ, സ്ഥിരമായ പ്രവർത്തനങ്ങൾ തിരക്കേറിയ സ്ക്രീനിനേക്കാൾ പിന്തുടരാൻ എളുപ്പമാണ്.", todays_focus:"ഇന്നത്തെ ശ്രദ്ധ", activity_available:"പ്രവർത്തനം ലഭ്യമാണ്", activity_available_desc:"തയ്യാറാകുമ്പോൾ ഒരു ഓർമ്മ ഗെയിം പരീക്ഷിക്കുക.", offline_storage:"ഓഫ്‌ലൈൻ സംഭരണം", offline_storage_desc:"നിലവിലെ പ്രോട്ടോടൈപ്പ് ഡാറ്റ ഈ ബ്രൗസറിൽ സൂക്ഷിക്കുന്നു.", dashboard_demo:"പ്രധാനമാണ്: ഈ ഡാഷ്ബോർഡ് പ്രോട്ടോടൈപ്പ് പ്രവർത്തന അളവുകൾ കാണിക്കുന്നു. ഇത് മെഡിക്കൽ വിലയിരുത്തലോ ഡിമെൻഷ്യ രോഗനിർണയമോ ആയി കാണരുത്.", caregiver_desc:"കുടുംബത്തിനോ പരിചരണ സംഘങ്ങൾക്കോ കൂടുതൽ വിവര കേന്ദ്രീകൃത കാഴ്ച.", patient_view:"← രോഗി കാഴ്ച", patient_overview:"രോഗിയുടെ പ്രവർത്തന അവലോകനം", patient_overview_desc:"MINDMATE പ്രോട്ടോടൈപ്പുമായുള്ള ഇടപെടൽ മനസ്സിലാക്കാൻ താഴെയുള്ള വിവരങ്ങൾ ഉപയോഗിക്കുക.", recorded_correct:"രേഖപ്പെടുത്തിയ ശരിയായ ഉത്തരങ്ങൾ", activity:"📅 പ്രവർത്തനം", today:"ഇന്ന്", latest_activity:"ഏറ്റവും പുതിയ പ്രാദേശിക പ്രവർത്തന കാഴ്ച", storage:"📴 സംഭരണം", local:"പ്രാദേശികം", storage_proto:"പ്രോട്ടോടൈപ്പിലെ ബ്രൗസർ സംഭരണം", cognitive_desc:"പദ്ധതി വളരുമ്പോൾ പ്രവർത്തന വിഭാഗങ്ങൾ വികസിപ്പിക്കാം.", memory:"ഓർമ്മ", memory_desc:"നമ്പർ ക്രമ പ്രവർത്തനം ലഭ്യമാണ്.", recognition:"തിരിച്ചറിയൽ", recognition_desc:"വസ്തു ഓർമ്മ പ്രവർത്തനം ലഭ്യമാണ്.", adaptive:"അനുസരണീയ ബുദ്ധിമുട്ട്", adaptive_desc:"നിലവിൽ പ്രൊഡക്ഷൻ AI ആയി നടപ്പാക്കിയിട്ടില്ല; അനുസരണീയ പെരുമാറ്റം പ്രോട്ടോടൈപ്പ് എന്ന് വ്യക്തമാക്കുക.", alerts_routine:"അറിയിപ്പുകളും പതിവും", hydration:"ജലാംശം", caregiver_demo:"പരിചരണ കാഴ്ച നിരീക്ഷണത്തിനുള്ളതാണ്; ഇത് ക്ലിനിക്കൽ അപകടം, രോഗനിർണയം അല്ലെങ്കിൽ യഥാർത്ഥ റിമോട്ട് സിങ്ക് സേവനം സ്ഥാപിക്കുന്നില്ല.", profile_desc:"നിങ്ങളുടെ അടിസ്ഥാന വിവരങ്ങളും കുടുംബ ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും ഈ ഉപകരണത്തിൽ സൂക്ഷിക്കുക.", shown_medicine:"രാവിലെ 8:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.", shown_hydration:"രാവിലെ 10:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.", shown_brain:"വൈകിട്ട് 6:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.", brain_activity_label:"മസ്തിഷ്ക പ്രവർത്തനം", medicine_label:"മരുന്ന്", water_label:"വെള്ളം", time_8am:"രാവിലെ 8:00", time_10am:"രാവിലെ 10:00", time_6pm:"വൈകിട്ട് 6:00", microphone_alt:"വോയ്സ് അസിസ്റ്റന്റ് മൈക്രോഫോൺ", aria_enter_number:"ഓർമ്മിച്ച നമ്പർ നൽകുക", aria_enter_objects:"ഓർമ്മിച്ച വസ്തുക്കൾ നൽകുക", performance_aria:"പ്രകടനം"
  },
  te: {
    time_am:"AM", time_pm:"PM",
    site_title:"MINDMATE - SIH 26003", language_label:"భాషను ఎంచుకోండి", main_navigation:"ప్రధాన నావిగేషన్", todays_status:"ఈరోజు స్థితి", language_english:"ఆంగ్లం", language_tamil:"తమిళం", language_hindi:"హిందీ", language_malayalam:"మలయాళం", language_telugu:"తెలుగు", language_kannada:"కన్నడ", brand_sub:"మీ జ్ఞాన సంరక్షణ సహచరి", eyebrow:"🌿 సరళం. సహాయకం. వ్యక్తిగతం.", hero_start:"🧠 ఈరోజు కార్యకలాపాన్ని ప్రారంభించండి", talk_mindmate:"🎤 MINDMATEతో మాట్లాడండి", one_step:"ఒక్కో అడుగు చొప్పున", one_step_desc:"చిన్న కార్యకలాపం చేయండి, రిమైండర్లను చూడండి లేదా MINDMATEతో మాట్లాడండి. క్లిష్టమైన యాప్ నేర్చుకోవాల్సిన అవసరం లేదు.", checkin_title:"ఈరోజు సులభమైన చెక్-ఇన్", checkin_desc:"ముఖ్యమైనవన్నీ ఒకే చోట ఉన్నాయి.", offline_ready:"ఆఫ్‌లైన్ సిద్ధంగా ఉంది", saved_device:"పరికరంలో సేవ్ చేయబడింది", what_do:"మీరు ఏమి చేయాలనుకుంటున్నారు?", choose_action:"ఒక సులభమైన చర్యను ఎంచుకోండి.", play_game:"గేమ్ ఆడండి", play_game_desc:"సులభంగా అనుసరించగల చిన్న జ్ఞాపక కార్యకలాపాలు.", talk_desc:"మీ స్కోర్, రిమైండర్లు లేదా సహాయం గురించి సహజంగా అడగండి.", my_reminders:"నా రిమైండర్లు", my_reminders_desc:"ఈరోజు మందు, నీరు మరియు మెదడు కార్యకలాప రిమైండర్లను చూడండి.", voice_help:"టైప్ చేయాల్సిన అవసరం లేదు. మైక్రోఫోన్ నొక్కి ఎంచుకున్న భాషలో మాట్లాడండి.", change_photo:"📷 ఫోటో మార్చండి", family_desc:"పరిచయమైన ముఖాలు అనుభవాన్ని మరింత వ్యక్తిగతంగా చేయగలవు.", games_desc:"జ్ఞాపకం మరియు గుర్తింపుకు చిన్న కార్యకలాపాలు.", home:"← హోమ్", memory_goal:"జ్ఞాపకం", recognition_goal:"గుర్తింపు", game_instruction_seq:"ప్రారంభించండి నొక్కి, సంఖ్యను గుర్తుంచుకుని, తర్వాత నమోదు చేయండి.", object_instruction:"ప్రారంభించండి నొక్కి వస్తువులను గుర్తుంచుకోండి.", demo_games:"ప్రోటోటైప్ గమనిక: ప్రస్తుత స్కోర్ మరియు గేమ్ లాజిక్ ప్రదర్శన కోసం మాత్రమే. ఇది వైద్య నిర్ధారణ లేదా ధృవీకరించబడిన జ్ఞాన పరీక్ష కాదు.", reminders_desc:"ఈరోజు దినచర్య కోసం సులభమైన రిమైండర్లు.", medicine_time:"ఉదయం 8:00 · మందు", water_time:"ఉదయం 10:00 · నీరు", brain_time:"సాయంత్రం 6:00 · మెదడు కార్యకలాపం", appointment:"అపాయింట్‌మెంట్", appointment_desc:"రాబోయే వైద్య అపాయింట్‌మెంట్లను సులభంగా గుర్తుంచుకోండి.", add_reminder:"➕ రిమైండర్ జోడించండి", custom_reminders:"కస్టమ్ రిమైండర్లు", reminder_title_label:"రిమైండర్ శీర్షిక", reminder_title_placeholder:"రిమైండర్ పేరు నమోదు చేయండి", reminder_time_label:"సమయం", save_reminder:"💾 రిమైండర్ సేవ్ చేయండి", cancel:"రద్దు", delete:"తొలగించండి", no_custom_reminders:"ఇంకా కస్టమ్ రిమైండర్లు లేవు.", reminder_demo:"ఇక్కడ చూపించే రిమైండర్లు ప్రస్తుత ప్రోటోటైప్‌లో భాగం. యాప్‌లో అమలు చేయనంతవరకు పూర్తి షెడ్యూల్ నోటిఫికేషన్లు లేదా పూర్తి చేసిన డేటా సమకాలీకరణను ప్రకటించము.", reminder_required:"రిమైండర్ పేరు మరియు సమయం రెండూ నమోదు చేయండి.", reminder_saved:"రిమైండర్ విజయవంతంగా సేవ్ చేయబడింది!", reminder_deleted:"రిమైండర్ తొలగించబడింది.", dashboard_desc:"ఈ ప్రోటోటైప్ నమోదు చేసిన కార్యకలాపానికి సులభమైన దృశ్యం.", practice_now:"🧠 ఇప్పుడే సాధన చేయండి", cognitive_activity:"🧠 జ్ఞాన కార్యకలాపం", current_streak:"🔥 ప్రస్తుత స్ట్రీక్", current_score:"ప్రస్తుత స్కోర్", performance_desc:"మీ ప్రస్తుత ప్రోటోటైప్ కార్యకలాప స్కోర్.", keep_simple:"సులభంగా ఉంచండి.", keep_simple_desc:"చిన్న, క్రమమైన కార్యకలాపాలు నిండిన స్క్రీన్ కంటే అనుసరించడానికి సులభం.", todays_focus:"ఈరోజు దృష్టి", activity_available:"కార్యకలాపం అందుబాటులో ఉంది", activity_available_desc:"సిద్ధంగా ఉన్నప్పుడు ఒక మెమరీ గేమ్ ప్రయత్నించండి.", offline_storage:"ఆఫ్‌లైన్ నిల్వ", offline_storage_desc:"ప్రస్తుత ప్రోటోటైప్ డేటా ఈ బ్రౌజర్‌లో నిల్వ చేయబడుతుంది.", dashboard_demo:"ముఖ్యం: ఈ డాష్‌బోర్డ్ ప్రోటోటైప్ కార్యకలాప మెట్రిక్‌లను చూపిస్తుంది. దీన్ని వైద్య అంచనా లేదా డిమెన్షియా నిర్ధారణగా భావించకండి.", caregiver_desc:"కుటుంబం లేదా సంరక్షణ బృందాల కోసం ఎక్కువ సమాచారంతో కూడిన దృశ్యం.", patient_view:"← రోగి దృశ్యం", patient_overview:"రోగి కార్యకలాప అవలోకనం", patient_overview_desc:"MINDMATE ప్రోటోటైప్‌తో పాల్గొనడాన్ని అర్థం చేసుకోవడానికి దిగువ సమాచారాన్ని ఉపయోగించండి.", recorded_correct:"నమోదైన సరైన సమాధానాలు", activity:"📅 కార్యకలాపం", today:"ఈరోజు", latest_activity:"తాజా స్థానిక కార్యకలాప దృశ్యం", storage:"📴 నిల్వ", local:"స్థానికం", storage_proto:"ప్రోటోటైప్‌లో బ్రౌజర్ నిల్వ", cognitive_desc:"ప్రాజెక్ట్ పెరిగేకొద్దీ కార్యకలాప వర్గాలను విస్తరించవచ్చు.", memory:"మెమరీ", memory_desc:"సంఖ్యా క్రమ కార్యకలాపం అందుబాటులో ఉంది.", recognition:"గుర్తింపు", recognition_desc:"వస్తు మెమరీ కార్యకలాపం అందుబాటులో ఉంది.", adaptive:"అనుకూల కష్టం", adaptive_desc:"ప్రస్తుతం ప్రొడక్షన్ AIగా అమలు కాలేదు; అనుకూల ప్రవర్తనను ప్రోటోటైప్‌గా పేర్కొనండి.", alerts_routine:"అలర్ట్‌లు & దినచర్య", hydration:"హైడ్రేషన్", caregiver_demo:"సంరక్షకుడి దృశ్యం పర్యవేక్షణ కోసం; ఇది క్లినికల్ ప్రమాదం, నిర్ధారణ లేదా నిజమైన రిమోట్ సింక్ సేవను నిర్ధారించదు.", profile_desc:"మీ ప్రాథమిక వివరాలు మరియు కుటుంబ సంప్రదింపు వివరాలను ఈ పరికరంలో ఉంచండి.", shown_medicine:"ఉదయం 8:00 రిమైండర్ చూపబడింది.", shown_hydration:"ఉదయం 10:00 రిమైండర్ చూపబడింది.", shown_brain:"సాయంత్రం 6:00 రిమైండర్ చూపబడింది.", brain_activity_label:"మెదడు కార్యకలాపం", medicine_label:"మందు", water_label:"నీరు", time_8am:"ఉదయం 8:00", time_10am:"ఉదయం 10:00", time_6pm:"సాయంత్రం 6:00", microphone_alt:"వాయిస్ అసిస్టెంట్ మైక్రోఫోన్", aria_enter_number:"గుర్తుంచుకున్న సంఖ్యను నమోదు చేయండి", aria_enter_objects:"గుర్తుంచుకున్న వస్తువులను నమోదు చేయండి", performance_aria:"పనితీరు"
  },
  kn: {
    time_am:"ಪೂರ್ವಾಹ್ನ", time_pm:"ಅಪರಾಹ್ನ",
    site_title:"MINDMATE - SIH 26003", language_label:"ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", main_navigation:"ಮುಖ್ಯ ನ್ಯಾವಿಗೇಶನ್", todays_status:"ಇಂದಿನ ಸ್ಥಿತಿ", language_english:"ಇಂಗ್ಲಿಷ್", language_tamil:"ತಮಿಳು", language_hindi:"ಹಿಂದಿ", language_malayalam:"ಮಲಯಾಳಂ", language_telugu:"ತೆಲುಗು", language_kannada:"ಕನ್ನಡ", brand_sub:"ನಿಮ್ಮ ಜ್ಞಾನಾತ್ಮಕ ಆರೈಕೆ ಸಹಚರಿ", eyebrow:"🌿 ಸರಳ. ಬೆಂಬಲ. ವೈಯಕ್ತಿಕ.", hero_start:"🧠 ಇಂದಿನ ಚಟುವಟಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ", talk_mindmate:"🎤 MINDMATE ಜೊತೆ ಮಾತನಾಡಿ", one_step:"ಒಂದು ಹೆಜ್ಜೆ ಒಂದೇ ಸಮಯದಲ್ಲಿ", one_step_desc:"ಸಣ್ಣ ಚಟುವಟಿಕೆ ಮಾಡಿ, ಜ್ಞಾಪನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ MINDMATE ಜೊತೆ ಮಾತನಾಡಿ. ಸಂಕೀರ್ಣ ಆಪ್ ಕಲಿಯಬೇಕಾಗಿಲ್ಲ.", checkin_title:"ಇಂದಿನ ಸರಳ ಪರಿಶೀಲನೆ", checkin_desc:"ಮುಖ್ಯವಾದ ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿದೆ.", offline_ready:"ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ", saved_device:"ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ", what_do:"ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?", choose_action:"ಒಂದು ಸರಳ ಕ್ರಿಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.", play_game:"ಆಟ ಆಡಿರಿ", play_game_desc:"ಸುಲಭವಾಗಿ ಅನುಸರಿಸಬಹುದಾದ ಸಣ್ಣ ನೆನಪು ಚಟುವಟಿಕೆಗಳು.", talk_desc:"ನಿಮ್ಮ ಸ್ಕೋರ್, ಜ್ಞಾಪನೆಗಳು ಅಥವಾ ಸಹಾಯದ ಬಗ್ಗೆ ಸಹಜವಾಗಿ ಕೇಳಿ.", my_reminders:"ನನ್ನ ಜ್ಞಾಪನೆಗಳು", my_reminders_desc:"ಇಂದಿನ ಔಷಧಿ, ನೀರು ಮತ್ತು ಮೆದುಳಿನ ಚಟುವಟಿಕೆ ಜ್ಞಾಪನೆಗಳನ್ನು ನೋಡಿ.", voice_help:"ಟೈಪ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿ ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ.", change_photo:"📷 ಫೋಟೋ ಬದಲಿಸಿ", family_desc:"ಪರಿಚಿತ ಮುಖಗಳು ಅನುಭವವನ್ನು ಹೆಚ್ಚು ವೈಯಕ್ತಿಕವಾಗಿಸಬಹುದು.", games_desc:"ನೆನಪು ಮತ್ತು ಗುರುತಿಸುವಿಕೆಗಾಗಿ ಸಣ್ಣ ಚಟುವಟಿಕೆಗಳು.", home:"← ಮುಖಪುಟ", memory_goal:"ನೆನಪು", recognition_goal:"ಗುರುತಿಸುವಿಕೆ", game_instruction_seq:"ಪ್ರಾರಂಭಿಸಿ ಒತ್ತಿ, ಸಂಖ್ಯೆಯನ್ನು ನೆನಪಿಟ್ಟು ನಂತರ ನಮೂದಿಸಿ.", object_instruction:"ಪ್ರಾರಂಭಿಸಿ ಒತ್ತಿ ವಸ್ತುಗಳನ್ನು ನೆನಪಿಡಿ.", demo_games:"ಪ್ರೋಟೋಟೈಪ್ ಸೂಚನೆ: ಪ್ರಸ್ತುತ ಸ್ಕೋರ್ ಮತ್ತು ಆಟದ ತರ್ಕ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಥವಾ ಮಾನ್ಯ ಜ್ಞಾನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನವಲ್ಲ.", reminders_desc:"ಇಂದಿನ ದಿನಚರಿಗಾಗಿ ಸರಳ ಜ್ಞಾಪನೆಗಳು.", medicine_time:"ಬೆಳಿಗ್ಗೆ 8:00 · ಔಷಧಿ", water_time:"ಬೆಳಿಗ್ಗೆ 10:00 · ನೀರು", brain_time:"ಸಂಜೆ 6:00 · ಮೆದುಳಿನ ಚಟುವಟಿಕೆ", appointment:"ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್", appointment_desc:"ಮುಂಬರುವ ವೈದ್ಯಕೀಯ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ನೆನಪಿಡಿ.", add_reminder:"➕ ಜ್ಞಾಪನೆ ಸೇರಿಸಿ", custom_reminders:"ಕಸ್ಟಮ್ ಜ್ಞಾಪನೆಗಳು", reminder_title_label:"ಜ್ಞಾಪನೆ ಶೀರ್ಷಿಕೆ", reminder_title_placeholder:"ಜ್ಞಾಪನೆ ಹೆಸರನ್ನು ನಮೂದಿಸಿ", reminder_time_label:"ಸಮಯ", save_reminder:"💾 ಜ್ಞಾಪನೆ ಉಳಿಸಿ", cancel:"ರದ್ದುಮಾಡಿ", delete:"ಅಳಿಸಿ", no_custom_reminders:"ಇನ್ನೂ ಯಾವುದೇ ಕಸ್ಟಮ್ ಜ್ಞಾಪನೆಗಳಿಲ್ಲ.", reminder_demo:"ಇಲ್ಲಿ ತೋರಿಸಲಾದ ಜ್ಞಾಪನೆಗಳು ಪ್ರಸ್ತುತ ಪ್ರೋಟೋಟೈಪ್‌ನ ಭಾಗ. ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಜಾರಿಗೆ ತರದಿದ್ದರೆ ಸಂಪೂರ್ಣ ನಿಗದಿತ ಅಧಿಸೂಚನೆಗಳು ಅಥವಾ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ ಸಿಂಕ್ ಅನ್ನು ಹೇಳಲಾಗುವುದಿಲ್ಲ.", reminder_required:"ಜ್ಞಾಪನೆಯ ಹೆಸರು ಮತ್ತು ಸಮಯ ಎರಡನ್ನೂ ನಮೂದಿಸಿ.", reminder_saved:"ಜ್ಞಾಪನೆ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!", reminder_deleted:"ಜ್ಞಾಪನೆ ಅಳಿಸಲಾಗಿದೆ.", dashboard_desc:"ಈ ಪ್ರೋಟೋಟೈಪ್ ದಾಖಲಿಸಿದ ಚಟುವಟಿಕೆಯ ಸರಳ ದೃಶ್ಯ.", practice_now:"🧠 ಈಗ ಅಭ್ಯಾಸ ಮಾಡಿ", cognitive_activity:"🧠 ಜ್ಞಾನಾತ್ಮಕ ಚಟುವಟಿಕೆ", current_streak:"🔥 ಪ್ರಸ್ತುತ ಸ್ಟ್ರೀಕ್", current_score:"ಪ್ರಸ್ತುತ ಸ್ಕೋರ್", performance_desc:"ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪ್ರೋಟೋಟೈಪ್ ಚಟುವಟಿಕೆ ಸ್ಕೋರ್.", keep_simple:"ಸರಳವಾಗಿರಿಸಿ.", keep_simple_desc:"ಸಣ್ಣ, ನಿಯಮಿತ ಚಟುವಟಿಕೆಗಳು ತುಂಬಿದ ಪರದೆಯಿಗಿಂತ ಅನುಸರಿಸಲು ಸುಲಭ.", todays_focus:"ಇಂದಿನ ಗಮನ", activity_available:"ಚಟುವಟಿಕೆ ಲಭ್ಯವಿದೆ", activity_available_desc:"ಸಿದ್ಧರಾದಾಗ ಒಂದು ಮೆಮೊರಿ ಆಟವನ್ನು ಪ್ರಯತ್ನಿಸಿ.", offline_storage:"ಆಫ್‌ಲೈನ್ ಸಂಗ್ರಹಣೆ", offline_storage_desc:"ಪ್ರಸ್ತುತ ಪ್ರೋಟೋಟೈಪ್ ಡೇಟಾವನ್ನು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.", dashboard_demo:"ಮುಖ್ಯ: ಈ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರೋಟೋಟೈಪ್ ಚಟುವಟಿಕೆ ಮಾಪಕಗಳನ್ನು ತೋರಿಸುತ್ತದೆ. ಇದನ್ನು ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ ಅಥವಾ ಡಿಮೆನ್ಶಿಯಾ ರೋಗನಿರ್ಣಯವೆಂದು ಪರಿಗಣಿಸಬೇಡಿ.", caregiver_desc:"ಕುಟುಂಬ ಅಥವಾ ಆರೈಕೆ ತಂಡಗಳಿಗೆ ಹೆಚ್ಚು ಮಾಹಿತಿ ಕೇಂದ್ರೀಕೃತ ದೃಶ್ಯ.", patient_view:"← ರೋಗಿ ದೃಶ್ಯ", patient_overview:"ರೋಗಿಯ ಚಟುವಟಿಕೆ ಅವಲೋಕನ", patient_overview_desc:"MINDMATE ಪ್ರೋಟೋಟೈಪ್‌ನೊಂದಿಗೆ ತೊಡಗುವಿಕೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಕೆಳಗಿನ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ.", recorded_correct:"ದಾಖಲಿಸಿದ ಸರಿಯಾದ ಉತ್ತರಗಳು", activity:"📅 ಚಟುವಟಿಕೆ", today:"ಇಂದು", latest_activity:"ಇತ್ತೀಚಿನ ಸ್ಥಳೀಯ ಚಟುವಟಿಕೆ ದೃಶ್ಯ", storage:"📴 ಸಂಗ್ರಹಣೆ", local:"ಸ್ಥಳೀಯ", storage_proto:"ಪ್ರೋಟೋಟೈಪ್‌ನಲ್ಲಿ ಬ್ರೌಸರ್ ಸಂಗ್ರಹಣೆ", cognitive_desc:"ಯೋಜನೆ ಬೆಳೆದಂತೆ ಚಟುವಟಿಕೆ ವಿಭಾಗಗಳನ್ನು ವಿಸ್ತರಿಸಬಹುದು.", memory:"ನೆನಪು", memory_desc:"ಸಂಖ್ಯೆ ಅನುಕ್ರಮ ಚಟುವಟಿಕೆ ಲಭ್ಯವಿದೆ.", recognition:"ಗುರುತಿಸುವಿಕೆ", recognition_desc:"ವಸ್ತು-ನೆನಪು ಚಟುವಟಿಕೆ ಲಭ್ಯವಿದೆ.", adaptive:"ಹೊಂದಿಕೊಳ್ಳುವ ಕಷ್ಟ", adaptive_desc:"ಪ್ರಸ್ತುತ ಉತ್ಪಾದನಾ AI ಆಗಿ ಜಾರಿಯಾಗಿಲ್ಲ; ಹೊಂದಿಕೊಳ್ಳುವ ನಡವಳಿಕೆಯನ್ನು ಪ್ರೋಟೋಟೈಪ್ ಎಂದು ಗುರುತಿಸಿ.", alerts_routine:"ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ದಿನಚರಿ", hydration:"ಜಲಾಂಶ", caregiver_demo:"ಆರೈಕೆದಾರರ ದೃಶ್ಯ ಮೇಲ್ವಿಚಾರಣೆಗೆ; ಇದು ಕ್ಲಿನಿಕಲ್ ಅಪಾಯ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ನೈಜ ರಿಮೋಟ್ ಸಿಂಕ್ ಸೇವೆಯನ್ನು ಸ್ಥಾಪಿಸುವುದಿಲ್ಲ.", profile_desc:"ನಿಮ್ಮ ಮೂಲ ವಿವರಗಳು ಮತ್ತು ಕುಟುಂಬ ಸಂಪರ್ಕಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಇರಿಸಿ.", shown_medicine:"ಬೆಳಿಗ್ಗೆ 8:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.", shown_hydration:"ಬೆಳಿಗ್ಗೆ 10:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.", shown_brain:"ಸಂಜೆ 6:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.", brain_activity_label:"ಮೆದುಳಿನ ಚಟುವಟಿಕೆ", medicine_label:"ಔಷಧಿ", water_label:"ನೀರು", time_8am:"ಬೆಳಿಗ್ಗೆ 8:00", time_10am:"ಬೆಳಿಗ್ಗೆ 10:00", time_6pm:"ಸಂಜೆ 6:00", microphone_alt:"ಧ್ವನಿ ಸಹಾಯಕ ಮೈಕ್ರೋಫೋನ್", aria_enter_number:"ನೆನಪಿನಲ್ಲಿರುವ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ", aria_enter_objects:"ನೆನಪಿನಲ್ಲಿರುವ ವಸ್ತುಗಳನ್ನು ನಮೂದಿಸಿ", performance_aria:"ಕಾರ್ಯಕ್ಷಮತೆ"
  }
};

/* Look up a translated string for the current language, falling back to English */
function t(key) {

    const language =
        localStorage.getItem("mindmateLanguage") || "en";

    const texts =
        translations[language] || translations.en;

    return texts[key] || translations.en[key] || "";
}


function changeLanguage(language) {
  if (!translations[language]) language = "en";
  localStorage.setItem("mindmateLanguage", language);
  document.documentElement.lang = language;
  const texts = translations[language] || translations.en;

  const resolve = function(key){
    if (Object.prototype.hasOwnProperty.call(texts,key) && texts[key] !== undefined && texts[key] !== null) return texts[key];
    if (Object.prototype.hasOwnProperty.call(translations.en,key) && translations.en[key] !== undefined && translations.en[key] !== null) {
      console.warn("Missing translation: " + language + "." + key + " — using English fallback");
      return translations.en[key];
    }
    console.warn("Missing translation key: " + key);
    return key;
  };

  document.querySelectorAll("[data-key]").forEach(function(element){
    const key = element.getAttribute("data-key");
    element.textContent = resolve(key);
  });
  document.querySelectorAll("[data-key-placeholder]").forEach(function(element){
    element.placeholder = resolve(element.getAttribute("data-key-placeholder"));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function(element){
    element.setAttribute("aria-label", resolve(element.getAttribute("data-i18n-aria")));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(function(element){
    element.setAttribute("alt", resolve(element.getAttribute("data-i18n-alt")));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(function(element){
    element.setAttribute("title", resolve(element.getAttribute("data-i18n-title")));
  });

  document.title = resolve("site_title");
  const selector = document.getElementById("languageSelector");
  if (selector) selector.value = language;

  updateProfileDisplay();
  renderCustomReminders();

  const score = parseInt(localStorage.getItem("mindmateScore") || "72",10);
  const streak = parseInt(localStorage.getItem("mindmateStreak") || "0",10);
  const correct = parseInt(localStorage.getItem("mindmateCorrectStreak") || "0",10);
  const scoreEl = document.getElementById("score"); if(scoreEl) scoreEl.textContent = score + "%";
  const careScore = document.getElementById("careScore"); if(careScore) careScore.textContent = score + "%";
  const perf = document.getElementById("performanceText"); if(perf) perf.textContent = score + "%";
  const st = document.getElementById("streak"); if(st) st.textContent = streak + " " + resolve("v_days");
  const cst = document.getElementById("careStreak"); if(cst) cst.textContent = streak + " " + resolve("v_days");
  const cs = document.getElementById("correctStreak"); if(cs) cs.textContent = correct;
  const cc = document.getElementById("careCorrect"); if(cc) cc.textContent = correct;

  // Keep currently running object-memory display in the selected language.
  const objectEl = document.getElementById("objects");
  if (objectEl && objectEl.textContent.indexOf("❓") === -1 && objectEl.textContent.trim()) {
    const objectLists = {
      en:"🍎 Apple · 📖 Book · 🕐 Clock", ta:"🍎 ஆப்பிள் · 📖 புத்தகம் · 🕐 கடிகாரம்", hi:"🍎 सेब · 📖 किताब · 🕐 घड़ी",
      ml:"🍎 ആപ്പിൾ · 📖 പുസ്തകം · 🕐 ക്ലോക്ക്", te:"🍎 ఆపిల్ · 📖 పుస్తకం · 🕐 గడియారం", kn:"🍎 ಸೇಬು · 📖 ಪುಸ್ತಕ · 🕐 ಗಡಿಯಾರ",
      as:"🍎 আপেল · 📖 কিতাপ · 🕐 ঘড়ী", brx:"🍎 आपेल · 📖 बिलाइ · 🕐 घड़ि", mni:"🍎 আপেল · 📖 বই · 🕐 ঘড়ি", lus:"🍎 Apple · 📖 Book · 🕐 Clock", kha:"🍎 Apple · 📖 Kot · 🕐 Clock"
    };
    if (gameType === "object") objectEl.textContent = objectLists[language] || objectLists.en;
  }
}

/* =====================================================
   LOAD SAVED DATA WHEN WEBSITE OPENS
===================================================== */

window.onload = function() {

    loadProfile();

    loadFamily();

    updateLoginStreak();

    updateDashboard();


    const savedLanguage = "en";
    localStorage.setItem("mindmateLanguage", "en");


    document.getElementById(
        "languageSelector"
    ).value =
        savedLanguage;


    changeLanguage(
        savedLanguage
    );
};


/* =====================================================
   ASSAMESE LOCALE — complete working language pack
===================================================== */
translations.as = Object.assign({}, translations.en, {
  site_title:"MINDMATE - SIH 26003", language_label:"ভাষা বাছনি কৰক", main_navigation:"মূল নেভিগেচন", todays_status:"আজিৰ অৱস্থা",
  language_english:"ইংৰাজী", language_tamil:"তামিল", language_hindi:"হিন্দী", language_malayalam:"মালয়ালম", language_telugu:"তেলুগু", language_kannada:"কন্নড়", language_assamese:"অসমীয়া",
  brand_sub:"আপোনাৰ জ্ঞানীয় যত্নৰ সহায়ক", eyebrow:"🌿 সহজ। সহায়ক। ব্যক্তিগত।", hero_start:"🧠 আজিৰ কাৰ্যকলাপ আৰম্ভ কৰক", talk_mindmate:"🎤 MINDMATEৰ সৈতে কথা পাতক", one_step:"এটা এটাকৈ খোজ",
  one_step_desc:"এটা সৰু কাৰ্যকলাপ কৰক, স্মৰণী চাওক বা MINDMATEৰ সৈতে কথা পাতক। জটিল এপ শিকাৰ প্ৰয়োজন নাই।", checkin_title:"আজিৰ সহজ পৰীক্ষা", checkin_desc:"প্ৰয়োজনীয় সকলো একে ঠাইতে আছে।", offline_ready:"অফলাইনত সাজু", saved_device:"ডিভাইচত সংৰক্ষিত", what_do:"আপুনি কি কৰিব বিচাৰে?", choose_action:"এটা সহজ কাৰ্যকলাপ বাছনি কৰক।", play_game:"এটা খেল খেলক", play_game_desc:"সহজে অনুসৰণ কৰিব পৰা সৰু স্মৃতি কাৰ্যকলাপ।",
  talk_desc:"আপোনাৰ স্ক'ৰ, স্মৰণী বা সহায়ৰ বিষয়ে স্বাভাৱিকভাৱে কওক।", my_reminders:"মোৰ স্মৰণীসমূহ", my_reminders_desc:"আজিৰ ঔষধ, পানী আৰু মগজুৰ কাৰ্যকলাপৰ স্মৰণী চাওক।", voice_help:"টাইপ কৰাৰ প্ৰয়োজন নাই। মাইক্ৰ'ফোন টিপি নিৰ্বাচিত ভাষাত কথা পাতক।",
  change_photo:"📷 ফটো সলনি কৰক", family_desc:"চিনাকি মুখে অভিজ্ঞতাটো অধিক ব্যক্তিগত কৰিব পাৰে।", games_desc:"স্মৃতি আৰু চিনাক্তকৰণৰ বাবে সৰু সৰু কাৰ্যকলাপ।", home:"← মুখ্য পৃষ্ঠা", memory_goal:"স্মৃতি", recognition_goal:"চিনাক্তকৰণ", game_instruction_seq:"আৰম্ভ কৰক টিপক, সংখ্যাটো মনত ৰাখক, তাৰ পিছত লিখক।", object_instruction:"আৰম্ভ কৰক টিপক আৰু বস্তুবোৰ মনত ৰাখক।",
  demo_games:"প্ৰট'টাইপ টোকা: বৰ্তমানৰ স্ক'ৰ আৰু খেলৰ যুক্তি প্ৰদৰ্শনৰ বাবে। এইটো চিকিৎসাগত নিৰ্ণয় বা প্ৰমাণিত জ্ঞানীয় মূল্যায়ন নহয়।", reminders_desc:"আজিৰ দৈনন্দিন কামৰ বাবে সহজ স্মৰণী।", medicine_time:"পুৱা ৮:০০ · ঔষধ", water_time:"পুৱা ১০:০০ · পানী", brain_time:"সন্ধিয়া ৬:০০ · মগজুৰ কাৰ্যকলাপ", appointment:"এপইণ্টমেণ্ট", appointment_desc:"আগন্তুক চিকিৎসা এপইণ্টমেণ্ট সহজে মনত ৰাখক।",
  add_reminder:"➕ স্মৰণী যোগ কৰক", custom_reminders:"নিজৰ স্মৰণী", reminder_title_label:"স্মৰণীৰ নাম", reminder_title_placeholder:"স্মৰণীৰ নাম লিখক", reminder_time_label:"সময়", save_reminder:"💾 স্মৰণী সংৰক্ষণ কৰক", cancel:"বাতিল", delete:"মচি পেলাওক", no_custom_reminders:"এতিয়ালৈ কোনো নিজৰ স্মৰণী নাই।",
  reminder_required:"স্মৰণীৰ নাম আৰু সময় দুয়োটা লিখক।", reminder_saved:"স্মৰণী সফলভাৱে সংৰক্ষণ কৰা হ'ল!", reminder_deleted:"স্মৰণী মচি পেলোৱা হ'ল।", dashboard_desc:"MINDMATEত সংৰক্ষিত কাৰ্যকলাপৰ সহজ দৃশ্য।", practice_now:"🧠 এতিয়া অনুশীলন কৰক", cognitive_activity:"🧠 জ্ঞানীয় কাৰ্যকলাপ", current_streak:"🔥 বৰ্তমান ধাৰাবাহিকতা", current_score:"বৰ্তমান স্ক'ৰ", performance_desc:"আপোনাৰ বৰ্তমানৰ কাৰ্যকলাপৰ স্ক'ৰ।", keep_simple:"সহজ কৰি ৰাখক।",
  keep_simple_desc:"সৰু আৰু নিয়মীয়া কাৰ্যকলাপ ব্যস্ত পৰ্দাতকৈ অনুসৰণ কৰাটো সহজ।", todays_focus:"আজিৰ লক্ষ্য", activity_available:"কাৰ্যকলাপ উপলব্ধ", activity_available_desc:"যেতিয়া সাজু হ'ব, এটা স্মৃতি খেল চেষ্টা কৰক।", offline_storage:"অফলাইন সংৰক্ষণ", offline_storage_desc:"বৰ্তমানৰ তথ্য এই ব্ৰাউজাৰত সংৰক্ষিত।",
  caregiver_desc:"পৰিয়াল বা যত্নদাতা দলৰ বাবে অধিক তথ্যভিত্তিক দৃশ্য।", patient_view:"← ৰোগীৰ দৃশ্য", patient_overview:"ৰোগীৰ কাৰ্যকলাপৰ সাৰাংশ", patient_overview_desc:"তলৰ তথ্য ব্যৱহাৰ কৰি MINDMATE ব্যৱহাৰৰ ধাৰা বুজক।", recorded_correct:"শুদ্ধ উত্তৰ সংৰক্ষিত", activity:"📅 কাৰ্যকলাপ", today:"আজি", latest_activity:"শেহতীয়া স্থানীয় কাৰ্যকলাপ", storage:"📴 সংৰক্ষণ", local:"স্থানীয়",
  memory:"স্মৃতি", recognition:"চিনাক্তকৰণ", adaptive:"অনুকূলিত অসুবিধা", hydration:"পানী গ্ৰহণ", medicine_label:"ঔষধ", water_label:"পানী", brain_activity_label:"মগজুৰ কাৰ্যকলাপ", profile_desc:"আপোনাৰ মৌলিক তথ্য আৰু পৰিয়ালৰ যোগাযোগ এই ডিভাইচত ৰাখক।",
  shown_medicine:"পুৱা ৮:০০ৰ স্মৰণী দেখুওৱা হৈছে।", shown_hydration:"পুৱা ১০:০০ৰ স্মৰণী দেখুওৱা হৈছে।", shown_brain:"সন্ধিয়া ৬:০০ৰ স্মৰণী দেখুওৱা হৈছে।", time_am:"পুৱা", time_pm:"সন্ধিয়া", time_8am:"পুৱা ৮:০০", time_10am:"পুৱা ১০:০০", time_6pm:"সন্ধিয়া ৬:০০", microphone_alt:"ভইচ সহায়কৰ মাইক্ৰ'ফোন", aria_enter_number:"মনত ৰখা সংখ্যাটো লিখক", aria_enter_objects:"মনত ৰখা বস্তুবোৰ লিখক", performance_aria:"কাৰ্যক্ষমতা",
  msg_correct_prefix:"শুদ্ধ!", msg_correct_in_row:"ধাৰাবাহিকভাৱে শুদ্ধ!", object_remember:"বস্তুবোৰ মনত ৰাখক!", msg_wrong_streak_reset:"ভুল হৈছে। ধাৰাবাহিকতা পুনৰ আৰম্ভ হ'ল।",
  v_home:"মুখ্য পৃষ্ঠা খোলা হৈছে।", v_dashboard:"ড্যাশব'ৰ্ড খোলা হৈছে।", v_games:"খেলৰ পৃষ্ঠা খোলা হৈছে।", v_reminders:"স্মৰণীৰ পৃষ্ঠা খোলা হৈছে।", v_caregiver:"যত্নদাতাৰ পৃষ্ঠা খোলা হৈছে।", v_days:"দিন",
  v_help:"আপুনি মুখ্য পৃষ্ঠা, ড্যাশব'ৰ্ড, খেল, স্মৰণী বা যত্নদাতা বুলি ক'ব পাৰে। স্মৃতি খেল আৰম্ভ কৰিবলৈও ক'ব পাৰে, বা আপোনাৰ স্ক'ৰ আৰু অগ্ৰগতি সুধিব পাৰে।"
});


/* =====================================================
   NER LOCALES — complete application integration
   Five Northeast India language packs:
   Assamese, Bodo, Meitei, Mizo, Khasi.
===================================================== */
const nerLocales = {
  as: {
    language_english:"ইংৰাজী", language_tamil:"তামিল", language_hindi:"হিন্দী", language_malayalam:"মালয়ালম", language_telugu:"তেলুগু", language_kannada:"কন্নড়", language_assamese:"অসমীয়া", language_bodo:"বড়ো", language_meitei:"মৈতৈলোন", language_mizo:"Mizo", language_khasi:"Khasi",
    nav_home:"মুখ্য পৃষ্ঠা", nav_dashboard:"ড্যাশব'ৰ্ড", nav_games:"মগজুৰ খেল", nav_reminders:"স্মৰণী", nav_caregiver:"যত্নদাতা", welcome:"MINDMATEলৈ স্বাগতম", subtitle:"স্মাৰ্ট জ্ঞানীয় যত্ন আৰু পৰিয়ালৰ সহায়তা প্লেটফৰ্ম", btn_open_dashboard:"ড্যাশব'ৰ্ড খোলক", profile_title:"👤 মোৰ প্ৰ'ফাইল", ph_name:"আপোনাৰ নাম লিখক", ph_age:"আপোনাৰ বয়স লিখক", ph_emergency:"জৰুৰী যোগাযোগ", ph_caregiver_name:"যত্নদাতাৰ নাম", ph_relationship:"সম্পৰ্ক", ph_city:"চহৰ", btn_save_profile:"💾 প্ৰ'ফাইল সংৰক্ষণ কৰক", btn_load_profile:"🔄 প্ৰ'ফাইল লোড কৰক", family_title:"👨‍👩‍👧‍👦 পৰিয়ালৰ সদস্য", lbl_father:"দেউতা", lbl_mother:"মা", lbl_daughter:"জীয়াৰী", lbl_son:"পুত্ৰ", ph_father_name:"দেউতাৰ নাম", ph_mother_name:"মাৰ নাম", ph_daughter_name:"জীয়াৰীৰ নাম", ph_son_name:"পুত্ৰৰ নাম", btn_save_family:"💾 পৰিয়ালৰ তথ্য সংৰক্ষণ কৰক",
    voice_title:"🎤 MINDMATE ভইচ সহায়ক", voice_click_speak:"বুটাম টিপি কথা কওক", btn_start_voice:"🎤 ভইচ সহায়ক আৰম্ভ কৰক", btn_stop:"⏹ বন্ধ কৰক", dashboard_title:"📊 ড্যাশব'ৰ্ড", card_cognitive_score:"🧠 জ্ঞানীয় স্ক'ৰ", card_current_streak:"🔥 বৰ্তমান ধাৰাবাহিকতা", card_correct_row:"🎯 একেৰাহে শুদ্ধ", card_reminders:"⏰ স্মৰণী", card_offline_mode:"📴 অফলাইন মোড", lbl_prototype_score:"খেলৰ স্ক'ৰ", lbl_daily_streak:"দৈনিক ধাৰাবাহিকতা", lbl_consecutive_correct:"একেৰাহে শুদ্ধ উত্তৰ", lbl_today_reminders:"আজিৰ স্মৰণী", lbl_browser_storage:"ব্ৰাউজাৰ সংৰক্ষণ", status_on:"চালু", performance_title:"কাৰ্যক্ষমতা", games_title:"🧠 মগজুৰ খেল", memory_seq_title:"🔢 সংখ্যা মনত ৰখা", memory_seq_desc:"সংখ্যাৰ ক্ৰমটো মনত ৰাখক।", press_start:"আৰম্ভ কৰক", btn_start_game:"খেল আৰম্ভ কৰক", ph_enter_sequence:"ক্ৰমটো লিখক", btn_check_answer:"উত্তৰ পৰীক্ষা কৰক", object_memory_title:"🧩 বস্তু মনত ৰখা", object_memory_desc:"এই বস্তুবোৰ মনত ৰাখক:", object_memory_list:"আপেল - কিতাপ - ঘড়ী", btn_start_object_game:"বস্তুৰ খেল আৰম্ভ কৰক", ph_enter_objects:"বস্তুবোৰ লিখক", reminders_title:"⏰ স্মৰণী", reminder_medicine:"ঔষধৰ স্মৰণী", reminder_water:"পানী খাওক", reminder_brain:"মগজুৰ অনুশীলন", caregiver_title:"👨‍⚕️ যত্নদাতাৰ ড্যাশব'ৰ্ড", card_correct_answers:"🎯 শুদ্ধ উত্তৰ", footer_line1:"🧠 MINDMATE | SIH 26003", footer_line2:"স্মাৰ্ট জ্ঞানীয় যত্ন আৰু পৰিয়ালৰ সহায়তা", alert_profile_saved:"প্ৰ'ফাইল সফলভাৱে সংৰক্ষিত!", alert_family_saved:"পৰিয়ালৰ তথ্য সংৰক্ষিত!", saved_profile_title:"সংৰক্ষিত প্ৰ'ফাইল", lbl_name:"নাম", lbl_age:"বয়স", lbl_emergency:"জৰুৰী যোগাযোগ", lbl_caregiver:"যত্নদাতা", lbl_relationship:"সম্পৰ্ক", lbl_city:"চহৰ",
    game_remember_number:"সংখ্যাটো মনত ৰাখক!", msg_correct_prefix:"শুদ্ধ!", msg_correct_in_row:"একেৰাহে শুদ্ধ!", msg_wrong_reset_full:"ভুল! ধাৰাবাহিকতা ০ লৈ পুনৰ আৰম্ভ হ'ল।", msg_wrong_streak_reset:"ভুল! ধাৰাবাহিকতা পুনৰ আৰম্ভ হ'ল।", object_remember:"বস্তুবোৰ মনত ৰাখক!", voice_not_supported:"এই ব্ৰাউজাৰত ভইচ চিনাক্তকৰণ সমৰ্থিত নহয়।", voice_listening:"শুনিছোঁ... এতিয়া কথা কওক", voice_you_said:"আপুনি ক'লে:", voice_not_understood:"বুজিব পৰা নগ'ল। আকৌ চেষ্টা কৰক।", voice_stopped:"ভইচ সহায়ক বন্ধ কৰা হৈছে।", v_home:"মুখ্য পৃষ্ঠা খোলা হৈছে।", v_dashboard:"ড্যাশব'ৰ্ড খোলা হৈছে।", v_games:"মগজুৰ খেল খোলা হৈছে।", v_reminders:"আপোনাৰ স্মৰণী খোলা হৈছে।", v_caregiver:"যত্নদাতাৰ ড্যাশব'ৰ্ড খোলা হৈছে।", v_start_memory:"স্মৃতিৰ খেল আৰম্ভ হৈছে।", v_streak_prefix:"আপোনাৰ দৈনিক ধাৰাবাহিকতা", v_days:"দিন।", v_correct_prefix:"আপোনাৰ", v_correct_suffix:"একেৰাহে শুদ্ধ উত্তৰ আছে।", v_score_prefix:"আপোনাৰ বৰ্তমানৰ স্ক'ৰ", v_percent:"শতাংশ।", v_name_prefix:"আপোনাৰ নাম", v_name_not_saved:"সংৰক্ষণ কৰা হোৱা নাই", v_age_prefix:"আপোনাৰ বয়স", v_not_saved:"সংৰক্ষণ কৰা হোৱা নাই", v_caregiver_prefix:"আপোনাৰ যত্নদাতা", v_help:"আপুনি মুখ্য পৃষ্ঠা, ড্যাশব'ৰ্ড, খেল, স্মৰণী, যত্নদাতা বা স্মৃতিৰ খেল আৰম্ভ কৰিবলৈ ক'ব পাৰে।", v_not_understood:"ক্ষমা কৰিব, বুজিব পৰা নগ'ল। আকৌ চেষ্টা কৰক।", v_greeting:"নমস্কাৰ! মই MINDMATE, আপোনাৰ ভইচ সহায়ক।", v_hello:"নমস্কাৰ! আজি মই কেনেকৈ সহায় কৰিব পাৰোঁ?", v_how_are_you:"মই ভালেই আছোঁ। আজি আপুনি কেনে অনুভৱ কৰিছে?", v_thanks:"আপোনাক স্বাগতম।", v_bye:"এতিয়াৰ বাবে বিদায়। নিজৰ যত্ন লওক আৰু পানী খাবলৈ মনত ৰাখক।", v_who_are_you:"মই MINDMATE, স্মৰণী, খেল আৰু দৈনন্দিন সহায়ৰ বাবে আপোনাৰ ভইচ সহায়ক।", v_time_prefix:"বৰ্তমান সময়", chip_hello:"👋 নমস্কাৰ", chip_score:"📊 মোৰ স্ক'ৰ", chip_streak:"🔥 মোৰ ধাৰাবাহিকতা", chip_reminders:"⏰ স্মৰণী", chip_game:"🧠 খেল খেলক", chip_help:"❓ সহায়"
  },
  brx: {
    language_english:"इंग्राजि", language_tamil:"तमिल", language_hindi:"हिन्दी", language_malayalam:"मलयालम", language_telugu:"तेलुगु", language_kannada:"कन्नड", language_assamese:"असमिया", language_bodo:"बर'", language_meitei:"मैतेइलोन", language_mizo:"Mizo", language_khasi:"Khasi",
    nav_home:"न' हाबफिन", nav_dashboard:"डेशब'र्ड", nav_games:"मोजां खेल", nav_reminders:"खोथा-सोर", nav_caregiver:"जिगिरनायगिरि", welcome:"MINDMATE आव स्वागत", subtitle:"मोजां बिबांथिनाय आरो फामिलि हेफाजाब", btn_open_dashboard:"डेशब'र्ड खेव", profile_title:"👤 आंनि प्रोफाइल", ph_name:"न'नि मुं लिर", ph_age:"न'नि बय लिर", ph_emergency:"जरुरी जोगाजोग", ph_caregiver_name:"जिगिरनायगिरिनि मुं", ph_relationship:"जोंजोंनि सोमोन्दो", ph_city:"सहर", btn_save_profile:"💾 प्रोफाइल थिना हो", btn_load_profile:"🔄 प्रोफाइल ल'ड खालाम", family_title:"👨‍👩‍👧‍👦 फामिलिनि सोद्रो", lbl_father:"बिफा", lbl_mother:"बिमा", lbl_daughter:"बेटी", lbl_son:"बेटा", ph_father_name:"बिफानि मुं", ph_mother_name:"बिमानि मुं", ph_daughter_name:"बेटीनि मुं", ph_son_name:"बेटानि मुं", btn_save_family:"💾 फामिलि बिबां थिना हो",
    voice_title:"🎤 MINDMATE आवाज सहायक", voice_click_speak:"बटन दबायना बुं", btn_start_voice:"🎤 आवाज सहायक जागाय", btn_stop:"⏹ बन्द खालाम", dashboard_title:"📊 डेशब'र्ड", card_cognitive_score:"🧠 बिबांथिनाय स्क'र", card_current_streak:"🔥 दा-जुगिया धाराबाहिकता", card_correct_row:"🎯 सल'स्रि थिक", card_reminders:"⏰ खोथा-सोर", card_offline_mode:"📴 अफलाइन मोड", lbl_prototype_score:"खेल स्क'र", lbl_daily_streak:"दिननि धाराबाहिकता", lbl_consecutive_correct:"सल'स्रि थिक जवाब", lbl_today_reminders:"दिनैनि खोथा-सोर", lbl_browser_storage:"ब्राउजार थिनाय", status_on:"जागोन", performance_title:"खामानि", games_title:"🧠 मोजां खेल", memory_seq_title:"🔢 अनजिमा मोनसे", memory_seq_desc:"अनजिमानि सारि मोनसे।", press_start:"जागाय", btn_start_game:"खेल जागाय", ph_enter_sequence:"सारि लिर", btn_check_answer:"फिनथि नाय", object_memory_title:"🧩 बेसाद मोनसे", object_memory_desc:"बे बेसादफोर मोनसे:", object_memory_list:"आपेल - बुक - घड़ि", btn_start_object_game:"बेसाद खेल जागाय", ph_enter_objects:"बेसादफोर लिर", reminders_title:"⏰ खोथा-सोर", reminder_medicine:"दावाइ खोथा", reminder_water:"दै जाय", reminder_brain:"मोजां मोजां अनजिमा खेल", caregiver_title:"👨‍⚕️ जिगिरनायगिरि डेशब'र्ड", card_correct_answers:"🎯 थिक जवाब", footer_line1:"🧠 MINDMATE | SIH 26003", footer_line2:"बिबांथिनाय आरो फामिलि हेफाजाब", alert_profile_saved:"प्रोफाइल जौगोन!", alert_family_saved:"फामिलि बिबां थिना होनाय!", saved_profile_title:"थिना होनाय प्रोफाइल", lbl_name:"मुं", lbl_age:"बय", lbl_emergency:"जरुरी जोगाजोग", lbl_caregiver:"जिगिरनायगिरि", lbl_relationship:"सोमोन्दो", lbl_city:"सहर",
    game_remember_number:"अनजिमाखौ मोनसे!", msg_correct_prefix:"थिक!", msg_correct_in_row:"सल'स्रि थिक!", msg_wrong_reset_full:"गोरुम! धाराबाहिकता 0 आव फिन दाजाब।", msg_wrong_streak_reset:"गोरुम! धाराबाहिकता फिन दाजाब।", object_remember:"बेसादफोर मोनसे!", voice_not_supported:"बे ब्राउजारआव आवाज सिनायथि समरथित नङा।", voice_listening:"खोनासों... दानिया बुं", voice_you_said:"न' बुंदों:", voice_not_understood:"बुजायनो हायाखै। फिन नाय।", voice_stopped:"आवाज सहायक बन्द।", v_home:"न' हाबफिन पेज खेवदों।", v_dashboard:"डेशब'र्ड खेवदों।", v_games:"मोजां खेल खेवदों।", v_reminders:"न'नि खोथा-सोर खेवदों।", v_caregiver:"जिगिरनायगिरि डेशब'र्ड खेवदों।", v_start_memory:"मोनसे खेल जागायदों।", v_streak_prefix:"न'नि दिननि धाराबाहिकता", v_days:"दिन।", v_correct_prefix:"न'नि", v_correct_suffix:"सल'स्रि थिक जवाब।", v_score_prefix:"न'नि स्क'र", v_percent:"प्रतिशत।", v_name_prefix:"न'नि मुं", v_name_not_saved:"थिना होआखै", v_age_prefix:"न'नि बय", v_not_saved:"थिना होआखै", v_caregiver_prefix:"न'नि जिगिरनायगिरि", v_help:"न' हाबफिन, डेशब'र्ड, खेल, खोथा-सोर, जिगिरनायगिरि आरो मोनसे खेल जागायनो बुंनो हायो।", v_not_understood:"बुजायनो हायाखै। फिन नाय।", v_greeting:"नमस्कार! आं MINDMATE, न'नि आवाज सहायक।", v_hello:"नमस्कार! आजि मा हेफाजाब खालामनो हायो?", v_how_are_you:"आं मोजां। न' आजि माबोरै?", v_thanks:"सादर स्वागत।", v_bye:"दानिया थां। न'नि जिउनि जिगिर नाय।", v_who_are_you:"आं MINDMATE, खोथा-सोर आरो खेलनि आवाज सहायक।", v_time_prefix:"दानियानि सम", chip_hello:"👋 नमस्कार", chip_score:"📊 आंनि स्क'र", chip_streak:"🔥 आंनि धाराबाहिकता", chip_reminders:"⏰ खोथा-सोर", chip_game:"🧠 खेल", chip_help:"❓ हेफाजाब"
  },
  mni: {
    language_english:"ইংলিশ", language_tamil:"তামিল", language_hindi:"হিন্দি", language_malayalam:"মালায়ালম", language_telugu:"তেলুগু", language_kannada:"কন্নড়", language_assamese:"অসমীয়া", language_bodo:"বড়ো", language_meitei:"মৈতৈলোন", language_mizo:"Mizo", language_khasi:"Khasi",
    nav_home:"নুমিত লুপ", nav_dashboard:"ডেশব'র্ড", nav_games:"মস্তরাং থৌরাং", nav_reminders:"নুংশিবসিং", nav_caregiver:"মাইবাং", welcome:"MINDMATE-দা তরাম্না", subtitle:"শান্না মস্তরাং-শিনবা অমসুং ইমা-ইবু সহায়", btn_open_dashboard:"ডেশব'র্ড হাং", profile_title:"👤 ঐগী প্রোফাইল", ph_name:"নমগী মিং হাপ্পু", ph_age:"নমগী শাং হাপ্পু", ph_emergency:"জরুরি যোগাযোগ", ph_caregiver_name:"মাইবাংগী মিং", ph_relationship:"মরুপ", ph_city:"শহর", btn_save_profile:"💾 প্রোফাইল থম্মু", btn_load_profile:"🔄 প্রোফাইল লোড থোকপু", family_title:"👨‍👩‍👧‍👦 ইমা-ইবুগী মীশিং", lbl_father:"ইপা", lbl_mother:"ইমা", lbl_daughter:"নুপীচা", lbl_son:"নুপা", ph_father_name:"ইপাগী মিং", ph_mother_name:"ইমাগী মিং", ph_daughter_name:"নুপীচাগী মিং", ph_son_name:"নুপাগী মিং", btn_save_family:"💾 ইমা-ইবুগী তথ্য থম্মু",
    voice_title:"🎤 MINDMATE ভয়েস সহায়ক", voice_click_speak:"বাটন ক্লিক তৌনা হায়রো", btn_start_voice:"🎤 ভয়েস সহায়ক হাং", btn_stop:"⏹ লেপ্পু", dashboard_title:"📊 ডেশব'র্ড", card_cognitive_score:"🧠 মস্তরাং স্কোর", card_current_streak:"🔥 হৌজিকগী ধারাবাহিকতা", card_correct_row:"🎯 তান্না শিনবা", card_reminders:"⏰ নুংশিবসিং", card_offline_mode:"📴 অফলাইন মোড", lbl_prototype_score:"গেম স্কোর", lbl_daily_streak:"নুমিৎ-গী ধারাবাহিকতা", lbl_consecutive_correct:"তান্না শিনবা ফিনথবা", lbl_today_reminders:"নুংশিবসিং", lbl_browser_storage:"ব্রাউজর স্টোরেজ", status_on:"চালু", performance_title:"শিনবা", games_title:"🧠 মস্তরাং থৌরাং", memory_seq_title:"🔢 অংক মোন্নবা", memory_seq_desc:"অংকগী লাইন মোন্নৌ।", press_start:"হাংগদ্রো", btn_start_game:"গেম হাং", ph_enter_sequence:"লাইন হাপ্পু", btn_check_answer:"ফিনথবা যাচাই", object_memory_title:"🧩 মচাক মোন্নবা", object_memory_desc:"মচাকসিং মোন্নৌ:", object_memory_list:"আপেল - বই - ঘড়ি", btn_start_object_game:"মচাক গেম হাং", ph_enter_objects:"মচাকসিং হাপ্পু", reminders_title:"⏰ নুংশিবসিং", reminder_medicine:"ওষুধ নুংশি", reminder_water:"ঈশিং চা", reminder_brain:"মস্তরাং অনুশীলন", caregiver_title:"👨‍⚕️ মাইবাং ডেশব'র্ড", card_correct_answers:"🎯 শিনবা ফিনথবা", footer_line1:"🧠 MINDMATE | SIH 26003", footer_line2:"মস্তরাং সহায় অমসুং ইমা-ইবু সহায়", alert_profile_saved:"প্রোফাইল থম্মরে!", alert_family_saved:"ইমা-ইবুগী তথ্য থম্মরে!", saved_profile_title:"থম্মা প্রোফাইল", lbl_name:"মিং", lbl_age:"শাং", lbl_emergency:"জরুরি যোগাযোগ", lbl_caregiver:"মাইবাং", lbl_relationship:"মরুপ", lbl_city:"শহর",
    game_remember_number:"অংক মোন্নৌ!", msg_correct_prefix:"শিনবা!", msg_correct_in_row:"তান্না শিনবা!", msg_wrong_reset_full:"নামথে! ধারাবাহিকতা ০ দা হংলু।", msg_wrong_streak_reset:"নামথে! ধারাবাহিকতা হংলু।", object_remember:"মচাকসিং মোন্নৌ!", voice_not_supported:"মসিগী ব্রাউজরদা ভয়েস সমর্থন নত্রে।", voice_listening:"খোনজরী... হায়রো", voice_you_said:"নহাক্না হায়রে:", voice_not_understood:"বুজ্জদে। অমুক হায়রো।", voice_stopped:"ভয়েস সহায়ক লেপ্পরে।", v_home:"নুমিত লুপ হাংদ্রে।", v_dashboard:"ডেশব'র্ড হাংদ্রে।", v_games:"গেম পেজ হাংদ্রে।", v_reminders:"নুংশিবসিং হাংদ্রে।", v_caregiver:"মাইবাং ডেশব'র্ড হাংদ্রে।", v_start_memory:"মেমরি গেম হাংদ্রে।", v_streak_prefix:"নহাক্কী নুমিৎ ধারাবাহিকতা", v_days:"নুমিৎ।", v_correct_prefix:"নহাক্কী", v_correct_suffix:"তান্না শিনবা ফিনথবা।", v_score_prefix:"নহাক্কী স্কোর", v_percent:"শতাংশ।", v_name_prefix:"নহাক্কী মিং", v_name_not_saved:"থম্মদে", v_age_prefix:"নহাক্কী শাং", v_not_saved:"থম্মদে", v_caregiver_prefix:"নহাক্কী মাইবাং", v_help:"নুমিত লুপ, ডেশব'র্ড, গেম, নুংশি, মাইবাং, অমসুং মেমরি গেম হাংনবা হায়রো।", v_not_understood:"বুজ্জদে। অমুক হায়রো।", v_greeting:"নমস্কার! ঐ MINDMATE, নহাক্কী ভয়েস সহায়ক।", v_hello:"নমস্কার! করিগুম্বা সহায় তৌগদ্রা?", v_how_are_you:"ঐ মোজাং। নহাক্না করিগুম্বা অনুভব তৌরিব্রা?", v_thanks:"স্বাগতম।", v_bye:"ফগৎপা। ইশিং চানা থম্মু।", v_who_are_you:"ঐ MINDMATE, নুংশি, গেম অমসুং সহায়গী ভয়েস সহায়ক।", v_time_prefix:"হৌজিকগী সময়", chip_hello:"👋 নমস্কার", chip_score:"📊 ঐগী স্কোর", chip_streak:"🔥 ঐগী ধারাবাহিকতা", chip_reminders:"⏰ নুংশি", chip_game:"🧠 গেম", chip_help:"❓ সহায়"
  },
  lus: {
    language_english:"English", language_tamil:"Tamil", language_hindi:"Hindi", language_malayalam:"Malayalam", language_telugu:"Telugu", language_kannada:"Kannada", language_assamese:"Assamese", language_bodo:"Bodo", language_meitei:"Meitei", language_mizo:"Mizo", language_khasi:"Khasi",
    nav_home:"Home", nav_dashboard:"Dashboard", nav_games:"Game te", nav_reminders:"Reminders", nav_caregiver:"Caregiver", welcome:"MINDMATE-ah lo lut ve", subtitle:"Mizo cognitive care leh chhungkaw tanpuina platform", btn_open_dashboard:"Dashboard hawn", profile_title:"👤 Ka Profile", ph_name:"I hming ziak", ph_age:"I kum ziak", ph_emergency:"Emergency contact", ph_caregiver_name:"Caregiver hming", ph_relationship:"Inlaichinna", ph_city:"Khawpui", btn_save_profile:"💾 Profile save", btn_load_profile:"🔄 Profile load", family_title:"👨‍👩‍👧‍👦 Chhungkaw member-te", lbl_father:"Pa", lbl_mother:"Nu", lbl_daughter:"Fanu", lbl_son:"Fapa", ph_father_name:"Pa hming", ph_mother_name:"Nu hming", ph_daughter_name:"Fanu hming", ph_son_name:"Fapa hming", btn_save_family:"💾 Chhungkaw thu save",
    voice_title:"🎤 MINDMATE Voice Assistant", voice_click_speak:"Button click la thu sawi rawh", btn_start_voice:"🎤 Voice Assistant hawn", btn_stop:"⏹ Stop", dashboard_title:"📊 Dashboard", card_cognitive_score:"🧠 Cognitive Score", card_current_streak:"🔥 Tunlai streak", card_correct_row:"🎯 Dik chhuak zela", card_reminders:"⏰ Reminders", card_offline_mode:"📴 Offline Mode", lbl_prototype_score:"Game score", lbl_daily_streak:"Ni tin streak", lbl_consecutive_correct:"Dik chhuak zela", lbl_today_reminders:"Tuni reminders", lbl_browser_storage:"Browser storage", status_on:"ON", performance_title:"Performance", games_title:"🧠 Game te", memory_seq_title:"🔢 Number Memory", memory_seq_desc:"Number sequence hriat reng rawh.", press_start:"Start", btn_start_game:"Game hawn", ph_enter_sequence:"Sequence ziak", btn_check_answer:"Answer check", object_memory_title:"🧩 Object Memory", object_memory_desc:"Heng thil-te hi hriat reng rawh:", object_memory_list:"Apple - Book - Clock", btn_start_object_game:"Object game hawn", ph_enter_objects:"Thil-te ziak", reminders_title:"⏰ Reminders", reminder_medicine:"Medicine reminder", reminder_water:"Tui in rawh", reminder_brain:"Brain exercise", caregiver_title:"👨‍⚕️ Caregiver Dashboard", card_correct_answers:"🎯 Correct Answers", footer_line1:"🧠 MINDMATE | SIH 26003", footer_line2:"Smart Cognitive Care leh Chhungkaw Tanpuina", alert_profile_saved:"Profile save fel takin a ni!", alert_family_saved:"Chhungkaw thu save fel takin a ni!", saved_profile_title:"Saved Profile", lbl_name:"Hming", lbl_age:"Kum", lbl_emergency:"Emergency Contact", lbl_caregiver:"Caregiver", lbl_relationship:"Inlaichinna", lbl_city:"Khawpui",
    game_remember_number:"Number hriat reng rawh!", msg_correct_prefix:"Dik!", msg_correct_in_row:"dika chhuak zela!", msg_wrong_reset_full:"Dik lo! Streak 0-ah kir leh.", msg_wrong_streak_reset:"Dik lo! Streak kir leh.", object_remember:"Thil-te hriat reng rawh!", voice_not_supported:"He browser-ah voice recognition support a awm lo.", voice_listening:"Ngaihthlak mek... Thu sawi rawh", voice_you_said:"I sawi chu:", voice_not_understood:"Ka hre thiam lo. Sawi leh rawh.", voice_stopped:"Voice assistant tih tawp.", v_home:"Home page hawn mek.", v_dashboard:"Dashboard hawn mek.", v_games:"Game page hawn mek.", v_reminders:"I reminders hawn mek.", v_caregiver:"Caregiver dashboard hawn mek.", v_start_memory:"Memory game hawn mek.", v_streak_prefix:"I daily streak chu", v_days:"ni.", v_correct_prefix:"I hnenah", v_correct_suffix:"correct answers consecutive an awm.", v_score_prefix:"I current score chu", v_percent:"percent.", v_name_prefix:"I hming chu", v_name_not_saved:"save a ni lo", v_age_prefix:"I kum chu", v_not_saved:"save a ni lo", v_caregiver_prefix:"I caregiver chu", v_help:"Home, dashboard, game, reminders, caregiver tih te sawi thei rawh; memory game hawn pawh sawi thei.", v_not_understood:"Ka hre thiam lo. Sawi leh rawh.", v_greeting:"Chibai! MINDMATE ka ni, i voice assistant.", v_hello:"Chibai! Engtin nge ka tanpui che?", v_how_are_you:"Ka tha e. Nang chu engtin nge i awm?", v_thanks:"Ka lawm e.", v_bye:"Tunah chuan bye. Tui in tur hriat reng rawh.", v_who_are_you:"MINDMATE ka ni, reminders, games leh tanpuina atan voice assistant.", v_time_prefix:"Tunah hun chu", chip_hello:"👋 Chibai", chip_score:"📊 Ka Score", chip_streak:"🔥 Ka Streak", chip_reminders:"⏰ Reminders", chip_game:"🧠 Game chhu", chip_help:"❓ Tanpuina"
  },
  kha: {
    language_english:"English", language_tamil:"Tamil", language_hindi:"Hindi", language_malayalam:"Malayalam", language_telugu:"Telugu", language_kannada:"Kannada", language_assamese:"Assamese", language_bodo:"Bodo", language_meitei:"Meitei", language_mizo:"Mizo", language_khasi:"Khasi",
    nav_home:"Ka ing", nav_dashboard:"Dashboard", nav_games:"Ki jingïalehkai", nav_reminders:"Ki jingpynkynmaw", nav_caregiver:"Nongsumar", welcome:"Wan sha MINDMATE", subtitle:"Ka rynsan jingïarap jingmut bad jingïarap ka longïing", btn_open_dashboard:"Plie Dashboard", profile_title:"👤 Ka Profile", ph_name:"Thoh ïa ka kyrteng jong phi", ph_age:"Thoh ïa ka rta", ph_emergency:"Emergency contact", ph_caregiver_name:"Kyrteng nongsumar", ph_relationship:"Jingiadei", ph_city:"Sor", btn_save_profile:"💾 Pynsah Profile", btn_load_profile:"🔄 Pynload Profile", family_title:"👨‍👩‍👧‍👦 Ki dkhot ka longïing", lbl_father:"Kpa", lbl_mother:"Kmie", lbl_daughter:"Ka khun kynthei", lbl_son:"Ka khun shynrang", ph_father_name:"Kyrteng Kpa", ph_mother_name:"Kyrteng Kmie", ph_daughter_name:"Kyrteng ka khun kynthei", ph_son_name:"Kyrteng ka khun shynrang", btn_save_family:"💾 Pynsah jingtip longïing",
    voice_title:"🎤 MINDMATE Voice Assistant", voice_click_speak:"Klik ïa ka button bad kren", btn_start_voice:"🎤 Sdang Voice Assistant", btn_stop:"⏹ Stop", dashboard_title:"📊 Dashboard", card_cognitive_score:"🧠 Cognitive Score", card_current_streak:"🔥 Streak mynta", card_correct_row:"🎯 Jubab kiba dei", card_reminders:"⏰ Ki jingpynkynmaw", card_offline_mode:"📴 Offline Mode", lbl_prototype_score:"Game score", lbl_daily_streak:"Streak man ka sngi", lbl_consecutive_correct:"Jubab kiba dei lynter", lbl_today_reminders:"Ki jingpynkynmaw mynta", lbl_browser_storage:"Browser storage", status_on:"ON", performance_title:"Ka jingtrei", games_title:"🧠 Ki jingïalehkai", memory_seq_title:"🔢 Pynkynmaw ïa ki nombor", memory_seq_desc:"Pynkynmaw ïa ka jingïaid nombor.", press_start:"Sdang", btn_start_game:"Sdang jingïalehkai", ph_enter_sequence:"Thoh ïa ka jingïaid", btn_check_answer:"Peit ïa ka jubab", object_memory_title:"🧩 Pynkynmaw ïa ki tiar", object_memory_desc:"Pynkynmaw ïa kine ki tiar:", object_memory_list:"Apple - Book - Clock", btn_start_object_game:"Sdang jingïalehkai tiar", ph_enter_objects:"Thoh ïa ki tiar", reminders_title:"⏰ Ki jingpynkynmaw", reminder_medicine:"Jingpynkynmaw dawai", reminder_water:"Dih um", reminder_brain:"Jinghikai jingmut", caregiver_title:"👨‍⚕️ Caregiver Dashboard", card_correct_answers:"🎯 Ki jubab kiba dei", footer_line1:"🧠 MINDMATE | SIH 26003", footer_line2:"Smart Cognitive Care bad jingïarap longïing", alert_profile_saved:"La pynsah bha ïa ka Profile!", alert_family_saved:"La pynsah bha ïa ki jingtip longïing!", saved_profile_title:"Saved Profile", lbl_name:"Kyrteng", lbl_age:"Rta", lbl_emergency:"Emergency Contact", lbl_caregiver:"Nongsumar", lbl_relationship:"Jingiadei", lbl_city:"Sor",
    game_remember_number:"Pynkynmaw ïa u nombor!", msg_correct_prefix:"Dei!", msg_correct_in_row:"ki jubab kiba dei lynter!", msg_wrong_reset_full:"Bakla! La sdang biang ka streak.", msg_wrong_streak_reset:"Bakla! La sdang biang ka streak.", object_remember:"Pynkynmaw ïa ki tiar!", voice_not_supported:"Ka voice recognition kam treikam ha kane ka browser.", voice_listening:"Nga sngap... kren mynta", voice_you_said:"Phi la ong:", voice_not_understood:"Ngam sngewthuh. Pyrshang biang.", voice_stopped:"La pynsangeh ïa Voice Assistant.", v_home:"La plie ïa ka home.", v_dashboard:"La plie ïa Dashboard.", v_games:"La plie ïa ki jingïalehkai.", v_reminders:"La plie ïa ki jingpynkynmaw.", v_caregiver:"La plie ïa Caregiver Dashboard.", v_start_memory:"La sdang ïa ka memory game.", v_streak_prefix:"Ka streak man ka sngi jong phi ka long", v_days:"sngi.", v_correct_prefix:"Phi don", v_correct_suffix:"ki jubab kiba dei lynter.", v_score_prefix:"Ka score jong phi ka long", v_percent:"percent.", v_name_prefix:"Ka kyrteng jong phi ka long", v_name_not_saved:"ym pat la pynsah", v_age_prefix:"Ka rta jong phi ka long", v_not_saved:"ym pat la pynsah", v_caregiver_prefix:"U/Ka nongsumar jong phi u/ka long", v_help:"Phi lah ban ong home, dashboard, games, reminders, caregiver lane sdang memory game.", v_not_understood:"Ngam sngewthuh. Pyrshang biang.", v_greeting:"Khublei! Nga dei MINDMATE, u/ka voice assistant jong phi.", v_hello:"Khublei! Kumno ngan lah ban iarap ia phi?", v_how_are_you:"Nga bha. Phi kumno mynta?", v_thanks:"Khublei bha.", v_bye:"Shong suk. Pynkynmaw ban dih um.", v_who_are_you:"Nga dei MINDMATE, u/ka voice assistant na bynta ki jingpynkynmaw bad jingïalehkai.", v_time_prefix:"Ka por mynta ka long", chip_hello:"👋 Khublei", chip_score:"📊 Ka Score", chip_streak:"🔥 Ka Streak", chip_reminders:"⏰ Ki jingpynkynmaw", chip_game:"🧠 Ialehkai", chip_help:"❓ Jingiarap"
  }
};

/* Add the five NER locales without inheriting the English locale as the visible
   translation source. Remaining structural keys are filled from the locale's
   own core vocabulary below, while dynamic game content comes from content-packs. */
Object.keys(nerLocales).forEach(function(lang){
  translations[lang] = Object.assign({}, translations.en, nerLocales[lang]);
});

/* Language-independent UI labels that must never remain English for NER users. */
const nerCommon = {
  as:{language_label:"ভাষা বাছনি কৰক", main_navigation:"মূল নেভিগেচন", site_title:"MINDMATE - SIH 26003", brand_sub:"আপোনাৰ জ্ঞানীয় যত্নৰ সহায়ক", one_step:"এটা এটাকৈ খোজ", offline_ready:"অফলাইনত সাজু", saved_device:"ডিভাইচত সংৰক্ষিত", what_do:"আপুনি কি কৰিব বিচাৰে?", choose_action:"এটা সহজ কাৰ্যকলাপ বাছনি কৰক।", play_game:"এটা খেল খেলক", talk_mindmate:"🎤 MINDMATEৰ সৈতে কথা পাতক", reminders_desc:"আজিৰ দৈনন্দিন কামৰ বাবে সহজ স্মৰণী।", add_reminder:"➕ স্মৰণী যোগ কৰক", dashboard_desc:"সংৰক্ষিত কাৰ্যকলাপৰ সহজ দৃশ্য।", memory:"স্মৃতি", recognition:"চিনাক্তকৰণ", medicine_label:"ঔষধ", water_label:"পানী", brain_activity_label:"মগজুৰ কাৰ্যকলাপ"},
  brx:{language_label:"रावथाइ बासार बाछ", main_navigation:"गाहाइ नेभिगेसन", site_title:"MINDMATE - SIH 26003", brand_sub:"नोंथांनि बिबांथिनाय गोनांनि मददगार", one_step:"खोन्दो खोन्दो", offline_ready:"अफलाइनाव सोझु", saved_device:"डिभाइसआव थिनाय", what_do:"नों मा खालामनो सानो?", choose_action:"मोनसे सोलेसिया खामानि बाछ", play_game:"खेल खालाम", talk_mindmate:"🎤 MINDMATE जों बुं", reminders_desc:"दिनैनि खामानिफोरनि खोथा-सोर।", add_reminder:"➕ खोथा-सोर दाजाब", dashboard_desc:"थिनाय खामानिनि सोलायसार", memory:"मोनसे", recognition:"सिनायथि", medicine_label:"दावाइ", water_label:"दै", brain_activity_label:"मोजां अनजिमा खामानि"},
  mni:{language_label:"লোল বাছি লৌ", main_navigation:"মুখ্য নেভিগেশন", site_title:"MINDMATE - SIH 26003", brand_sub:"নহাক্কী মস্তরাং সহায়ক", one_step:"খোন্দো খোন্দো", offline_ready:"অফলাইন প্রস্তুত", saved_device:"ডিভাইসদা থম্মা", what_do:"নহাক্না করিগুম্বা তৌগদ্রা?", choose_action:"মরাম অমা বাছি লৌ।", play_game:"গেম খেল্লো", talk_mindmate:"🎤 MINDMATE-গা হায়রো", reminders_desc:"নুমিৎকী খামাংগী নুংশি।", add_reminder:"➕ নুংশি হাপ্পু", dashboard_desc:"থম্মা খামাংগী মচাক", memory:"মেমরি", recognition:"সিনায়থি", medicine_label:"ওষুধ", water_label:"ঈশিং", brain_activity_label:"মস্তরাং খামাং"},
  lus:{language_label:"Tawng thlang rawh", main_navigation:"Navigation", site_title:"MINDMATE - SIH 26003", brand_sub:"I cognitive care tanpuina", one_step:"Step khat khat", offline_ready:"Offline-a a inpeih", saved_device:"Device-ah save", what_do:"Eng nge i tih duh?", choose_action:"Action awlsam pakhat thlang rawh.", play_game:"Game chhu", talk_mindmate:"🎤 MINDMATE hnenah kren rawh", reminders_desc:"Tuni routine atan reminders awlsam.", add_reminder:"➕ Reminder belh", dashboard_desc:"Activity record awlsam taka enna.", memory:"Memory", recognition:"Recognition", medicine_label:"Dawt", water_label:"Tui", brain_activity_label:"Brain activity"},
  kha:{language_label:"Jied ia ka ktien", main_navigation:"Ka navigation", site_title:"MINDMATE - SIH 26003", brand_sub:"U/Ka nongiarap jingmut jong phi", one_step:"Kawei ka sien", offline_ready:"Offline la pynkhreh", saved_device:"La pynsah ha device", what_do:"Kaei kaba phi kwah ban leh?", choose_action:"Jied ia ka kam kaba suk.", play_game:"Ialehkai", talk_mindmate:"🎤 Kren bad MINDMATE", reminders_desc:"Ki jingpynkynmaw na bynta ka routine mynta.", add_reminder:"➕ Pynbud jingpynkynmaw", dashboard_desc:"Ka jingpeit kaba suk ia ki kam ba la record.", memory:"Jingkynmaw", recognition:"Jingithuh", medicine_label:"Dawai", water_label:"Um", brain_activity_label:"Ka kam jingmut"}
};
Object.keys(nerCommon).forEach(function(lang){ Object.assign(translations[lang], nerCommon[lang]); });

/* Localized dynamic game/object content for all five NER packs. */
const nerObjectLists = {
  as:"🍎 আপেল · 📖 কিতাপ · 🕐 ঘড়ী",
  brx:"🍎 आपेल · 📖 बिलाइ · 🕐 घड़ि",
  mni:"🍎 আপেল · 📖 বই · 🕐 ঘড়ি",
  lus:"🍎 Apple · 📖 Book · 🕐 Clock",
  kha:"🍎 Apple · 📖 Kot · 🕐 Clock"
};
const nerCommandAliases = {
  as:{home:["মুখ্য পৃষ্ঠা","ঘৰ"],dashboard:["ড্যাশব'ৰ্ড"],games:["খেল","মগজুৰ খেল"],reminders:["স্মৰণী","স্মৰণীসমূহ"],caregiver:["যত্নদাতা"],memory:["স্মৃতি খেল","স্মৃতিৰ খেল"],help:["সহায়"]},
  brx:{home:["न' हाबफिन"],dashboard:["डेशब'र्ड"],games:["खेल"],reminders:["खोथा-सोर"],caregiver:["जिगिरनायगिरि"],memory:["मोनसे खेल"],help:["हेफाजाब"]},
  mni:{home:["নুমিত লুপ"],dashboard:["ডেশব'র্ড"],games:["গেম","মস্তরাং থৌরাং"],reminders:["নুংশি","নুংশিবসিং"],caregiver:["মাইবাং"],memory:["মেমরি গেম"],help:["সহায়"]},
  lus:{home:["home","ka ing"],dashboard:["dashboard"],games:["game","game te"],reminders:["reminder","reminders"],caregiver:["caregiver","nongsumar"],memory:["memory game"],help:["help","tanpuina"]},
  kha:{home:["ka ing"],dashboard:["dashboard"],games:["ki jingïalehkai","game"],reminders:["ki jingpynkynmaw"],caregiver:["nongsumar"],memory:["memory game"],help:["jingiarap"]}
};

/* =====================================================
   EXTENDED I18N: bind the remaining static interface text
===================================================== */
uiExtraTranslations.as = Object.assign({}, uiExtraTranslations.en, translations.as);
uiExtraTranslations.as.language_assamese = "অসমীয়া";

Object.keys(uiExtraTranslations).forEach(function(lang){
  if (translations[lang]) Object.assign(translations[lang], uiExtraTranslations[lang]);
});

const uiBindings = [
  ["Your cognitive care companion","brand_sub"],
  ["Simple. Supportive. Personal.","eyebrow"],
  ["🧠 Start Today's Activity","hero_start"],
  ["🎤 Talk to MINDMATE","talk_mindmate"],
  ["One step at a time","one_step"],
  ["Play a short activity, check your reminders, or talk with MINDMATE. You don't need to learn a complicated app.","one_step_desc"],
  ["Today's simple check-in","checkin_title"],
  ["Everything important is kept in one place.","checkin_desc"],
  ["Offline ready","offline_ready"],
  ["Saved on device","saved_device"],
  ["What would you like to do?","what_do"],
  ["Choose one simple action.","choose_action"],
  ["Play a Game","play_game"],
  ["Short memory activities designed to be easy to follow.","play_game_desc"],
  ["Speak naturally to ask about your score, reminders, or help.","talk_desc"],
  ["My Reminders","my_reminders"],
  ["See today's medicine, water, and brain-activity reminders.","my_reminders_desc"],
  ["No typing needed. Tap the microphone and speak in your selected language.","voice_help"],
  ["📷 Change photo","change_photo"],
  ["Familiar faces can make the experience more personal.","family_desc"],
  ["Short activities for memory and recognition.","games_desc"],
  ["← Home","home"],
  ["MEMORY","memory_goal"],
  ["RECOGNITION","recognition_goal"],
  ["Press Start, remember the number, then enter it.","game_instruction_seq"],
  ["Press Start and remember the objects.","object_instruction"],
  ["Prototype note: the current score and game logic are demonstration mechanisms. They are not a clinical diagnosis or validated cognitive assessment.","demo_games"],
  ["Simple prompts for today's routine.","reminders_desc"],
  ["8:00 AM · Medicine","medicine_time"],
  ["10:00 AM · Water","water_time"],
  ["6:00 PM · Brain activity","brain_time"],
  ["Appointment","appointment"],
  ["Keep upcoming medical appointments easy to remember.","appointment_desc"],
  ["Reminder content shown here is part of the current prototype. Full scheduled notifications and completion syncing are not claimed unless implemented by the application.","reminder_demo"],
  ["A simple view of activity recorded by this prototype.","dashboard_desc"],
  ["🧠 Practice now","practice_now"],
  ["🧠 Cognitive activity","cognitive_activity"],
  ["🔥 Current streak","current_streak"],
  ["🎯 Correct in a Row","card_correct_row"],
  ["🎯 Correct in a row","card_correct_row"],
  ["⏰ Today's reminders","card_reminders"],
  ["📴 Offline","card_offline_mode"],
  ["Current score","current_score"],
  ["Your current prototype activity score.","performance_desc"],
  ["Keep it simple.","keep_simple"],
  ["Short, regular activities are easier to follow than a crowded screen.","keep_simple_desc"],
  ["Today's focus","todays_focus"],
  ["Activity available","activity_available"],
  ["Try one memory game when you're ready.","activity_available_desc"],
  ["Offline storage","offline_storage"],
  ["Current prototype data is stored in this browser.","offline_storage_desc"],
  ["Important: this dashboard shows prototype activity metrics. It should not be interpreted as a medical assessment or dementia diagnosis.","dashboard_demo"],
  ["A more information-focused view for family or care teams.","caregiver_desc"],
  ["← Patient view","patient_view"],
  ["Patient activity overview","patient_overview"],
  ["Use the information below to understand engagement with the MINDMATE prototype.","patient_overview_desc"],
  ["Recorded correct answers","recorded_correct"],
  ["📅 Activity","activity"],
  ["Today","today"],
  ["Latest local activity view","latest_activity"],
  ["📴 Storage","storage"],
  ["Local","local"],
  ["Browser storage in prototype","storage_proto"],
  ["Activity categories can be expanded as the project grows.","cognitive_desc"],
  ["Memory","memory"],
  ["Number-sequence activity is available.","memory_desc"],
  ["Recognition","recognition"],
  ["Object-memory activity is available.","recognition_desc"],
  ["Adaptive difficulty","adaptive"],
  ["Not currently implemented as production AI; keep any adaptive behavior labeled as prototype.","adaptive_desc"],
  ["Alerts & routine","alerts_routine"],
  ["Hydration","hydration"],
  ["Caregiver view is monitoring-oriented, but the current prototype does not establish clinical risk, diagnosis, or a real remote-sync service.","caregiver_demo"]
];

function bindUiTranslations(){
  uiBindings.forEach(function(pair){
    const target = pair[0], key = pair[1];
    document.querySelectorAll("body *").forEach(function(el){
      if(el.children.length === 0 && el.textContent.trim() === target){
        el.setAttribute("data-key", key);
      }
    });
  });
}

function getCurrentLanguage(){
  return localStorage.getItem("mindmateLanguage") || "en";
}

function getCustomReminders(){
  try{
    const saved = JSON.parse(localStorage.getItem("mindmateCustomReminders") || "[]");
    return Array.isArray(saved) ? saved : [];
  }catch(e){ return []; }
}

function saveCustomReminders(list){
  localStorage.setItem("mindmateCustomReminders", JSON.stringify(list));
}

function formatReminderTime(value){
  if(!value) return "";
  const parts = value.split(":");
  let hour = Number(parts[0]), minute = parts[1] || "00";
  const suffix = hour >= 12 ? t("time_pm") : t("time_am");
  hour = hour % 12 || 12;
  return hour + ":" + minute + " " + suffix;
}

function renderCustomReminders(){
  const list = document.getElementById("customReminderList");
  if(!list) return;
  const reminders = getCustomReminders();
  list.innerHTML = "";
  if(reminders.length === 0){
    const empty = document.createElement("div");
    empty.className = "demo-note";
    empty.setAttribute("data-key","no_custom_reminders");
    empty.textContent = t("no_custom_reminders");
    list.appendChild(empty);
  }else{
    const heading = document.createElement("h2");
    heading.setAttribute("data-key","custom_reminders");
    heading.textContent = t("custom_reminders");
    list.appendChild(heading);
    reminders.sort(function(a,b){ return (a.time||"").localeCompare(b.time||""); });
    reminders.forEach(function(item){
      const card = document.createElement("div");
      card.className = "reminder custom-reminder";
      const icon = document.createElement("div"); icon.className="reminder-icon"; icon.textContent="🔔";
      const content = document.createElement("div"); content.className="reminder-content";
      const h3 = document.createElement("h3"); h3.textContent = formatReminderTime(item.time) + " · " + item.title;
      const p = document.createElement("p"); p.setAttribute("data-key","custom_reminders"); p.textContent = t("custom_reminders");
      content.append(h3,p);
      const del = document.createElement("button"); del.className="btn orange reminder-delete"; del.type="button"; del.setAttribute("data-id",String(item.id)); del.setAttribute("data-key","delete"); del.textContent=t("delete");
      card.append(icon,content,del);
      del.addEventListener("click",function(){ deleteCustomReminder(item.id); });
      list.appendChild(card);
    });
  }
  const count = 3 + reminders.length;
  const countEl = document.getElementById("todayReminderCount");
  if(countEl) countEl.textContent = count;
}

function toggleReminderForm(force){
  const form = document.getElementById("customReminderForm");
  if(!form) return;
  const open = typeof force === "boolean" ? force : !form.classList.contains("open");
  form.classList.toggle("open", open);
  if(open){
    const title = document.getElementById("customReminderTitle");
    if(title) title.focus();
  }
}

function saveCustomReminder(){
  const titleEl = document.getElementById("customReminderTitle");
  const timeEl = document.getElementById("customReminderTime");
  const title = titleEl ? titleEl.value.trim() : "";
  const time = timeEl ? timeEl.value : "";
  if(!title || !time){
    alert(t("reminder_required"));
    return;
  }
  const reminders = getCustomReminders();
  reminders.push({id: Date.now(), title:title, time:time});
  saveCustomReminders(reminders);
  if(titleEl) titleEl.value = "";
  if(timeEl) timeEl.value = "";
  toggleReminderForm(false);
  renderCustomReminders();
  alert(t("reminder_saved"));
}

function deleteCustomReminder(id){
  const reminders = getCustomReminders().filter(function(item){ return String(item.id) !== String(id); });
  saveCustomReminders(reminders);
  renderCustomReminders();
  alert(t("reminder_deleted"));
}

/* Replace the original language updater so every bound element,
   attributes, dynamic reminders, and generated profile text update together. */
window.changeLanguage = function(language){
  if(!translations[language]) language = "en";
  localStorage.setItem("mindmateLanguage", language);
  document.documentElement.lang = language;
  const texts = translations[language] || translations.en;

  document.querySelectorAll("[data-key]").forEach(function(element){
    const key = element.getAttribute("data-key");
    const value = texts[key] || translations.en[key];
    if(value !== undefined) element.innerText = value;
  });
  document.querySelectorAll("[data-key-placeholder]").forEach(function(element){
    const key = element.getAttribute("data-key-placeholder");
    const value = texts[key] || translations.en[key];
    if(value !== undefined) element.placeholder = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function(element){
    const key = element.getAttribute("data-i18n-aria");
    const value = texts[key] || translations.en[key];
    if(value !== undefined) element.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(function(element){
    const key = element.getAttribute("data-i18n-alt");
    const value = texts[key] || translations.en[key];
    if(value !== undefined) element.setAttribute("alt", value);
  });
  document.title = texts.site_title || translations.en.site_title;
  updateProfileDisplay();
  renderCustomReminders();

  const selector = document.getElementById("languageSelector");
  if(selector) selector.value = language;
  window.dispatchEvent(new CustomEvent("mindmate:languageChanged", {detail:{language:language}}));

  /* Re-apply values that are intentionally dynamic after translation. */
  const score = parseInt(localStorage.getItem("mindmateScore") || "72",10);
  const streak = parseInt(localStorage.getItem("mindmateStreak") || "0",10);
  const correct = parseInt(localStorage.getItem("mindmateCorrectStreak") || "0",10);
  const scoreEl = document.getElementById("score"); if(scoreEl) scoreEl.innerText = score + "%";
  const careScore = document.getElementById("careScore"); if(careScore) careScore.innerText = score + "%";
  const perf = document.getElementById("performanceText"); if(perf) perf.innerText = score + "%";
  const st = document.getElementById("streak"); if(st) st.innerText = streak + " " + t("v_days");
  const cst = document.getElementById("careStreak"); if(cst) cst.innerText = streak + " " + t("v_days");
  const cs = document.getElementById("correctStreak"); if(cs) cs.innerText = correct;
  const cc = document.getElementById("careCorrect"); if(cc) cc.innerText = correct;
};


/* Navigation labels used by the rebuilt Journey/role views. */
const navLocaleLabels = {
  en:{nav_journey:"My Journey",nav_healthworker:"Health Worker"},
  ta:{nav_journey:"எனது பயணம்",nav_healthworker:"சுகாதார பணியாளர்"},
  hi:{nav_journey:"मेरी यात्रा",nav_healthworker:"स्वास्थ्य कार्यकर्ता"},
  ml:{nav_journey:"എന്റെ യാത്ര",nav_healthworker:"ആരോഗ്യ പ്രവർത്തകൻ"},
  te:{nav_journey:"నా ప్రయాణం",nav_healthworker:"ఆరోగ్య కార్యకర్త"},
  kn:{nav_journey:"ನನ್ನ ಪ್ರಯಾಣ",nav_healthworker:"ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ"},
  as:{nav_journey:"মোৰ যাত্ৰা",nav_healthworker:"স্বাস্থ্যকৰ্মী"},
  brx:{nav_journey:"आंनि जारि",nav_healthworker:"स्वास्थ्‍य खामानि"},
  mni:{nav_journey:"ঐগী যাত্রা",nav_healthworker:"হেল্থ ৱৰ্কার"},
  lus:{nav_journey:"Ka Journey",nav_healthworker:"Health Worker"},
  kha:{nav_journey:"Ka Jingiaid",nav_healthworker:"Nongtrei ka koit ka khiah"}
};
Object.keys(navLocaleLabels).forEach(function(lang){ Object.assign(translations[lang], navLocaleLabels[lang]); });

function initMindmateEnhancements(){
  bindUiTranslations();
  renderCustomReminders();
  localStorage.setItem("mindmateLanguage", "en");
  window.changeLanguage("en");
}

/* Ensure this runs after the original onload setup and does not remove it. */
const originalMindmateOnload = window.onload;
window.onload = function(){
  if(typeof originalMindmateOnload === "function") originalMindmateOnload();
  initMindmateEnhancements();
};


/* Accessibility labels for form fields */
document.addEventListener("DOMContentLoaded", function(){
  const fields = [
    ["nameInput","ph_name"],["ageInput","ph_age"],["emergencyInput","ph_emergency"],
    ["caregiverInput","ph_caregiver_name"],["relationshipInput","ph_relationship"],
    ["cityInput","ph_city"],["gameInput","ph_enter_sequence"],["objectInput","ph_enter_objects"],
    ["fatherName","ph_father_name"],["motherName","ph_mother_name"],
    ["daughterName","ph_daughter_name"],["sonName","ph_son_name"]
  ];
  fields.forEach(function(pair){
    const el=document.getElementById(pair[0]);
    if(el) el.setAttribute("data-i18n-aria",pair[1]);
  });
});


/* Final UI binding patch for remaining static strings */
Object.assign(translations.en, {
  profile_desc:"Keep your basic details and family contacts available on this device.",
  shown_medicine:"8:00 AM reminder shown.", shown_hydration:"10:00 AM reminder shown.", shown_brain:"6:00 PM reminder shown.",
  brain_activity_label:"Brain activity"
});
Object.assign(translations.ta, {
  profile_desc:"உங்கள் அடிப்படை விவரங்களையும் குடும்ப தொடர்புகளையும் இந்த சாதனத்தில் வைத்திருக்கவும்.",
  shown_medicine:"காலை 8:00 நினைவூட்டல் காட்டப்படுகிறது.", shown_hydration:"காலை 10:00 நினைவூட்டல் காட்டப்படுகிறது.", shown_brain:"மாலை 6:00 நினைவூட்டல் காட்டப்படுகிறது.",
  brain_activity_label:"மூளை செயல்பாடு"
});
Object.assign(translations.hi, {
  profile_desc:"अपनी बुनियादी जानकारी और परिवार के संपर्क इस डिवाइस पर रखें.",
  shown_medicine:"सुबह 8:00 का रिमाइंडर दिखाया गया है.", shown_hydration:"सुबह 10:00 का रिमाइंडर दिखाया गया है.", shown_brain:"शाम 6:00 का रिमाइंडर दिखाया गया है.",
  brain_activity_label:"मस्तिष्क गतिविधि"
});
Object.assign(translations.ml, {
  profile_desc:"നിങ്ങളുടെ അടിസ്ഥാന വിവരങ്ങളും കുടുംബ ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും ഈ ഉപകരണത്തിൽ സൂക്ഷിക്കുക.",
  shown_medicine:"രാവിലെ 8:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.", shown_hydration:"രാവിലെ 10:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.", shown_brain:"വൈകിട്ട് 6:00 ഓർമ്മപ്പെടുത്തൽ കാണിക്കുന്നു.",
  brain_activity_label:"മസ്തിഷ്ക പ്രവർത്തനം"
});
Object.assign(translations.te, {
  profile_desc:"మీ ప్రాథమిక వివరాలు మరియు కుటుంబ సంప్రదింపు వివరాలను ఈ పరికరంలో ఉంచండి.",
  shown_medicine:"ఉదయం 8:00 రిమైండర్ చూపబడింది.", shown_hydration:"ఉదయం 10:00 రిమైండర్ చూపబడింది.", shown_brain:"సాయంత్రం 6:00 రిమైండర్ చూపబడింది.",
  brain_activity_label:"మెదడు కార్యకలాపం"
});
Object.assign(translations.kn, {
  profile_desc:"ನಿಮ್ಮ ಮೂಲ ವಿವರಗಳು ಮತ್ತು ಕುಟುಂಬ ಸಂಪರ್ಕಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಇರಿಸಿ.",
  shown_medicine:"ಬೆಳಿಗ್ಗೆ 8:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.", shown_hydration:"ಬೆಳಿಗ್ಗೆ 10:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.", shown_brain:"ಸಂಜೆ 6:00 ಜ್ಞಾಪನೆ ತೋರಿಸಲಾಗಿದೆ.",
  brain_activity_label:"ಮೆದುಳಿನ ಚಟುವಟಿಕೆ"
});

uiBindings.push(
  ["Keep your basic details and family contacts available on this device.","profile_desc"],
  ["Medicine","reminder_medicine"], ["Water","reminder_water"], ["Brain activity","brain_activity_label"],
  ["Medicine reminder","reminder_medicine"], ["Drink water","reminder_water"], ["Brain exercise","reminder_brain"],
  ["8:00 AM reminder shown.","shown_medicine"], ["10:00 AM reminder shown.","shown_hydration"], ["6:00 PM reminder shown.","shown_brain"]
);

/* Object-memory answers are localized too, while English aliases remain accepted. */
const localizedObjectAnswers = {
  en:["apple book clock","apple - book - clock"],
  ta:["ஆப்பிள் புத்தகம் கடிகாரம்","ஆப்பிள் - புத்தகம் - கடிகாரம்"],
  hi:["सेब किताब घड़ी","सेब - किताब - घड़ी"],
  ml:["ആപ്പിൾ പുസ്തകം ക്ലോക്ക്","ആപ്പിൾ - പുസ്തകം - ക്ലോക്ക്"],
  te:["ఆపిల్ పుస్తకం గడియారం","ఆపిల్ - పుస్తకం - గడియారం"],
  kn:["ಸೇಬು ಪುಸ್ತಕ ಗಡಿಯಾರ","ಸೇಬು - ಪುಸ್ತಕ - ಗಡಿಯಾರ"],
  as:["আপেল কিতাপ ঘড়ী","আপেল - কিতাপ - ঘড়ী"]
};

function normalizeGameText(value){
  return String(value || "").toLowerCase().replace(/[·•,;|]/g," ").replace(/\s*[-–—]\s*/g," ").replace(/\s+/g," ").trim();
}

/* Patch the object game without removing the existing game logic. */
const originalStartObjectGame = window.startObjectGame;
window.startObjectGame = function(){
  const lang=getCurrentLanguage();
  const list = {
    en:"🍎 Apple · 📖 Book · 🕐 Clock",
    ta:"🍎 ஆப்பிள் · 📖 புத்தகம் · 🕐 கடிகாரம்",
    hi:"🍎 सेब · 📖 किताब · 🕐 घड़ी",
    ml:"🍎 ആപ്പിൾ · 📖 പുസ്തകം · 🕐 ക്ലോക്ക്",
    te:"🍎 ఆపిల్ · 📖 పుస్తకం · 🕐 గడియారం",
    kn:"🍎 ಸೇಬು · 📖 ಪುಸ್ತಕ · 🕐 ಗಡಿಯಾರ",
    as:"🍎 আপেল · 📖 কিতাপ · 🕐 ঘড়ী"
  };
  objectAnswer = localizedObjectAnswers[lang][0];
  gameType = "object";
  document.getElementById("objects").innerText = list[lang] || list.en;
  document.getElementById("objectResult").innerText = t("object_remember");
  setTimeout(function(){
    const el=document.getElementById("objects");
    if(el) el.innerText="❓ ❓ ❓";
  },3000);
};

const originalCheckObjectAnswer = window.checkObjectAnswer;
window.checkObjectAnswer = function(){
  const input=normalizeGameText(document.getElementById("objectInput").value);
  const lang=getCurrentLanguage();
  const accepted=(localizedObjectAnswers[lang] || localizedObjectAnswers.en).map(normalizeGameText);
  accepted.push("apple book clock");
  const result=document.getElementById("objectResult");
  if(accepted.indexOf(input)!==-1){
    correctStreak++;
    localStorage.setItem("mindmateCorrectStreak",correctStreak);
    let score=parseInt(localStorage.getItem("mindmateScore")||"72",10);
    score=Math.min(score+2,100);
    localStorage.setItem("mindmateScore",score);
    result.innerText="✅ "+t("msg_correct_prefix")+" "+correctStreak+" "+t("msg_correct_in_row");
  }else{
    correctStreak=0;
    localStorage.setItem("mindmateCorrectStreak",0);
    result.innerText="❌ "+t("msg_wrong_streak_reset");
  }
  document.getElementById("objectInput").value="";
  updateDashboard();
};

/* Make localized command words work with the existing voice assistant. */
const originalProcessVoiceCommand = window.processVoiceCommand;
window.processVoiceCommand = function(command){
  const c=String(command||"").toLowerCase();
  const aliases={
    home:["home","முகப்பு","முகப்புப்","होम","ഹോം","హోమ్","ಮುಖಪುಟ"],
    dashboard:["dashboard","டாஷ்போர்டு","டாஷ்போர்ட்","डैशबोर्ड","ഡാഷ്ബോർഡ്","డాష్‌బోర్డ్","ಡ್ಯಾಶ್‌ಬೋರ್ಡ್"],
    game:["game","games","விளையாட்டு","விளையாட்டுகள்","खेल","ഗെയിം","ഗെയിമുകൾ","ఆట","ఆటలు","ಆಟ"],
    reminder:["reminder","reminders","நினைவூட்டல்","நினைவூட்டல்கள்","रिमाइंडर","रिमाइंडर्स","ഓർമ്മപ്പെടുത്തൽ","ഓർമ്മപ്പെടുത്തലുകൾ","రిమైండర్","రిమైండర్లు","ಜ್ಞಾಪನೆ","ಜ್ಞಾಪನೆಗಳು"],
    caregiver:["caregiver","கேர்கிவர்","பராமரிப்பாளர்","केयरगिवर","परिचारक","കെയർഗിവർ","പരിചാരകൻ","కేర్‌గివర్","సంరక్షకుడు","ಕೇರ್‌ಗಿವರ್","ಆರೈಕೆದಾರ"],
    help:["help","உதவி","मदद","സഹായം","సహాయం","ಸಹಾಯ"]
  };
  const asAliases={home:["মুখ্য পৃষ্ঠা","মুখ্যপৃষ্ঠা","হোম"],dashboard:["ড্যাশব’ৰ্ড","ড্যাশব’ৰ্ড","ড্যাশবোর্ড"],game:["খেল","খেলসমূহ"],reminder:["স্মৰণী","স্মৰণীসমূহ"],caregiver:["যত্নদাতা"],help:["সহায়","সহায়তা"]};
  Object.keys(asAliases).forEach(function(k){ aliases[k]=aliases[k].concat(asAliases[k]); });
  function has(list){return list.some(function(x){return c.indexOf(x)!==-1;});}
  if(has(aliases.help)){ addChatBubble("user",command); speakReply(t("v_help")); return; }
  if(has(aliases.home)){ showPage("home"); const r=t("v_home"); addChatBubble("assistant",r); speakReply(r); return; }
  if(has(aliases.dashboard)){ showPage("dashboard"); const r=t("v_dashboard"); addChatBubble("assistant",r); speakReply(r); return; }
  if(has(aliases.game)){ showPage("games"); const r=t("v_games"); addChatBubble("assistant",r); speakReply(r); return; }
  if(has(aliases.reminder)){ showPage("reminders"); const r=t("v_reminders"); addChatBubble("assistant",r); speakReply(r); return; }
  if(has(aliases.caregiver)){ showPage("caregiver"); const r=t("v_caregiver"); addChatBubble("assistant",r); speakReply(r); return; }
  return originalProcessVoiceCommand(command);
};


/* Small label refinements for status cards */
Object.assign(translations.en,{medicine_label:"Medicine",water_label:"Water"});
Object.assign(translations.ta,{medicine_label:"மருந்து",water_label:"தண்ணீர்"});
Object.assign(translations.hi,{medicine_label:"दवा",water_label:"पानी"});
Object.assign(translations.ml,{medicine_label:"മരുന്ന്",water_label:"വെള്ളം"});
Object.assign(translations.te,{medicine_label:"మందు",water_label:"నీరు"});
Object.assign(translations.kn,{medicine_label:"ಔಷಧಿ",water_label:"ನೀರು"});
uiBindings.push(["Medicine","medicine_label"],["Water","water_label"]);


/* =====================================================
   ASSAMESE — APPLICATION-WIDE LOCALE COMPLETION
   This intentionally overrides the English fallback for every
   core UI/voice/game key used by the application.
===================================================== */
(function completeAssameseLocale(){
  const as = {
    lbl_caregiver_name:"যত্নদাতাৰ নাম", welcome:"MINDMATEলৈ স্বাগতম", subtitle:"স্মাৰ্ট জ্ঞানীয় যত্ন আৰু পৰিয়াল সহায়তা প্লেটফৰ্ম",
    nav_home:"মুখ্য পৃষ্ঠা", nav_dashboard:"ড্যাশব'ৰ্ড", nav_games:"মগজুৰ খেল", nav_reminders:"স্মৰণী", nav_caregiver:"যত্নদাতা",
    btn_open_dashboard:"ড্যাশব'ৰ্ড খোলক", profile_title:"👤 মোৰ প্ৰ'ফাইল", ph_name:"আপোনাৰ নাম লিখক", ph_age:"আপোনাৰ বয়স লিখক", ph_emergency:"জৰুৰীকালীন যোগাযোগ", ph_caregiver_name:"যত্নদাতাৰ নাম", ph_relationship:"সম্পৰ্ক", ph_city:"চহৰ",
    btn_save_profile:"💾 প্ৰ'ফাইল সংৰক্ষণ কৰক", btn_load_profile:"🔄 প্ৰ'ফাইল লোড কৰক", family_title:"👨‍👩‍👧‍👦 পৰিয়ালৰ সদস্য", lbl_father:"দেউতা", lbl_mother:"মা", lbl_daughter:"জীয়াৰী", lbl_son:"পুত্ৰ",
    ph_father_name:"দেউতাৰ নাম", ph_mother_name:"মাৰ নাম", ph_daughter_name:"জীয়াৰীৰ নাম", ph_son_name:"পুত্ৰৰ নাম", btn_save_family:"💾 পৰিয়ালৰ তথ্য সংৰক্ষণ কৰক",
    voice_title:"🎤 MINDMATE ভইচ সহায়ক", voice_click_speak:"বুটামটো টিপি কথা পাতক", btn_start_voice:"🎤 ভইচ সহায়ক আৰম্ভ কৰক", btn_stop:"⏹ বন্ধ কৰক",
    dashboard_title:"📊 ড্যাশব'ৰ্ড", card_cognitive_score:"🧠 জ্ঞানীয় স্ক'ৰ", card_current_streak:"🔥 বৰ্তমান ধাৰাবাহিকতা", card_correct_row:"🎯 একেৰাহে শুদ্ধ", card_reminders:"⏰ স্মৰণী", card_offline_mode:"📴 অফলাইন মোড",
    lbl_prototype_score:"প্ৰ'ট'টাইপ খেলৰ স্ক'ৰ", lbl_daily_streak:"দৈনিক ধাৰাবাহিকতা", lbl_consecutive_correct:"একেৰাহে শুদ্ধ উত্তৰ", lbl_today_reminders:"আজিৰ স্মৰণী", lbl_browser_storage:"ব্ৰাউজাৰ সংৰক্ষণ", status_on:"চালু",
    performance_title:"কাৰ্যক্ষমতা", games_title:"🧠 মগজুৰ খেল", memory_seq_title:"🔢 সংখ্যা স্মৃতি", memory_seq_desc:"সংখ্যাৰ ক্ৰমটো মনত ৰাখক।", press_start:"আৰম্ভ কৰক টিপক", btn_start_game:"খেল আৰম্ভ কৰক", ph_enter_sequence:"ক্ৰমটো লিখক", btn_check_answer:"উত্তৰ পৰীক্ষা কৰক",
    object_memory_title:"🧩 বস্তু স্মৃতি", object_memory_desc:"এই বস্তুবোৰ মনত ৰাখক:", object_memory_list:"আপেল - কিতাপ - ঘড়ী", btn_start_object_game:"বস্তুৰ খেল আৰম্ভ কৰক", ph_enter_objects:"বস্তুবোৰ লিখক",
    reminders_title:"⏰ স্মৰণী", reminder_medicine:"ঔষধৰ স্মৰণী", reminder_water:"পানী খাবলৈ স্মৰণী", reminder_brain:"মগজুৰ ব্যায়াম", caregiver_title:"👨‍⚕️ যত্নদাতাৰ ড্যাশব'ৰ্ড", card_correct_answers:"🎯 শুদ্ধ উত্তৰ",
    footer_line1:"🧠 MINDMATE | SIH 26003 প্ৰ'ট'টাইপ", footer_line2:"স্মাৰ্ট জ্ঞানীয় যত্ন আৰু পৰিয়াল সহায়তা", alert_profile_saved:"প্ৰ'ফাইল সফলভাৱে সংৰক্ষণ কৰা হ'ল!", alert_family_saved:"পৰিয়ালৰ তথ্য সংৰক্ষণ কৰা হ'ল!",
    saved_profile_title:"সংৰক্ষিত প্ৰ'ফাইল", lbl_name:"নাম", lbl_age:"বয়স", lbl_emergency:"জৰুৰীকালীন যোগাযোগ", lbl_caregiver:"যত্নদাতা", lbl_relationship:"সম্পৰ্ক", lbl_city:"চহৰ",
    game_remember_number:"সংখ্যাটো মনত ৰাখক!", msg_correct_prefix:"শুদ্ধ!", msg_correct_in_row:"একেৰাহে শুদ্ধ!", msg_wrong_reset_full:"ভুল! শুদ্ধ ধাৰাবাহিকতা ০লৈ পুনৰ স্থাপন কৰা হ'ল।", msg_wrong_streak_reset:"ভুল! ধাৰাবাহিকতা পুনৰ আৰম্ভ হ'ল।", object_remember:"বস্তুবোৰ মনত ৰাখক!",
    voice_not_supported:"এই ব্ৰাউজাৰত ভইচ চিনাক্তকৰণ সমৰ্থিত নহয়।", voice_listening:"শুনি আছোঁ... এতিয়া কথা পাতক", voice_you_said:"আপুনি ক'লে:", voice_not_understood:"বুজিব পৰা নগ'ল। আকৌ চেষ্টা কৰক।", voice_stopped:"ভইচ সহায়ক বন্ধ কৰা হৈছে।",
    v_home:"মুখ্য পৃষ্ঠা খোলা হৈছে।", v_dashboard:"ড্যাশব'ৰ্ড খোলা হৈছে।", v_games:"মগজুৰ খেল খোলা হৈছে।", v_reminders:"আপোনাৰ স্মৰণী খোলা হৈছে।", v_caregiver:"যত্নদাতাৰ ড্যাশব'ৰ্ড খোলা হৈছে।", v_start_memory:"সংখ্যা স্মৃতি খেল আৰম্ভ হৈছে।",
    v_streak_prefix:"আপোনাৰ দৈনিক ধাৰাবাহিকতা", v_days:"দিন।", v_correct_prefix:"আপোনাৰ", v_correct_suffix:"টা শুদ্ধ উত্তৰ একেৰাহে আছে।", v_score_prefix:"আপোনাৰ বৰ্তমানৰ প্ৰ'ট'টাইপ স্ক'ৰ", v_percent:"শতাংশ।",
    v_name_prefix:"আপোনাৰ নাম", v_name_not_saved:"আপোনাৰ নাম এতিয়াও সংৰক্ষণ কৰা হোৱা নাই।", v_age_prefix:"আপোনাৰ বয়স", v_not_saved:"সংৰক্ষণ কৰা হোৱা নাই।", v_caregiver_prefix:"আপোনাৰ যত্নদাতা", v_help:"আপুনি মুখ্য পৃষ্ঠা, ড্যাশব'ৰ্ড, খেল, স্মৰণী বা যত্নদাতা বুলি ক'ব পাৰে।", v_not_understood:"আপোনাৰ কথা বুজিব পৰা নগ'ল। আকৌ চেষ্টা কৰক।",
    v_greeting:"নমস্কাৰ! মই MINDMATE। আজি আপোনাক সহায় কৰিবলৈ সাজু।", v_hello:"নমস্কাৰ! আপোনাক লগ পাই ভাল লাগিল।", v_how_are_you:"মই ভালেই আছোঁ। আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?", v_thanks:"আপোনাক স্বাগতম।", v_bye:"বিদায়। সুস্থ থাকক।", v_who_are_you:"মই MINDMATE, আপোনাৰ জ্ঞানীয় যত্নৰ সহায়ক।", v_time_prefix:"বৰ্তমান সময় হৈছে",
    chip_hello:"👋 নমস্কাৰ", chip_score:"📊 মোৰ স্ক'ৰ", chip_streak:"🔥 মোৰ ধাৰাবাহিকতা", chip_reminders:"⏰ মোৰ স্মৰণী", chip_game:"🧠 খেল খেলক", chip_help:"❓ সহায়",
    time_am:"পুৱা", time_pm:"সন্ধিয়া", site_title:"MINDMATE - SIH 26003", language_label:"ভাষা বাছনি কৰক", main_navigation:"মূল নেভিগেচন", todays_status:"আজিৰ অৱস্থা",
    language_english:"ইংৰাজী", language_tamil:"তামিল", language_hindi:"হিন্দী", language_malayalam:"মালয়ালম", language_telugu:"তেলুগু", language_kannada:"কন্নড়", language_assamese:"অসমীয়া",
    brand_sub:"আপোনাৰ জ্ঞানীয় যত্নৰ সহায়ক", eyebrow:"🌿 সহজ। সহায়ক। ব্যক্তিগত।", hero_start:"🧠 আজিৰ কাৰ্যকলাপ আৰম্ভ কৰক", talk_mindmate:"🎤 MINDMATEৰ সৈতে কথা পাতক", one_step:"এটা এটাকৈ খোজ",
    one_step_desc:"এটা সৰু কাৰ্যকলাপ কৰক, স্মৰণী চাওক বা MINDMATEৰ সৈতে কথা পাতক। জটিল এপ শিকাৰ প্ৰয়োজন নাই।", checkin_title:"আজিৰ সহজ পৰীক্ষা", checkin_desc:"প্ৰয়োজনীয় সকলো একে ঠাইতে আছে।", offline_ready:"অফলাইনত সাজু", saved_device:"ডিভাইচত সংৰক্ষিত",
    what_do:"আপুনি কি কৰিব বিচাৰে?", choose_action:"এটা সহজ কাৰ্যকলাপ বাছনি কৰক।", play_game:"এটা খেল খেলক", play_game_desc:"সহজে অনুসৰণ কৰিব পৰা সৰু স্মৃতি কাৰ্যকলাপ।", talk_desc:"আপোনাৰ স্ক'ৰ, স্মৰণী বা সহায়ৰ বিষয়ে স্বাভাৱিকভাৱে কওক।", my_reminders:"মোৰ স্মৰণীসমূহ", my_reminders_desc:"আজিৰ ঔষধ, পানী আৰু মগজুৰ কাৰ্যকলাপৰ স্মৰণী চাওক।", voice_help:"টাইপ কৰাৰ প্ৰয়োজন নাই। মাইক্ৰ'ফোন টিপি নিৰ্বাচিত ভাষাত কথা পাতক।",
    change_photo:"📷 ফটো সলনি কৰক", family_desc:"চিনাকি মুখে অভিজ্ঞতাটো অধিক ব্যক্তিগত কৰিব পাৰে।", games_desc:"স্মৃতি আৰু চিনাক্তকৰণৰ বাবে সৰু সৰু কাৰ্যকলাপ।", home:"← মুখ্য পৃষ্ঠা", memory_goal:"স্মৃতি", recognition_goal:"চিনাক্তকৰণ",
    game_instruction_seq:"আৰম্ভ কৰক টিপক, সংখ্যাটো মনত ৰাখক, তাৰ পিছত লিখক।", object_instruction:"আৰম্ভ কৰক টিপক আৰু বস্তুবোৰ মনত ৰাখক।", reminders_desc:"আজিৰ দৈনন্দিন কামৰ বাবে সহজ স্মৰণী।", medicine_time:"পুৱা ৮:০০ · ঔষধ", water_time:"পুৱা ১০:০০ · পানী", brain_time:"সন্ধিয়া ৬:০০ · মগজুৰ কাৰ্যকলাপ", appointment:"এপইণ্টমেণ্ট", appointment_desc:"আগন্তুক চিকিৎসা এপইণ্টমেণ্ট সহজে মনত ৰাখক।",
    add_reminder:"➕ স্মৰণী যোগ কৰক", custom_reminders:"নিজৰ স্মৰণী", reminder_title_label:"স্মৰণীৰ নাম", reminder_title_placeholder:"স্মৰণীৰ নাম লিখক", reminder_time_label:"সময়", save_reminder:"💾 স্মৰণী সংৰক্ষণ কৰক", cancel:"বাতিল", delete:"মচি পেলাওক", no_custom_reminders:"এতিয়ালৈ কোনো নিজৰ স্মৰণী নাই।", reminder_required:"স্মৰণীৰ নাম আৰু সময় দুয়োটা লিখক।", reminder_saved:"স্মৰণী সফলভাৱে সংৰক্ষণ কৰা হ'ল!", reminder_deleted:"স্মৰণী মচি পেলোৱা হ'ল।",
    dashboard_desc:"MINDMATEত সংৰক্ষিত কাৰ্যকলাপৰ সহজ দৃশ্য।", practice_now:"🧠 এতিয়া অনুশীলন কৰক", cognitive_activity:"🧠 জ্ঞানীয় কাৰ্যকলাপ", current_streak:"🔥 বৰ্তমান ধাৰাবাহিকতা", current_score:"বৰ্তমান স্ক'ৰ", performance_desc:"আপোনাৰ বৰ্তমানৰ কাৰ্যকলাপৰ স্ক'ৰ।", keep_simple:"সহজ কৰি ৰাখক।", keep_simple_desc:"সৰু আৰু নিয়মীয়া কাৰ্যকলাপ ব্যস্ত পৰ্দাতকৈ অনুসৰণ কৰাটো সহজ।", todays_focus:"আজিৰ লক্ষ্য", activity_available:"কাৰ্যকলাপ উপলব্ধ", activity_available_desc:"যেতিয়া সাজু হ'ব, এটা স্মৃতি খেল চেষ্টা কৰক।",
    offline_storage:"অফলাইন সংৰক্ষণ", offline_storage_desc:"বৰ্তমানৰ তথ্য এই ব্ৰাউজাৰত সংৰক্ষিত।", dashboard_demo:"গুৰুত্বপূৰ্ণ: এই ড্যাশব'ৰ্ডে প্ৰ'ট'টাইপৰ কাৰ্যকলাপৰ তথ্য দেখুৱায়। ইয়াক চিকিৎসাগত মূল্যায়ন বা ডিমেনচিয়াৰ নিৰ্ণয় বুলি নাভাবিব।", caregiver_desc:"পৰিয়াল বা যত্নদাতা দলৰ বাবে অধিক তথ্যভিত্তিক দৃশ্য।", patient_view:"← ৰোগীৰ দৃশ্য", patient_overview:"ৰোগীৰ কাৰ্যকলাপৰ সাৰাংশ", patient_overview_desc:"তলৰ তথ্য ব্যৱহাৰ কৰি MINDMATE ব্যৱহাৰৰ ধাৰা বুজক।",
    recorded_correct:"শুদ্ধ উত্তৰ সংৰক্ষিত", activity:"📅 কাৰ্যকলাপ", today:"আজি", latest_activity:"শেহতীয়া স্থানীয় কাৰ্যকলাপ", storage:"📴 সংৰক্ষণ", local:"স্থানীয়", storage_proto:"প্ৰ'ট'টাইপৰ ব্ৰাউজাৰ সংৰক্ষণ", cognitive_desc:"প্ৰকল্প বৃদ্ধি পোৱাৰ লগে লগে কাৰ্যকলাপৰ শ্ৰেণী বৃদ্ধি কৰিব পাৰি।", memory:"স্মৃতি", memory_desc:"সংখ্যাৰ ক্ৰমৰ কাৰ্যকলাপ উপলব্ধ।", recognition:"চিনাক্তকৰণ", recognition_desc:"বস্তু স্মৃতিৰ কাৰ্যকলাপ উপলব্ধ।", adaptive:"অনুকূলিত অসুবিধা", adaptive_desc:"ব্যক্তিগত কাৰ্যক্ষমতাৰ ওপৰত ভিত্তি কৰি প্ৰ'ট'টাইপ অনুকূলন।", alerts_routine:"সতৰ্কতা আৰু দৈনন্দিন ৰুটিন", hydration:"পানী গ্ৰহণ", caregiver_demo:"যত্নদাতাৰ দৃশ্যটো নিৰীক্ষণৰ বাবে। ই চিকিৎসাগত বিপদ, নিৰ্ণয় বা প্ৰকৃত দূৰৱৰ্তী ছিংক স্থাপন নকৰে।",
    profile_desc:"আপোনাৰ মৌলিক তথ্য আৰু পৰিয়ালৰ যোগাযোগ এই ডিভাইচত ৰাখক।", shown_medicine:"পুৱা ৮:০০ৰ স্মৰণী দেখুওৱা হৈছে।", shown_hydration:"পুৱা ১০:০০ৰ স্মৰণী দেখুওৱা হৈছে।", shown_brain:"সন্ধিয়া ৬:০০ৰ স্মৰণী দেখুওৱা হৈছে।", brain_activity_label:"মগজুৰ কাৰ্যকলাপ", medicine_label:"ঔষধ", water_label:"পানী", time_8am:"পুৱা ৮:০০", time_10am:"পুৱা ১০:০০", time_6pm:"সন্ধিয়া ৬:০০", microphone_alt:"ভইচ সহায়কৰ মাইক্ৰ'ফোন", aria_enter_number:"মনত ৰখা সংখ্যাটো লিখক", aria_enter_objects:"মনত ৰখা বস্তুবোৰ লিখক", performance_aria:"কাৰ্যক্ষমতা",
    demo_games:"প্ৰ'ট'টাইপ টোকা: বৰ্তমানৰ স্ক'ৰ আৰু খেলৰ যুক্তি প্ৰদৰ্শনৰ বাবে। এইটো চিকিৎসাগত নিৰ্ণয় বা প্ৰমাণিত জ্ঞানীয় মূল্যায়ন নহয়।", reminder_demo:"এই স্মৰণীৰ তথ্য প্ৰ'ট'টাইপৰ অংশ। প্ৰকৃত scheduled notification আৰু completion sync কেৱল বাস্তৱত সংযোগ কৰা থাকিলেহে দাবী কৰা হয়।"
  };
  Object.assign(translations.as, as);
  Object.assign(uiExtraTranslations.as, as);
  /* Ensure the selector itself has a localized Assamese label. */
  const option = document.querySelector('#languageSelector option[value="as"]');
  if(option) option.textContent = "অসমীয়া";
})();
