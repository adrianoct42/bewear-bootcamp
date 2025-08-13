"use client";

import BrandItem from "./brand-item";

const brands = [
  { title: "Adidas", image: "/Adidas.png" },
  { title: "Converse", image: "/Converse.png" },
  { title: "New Balance", image: "/New-Balance.png" },
  { title: "Nike", image: "/Nike.png" },
  { title: "Polo", image: "/Polo.png" },
  { title: "Puma", image: "/Puma.png" },
  { title: "Zara", image: "/Zara.png" },
];

const BrandList = () => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Marcas</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {brands.map((brand) => (
          <BrandItem key={brand.title} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandList;
