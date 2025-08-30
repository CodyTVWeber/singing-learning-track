import React from 'react';
import { render } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders with links snapshot', () => {
    const { asFragment } = render(
      <Navbar
        brand={"Kooka"}
        links={[
          { label: 'Home', href: '#', active: true },
          { label: 'About', href: '#' },
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

