# Manual Test Script - Echo Lesson (Increment 1)

## Test Environment Setup
1. Run the app with `npm run dev`
2. Open browser developer console to see analytics events
3. Ensure microphone permissions are enabled in browser

## Test Flow

### 1. App Launch
- [ ] Navigate to http://localhost:5173
- [ ] Verify splash page loads
- [ ] Check console for `app_opened` analytics event

### 2. User Onboarding
- [ ] Click "Get Started"
- [ ] Enter name: "Test User"
- [ ] Select age group
- [ ] Click "Start Singing!"
- [ ] Verify redirect to skill tree page

### 3. Echo Lesson Flow
- [ ] On skill tree, verify first lesson "🔊 Echo with Kooka" is unlocked
- [ ] Click on the echo lesson
- [ ] Verify `lesson_started` event in console with lessonType: 'echo'

#### 3.1 Intro Screen
- [ ] Verify intro card displays with microphone emoji
- [ ] Text shows "Listen carefully to the sound, then repeat it back"
- [ ] Click "Let's Start!" button

#### 3.2 Listen Screen
- [ ] Verify ear emoji and "Listen Carefully" heading
- [ ] Prompt text shows "Koo-ka-bur-ra!"
- [ ] Audio player is visible
- [ ] Info message about pressing play is shown
- [ ] "My Turn!" button is disabled initially
- [ ] Click play on audio player
- [ ] Verify "My Turn!" button becomes enabled after audio plays
- [ ] Click "My Turn!" button
- [ ] Verify `recording_started` event in console

#### 3.3 Record Screen
- [ ] Verify "Your Turn!" heading
- [ ] Prompt reminder shows "Repeat: 'Koo-ka-bur-ra!'"
- [ ] Click "Start Recording" button
- [ ] Grant microphone permission if prompted
- [ ] Verify microphone icon animates (pulse effect)
- [ ] Speak into microphone (loud and clear)
- [ ] Verify volume meter shows feedback:
  - Low volume: "Speak louder"
  - Medium volume: "Good!"
  - High volume: "Great volume!"
- [ ] Verify progress bar shows recording time
- [ ] Click "Stop Recording" or wait for 10 second auto-stop
- [ ] Verify `recording_completed` event in console with averageVolume

#### 3.4 Review Screen
- [ ] Verify completion emoji (🌟 for pass, 💪 for needs improvement)
- [ ] Score is displayed (0-100 points)
- [ ] Audio player shows for recorded audio
- [ ] Click play to hear your recording
- [ ] If score < 70:
  - "Try Again" button is shown
  - Clicking returns to record screen
- [ ] Click "Continue" (or "Next Lesson" if failed)
- [ ] Verify `lesson_completed` event in console with score
- [ ] Verify `points_earned` event if score > 0

### 4. Completion & Progress
- [ ] Verify completion modal shows with confetti animation
- [ ] Points earned displayed (+10-100 points)
- [ ] Click "Back to Lessons"
- [ ] On skill tree, verify:
  - Echo lesson shows as completed
  - Next lesson (Belly Breathing) is now unlocked
  - User's total points increased
  - Streak shows as 1

### 5. Analytics Verification
Check that the following events were tracked in order:
1. `app_opened`
2. `lesson_started` (lessonType: 'echo')
3. `recording_started` 
4. `recording_completed` (with averageVolume)
5. `lesson_completed` (with score and passed status)
6. `points_earned` (with points value)
7. `streak_started` (first completion of a new streak) OR `streak_incremented` (continuation from yesterday)

## Edge Cases to Test

### Audio Permission Denied
- [ ] Deny microphone permission
- [ ] Verify error message appears
- [ ] Cannot proceed with recording

### Poor Audio Input
- [ ] Record with very low volume
- [ ] Verify low score and feedback
- [ ] "Try Again" option available

### Interruption Handling
- [ ] Start recording then navigate away
- [ ] Return to lesson
- [ ] Verify clean state (can start over)

## Performance Checks
- [ ] Page transitions are smooth
- [ ] No console errors during flow
- [ ] Recording starts within 1 second of button click
- [ ] Audio playback has no noticeable delay

## Notes
- Placeholder audio file is used (/audio/placeholder.mp3)
- In production, real audio files would be provided
- Analytics are logged to console in development mode

---

## Daily Streak Scenarios

### A. First Day Streak Start
- [ ] Ensure you are a fresh user (use onboarding or clear `kooka_sing_user` in LocalStorage)
- [ ] Complete the first lesson
- [ ] Verify a streak chip shows "1 day 🔥" in the skill tree header
- [ ] Verify a `streak_started` analytics event fired with `{ streakCount: 1 }`

### B. Next Day Streak Increment (simulate)
To simulate the next day without waiting:
1. Open DevTools > Application > Local Storage > `kooka_sing_user`
2. Edit the JSON value for `lastStreakDate` to yesterday's date (YYYY-MM-DD)
3. Refresh the app
4. Complete any lesson
5. Verify the streak chip shows "2 days 🔥"
6. Verify a `streak_incremented` analytics event fired with `{ streakCount: 2 }`

### C. Same-Day Multiple Completions
- [ ] Complete more than one lesson on the same calendar day
- [ ] Verify the streak count does not increase again that day
- [ ] No additional `streak_started`/`streak_incremented` events should fire
