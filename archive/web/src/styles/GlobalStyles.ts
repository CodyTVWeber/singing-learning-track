import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 80px;
    padding-bottom: 80px;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    outline: none;
    transition: all 0.3s ease;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, textarea {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: 2px solid ${theme.colors.featherLight};
    border-radius: ${theme.borderRadius.medium};
    padding: ${theme.spacing.md};
    transition: all 0.3s ease;
    background: ${theme.colors.surface};
    width: 100%;
    
    &:focus {
      border-color: ${theme.colors.secondary};
      box-shadow: 0 0 0 3px ${theme.colors.skyLight};
    }
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
    
    #root {
      padding-top: 70px;
      padding-bottom: 70px;
    }
  }
  
  /* Prevent pull-to-refresh on mobile */
  body {
    overscroll-behavior-y: contain;
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  .pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .bounce {
    animation: bounce 1s ease-in-out;
  }
`;