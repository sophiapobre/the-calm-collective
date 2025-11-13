import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

import './Hero.css';

const Hero = () => {
  const [images, setImages] = useState([]);

  // Shuffle images using Durstenfeld shuffle algorithm from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffleImages(imageArray) {
    for (var i = imageArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = imageArray[i];
        imageArray[i] = imageArray[j];
        imageArray[j] = temp;
    }
    return imageArray;
  }

  // Fetch best seller products
    useEffect(() => {
      fetch(`http://localhost:4000/api/category-products/category/${encodeURIComponent('best sellers')}`)
        .then(response => response.json())
        .then(data => {
          let imgs = [];
          
          // Filter out products without images and randomly select up to 3
          const validProducts = data.filter(product => product && product.image);
          const shuffledData = shuffleImages(validProducts);
          
          // Get up to 3 images (or fewer if not enough products)
          const count = Math.min(3, shuffledData.length);
          for (let i = 0; i < count; i++) {
            imgs.push(getImageUrl(shuffledData[i].image));
          }

          setImages(imgs);
        })
        .catch(err => console.error(err));
    }, [])

    return (
        <div className='hero'>
            <h2>Products for Mindful Living</h2>
            <p className='hero-subtitle'>Slow down, reflect, and savor the moment</p>
            <div className='hero-images'>
                {images.map((img) => (
                    <img src={img} className='hero-img' key={img}/>
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