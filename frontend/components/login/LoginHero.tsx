"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const carouselImages = [
  "/icons/1.png",
  "/icons/2.png",
  "/icons/3.png",
  "/icons/4.png",
];

export default function LoginHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[38vh] lg:h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-white px-6">

      {/* Carousel container */}
      <div className="relative w-full max-w-3xl aspect-[16/9]">
        {carouselImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index === 0}
              unoptimized
              className="object-contain"
            />
          </div>
        ))}

        {/* Carousel dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "w-6 bg-primary"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}