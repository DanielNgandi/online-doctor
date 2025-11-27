// components/ImageSlideshow.jsx
import { useState, useEffect } from 'react';
import  '../App.css'
// Import your static images - make sure these paths are correct
import image from '../assets/images/img.jpg'
import image1 from '../assets/images/img1.jpg'
import image2 from '../assets/images/img2.jpg'
import image3 from '../assets/images/img3.jpg'
import image4 from '../assets/images/img4.jpg'
import image5 from '../assets/images/img5.jpg'
import image6 from '../assets/images/img6.jpg'
import image7 from '../assets/images/img7.jpg'
import image8 from '../assets/images/img8.jpg'
import image9 from '../assets/images/img9.jpg'
import image10 from '../assets/images/img10.jpg'
const ImageSlideshow = ({ interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
   image, image1, image2, image3, image4, image5,
    
   image, image1, image2, image3, image4, image5
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slideshow-container relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-xl">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? 'opacity-100 transform scale-100' 
              : 'opacity-0 transform scale-105'
          }`}
        >
          <img
            src={image}
            alt={`Medical facility ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primaryColor scale-125' 
                : 'bg-white/70 hover:bg-white'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

export default ImageSlideshow;