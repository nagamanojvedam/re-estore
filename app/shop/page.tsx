import ProductList from '@/components/products/ProductList';
import config from '@/lib/utils/config';
import axios from 'axios';

import ActiveFilters from '@/components/shop/ActiveFilters';
import SidebarFilters from '@components/shop/SidebarFilters';
import Pagination from '@/components/common/Pagination';

async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queries = await searchParams;
  queries.limit = config.items_per_page;
  queries.isActive = 'true';

  const queryString = new URLSearchParams(queries as any).toString();

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
            <ActiveFilters total={pagination?.total || 0} filters={queries} />

            <ProductList products={products} />

            {/* Pagination - Client Component */}
            {pagination.pages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                searchParams={queries}
                href="/shop"
                allowedParams={[
                  'page',
                  'limit',
                  'sortOrder',
                  'sortBy',
                  'category',
                  'minPrice',
                  'maxPrice',
                  'minRating',
                ]}
                showInfo={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
