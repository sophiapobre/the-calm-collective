import React from 'react';
import { Link } from 'react-router-dom';

import './Hero.css';

const Hero = () => {
    return (
        <div className='hero'>
            <div className='hero-content'>
                <h2>Welcome to the RandomShop!</h2>
                <Link to='/Categories' className='link'>
                    <button className='hero-button'>Shop Now</button>
                </Link>
            </div>
        </div>
    )
}

export default Hero