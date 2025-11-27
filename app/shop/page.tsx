import ProductList from '@/components/products/ProductList';
import { ENV } from '@/lib/utils/constants';
import config from '@/lib/utils/config';
import axios from 'axios';

import SidebarFilters from '@components/shop/SidebarFilters';
import ClientPagination from '@/components/shop/ShopPagination';

async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queries = await searchParams;

  console.log('queries', queries);

  const queryString = new URLSearchParams(queries as any).toString();

  console.log('query string', queryString);

  const {
    data: {
      data: { products, pagination },
    },
  } = await axios.get(`${config.next.api.baseUrl}/products?${queryString}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <h1 className="heading-2 mb-4 text-gray-900 dark:text-white">Shop All Products</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover our wide range of quality products
        </p>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          {/* CLIENT COMPONENT FILTERS */}
          <div className="sticky top-8 flex-shrink-0 lg:w-80">
            <SidebarFilters searchParams={queries} total={pagination?.total || 0} />
          </div>

          {/* PRODUCT LIST (server-rendered data) */}
          <div className="flex-1">
            <ProductList products={products} />

            {/* Pagination - Client Component */}
            {pagination.pages > 1 && (
              <ClientPagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                searchParams={queries}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
