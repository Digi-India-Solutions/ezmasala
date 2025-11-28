export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export const blogs: Blog[] = [
  {
    id: "1",
    title: "The Health Benefits of Turmeric",
    slug: "health-benefits-of-turmeric",
    excerpt: "Discover why turmeric is called the golden spice and its amazing health benefits",
    content: `Turmeric, known as Haldi in India, has been used for thousands of years in Ayurvedic medicine. The active compound curcumin gives turmeric its bright yellow color and powerful anti-inflammatory properties.

## Health Benefits

1. **Anti-inflammatory Properties**: Curcumin is a powerful anti-inflammatory compound that can help fight chronic inflammation.

2. **Antioxidant Boost**: Turmeric increases the antioxidant capacity of the body and helps fight free radicals.

3. **Brain Function**: It may improve brain function and lower the risk of brain diseases.

4. **Heart Health**: Curcumin improves the function of the endothelium, which is the lining of blood vessels.

5. **Cancer Prevention**: Studies suggest that curcumin can contribute to the death of cancerous cells.

## How to Use Turmeric Daily

- Add to warm milk with black pepper for better absorption
- Use in curries and rice dishes
- Make turmeric tea
- Add to smoothies

Remember to always use high-quality, pure turmeric powder like EZ Masala for maximum benefits.`,
    image: "/spice/2.jpg",
    date: "2024-01-15",
    author: "Dr. Priya Sharma",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Everything You Need to Know About Garam Masala",
    slug: "everything-about-garam-masala",
    excerpt: "Learn about the king of Indian spice blends and how to use it in your cooking",
    content: `Garam Masala is the backbone of Indian cuisine, a warming spice blend that adds depth and complexity to countless dishes.

## What's in Garam Masala?

Traditional garam masala typically contains:
- Cumin seeds
- Coriander seeds
- Cardamom pods
- Black peppercorns
- Cinnamon
- Cloves
- Nutmeg

## Regional Variations

Different regions of India have their own versions:
- North Indian: More warming spices like cloves and cinnamon
- South Indian: Includes curry leaves and dried red chilies
- Bengali: Sweeter with more cinnamon and cloves

## Cooking Tips

1. **Add at the End**: For maximum aroma, add garam masala in the last 5 minutes of cooking
2. **Toast First**: Lightly toasting releases the essential oils
3. **Store Properly**: Keep in an airtight container away from light
4. **Use Sparingly**: A little goes a long way

EZ Masala Garam Masala is carefully crafted with the perfect blend of premium spices.`,
    image: "/spice/1.jpg",
    date: "2024-01-10",
    author: "Chef Rajesh Kumar",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "Red Chilli: Adding Heat and Flavor",
    slug: "red-chilli-guide",
    excerpt: "A comprehensive guide to different types of red chillies and their uses",
    content: `Red chillies are more than just heat - they add flavor, color, and character to dishes.

## Types of Red Chillies

### Kashmiri Chilli
- Mild heat, deep red color
- Perfect for color in dishes
- Use in tandoori marinades

### Byadgi Chilli
- Medium heat, rich flavor
- Popular in South Indian cuisine
- Great for sambhar and rasam

### Guntur Chilli
- Very hot, intense flavor
- Used in Andhra cuisine
- Handle with care

## Health Benefits

- Rich in Vitamin C
- Boosts metabolism
- Natural pain reliever
- Improves digestion

## Storage Tips

Store in a cool, dry place away from moisture. Whole dried chillies last longer than powder.

Choose EZ Masala Red Chilli Powder for consistent quality and heat level.`,
    image: "/spice/3.jpg",
    date: "2024-01-05",
    author: "Spice Expert Anjali Mehta",
    readTime: "4 min read"
  },
  {
    id: "4",
    title: "The Magic of Cumin Seeds",
    slug: "magic-of-cumin-seeds",
    excerpt: "Explore the aromatic world of cumin and its importance in Indian cooking",
    content: `Cumin (Jeera) is one of the most essential spices in Indian cuisine, known for its distinctive earthy aroma.

## Why Cumin is Essential

Cumin seeds are used in three forms:
1. **Whole Seeds**: For tempering (tadka)
2. **Roasted and Ground**: For enhanced flavor
3. **Raw Powder**: For quick seasoning

## Culinary Uses

- Tempering for dal and rice
- Base for curry powders
- Flavoring for yogurt (raita)
- Essential in jeera rice

## Health Benefits

- Aids digestion
- Rich in iron
- Helps control blood sugar
- Boosts immunity

EZ Masala Cumin Seeds are sourced from the finest farms to ensure premium quality.`,
    image: "/spice/12.jpg",
    date: "2024-01-01",
    author: "Chef Arjun Singh",
    readTime: "3 min read"
  }
];
