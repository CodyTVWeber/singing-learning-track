import React from 'react';
import { renderWithProviders } from '../../test/utils';
import { SplashPage } from '../SplashPage';

describe('SplashPage', () => {
  it('renders and matches snapshot', () => {
    const { asFragment } = renderWithProviders(<SplashPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

