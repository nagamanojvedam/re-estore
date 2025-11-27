'use client';

import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';

export default function ClientPagination({ currentPage, totalPages, searchParams }: any) {
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const onPageChange = (page: number) => {
    params.set('page', page.toString());
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showInfo
    />
  );
}
