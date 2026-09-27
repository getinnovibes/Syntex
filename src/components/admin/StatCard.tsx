import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  badge?: string;
  icon: string;
  progressPercent?: number;
  isPriority?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  badge,
  icon,
  progressPercent = 75,
  isPriority = false,
}) => {
  return (
    <div className="group relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] border border-outline-variant/30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
            isPriority
              ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(108,59,255,0.3)]'
              : 'bg-secondary-container text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span
          className={`font-headline-xl text-3xl md:text-headline-xl ${
            isPriority ? 'text-primary font-bold' : 'text-on-surface'
          }`}
        >
          {value}
        </span>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-semibold tracking-tight">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-1 font-body-sm text-body-sm text-secondary truncate">{subtext}</p>

      <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>
    </div>
  );
};
