import Image from "next/image";

import { Card } from "../ui/card";

interface BrandItemProps {
  brand: BrandObject;
}

type BrandObject = {
  title: string;
  image: string;
};

const BrandItem = ({ brand }: BrandItemProps) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Card className="flex h-20 w-20 items-center justify-center">
        <Image
          src={brand.image}
          alt={brand.title}
          sizes="100vw"
          height={0}
          width={0}
          className="h-12 w-12 rounded-3xl"
        />
      </Card>
      <div className="flex w-full items-center justify-center">
        <p className="truncate text-sm font-medium">{brand.title}</p>
      </div>
    </div>
  );
};

export default BrandItem;
