import Product from '@/models/Product';
import '@/models/User'; // Ensure User model is registered for population
import connectDB from '@utils/db';
import ProductCard from '../products/ProductCard';

async function FeaturedProducts() {
  await connectDB();
  
  // Fetch products directly from DB to avoid build-time API call issues
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('owner', 'name email') // Populate to match API behavior if needed, though ProductCard might not use owner
    .lean();

  // Serialize to plain objects to avoid "Only plain objects can be passed to Client Components" error
  const featuredProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredProducts?.map((product: any, index: number) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
}

export default FeaturedProducts;
