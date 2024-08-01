/* 슬라이드 배너 컴포넌트
'Swiper' 라이브러리를 사용 (npm i swiper) */ 
import React from 'react';
import banner from '../assets/images/banner.jpg';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


function BannerSlide() {
  return (
    <div className='banner-container'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        autoplay={{ delay: 3000 }}
        className='mySwiper'
      >
        <SwiperSlide>
          <img src={banner} alt="배너 이미지" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner} alt="배너 이미지" />
          </SwiperSlide>
        <SwiperSlide>
          <img src={banner} alt="배너 이미지" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner} alt="배너 이미지" />
        </SwiperSlide>
        
      </Swiper>
    </div>
  );
};
export default BannerSlide;