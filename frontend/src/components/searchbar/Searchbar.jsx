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
            <div className='search-header'>
                <h1>Find Your Moment</h1>
                <p className='search-subtitle'>Search our collection of mindful essentials</p>
            </div>
            
            <div className='search-container'>
                <div className='search-bar'>
                    <input 
                        type='text' 
                        placeholder='Search for candles, journals, tea...' 
                        value={keyword} 
                        onChange={onChange}
                        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
                    />
                    <button onClick={() => onSubmit()}>Search</button>
                </div>
                
                {results === null ? null :
                    results.length === 0 ? (
                        <div className="empty-search-results">
                            <div className="empty-search-icon">🔍</div>
                            <h3>Nothing found</h3>
                            <p>Try searching for tea, candles, or journals</p>
                        </div>
                    ) : (
                        <div className='search-results-section'>
                            <h2 className='search-results-title'>
                                Search Results for "{submittedKeyword}"
                            </h2>
                            <div className='result-container'>
                                <ItemCard products={results ?? []} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Searchbar;