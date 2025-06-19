import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
          
          // Randomly select 3 images from the best sellers category
          const shuffledData = shuffleImages(data);
          for (let i = 0; i < 3; i++) {
            imgs.push(`http://localhost:4000/images/${shuffledData[i].image}`);
          }

          setImages(imgs);
        })
        .catch(err => console.error(err));
    }, [])

    return (
        <div className='hero'>
            <h2>Our Best Sellers</h2>
            <div className='hero-images'>
                {images.map((img) => (
                    <img src={img} className='hero-img' key={img}/>
                ))}
            </div>
            <div className='hero-content'>
                <Link to='/BestSellers' className='link'>
                    <button className='hero-button'>Shop now</button>
                </Link>
            </div>
        </div>
    )
}

export default Hero