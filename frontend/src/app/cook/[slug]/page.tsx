import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

async function getRecipe(slug: string) {
  try {
    return await api.get(`/cooks/slug/${slug}`);
  } catch (error) {
    return null;
  }
}

async function getAllRecipes() {
  try {
    return await api.get('/cooks');
  } catch (error) {
    return [];
  }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  const allRecipes = await getAllRecipes();

  if (!recipe) {
    return (
      <div className="py-4 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Recipe Not Found</h1>
          <Link href="/cook" className="text-black font-semibold hover:underline">
            ← Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  const relatedRecipes = allRecipes
    .filter((r: any) => r._id !== recipe._id && r.category === recipe.category)
    .slice(0, 3);

  return (
    <div className="py-4 md:py-8 bg-gray-50">
      <article className="container mx-auto px-4 max-w-6xl">

        <Breadcrumb
          items={[
            { label: "Recipes", href: "/cook" },
            { label: recipe.title }
          ]}
        />

        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto bg-gray-100">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 md:p-8 lg:p-12">
              <div className="inline-block mb-4">
                <span className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                  {recipe.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-black leading-tight">
                {recipe.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-semibold text-black">{recipe.steps?.length || 0} Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-black">{recipe.ingredients?.length || 0} Ingredients</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                A delicious recipe using our premium EZ Masala spices. Follow the steps below for a perfect dish every time.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-12 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h2 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients?.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-black">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.steps?.map((step: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-black to-gray-800 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-1 text-black">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-black text-white rounded-2xl">
              <div>
                <h3 className="text-xl font-bold mb-1">Enjoy Your Meal!</h3>
                <p className="text-gray-300 text-sm">Made with love and EZ Masala spices</p>
              </div>
              <Link href="/collections">
                <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg">
                  Shop Spices
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* RELATED RECIPES */}
        {relatedRecipes.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl md:text-3xl font-black mb-6 text-black">
              More {recipe.category} Recipes
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedRecipes.map((r: any) => (
                <Link key={r._id} href={`/cook/${r.slug}`}>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="aspect-video relative bg-gray-100 overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 text-black">{r.title}</h4>
                      <p className="text-sm text-gray-600">
                        {r.ingredients?.length || 0} ingredients • {r.steps?.length || 0} steps
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
