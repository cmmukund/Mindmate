# MINDMATE — SIH26003 NER Cognitive-Engagement & Routine-Support Prototype

> **Notice:** MINDMATE provides cognitive engagement, routine support, and activity insights. It is not a medical diagnostic system and does not replace professional medical assessment.

---

## 1. System Overview & Architecture

MINDMATE is an elderly-friendly, competition-ready prototype for the North Eastern Region (NER). It focuses on local-first use, regional-language content, and caregiver awareness where connectivity and specialist access may be limited.

```text
                  MINDMATE
                     │
        ┌────────────┴────────────┐
        │                         │
   PATIENT APP              CARE ECOSYSTEM
        │                         │
        ▼                         ▼
 Cognitive Games            Caregiver Dashboard
 (5 Domains)                Health Worker View
        │                         │
        ▼                         │
 Personal Baseline               │
 (Insufficient-Data Guard)       │
        │                         │
        ▼                         │
 Adaptive Personalization ────────┘
        │
        ▼
 My Cognitive Journey
        │
        ├── Voice Assistant (Priority Order & Multilingual)
        ├── Routine & Reminder Engine (6 Lifecycle States & Adherence)
        ├── Assisted Mode (TTS, Large Targets, High Contrast)
        ├── Cultural Content Packs (11 Indian & Regional Languages)
        └── Offline Engine (IndexedDB v2 + Service Worker)
                 │
                 ▼
          Offline Sync Queue (Deduplication & Retry Tracking)
                 │
                 ▼
       Backend API Client (Local Mock Adapter / Cloud REST)
```

---

## 2. Core Implemented Features

### A. Five Cognitive Domains (Brain Games & Journey)
1. **Memory:** Sequence recall, number recall, delayed card memory. Dynamic sequence length scales with difficulty (3–7 digits).
2. **Attention:** Real-time visual search, distraction filtering, and target identification across variable grid matrices (9 to 25 tiles).
3. **Routine Recall:** Daily habit sequencing (Morning water ➔ Walk ➔ Breakfast ➔ Medicine ➔ Rest) with personalized questions.
4. **Pattern & Object Recognition:** Culturally familiar regional objects (Clay Lamp, Reading Book, Wall Clock, Chai Cup, Cane, Temple Bell) with visual matching.
5. **Mental & Emotional Engagement:** Safe, warm short stories with reflection questions and elderly mood check-in.

### B. Explainable Adaptive Personalization
- **Individualized Telemetry:** Accuracy, latency (ms), retries, and completion state tracked per session.
- **Personal Baseline:** Requires a minimum of 3 sessions per domain to establish baseline. If insufficient data exists, clearly warns: *"Complete X more session(s) to establish your personal baseline."* Never fabricates trends.
- **Adaptive Adjustments:**
  - High accuracy (≥ 85%) + brisk responses (< 4.5s) + 0 retries ➔ **Level stepped up (Level 1–5)**.
  - Low accuracy (≤ 60%) or repeated retries (≥ 1.2) or slow latency (> 9s) ➔ **Level stepped down**.
  - Consistent performance within range ➔ **Level held**.
- **Explainable Reasoning:** Every shift generates a transparent, plain-language reason displayed to users and caregivers.
- **Honest scope:** This is a local rules-based personalization engine, not a diagnostic, clinically validated, or trained ML model.

### C. Real Reminder Engine & Adherence Tracking
- **6-State Lifecycle:** `SCHEDULED`, `TRIGGERED`, `ACKNOWLEDGED`, `COMPLETED`, `SNOOZED`, `MISSED`.
- **Categories:** Medicine 💊, Hydration 💧, Meals 🍲, Walking/Exercise 🚶, Cognitive Activity 🧠, Clinic 📅, Custom ⏰.
- **Interactive UI:** Quick actions (`✓ Taken`, `⏱ Snooze 15m`, `✕ Missed`) and pop-up alerts.
- **Adherence Metrics:** Computes Completed %, Snoozed %, Missed %, plus category breakdowns (e.g. Medicine Adherence: 87%).

### D. Voice Assistant with Priority Resolution
- **Priority Resolution Engine:** Specific commands (`start memory game`, `start cognitive journey`, `remind me about my medicine`, `how did i perform today`) are evaluated strictly **before** generic words (`game`, `reminder`, `home`).
- **Multilingual Recognition:** Supports commands in English, Hindi, Tamil, Assamese, Malayalam, Telugu, Kannada, Bodo, Meitei, Mizo, and Khasi.

### E. Assisted Mode & Elderly-First UX
- **Toggle Button:** One-tap toggle in the header (`🧓 Assisted Mode: ON / OFF`).
- **Features:** 20px+ readable font, generous touch targets (> 64px), high contrast borders, automatic text-to-speech audio narration (`speakAloud`), and floating "🔊 Repeat" audio helper.

### F. Care Ecosystem & Role Previews
- **Roles:**
  - `PATIENT` (Default self-care view)
  - `CAREGIVER` — View local activity adherence, personalization explanations, and reminders needing follow-up.
  - `HEALTH WORKER` — View local longitudinal activity telemetry.
  - `ADMIN` — Inspect local prototype diagnostics.
- These are local UI previews for the competition demo, not production authentication or remote access control.

### G. Offline-First PWA & Synchronization Queue
- **IndexedDB v2:** Dedicated stores for `events`, `sessions`, `reminders`, `preferences`, `content`, `profiles`, and `audit_logs`.
- **Deduplication & Idempotency:** Synced event tokens ensure no duplicate records.
- **Network Status & Simulation:** Works completely without internet; includes an offline simulation mode for live evaluation.

### H. 5-Minute Competition Demonstration Runner
- Built-in guided runner (`🏆 5-Min Demo Tour` in header) that steps evaluators through:
  1. Patient Cognitive Journey
  2. Explainable Adaptive Personalization (Struggle ➔ Level drops with reason; Success ➔ Level rises with reason)
  3. Offline Mode Simulation & Local Event Queuing
  4. Reconnection & duplicate-safe local sync simulation
  5. Caregiver & Health Worker Adherence Dashboards
  6. Multilingual & Cultural Content Switching

---

## 3. Running the Application

A Service Worker requires HTTP(S). Run a local web server:

```bash
# Using Python
python -m http.server 8000
```

Open your browser to:
```text
http://localhost:8000
```

---

## 4. Running the Tests

### A. Python Automated Test Suite
Runs the 18 algorithmic and structural validation tests:
```bash
python tests/run_tests.py
```

### B. In-Browser Interactive Test Suite
Open the interactive test harness directly in your browser:
```text
http://localhost:8000/test.html
```
Exercises real IndexedDB operations, telemetry recording, baseline calculation, and voice priority resolution.

---

## 5. Honest Infrastructure Boundary
- The current build operates in **Local Mock Adapter Mode**, where all database records, synchronization queues, and telemetry are persisted locally in browser IndexedDB.
- The demo's role views, synchronization, and caregiver alerts are local prototype simulations. They do not provide remote monitoring, real authentication, secure cloud storage, or clinically validated care.
- The demo runner includes **Reset Demo Data** so a judge walkthrough can start from a predictable state.

## 6. Judge Demo (5 Minutes)
1. Show the NER context banner and choose Assamese, Bodo, Meitei, Khasi, or Mizo.
2. Start a cognitive activity and show the elderly-friendly controls.
3. Use the demo runner to show adaptive personalization from a successful or difficult attempt.
4. Turn on offline mode, complete a reminder, and point out the local queue.
5. Restore local demo connectivity and open the caregiver preview, including the “Needs attention” card.
6. State the boundary clearly: local-first prototype today; secure multi-user backend and verified notification delivery are the next implementation steps.
