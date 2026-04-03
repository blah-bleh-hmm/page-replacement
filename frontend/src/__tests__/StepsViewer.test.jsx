import { render, screen } from '@testing-library/react';
import React from 'react';
import StepsViewer from '../components/StepsViewer.jsx';

const runs = [
  {
    key: 'fifo',
    algorithm: 'FIFO',
    summary: { faults: 2, hits: 3, hitRatio: 0.6 },
    steps: [
      { index: 0, page: 1, frames: [1, 0], hit: false, replaced: 0 },
      { index: 1, page: 2, frames: [1, 2], hit: false, replaced: 1 },
      { index: 2, page: 1, frames: [1, 2], hit: true, replaced: null },
    ],
  },
];

describe('StepsViewer', () => {
  test('shows pagination and step rows', () => {
    render(<StepsViewer runs={runs} />);

    expect(screen.getByText(/Showing steps 1 – 3 of 3/)).toBeInTheDocument();
    expect(screen.getByText('FIFO')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4); // header + 3 rows
  });
});
