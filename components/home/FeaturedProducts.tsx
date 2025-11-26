import config from "@utils/config";
import ProductCard from "../products/ProductCard";

async function FeaturedProducts() {

  const res = await fetch(`${config.next.api.baseUrl}/products?limit=8`);
  const { data: { products: featuredProducts } } = await res.json();


  return (<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {featuredProducts?.map((product: any, index: number) => (
      <ProductCard key={product._id} product={product} index={index} />
    ))}
  </div>)

}

export default FeaturedProducts
