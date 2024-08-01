import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

function RecipeCarousel() {

  return(
    <div>
    <Swiper slidesPerView={2.5} spaceBetween={8}>
      {recipes.map((recipe, i) => (
      	<SwiperSlide
              key={i}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <ThumbNail
                    type="small"
                    id={recipe.id}
                    img={recipe.image}
                    name={recipe.name}
                    info={recipe.description}
                    chef={chef.id}
                  />
          </SwiperSlide>
      ))}
      </Swiper>
    </div>

  )
}
export default RecipeCarousel;
