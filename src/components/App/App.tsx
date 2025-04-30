import { BrowserRouter, Route, Routes } from "react-router";
import { AuthContextProvider } from "providers/AuthProvider";
import CreateProductPage from "pages/CreateProductPage/CreateProductPage";
import HomePage from "pages/HomePage/HomePage";
import LoginPage from "pages/LoginPage/LoginPage";
import ProductPage from "pages/ProductPage/ProductPage";
import ProductsPage from "pages/ProductsPage/ProductsPage";
import Layout from "components/Layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
          </Routes>
        </Layout>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;