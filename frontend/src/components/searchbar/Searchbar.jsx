import { React, useState } from 'react';
import { Link } from 'react-router-dom'
import ItemCard from '../itemcard/ItemCard';

import './Searchbar.css';

// Adapted code from React with Masoud https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud
const Searchbar = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState(null);
    const [submittedKeyword, setSubmittedKeyword] = useState('');

    const onChange = (e) => {
        setKeyword(e.target.value);
    }

    const onSubmit = async () => {
        // Trim whitespace and check if keyword is empty
        if (!keyword.trim()) {
          setResults(null);
          return;
        }

        setSubmittedKeyword(keyword);

        // Fetch search results from API
        const response = await fetch(`http://localhost:4000/api/products/search?q=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div className='overall-search-container'>
            <h1>Product Search</h1>
            <div className='search-container'>
                <div className='search-bar'>
                    <input type='text' placeholder='Search...' value={keyword} onChange={onChange} />
                    <button onClick={() => onSubmit()}>Search</button>
                </div>
                  {results === null ? null :
                      results.length === 0 ? (
                          <p>No matching products found.</p>
                      ) : (
                          <>
                              <h2>Showing search results for "{submittedKeyword}"</h2>
                              <div className='result-container'>
                                  <ItemCard products={results ?? []} />
                              </div>
                          </>
                      )
                  }
            </div>
        </div>
    )
}

export default Searchbar;