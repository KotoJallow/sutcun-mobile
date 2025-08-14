export interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  category_name: string;
  category_icon: string;
  image: string;
  district_name: string;
  neighborhood_name: string;
  price: number;
  stock_quantity: number;
  unit: string; // Birleştirilmiş property
  created_at: string;
}

export const products: Product[] = [
  {
    product_id: 1,
    product_name: "Elma",
    category_id: 1,
    category_name: "Organik Meyve",
    category_icon: "nutrition-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 35.50,
    stock_quantity: 50,
    unit: "1 Kg",
    created_at: "2025-08-14 10:30:00"
  },
  {
    product_id: 2,
    product_name: "Armut",
    category_id: 1,
    category_name: "Organik Meyve",
    category_icon: "nutrition-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 28.00,
    stock_quantity: 30,
    unit: "1 Kg",
    created_at: "2025-08-14 10:35:00"
  },
  {
    product_id: 11,
    product_name: "Elma",
    category_id: 1,
    category_name: "Organik Meyve",
    category_icon: "nutrition-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 35.50,
    stock_quantity: 50,
    unit: "1 Kg",
    created_at: "2025-08-14 10:30:00"
  },
  {
    product_id: 12,
    product_name: "Armut",
    category_id: 1,
    category_name: "Organik Meyve",
    category_icon: "nutrition-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 28.00,
    stock_quantity: 30,
    unit: "1 Kg",
    created_at: "2025-08-14 10:35:00"
  },
  {
    product_id: 3,
    product_name: "Domates",
    category_id: 2,
    category_name: "Organik Sebze",
    category_icon: "leaf-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 15.00,
    stock_quantity: 100,
    unit: "1 Kg",
    created_at: "2025-08-14 10:40:00"
  },
  {
    product_id: 4,
    product_name: "Salatalık",
    category_id: 2,
    category_name: "Organik Sebze",
    category_icon: "leaf-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 18.50,
    stock_quantity: 80,
    unit: "1 Kg",
    created_at: "2025-08-14 10:45:00"
  },
  {
    product_id: 5,
    product_name: "Günlük Süt",
    category_id: 3,
    category_name: "Doğal Süt Ürünleri",
    category_icon: "water-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 20.00,
    stock_quantity: 60,
    unit: "1 Lt",
    created_at: "2025-08-14 10:50:00"
  },
  {
    product_id: 6,
    product_name: "Köy Peyniri",
    category_id: 3,
    category_name: "Doğal Süt Ürünleri",
    category_icon: "water-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 45.00,
    stock_quantity: 25,
    unit: "500 Gr",
    created_at: "2025-08-14 10:55:00"
  },
  {
    product_id: 7,
    product_name: "Fındık",
    category_id: 4,
    category_name: "Kuruyemiş & Bakliyat",
    category_icon: "basket-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 90.00,
    stock_quantity: 40,
    unit: "1 Kg",
    created_at: "2025-08-14 11:00:00"
  },
  {
    product_id: 8,
    product_name: "Kuru Fasulye",
    category_id: 4,
    category_name: "Kuruyemiş & Bakliyat",
    category_icon: "basket-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 55.00,
    stock_quantity: 70,
    unit: "1 Kg",
    created_at: "2025-08-14 11:05:00"
  },
  {
    product_id: 9,
    product_name: "Nar Suyu",
    category_id: 5,
    category_name: "Organik İçecekler",
    category_icon: "cafe-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 25.00,
    stock_quantity: 100,
    unit: "1 Lt",
    created_at: "2025-08-14 11:10:00"
  },
  {
    product_id: 10,
    product_name: "Elma Suyu",
    category_id: 5,
    category_name: "Organik İçecekler",
    category_icon: "cafe-outline",
    image: "https://picsum.photos/100/100",
    district_name: "Beylikdüzü",
    neighborhood_name: "Kavaklı",
    price: 30.00,
    stock_quantity: 90,
    unit: "1 Lt",
    created_at: "2025-08-14 11:15:00"
  }
];

// Unique categories helper
export const categories = products.reduce((acc, product) => {
  const exists = acc.find(cat => cat.id === product.category_id);
  if (!exists) {
    acc.push({
      id: product.category_id,
      name: product.category_name,
      icon: product.category_icon
    });
  }
  return acc;
}, [] as Array<{
  id: number;
  name: string;
  icon: string;
}>);