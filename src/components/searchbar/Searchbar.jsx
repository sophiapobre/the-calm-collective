import { React, useState } from 'react';
import { Link } from 'react-router-dom'

import './Searchbar.css';
import data from '../assets/products.js'

// Adapted code from React with Masoud https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud
const Searchbar = (item) => {
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState(null);

    const onChange = (e) => {
        setKeyword(e.target.value);
    }

    const onSubmit = (input) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].name.toLowerCase() === input.toLowerCase()) {
                setResult(data[i]);
                break;
            }
            else {
                setResult(false);
            }
        }
    }

    return (
        <div>
            <h1>Product Search</h1>
            <div className='search-container'>
                <div className='search-bar'>
                    <input type='text' placeholder='Search...' value={keyword} onChange={onChange}/>
                    <button onClick={() => onSubmit(keyword)}>Search</button>
                </div>

                <div className='result-container'>
                    {
                        result ? (
                            <div className='search-result'>
                                <img src={result.image} alt='' />
                                <Link to={`/Product/${result.id}`}>
                                    <p className='search-result-name'>{result.name}</p>
                                </Link>
                                <p className='search-result-price'>${result.price}</p>
                            </div>
                        ) : result === false ? (
                            <p>No matching products found.</p>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default Searchbar;