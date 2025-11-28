import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthContextProvider } from 'providers/AuthProvider';
import {
  CreateFragranceOilPage,
  CreateProductPage,
  FragranceOilPage,
  FragranceOilsPage,
  HomePage,
  LoginPage,
  MediaItemPage,
  MediaPage,
  ProductPage,
  ProductsPage,
} from 'pages';
import { Layout } from 'components';

const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/fragrance-oils" element={<FragranceOilsPage />} />
            <Route
              path="/fragrance-oils/:fragranceOilId"
              element={<FragranceOilPage />}
            />
            <Route
              path="/fragrance-oils/create"
              element={<CreateFragranceOilPage />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/media/:mediaId" element={<MediaItemPage />} />
          </Routes>
        </Layout>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
