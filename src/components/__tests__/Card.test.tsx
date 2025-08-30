import React from 'react';
import { render } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders with default padding snapshot', () => {
    const { asFragment } = render(<Card>Content</Card>);
    expect(asFragment()).toMatchSnapshot();
  });
});

