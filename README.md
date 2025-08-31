# Kooka Burra Sing

A mobile-first React web app for learning to sing with Kooka the Kookaburra.

## Features

- 🎤 Interactive singing lessons (Echo, Practice, Sound, Song)
- 🎯 Progressive skill tree with lesson unlocking and unit progress bars
- 🔥 Daily streaks with local carryover and reminder toast
- 🎧 Waveform preview and improved audio recording quality
- 🌐 Localization scaffold (en base) for UI strings
- 📱 Mobile-first responsive design
- 💾 Local storage for offline progress
- 🎨 Beautiful Kookaburra-themed UI

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context for app state
├── data/           # Sample lessons and units
├── models/         # TypeScript interfaces
├── pages/          # Page components
├── storage/        # LocalStorage utilities
└── theme/          # Design system and styles
```

## Mobile Optimization

The app is optimized for mobile devices with:
- Touch-friendly UI elements
- Responsive layouts
- iOS/Android viewport settings
- Overscroll behavior prevention
- App-capable meta tags

## Technologies

- React with TypeScript
- Vite for fast development
- React Router for navigation
- LocalStorage for persistence
- CSS-in-JS styling

## Notes

- i18n: strings live in `src/i18n/`, default locale set in `src/App.tsx`.
- Streak logic: handled in `src/context/AppContext.tsx` on lesson completion. Reminder toast appears on `SkillTreePage` if no completion today.
- Unit progress: `SkillTreePage` shows per-unit progress using `Progress` component.

## Credits

- Nursery rhyme audio sourced from BabyMozart (nursery_rhymes). Used for educational, non-commercial purposes with attribution.
