import React from 'react';
import { TheoryStep as TheoryStepType } from '../../models/skillAssessment';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme/theme';
import ReactMarkdown from 'react-markdown';

interface TheoryStepProps {
  step: TheoryStepType;
  onComplete: (score: number) => void;
}

export const TheoryStep: React.FC<TheoryStepProps> = ({ step, onComplete }) => {
  const handleContinue = () => {
    // Theory steps always give full score when read
    onComplete(100);
  };

  return (
    <Card variant="elevated">
      <h3 style={{
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
      }}>
        <Icon name="info" size={24} />
        {step.title}
      </h3>
      
      <div style={{
        fontSize: fontSize.md,
        color: colors.text,
        lineHeight: 1.8,
        marginBottom: spacing.xl,
      }}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 style={{
                fontSize: fontSize.xxl,
                fontWeight: fontWeight.bold,
                color: colors.text,
                marginTop: spacing.lg,
                marginBottom: spacing.md,
              }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{
                fontSize: fontSize.xl,
                fontWeight: fontWeight.semibold,
                color: colors.text,
                marginTop: spacing.lg,
                marginBottom: spacing.md,
              }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{
                fontSize: fontSize.lg,
                fontWeight: fontWeight.semibold,
                color: colors.text,
                marginTop: spacing.md,
                marginBottom: spacing.sm,
              }}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p style={{
                marginBottom: spacing.md,
                lineHeight: 1.6,
              }}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul style={{
                marginLeft: spacing.lg,
                marginBottom: spacing.md,
              }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{
                marginLeft: spacing.lg,
                marginBottom: spacing.md,
              }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{
                marginBottom: spacing.sm,
                lineHeight: 1.6,
              }}>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong style={{
                fontWeight: fontWeight.bold,
                color: colors.primary,
              }}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em style={{
                fontStyle: 'italic',
                color: colors.textLight,
              }}>
                {children}
              </em>
            ),
          }}
        >
          {step.content}
        </ReactMarkdown>
      </div>

      {/* Media Section */}
      {step.media && step.media.length > 0 && (
        <div style={{ marginBottom: spacing.xl }}>
          {step.media.map((item, index) => (
            <div key={index} style={{ marginBottom: spacing.lg }}>
              {item.type === 'image' && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={item.url}
                    alt={item.caption || ''}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: borderRadius.md,
                      marginBottom: spacing.sm,
                    }}
                  />
                  {item.caption && (
                    <p style={{
                      fontSize: fontSize.sm,
                      color: colors.textLight,
                      fontStyle: 'italic',
                    }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
              {item.type === 'video' && (
                <div style={{ textAlign: 'center' }}>
                  <video
                    src={item.url}
                    controls
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: borderRadius.md,
                      marginBottom: spacing.sm,
                    }}
                  />
                  {item.caption && (
                    <p style={{
                      fontSize: fontSize.sm,
                      color: colors.textLight,
                      fontStyle: 'italic',
                    }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
              {item.type === 'audio' && (
                <div style={{ marginBottom: spacing.md }}>
                  <audio
                    src={item.url}
                    controls
                    style={{ width: '100%' }}
                  />
                  {item.caption && (
                    <p style={{
                      fontSize: fontSize.sm,
                      color: colors.textLight,
                      fontStyle: 'italic',
                      marginTop: spacing.sm,
                    }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <Button onClick={handleContinue} size="large" icon={<Icon name="forward" />} iconPosition="right">
          I've Read This - Continue
        </Button>
      </div>
    </Card>
  );
};