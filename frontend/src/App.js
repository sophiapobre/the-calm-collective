import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Search from './pages/Search';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import store from './store/Store';
import Item from './components/item/Item';

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
        <Route path='/search' element={<Search/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/products/:productId' element={<Product/>}>
        </Route>
      </Routes>
      </BrowserRouter>
      
    </div>
    </Provider>
  );
}

export default App;
