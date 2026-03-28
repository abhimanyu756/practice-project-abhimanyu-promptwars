import React from 'react';

interface FirstAidStepsProps {
  steps: string[];
}

export const FirstAidSteps: React.FC<FirstAidStepsProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="glass-card" aria-label="Immediate relief protocol">
      <h3 className="data-card-title">&#x26A1; Immediate Relief Protocol</h3>
      <ol className="data-list" style={{ listStyle: 'decimal', paddingLeft: '20px' }}>
        {steps.map((step, i) => (
          <li key={i} className="text-body" style={{ paddingLeft: '4px' }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};
