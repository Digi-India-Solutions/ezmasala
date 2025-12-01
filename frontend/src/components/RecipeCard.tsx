import Image from "next/image";
import Link from "next/link";

interface RecipeCardProps {
  recipe: any;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/cook/${recipe.slug}`} className="block h-full">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="aspect-video relative bg-gray-100 overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-xl mb-3 text-black group-hover:text-gray-600 transition">{recipe.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {recipe.steps?.length || 0} steps
            </span>
          </div>
          <h4 className="font-bold text-sm mb-2 text-gray-900">Key Ingredients:</h4>
          <ul className="text-sm text-gray-600 space-y-1.5 mb-5 flex-grow">
            {recipe.ingredients?.slice(0, 3).map((ingredient: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-black mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
            {recipe.ingredients?.length > 3 && <li className="text-gray-400 font-medium">+ {recipe.ingredients.length - 3} more ingredients...</li>}
          </ul>
          <div className="w-full bg-black text-white py-3 rounded-xl group-hover:bg-gray-900 transition-all duration-200 font-semibold shadow-md group-hover:shadow-lg transform group-hover:-translate-y-0.5 text-center">
            View Full Recipe
          </div>
        </div>
      </div>
    </Link>
  );
}
