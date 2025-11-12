import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const { cartItemCount } = useCart();

    const handleLogout = () => {
      logout();
      window.location.href = '/'; // Redirect to home after logout
    };

    const handleLogin = () => {
      handleNavCollapse();
      window.location.href = '/login'; // Redirect to login page
    };

    return (
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#023020' }}>
        <Link className="navbar-brand" to="/">Solara</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleNavCollapse}
          aria-controls="navbarSupportedContent" 
          aria-expanded={!isNavCollapsed} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavCollapse}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories" onClick={handleNavCollapse}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bestsellers" onClick={handleNavCollapse}>
                Best Sellers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search" onClick={handleNavCollapse}>
                Search
              </Link>
            </li>

            {user && isAuthenticated() && (
            <li className="nav-item">
              <Link className="nav-link" to="/my-orders" onClick={handleNavCollapse}>
                My Orders
              </Link>
            </li>
            )}

            {/* Only show Admin link if user is authenticated and is admin */}
            {user && isAdmin() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" onClick={handleNavCollapse}>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar-nav ml-auto">
            <Link to="/cart" onClick={handleNavCollapse}>
              <div className="cart-icon-container">
                <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" fill="white" class="bi bi-cart3" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
            </Link>

            {user ? (
              // User is logged in - show welcome message and logout
              <div className="auth-section d-flex align-items-center">
                <span className="welcome-text mr-3">Welcome, {user.name}!</span>
                <button className="login-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              // User is not logged in - show login button
              <div className="auth-section d-flex align-items-center">
                <button className="login-button" onClick={handleLogin}>
                  Login   
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    )
}

export default Navbar