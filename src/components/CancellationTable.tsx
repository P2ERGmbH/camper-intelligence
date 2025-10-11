
import React from 'react';

interface Condition {
  daysCol: string;
  costCol: string;
}

interface CancellationTableProps {
  headline: string;
  conditions: Condition[];
}

const CancellationTable: React.FC<CancellationTableProps> = ({ headline, conditions }) => {
  return (
    <div className="my-8">
      <h4 className="text-lg font-bold">{headline}</h4>
      <table className="w-full">
        <tbody>
          <tr className="odd:bg-gray-100">
            <th className="p-2 text-left w-1/2">Days until takeover</th>
            <th className="p-2 text-left w-1/2">Fees</th>
          </tr>
          {conditions.map(({ daysCol, costCol }, index) => (
            <tr key={index} className="odd:bg-gray-100">
              <td className="p-2">{daysCol}</td>
              <td className="p-2">{costCol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancellationTable;
