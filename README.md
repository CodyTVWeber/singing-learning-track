# Kooka Sing (React)

A mobile-first React web app for learning to sing with Kooka the Kookaburra.

## Features

- 🎤 Interactive singing lessons
- 🎯 Progressive skill tree with lesson unlocking
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

- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- LocalStorage for persistence
- CSS-in-JS styling

## Credits

- Nursery rhyme audio sourced from BabyMozart (nursery_rhymes). Used for educational, non-commercial purposes with attribution.