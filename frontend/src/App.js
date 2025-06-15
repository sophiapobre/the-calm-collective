import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import Product from './pages/Product';
import CartPage from './pages/CartPage';
import store from './store/Store';
import BestSellers from './pages/BestSellers';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack
function App() {
  return (
    <Provider store={store}>
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/bestsellers' element={<BestSellers/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/checkout' element={<CheckoutPage/>}/>
        <Route path='/orders/:orderNumber' element={<OrderConfirmation/>}/>
        <Route path='/products/:productId' element={<Product/>}>
        </Route>
      </Routes>
      </BrowserRouter>
      
    </div>
    </Provider>
  );
}

export default App;
