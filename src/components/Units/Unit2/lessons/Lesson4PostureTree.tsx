import React from 'react';
import { Container } from '../../../Container';
import { Card } from '../../../Card';
import { Button } from '../../../Button';
import { colors, fontSize, fontWeight, spacing } from '../../../../theme/theme';

interface Lesson4PostureTreeProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const Lesson4PostureTree: React.FC<Lesson4PostureTreeProps> = ({
  onComplete,
  onExit
}) => {
  return (
    <Container maxWidth="800px" style={{ paddingTop: spacing.xl }}>
      <Card variant="elevated" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginBottom: spacing.md }}>
          Posture: Tall Like a Tree - Coming Soon!
        </h2>
        <p style={{ marginBottom: spacing.lg }}>This lesson is being developed.</p>
        <Button onClick={onExit} variant="outline">Back to Unit</Button>
      </Card>
    </Container>
  );
};