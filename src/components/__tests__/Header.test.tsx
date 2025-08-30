import React from 'react';
import { render } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders with title and subtitle snapshot', () => {
    const { asFragment } = render(<Header title="Hello" subtitle="World" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

