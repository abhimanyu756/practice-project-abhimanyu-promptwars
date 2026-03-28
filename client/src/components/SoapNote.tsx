import React from 'react';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string[];
}

interface SoapNoteProps {
  soap: SOAPNote;
}

const sections: { key: keyof SOAPNote; label: string; abbr: string }[] = [
  { key: 'subjective', label: 'Subjective', abbr: 'S' },
  { key: 'objective', label: 'Objective', abbr: 'O' },
  { key: 'assessment', label: 'Assessment', abbr: 'A' },
  { key: 'plan', label: 'Plan', abbr: 'P' },
];

export const SoapNote: React.FC<SoapNoteProps> = ({ soap }) => {
  return (
    <div
      className="glass-card glass-card--full"
      aria-label="Clinical SOAP Note"
    >
      <h3 className="data-card-title">
        &#x1F9EA; Clinical Dossier (S.O.A.P.)
      </h3>
      <dl className="stack stack--md">
        {sections.map(({ key, label, abbr }) => (
          <div key={key} className="stack stack--sm">
            <dt>
              <span className="badge badge--info">{abbr}</span>{' '}
              <strong className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                {label}
              </strong>
            </dt>
            <dd className="text-body" style={{ marginLeft: 0 }}>
              {key === 'plan' ? (
                <ol className="data-list" style={{ listStyle: 'decimal', paddingLeft: '20px' }}>
                  {(soap.plan || []).map((step, i) => (
                    <li key={i} style={{ paddingLeft: '4px' }}>{step}</li>
                  ))}
                </ol>
              ) : (
                <span className="text-secondary">{soap[key] as string}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
