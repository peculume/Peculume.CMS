import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthContextProvider } from 'providers/AuthProvider';
import {
  CreateFragranceMixPage,
  CreateFragranceOilPage,
  CreateProductPage,
  FragranceMixesPage,
  FragranceMixPage,
  FragranceOilPage,
  FragranceOilsPage,
  HomePage,
  KanbanPage,
  LoginPage,
  LorePage,
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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/kanban" element={<KanbanPage />} />
                  <Route path="/fragrance-mixes" element={<FragranceMixesPage />} />
                  <Route
                    path="/fragrance-mixes/:fragranceMixId"
                    element={<FragranceMixPage />}
                  />
                  <Route
                    path="/fragrance-mixes/create"
                    element={<CreateFragranceMixPage />}
                  />
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
                  <Route path="/lore" element={<LorePage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
