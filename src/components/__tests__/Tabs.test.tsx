import React from 'react';
import { render } from '@testing-library/react';
import { Tabs } from '../Tabs';

describe('Tabs', () => {
  it('renders underline variant snapshot', () => {
    const { asFragment } = render(
      <Tabs
        variant="underline"
        tabs={[
          { id: 'a', label: 'A', content: <div>A</div> },
          { id: 'b', label: 'B', content: <div>B</div> },
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

