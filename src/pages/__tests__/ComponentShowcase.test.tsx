import React from 'react';
import { render } from '@testing-library/react';
import { ComponentShowcase } from '../ComponentShowcase';

describe('ComponentShowcase', () => {
  it('renders and matches snapshot', () => {
    const { asFragment } = render(<ComponentShowcase />);
    expect(asFragment()).toMatchSnapshot();
  });
});

