import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { FunButton } from './FunButton';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

const VisualizerCanvas = styled.canvas`
  width: 100%;
  height: 150px;
  background-color: #F0F0F0;
  border-radius: ${theme.borderRadius.medium};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const RecordButton = styled(FunButton)<{ isRecording: boolean }>`
  ${({ isRecording }) => isRecording && `
    background-color: ${theme.colors.error};
    animation: pulse 1.5s ease-in-out infinite;
  `}
`;

const Timer = styled.div`
  font-size: ${theme.fonts.sizes.xlarge};
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  background-color: #FFF0F0;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.small};
  width: 100%;
  text-align: center;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

export const AudioRecorder: React.FC = () => {
  const {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    clearRecording,
    error,
    duration,
  } = useAudioRecorder();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRecording && canvasRef.current) {
      // Set up audio visualization
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = '#F0F0F0';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * canvas.height;

            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, theme.colors.primary);
            gradient.addColorStop(1, theme.colors.secondary);

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        };

        draw();
      });
    } else {
      // Clean up animation
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#F0F0F0';
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    await startRecording();
  };

  return (
    <RecorderContainer>
      <h2>🎤 Record Your Voice</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <VisualizerCanvas ref={canvasRef} />
      
      {isRecording && <Timer>{formatDuration(duration)}</Timer>}
      
      <ControlsContainer>
        {!isRecording && !audioURL && (
          <RecordButton
            onClick={handleStartRecording}
            size="large"
            variant="primary"
            isRecording={false}
          >
            🔴 Start Recording
          </RecordButton>
        )}
        
        {isRecording && (
          <RecordButton
            onClick={stopRecording}
            size="large"
            variant="warning"
            isRecording={true}
          >
            ⏹️ Stop Recording
          </RecordButton>
        )}
        
        {audioURL && !isRecording && (
          <>
            <FunButton
              onClick={handleStartRecording}
              size="large"
              variant="primary"
            >
              🔴 New Recording
            </FunButton>
            <FunButton
              onClick={clearRecording}
              size="large"
              variant="secondary"
            >
              🗑️ Clear
            </FunButton>
          </>
        )}
      </ControlsContainer>
      
      {audioURL && (
        <AudioPlayer controls src={audioURL}>
          Your browser does not support the audio element.
        </AudioPlayer>
      )}
    </RecorderContainer>
  );
};