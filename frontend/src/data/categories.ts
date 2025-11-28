export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Best Sellers",
    slug: "best-sellers",
    image: "/spice/21.jpg",
    description: "Our most popular masalas loved by customers"
  },
  {
    id: "2",
    name: "Combo Masalas",
    slug: "combo-spices",
    image: "/spice/14.jpg",
    description: "Ready-to-use masala blends for every dish"
  },
  {
    id: "3",
    name: "Pastes",
    slug: "pastes",
    image: "/spice/7.jpg",
    description: "Fresh and flavorful paste collection"
  },
  {
    id: "4",
    name: "Whole Masalas",
    slug: "whole-spices",
    image: "/spice/11.jpg",
    description: "Premium whole masalas for authentic taste"
  },
  {
    id: "5",
    name: "Tea Masalas",
    slug: "tea-spices",
    image: "/spice/1.jpg",
    description: "Perfect blends for your chai"
  },
  {
    id: "6",
    name: "Premium Masalas",
    slug: "premium-spices",
    image: "/spice/20.jpg",
    description: "Exclusive and rare masalas"
  }
];
