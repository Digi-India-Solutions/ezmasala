export interface Recipe {
  id: string;
  title: string;
  category: string;
  image: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  steps: string[];
}

export interface RecipeCategory {
  id: string;
  name: string;
  slug: string;
  recipes: Recipe[];
}

export const recipeCategories: RecipeCategory[] = [
  {
    id: "1",
    name: "Butter Masala Recipes",
    slug: "butter-masala",
    recipes: [
      {
        id: "1",
        title: "Paneer Butter Masala",
        category: "butter-masala",
        image: "/spice/1.jpg",
        prepTime: "30 mins",
        servings: 4,
        ingredients: [
          "250g paneer cubes",
          "2 tbsp EZ Masala Butter Masala",
          "1 cup tomato puree",
          "1/2 cup cream",
          "2 tbsp butter",
          "1 onion, chopped",
          "Salt to taste"
        ],
        steps: [
          "Heat butter in a pan and sauté onions until golden",
          "Add tomato puree and cook for 5 minutes",
          "Add EZ Masala Butter Masala and mix well",
          "Add paneer cubes and cream",
          "Simmer for 10 minutes",
          "Garnish with cream and serve hot"
        ]
      },
      {
        id: "2",
        title: "Chicken Butter Masala",
        category: "butter-masala",
        image: "/spice/2.jpg",
        prepTime: "45 mins",
        servings: 4,
        ingredients: [
          "500g chicken pieces",
          "2 tbsp EZ Masala Butter Masala",
          "1 cup tomato puree",
          "1/2 cup cream",
          "3 tbsp butter",
          "1 onion, chopped",
          "Kasuri methi for garnish"
        ],
        steps: [
          "Marinate chicken with yogurt and spices for 30 mins",
          "Grill or pan-fry chicken pieces until golden",
          "In another pan, melt butter and sauté onions",
          "Add tomato puree and EZ Masala Butter Masala",
          "Add grilled chicken and cream",
          "Simmer for 15 minutes and garnish with kasuri methi"
        ]
      },
      {
        id: "3",
        title: "Mushroom Butter Masala",
        category: "butter-masala",
        image: "/spice/3.jpg",
        prepTime: "25 mins",
        servings: 4,
        ingredients: [
          "300g mushrooms, sliced",
          "2 tbsp EZ Masala Butter Masala",
          "1 cup tomato puree",
          "1/2 cup cream",
          "2 tbsp butter",
          "1 onion, chopped",
          "Fresh coriander"
        ],
        steps: [
          "Sauté mushrooms in butter until lightly browned",
          "Add chopped onions and cook until soft",
          "Mix in tomato puree and EZ Masala Butter Masala",
          "Add cream and simmer for 10 minutes",
          "Garnish with fresh coriander"
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Ghee Roast Recipes",
    slug: "ghee-roast",
    recipes: [
      {
        id: "4",
        title: "Chicken Ghee Roast",
        category: "ghee-roast",
        image: "/spice/4.jpg",
        prepTime: "40 mins",
        servings: 4,
        ingredients: [
          "500g chicken pieces",
          "3 tbsp EZ Masala Ghee Roast",
          "4 tbsp ghee",
          "1 onion, sliced",
          "Curry leaves",
          "Lemon juice"
        ],
        steps: [
          "Marinate chicken with EZ Masala Ghee Roast for 1 hour",
          "Heat ghee in a pan and add curry leaves",
          "Add marinated chicken and cook on high heat",
          "Add sliced onions and roast until chicken is cooked",
          "Finish with lemon juice and serve hot"
        ]
      },
      {
        id: "5",
        title: "Prawns Ghee Roast",
        category: "ghee-roast",
        image: "/spice/5.jpg",
        prepTime: "30 mins",
        servings: 4,
        ingredients: [
          "400g prawns, cleaned",
          "3 tbsp EZ Masala Ghee Roast",
          "4 tbsp ghee",
          "Curry leaves",
          "Garlic cloves",
          "Tamarind paste"
        ],
        steps: [
          "Marinate prawns with ghee roast masala",
          "Heat ghee and add curry leaves and garlic",
          "Add prawns and roast on high heat",
          "Add tamarind paste for tanginess",
          "Cook until prawns are done and serve"
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Biryani Recipes",
    slug: "biryani",
    recipes: [
      {
        id: "6",
        title: "Hyderabadi Chicken Biryani",
        category: "biryani",
        image: "/spice/6.jpg",
        prepTime: "60 mins",
        servings: 6,
        ingredients: [
          "500g chicken",
          "3 cups basmati rice",
          "3 tbsp EZ Masala Biryani Masala",
          "1 cup yogurt",
          "Fried onions",
          "Mint and coriander",
          "Saffron milk"
        ],
        steps: [
          "Marinate chicken with yogurt and biryani masala",
          "Par-boil rice with whole spices",
          "Layer marinated chicken in a pot",
          "Top with rice, fried onions, herbs, and saffron milk",
          "Cook on dum (slow steam) for 30 minutes",
          "Serve hot with raita"
        ]
      }
    ]
  }
];
