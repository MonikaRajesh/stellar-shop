import { classNames } from '@/utils/format';

export function Skeleton({ className }: { className?: string }) {
  return <div className={classNames('skeleton rounded-xl', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-card border border-base bg-elevated p-4">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
      <Skeleton className="mt-3 h-5 w-1/2" />
      <Skeleton className="mt-3 h-9 w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
