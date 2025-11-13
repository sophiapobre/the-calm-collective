import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

import './Hero.css';

const Hero = () => {
  const [images, setImages] = useState([]);

  // Shuffle images using Durstenfeld shuffle algorithm
  function shuffleImages(imageArray) {
    const shuffled = [...imageArray];
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
  }

  // Fetch best seller products
    useEffect(() => {
      // Check if we have cached images and when they were cached
      const cachedImages = localStorage.getItem('heroImages');
      const cachedTime = localStorage.getItem('heroImagesTime');
      const now = Date.now();
      const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

      // If we have valid cached images, use them
      if (cachedImages && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
        setImages(JSON.parse(cachedImages));
        return;
      }

      // Otherwise, fetch and shuffle new images
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/category-products/category/${encodeURIComponent('best sellers')}`)
        .then(response => response.json())
        .then(data => {
          // Filter out products without images and shuffle
          const validProducts = data.filter(product => product && product.image);
          const shuffledData = shuffleImages(validProducts);
          
          // Get up to 3 images (or fewer if not enough products)
          const count = Math.min(3, shuffledData.length);
          let imgs = [];
          for (let i = 0; i < count; i++) {
            imgs.push(getImageUrl(shuffledData[i].image));
          }

          setImages(imgs);
          
          // Cache the images and timestamp
          localStorage.setItem('heroImages', JSON.stringify(imgs));
          localStorage.setItem('heroImagesTime', now.toString());
        })
        .catch(err => console.error(err));
    }, [])

    return (
        <div className='hero'>
            <h2>Find Your Calm</h2>
            <p className='hero-subtitle'>Curated essentials for your perfect wind-down</p>
            <div className='hero-images'>
                {images.map((img, index) => (
                    <img src={img} alt="" className='hero-img' key={`${img}-${index}`}/>
                ))}
            </div>
            <div className='hero-content'>
                <Link to='/BestSellers' className='link'>
                    <button className='hero-button'>Explore Collection</button>
                </Link>
            </div>
        </div>
    )
}

export default Hero