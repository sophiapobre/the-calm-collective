import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import Product from './pages/Product';
import Cart from './pages/Cart';

// Adapted code from GreatStack Tutorial
function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
