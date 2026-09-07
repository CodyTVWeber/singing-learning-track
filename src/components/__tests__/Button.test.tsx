import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders primary medium button snapshot', () => {
    const { asFragment } = render(<Button>Click me</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('defaults type to button', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows explicit type submit', () => {
    const { getByRole } = render(<Button type="submit">Submit</Button>);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

