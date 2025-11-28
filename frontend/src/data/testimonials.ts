export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "EZ Masala has transformed my cooking! The quality is exceptional and the flavors are authentic. My family loves every dish I make with these masalas.",
    avatar: "/spice/1.jpg"
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    comment: "Best masalas I've ever used. The aroma is incredible and they stay fresh for so long. Highly recommend the garam masala and biryani masala!",
    avatar: "/spice/2.jpg"
  },
  {
    id: "3",
    name: "Anjali Patel",
    location: "Ahmedabad",
    rating: 4,
    comment: "Great quality masalas at reasonable prices. The packaging keeps them fresh, and the variety is impressive. My go-to brand for all my masala needs.",
    avatar: "/spice/3.jpg"
  },
  {
    id: "4",
    name: "Vikram Singh",
    location: "Bangalore",
    rating: 5,
    comment: "Pure and authentic! You can taste the difference in quality. The turmeric powder is especially good - vibrant color and fresh aroma.",
    avatar: "/spice/4.jpg"
  },
  {
    id: "5",
    name: "Meera Reddy",
    location: "Hyderabad",
    rating: 5,
    comment: "I've been using EZ Masala for over a year now. Consistent quality, excellent customer service, and fast delivery. Couldn't ask for more!",
    avatar: "/spice/5.jpg"
  },
  {
    id: "6",
    name: "Arjun Malhotra",
    location: "Pune",
    rating: 4,
    comment: "The combo masalas are a game-changer! Saves so much time in the kitchen and the taste is restaurant-quality. Love the pav bhaji masala!",
    avatar: "/spice/6.jpg"
  }
];
