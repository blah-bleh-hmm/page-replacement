import { render, screen } from '@testing-library/react';
import React from 'react';
import ComparisonTable from '../components/ComparisonTable.jsx';

describe('ComparisonTable', () => {
  test('highlights best algorithm by faults', () => {
    const runs = [
      {
        key: 'a',
        algorithm: 'Algo A',
        summary: { faults: 1, hits: 4, hitRatio: 0.8 },
      },
      {
        key: 'b',
        algorithm: 'Algo B',
        summary: { faults: 3, hits: 2, hitRatio: 0.4 },
      },
    ];

    render(<ComparisonTable runs={runs} />);

    const bestRow = screen.getByText('Algo A').closest('tr');
    expect(bestRow).toHaveClass('best');
    expect(screen.getByText('🏅 Best (fewest faults)')).toBeInTheDocument();
    expect(screen.getByText('Algo B')).toBeInTheDocument();
  });
});
