"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

export default function App({
  items,
  isMobile,
}: {
  items: { mb: string; lg: string; id: number }[];
  isMobile: boolean;
}) {
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  }, []);

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={!isMobile}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.mb}>
            <Image
              className="object-cover"
              height={270}
              width={1600}
              src={`https://rukminim2.flixcart.com/fk-p-flap/${width}/${height}/image/${
                isMobile ? item.mb : item.lg
              }`}
              alt="banner"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
