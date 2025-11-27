import { StarIcon } from 'lucide-react';

function RenderStarts({ rating }) {
  return [...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      className={`h-5 w-5 ${
        i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-300 dark:text-gray-600'
      }`}
    />
  ));
}

export default RenderStarts;
