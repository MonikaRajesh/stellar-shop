import { useEffect, useState } from 'react';
import { countdown } from '@/utils/format';

export function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(() => countdown(target));

  useEffect(() => {
    const t = setInterval(() => setTime(countdown(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (time.done) {
    return <span className="text-sm font-semibold text-error-500">Sale ended</span>;
  }

  const cells = [
    { label: 'Hrs', value: time.hours },
    { label: 'Min', value: time.minutes },
    { label: 'Sec', value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-center gap-2">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900">
            <span className="text-xl font-bold tabular-nums">{String(c.value).padStart(2, '0')}</span>
          </div>
          <span className="text-xs font-medium text-muted">{c.label}</span>
          {i < cells.length - 1 && <span className="text-xl font-bold text-muted">:</span>}
        </div>
      ))}
    </div>
  );
}
