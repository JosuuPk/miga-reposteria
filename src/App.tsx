import { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { DemoNotice } from './components/DemoNotice';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { FaqPage } from './pages/FaqPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductPage } from './pages/ProductPage';

/** Al cambiar de página: sube al inicio y lleva el foco al contenido. */
function useRouteChange(mainRef: React.RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, mainRef]);
}

function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  useRouteChange(mainRef);
  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <DemoNotice />
      <Header />
      <main id="contenido" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductPage />} />
          <Route path="/armar/:id" element={<ConfiguratorPage />} />
          <Route path="/preguntas" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
