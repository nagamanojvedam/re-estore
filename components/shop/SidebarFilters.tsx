'use client';

import ProductFilter from '@/components/products/ProductFilter';
import { useRouter } from 'next/navigation';

export default function ClientFilters({
  searchParams,
  total,
}: {
  searchParams: any;
  total: number;
}) {
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleChange = (newFilters: any) => {
    Object.entries(newFilters).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/shop');
  };

  return (
    <ProductFilter
      filters={searchParams}
      onFilterChange={handleChange}
      onClearFilters={clearFilters}
      productCount={total}
    />
  );
}
