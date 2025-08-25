import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F7F7F7;
    color: #2C3E50;
    font-size: 16px;
    line-height: 1.6;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 12px;
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #4ECDC4;
    }
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