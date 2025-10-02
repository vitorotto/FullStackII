import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Importar componentes
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import UserDetail from './pages/UserDetail';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas de produtos */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Rotas protegidas (requerem autenticação) */}
            <Route 
              path="/products/new" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products/edit/:id" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de usuários (requerem permissão de admin) */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              } 
            />
            <Route 
              path="/users/:id" 
              element={
                <AdminRoute>
                  <UserDetail />
                </AdminRoute>
              } 
            />
            <Route 
              path="/users/edit/:id" 
              element={
                <AdminRoute>
                  <UserForm />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
