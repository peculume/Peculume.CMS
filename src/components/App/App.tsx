import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "pages/HomePage/HomePage";
import CreateProductPage from "pages/CreateProductPage/CreateProductPage";
import ProductPage from "pages/ProductPage/ProductPage";
import ProductsPage from "pages/ProductsPage/ProductsPage";
import Layout from "components/Layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;