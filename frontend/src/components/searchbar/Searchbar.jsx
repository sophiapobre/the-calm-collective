import { React, useState } from 'react';
import { Link } from 'react-router-dom'

import './Searchbar.css';

// Adapted code from React with Masoud https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud
const Searchbar = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState(null);

    const onChange = (e) => {
        setKeyword(e.target.value);
    }

    const onSubmit = async () => {
        // Trim whitespace and check if keyword is empty
        if (!keyword.trim()) {
          setResults(null);
          return;
        }

        // Fetch search results from API
        const response = await fetch(`http://localhost:4000/api/products/search?q=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div>
            <h1>Product Search</h1>
            <div className='search-container'>
                <div className='search-bar'>
                    <input type='text' placeholder='Search...' value={keyword} onChange={onChange}/>
                    <button onClick={() => onSubmit()}>Search</button>
                </div>

                <div className='result-container'>
                    {results === null ? null :
                        results.length === 0 ? (
                            <p>No matching products found.</p>
                        ) : (
                            results.map(product => (
                                <div className='search-result' key={product._id}>
                                    <Link to={`/products/${product._id}`}>
                                        <img src={`http://localhost:4000/images/${product.image}`} alt='' />
                                        <p className='search-result-name'>{product.name}</p>
                                    </Link>
                                    <p className='search-result-price'>${product.price}</p>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Searchbar;