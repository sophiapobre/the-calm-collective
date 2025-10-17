import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
import AdminPage from './pages/AdminPage';
import ShoppingCarts from './pages/ShoppingCarts';
import Orders from './pages/Orders';
import ManageProducts from './pages/ManageProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProtectedRoute from './components/protectedroute/Protectedroute';
import Login from './pages/LoginPage'; 
import { AuthProvider } from './context/AuthContext';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div>
          <BrowserRouter>
            <Navbar/>
            <Routes>
              {/* Public routes */}
              <Route path='/' element={<Home/>}/>
              <Route path='/categories' element={<Categories/>}/>
              <Route path='/bestsellers' element={<BestSellers/>}/>
              <Route path='/search' element={<Search/>}/>
              <Route path='/products/:productId' element={<Product/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/checkout' element={<CheckoutPage/>}/>
              <Route path='/orders/:orderNumber' element={<OrderConfirmation/>}/>

              {/* Protected admin routes */}
              <Route path='/admin' element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage/>
                </ProtectedRoute>
              }/>
              <Route path='/admin/shopping-carts' element={
                <ProtectedRoute requireAdmin={true}>
                  <ShoppingCarts/>
                </ProtectedRoute>
              }/>
              <Route path='/admin/orders' element={
                <ProtectedRoute requireAdmin={true}>
                  <Orders/>
                </ProtectedRoute>
              }/>
              <Route path='/admin/products' element={
                <ProtectedRoute requireAdmin={true}>
                  <ManageProducts/>
                </ProtectedRoute>
              }/>
              <Route path='/admin/products/add' element={
                <ProtectedRoute requireAdmin={true}>
                  <AddProduct/>
                </ProtectedRoute>
              }/>
              <Route path='/admin/products/edit/:productId' element={
                <ProtectedRoute requireAdmin={true}>
                  <EditProduct/>
                </ProtectedRoute>
              }/>

              {/* Protected user routes */}
              {/* <Route path='/cart' element={
                <ProtectedRoute>
                  <CartPage/>
                </ProtectedRoute>
              }/>
              <Route path='/checkout' element={
                <ProtectedRoute>
                  <CheckoutPage/>
                </ProtectedRoute>
              }/> */}
              {/* <Route path='/orders/:orderNumber' element={
                <ProtectedRoute>
                  <OrderConfirmation/>
                </ProtectedRoute>
              }/> */}

            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;