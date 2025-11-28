export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Garam Masala Powder",
    category: "best-sellers",
    price: 149,
    image: "/spice/1.jpg",
    rating: 4.5,
    reviews: 234,
    description: "Premium blend of aromatic masalas"
  },
  {
    id: "2",
    name: "Turmeric Powder",
    category: "best-sellers",
    price: 99,
    image: "/spice/2.jpg",
    rating: 4.8,
    reviews: 456,
    description: "Pure and fresh turmeric powder"
  },
  {
    id: "3",
    name: "Red Chilli Powder",
    category: "best-sellers",
    price: 89,
    image: "/spice/3.jpg",
    rating: 4.6,
    reviews: 189,
    description: "Spicy red chilli powder"
  },
  {
    id: "4",
    name: "Coriander Powder",
    category: "best-sellers",
    price: 79,
    image: "/spice/4.jpg",
    rating: 4.4,
    reviews: 123,
    description: "Freshly ground coriander"
  },
  {
    id: "5",
    name: "Kitchen King Masala",
    category: "combo-spices",
    price: 169,
    image: "/spice/5.jpg",
    rating: 4.7,
    reviews: 345,
    description: "All-in-one masala blend"
  },
  {
    id: "6",
    name: "Pav Bhaji Masala",
    category: "combo-spices",
    price: 129,
    image: "/spice/6.jpg",
    rating: 4.5,
    reviews: 278,
    description: "Authentic Mumbai street food masala"
  },
  {
    id: "7",
    name: "Biryani Masala",
    category: "combo-spices",
    price: 159,
    image: "/spice/7.jpg",
    rating: 4.8,
    reviews: 512,
    description: "Perfect biryani masala blend"
  },
  {
    id: "8",
    name: "Chana Masala",
    category: "combo-spices",
    price: 139,
    image: "/spice/8.jpg",
    rating: 4.6,
    reviews: 189,
    description: "Masala mix for chickpea curry"
  },
  {
    id: "9",
    name: "Ginger Garlic Paste",
    category: "pastes",
    price: 119,
    image: "/spice/9.jpg",
    rating: 4.7,
    reviews: 456,
    description: "Fresh ginger garlic paste"
  },
  {
    id: "10",
    name: "Green Chilli Paste",
    category: "pastes",
    price: 99,
    image: "/spice/10.jpg",
    rating: 4.5,
    reviews: 234,
    description: "Spicy green chilli paste"
  },
  {
    id: "11",
    name: "Tamarind Paste",
    category: "pastes",
    price: 109,
    image: "/spice/11.jpg",
    rating: 4.4,
    reviews: 167,
    description: "Tangy tamarind concentrate"
  },
  {
    id: "12",
    name: "Cumin Seeds",
    category: "whole-spices",
    price: 89,
    image: "/spice/12.jpg",
    rating: 4.6,
    reviews: 289,
    description: "Premium quality cumin seeds"
  },
  {
    id: "13",
    name: "Black Pepper",
    category: "whole-spices",
    price: 199,
    image: "/spice/13.jpg",
    rating: 4.8,
    reviews: 345,
    description: "Whole black peppercorns"
  },
  {
    id: "14",
    name: "Cardamom",
    category: "whole-spices",
    price: 249,
    image: "/spice/14.jpg",
    rating: 4.9,
    reviews: 234,
    description: "Green cardamom pods"
  },
  {
    id: "15",
    name: "Chai Masala",
    category: "tea-spices",
    price: 129,
    image: "/spice/15.jpg",
    rating: 4.7,
    reviews: 456,
    description: "Aromatic tea masala blend"
  },
  {
    id: "16",
    name: "Saffron",
    category: "premium-spices",
    price: 999,
    image: "/spice/16.jpg",
    rating: 5.0,
    reviews: 123,
    description: "Pure Kashmiri saffron"
  }
];
