"use client";

import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    price: string;
    description: string;
  } | null;
}

export default function ProductModal({
  open,
  onClose,
  product,
}: Props) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl"
        >
          ✕
        </button>

        <Image
          src={product.image}
          alt={product.name}
          width={250}
          height={250}
          className="mx-auto"
        />

        <h2 className="text-3xl font-bold mt-6 text-green-700">
          {product.name}
        </h2>

        <p className="mt-4 text-gray-600">
          {product.description}
        </p>

        <h3 className="mt-6 text-3xl font-bold text-green-800">
          {product.price}
        </h3>

        <button className="mt-8 w-full bg-green-600 text-white py-4 rounded-full">
          Order On WhatsApp
        </button>

      </div>

    </div>
  );
}