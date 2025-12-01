import Pagination from '@/components/common/Pagination';
import ProductReviewCard from '@/components/products/ProductReviewCard';
import config from '@/lib/utils/config';
import { cookies } from 'next/headers';

export default async function MyProducts({ searchParams }: { searchParams: { page?: string } }) {
  const params = await searchParams;

  const pageNumber = Number(params.page) || 1;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`${config.next.api.baseUrl}/users/me/products?page=${pageNumber}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const {
    data: { products, pagination },
  } = await res.json();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View purchased products and leave reviews
            </p>
          </div>

          {/* Products */}
          <div>
            {/* Product List */}
            <ul
              role="list"
              aria-label="Purchased products"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {products.map((item: any) => (
                <ProductReviewCard key={item._id} item={item} page={pageNumber} />
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={pagination.pages}
              searchParams={params}
              allowedParams={['page']}
              href="/my-products"
              showInfo={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
