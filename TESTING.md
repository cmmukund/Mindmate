# MINDMATE 2.0 Comprehensive Quality & Testing Guide

This document contains testing protocols for evaluators, judges, and developers.

---

## 1. Automated Test Suites

### A. Python Automated Test Suite
Run from project root:
```bash
python tests/run_tests.py
```
**Verification Points:**
- All 11 regional language content packs defined and populated.
- 5 Cognitive domains defined with localized titles.
- Voice command priority resolution (verifies `start memory game` is not intercepted by generic `game`, and `caregiver name` is not intercepted by `caregiver`).
- Adaptive AI math (high performance ➔ step up; low performance ➔ step down; steady performance ➔ hold).
- Boundary tests (difficulty strictly clamped to 1–5).
- Reminder adherence calculation (completed/snoozed/missed percentages).
- Role-based permissions matrix (patients blocked from caregiver/health worker/admin).
- PWA manifest & Service Worker module caching.
- XSS prevention (ensures safe DOM rendering).

### B. In-Browser Live Integration Test Suite
Start local server:
```bash
python -m http.server 8000
```
Open in browser:
```text
http://localhost:8000/test.html
```
Exercises real browser APIs:
- IndexedDB creation and session persistence.
- Insufficient data protection before 3 sessions.
- Difficulty recommendation changes with generated explanation strings.
- Reminder state transitions (`SCHEDULED` ➔ `COMPLETED`).
- Offline event queuing and reconnection synchronization.
- Voice command matching.
- Role PIN authentication.

---

## 2. 5-Minute Competition Demonstration Walkthrough

Click the **`🏆 5-Min Demo Tour`** button in the top navigation bar.

1. **Step 1 — Patient Journey:**
   - Opens the 10-minute Cognitive Journey.
   - Shows the 5 personalized domain activities with estimated duration.

2. **Step 2 — Genuine Explainable Adaptive AI:**
   - Tap **"Simulate Struggle (Level 3 ➔ 2)"**:
     - Telemetry records low accuracy and retries.
     - Adaptive Engine reduces difficulty: *"Difficulty: Level 3 ➔ Level 2. Reason: Recent accuracy was 45% with 2.0 average retries..."*
   - Tap **"Simulate Success (Level 2 ➔ 3)"**:
     - Telemetry records high accuracy and fast responses.
     - Adaptive Engine steps up difficulty: *"Difficulty: Level 2 ➔ Level 3. Reason: Recent accuracy is 98% with fast response times (1.9s)..."*

3. **Step 3 — Offline-First Operation:**
   - Tap **"Turn On Offline Mode"**:
     - System simulates network disconnect without needing browser DevTools.
     - Plays an activity and completes a reminder.
     - Status updates to: *"OFFLINE MODE ACTIVE: 2 event(s) waiting in local sync queue."*

4. **Step 4 — Reconnection & Synchronization:**
   - Tap **"Restore Online & Synchronize"**:
     - System reconnects.
     - Sync queue automatically pushes events through API adapter.
     - Duplicate protection is verified.
     - Status updates to: *"SYNC COMPLETE: 2 event(s) synchronized. Queue status: 0 pending."*

5. **Step 5 — Caregiver & Health Worker Dashboards:**
   - Opens Caregiver Dashboard.
   - Shows Activity Performance, Medicine Adherence %, Adaptive AI Explanations Feed, and Recent Activity Telemetry.

6. **Step 6 — Multilingual Localization:**
   - Select Assamese (`অসমীয়া`), Tamil (`தமிழ்`), or Hindi (`हिन्दी`).
   - Demonstrates culturally familiar objects (e.g. Diya/Chaki, Tea/Kahwa, Clock), regional daily routines, and audio voice prompts.

---

## 3. Manual Functional Verification Checklist

### Cognitive Domains
- [x] Memory Game: Number sequence memorization with adaptive length.
- [x] Attention Game: Visual search matrix (9, 16, or 25 tiles) with distraction filtering.
- [x] Routine Recall: Daily habits flow (Morning water ➔ Walk ➔ Breakfast ➔ Medicine ➔ Rest) with "What comes next?" prompt.
- [x] Recognition: Culturally familiar object match.
- [x] Engagement: Safe short stories with comprehension and elderly mood check-in.

### Adaptive AI & Baselines
- [x] Insufficient data state displayed before 3 sessions recorded.
- [x] Personal baseline established after 3+ sessions.
- [x] Baseline change indicators displayed (`↑ +4%`, `↓ -2%`, `─ Steady`).
- [x] Transparent explainable decision reason generated for every change.

### Reminders & Routines
- [x] Add new reminder with category selection.
- [x] State transitions: Scheduled, Triggered, Completed, Snoozed, Missed.
- [x] Real-time pop-up modal when reminder time arrives.
- [x] Adherence rate calculations: Completed %, Snoozed %, Missed %.

### Voice Assistant
- [x] High-priority specific commands execute before generic substrings.
- [x] Multilingual speech aliases supported for 11 regional languages.
- [x] Graceful text and TTS fallback.

### Accessibility & Assisted Mode
- [x] Large touch targets (≥ 64px).
- [x] Text-to-speech audio narration (`speakAloud`).
- [x] Floating "🔊 Repeat" audio button.
- [x] High contrast styling and visible focus rings.

### Care Ecosystem & RBAC
- [x] Role selector in header: Patient, Caregiver, Health Worker, Admin.
- [x] PIN verification for protected views (Caregiver: `1234`, Health Worker: `5678`, Admin: `9999`).
- [x] Non-medical disclaimer displayed on all monitoring dashboards.
