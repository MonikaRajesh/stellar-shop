import { Star } from 'lucide-react';
import { classNames } from '@/utils/format';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function Rating({ value, count, size = 'sm', showCount = true }: RatingProps) {
  const px = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)));
          return (
            <span key={i} className="relative inline-block" style={{ width: px, height: px }}>
              <Star size={px} className="absolute inset-0 text-ink-200 dark:text-ink-700" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={px} className="text-warning-500 fill-warning-500" />
              </span>
            </span>
          );
        })}
      </div>
      <span className={classNames('font-semibold', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={classNames('text-muted', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
