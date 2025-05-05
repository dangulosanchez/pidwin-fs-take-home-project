// StreaksTable.tsx
import React from 'react';
import './StreaksTable.css';
// Types
import { StreaksTableProps } from '../../types/props';

const StreaksTable: React.FC<StreaksTableProps> = ({ streaks }) => {
  const sortedData = React.useMemo(
    () => [...streaks].sort((a, b) => b.streak - a.streak),
    [streaks]
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Streak</th>
            <th>Name</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.streak}</td>
              <td>{row.name}</td>
              <td>
                <span
                  className={`active-icon ${
                    row.active ? 'active-true' : 'active-false'
                  }`}
                >
                  {row.active ? '✓' : '×'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StreaksTable;
