
import React, { useState, useEffect, useCallback } from 'react';
import { Page } from './types.ts';
import { Header } from './components/Layout/Header.tsx';
import { Footer } from './components/Layout/Footer.tsx';
import { LoadingScreen } from './components/Layout/LoadingScreen.tsx';
import { Home } from './components/Sections/Home.tsx';
import { Registration } from './components/Sections/Registration.tsx';
import { Schedule } from './components/Sections/Schedule.tsx';
import { Speakers } from './components/Sections/Speakers.tsx';
import { Gallery } from './components/Sections/Gallery.tsx';
import { Admin } from './components/Sections/Admin.tsx';
import { PressReleases } from './components/Sections/PressReleases.tsx';
import { CONFERENCE_INFO } from './constants.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transImgError, setTransImgError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') as Page;
    if (pageParam && Object.values(Page).includes(pageParam)) {
      setCurrentPage(pageParam);
    }

    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as Page;
      if (pageParam && Object.values(Page).includes(pageParam)) {
        setCurrentPage(pageParam);
      } else {
        setCurrentPage(Page.Home);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePageChange = useCallback((page: Page) => {
    if (page === currentPage) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage(page);
      
      try {
        const url = new URL(window.location.href);
        if (!url.protocol.startsWith('blob')) {
          url.searchParams.set('page', page);
          window.history.pushState({}, '', url.toString());
        }
      } catch (e) {
        console.warn("Navigation: URL update skipped.");
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 400); 
  }, [currentPage]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home: return <Home onPageChange={handlePageChange} />;
      case Page.Registration: return <Registration />;
      case Page.Schedule: return <Schedule />;
      case Page.Speakers: return <Speakers />;
      case Page.Gallery: return <Gallery />;
      case Page.PressReleases: return <PressReleases />;
      case Page.Admin: return <Admin />;
      default: return <Home onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-red-100 selection:text-red-900">
      <div className={`page-transition-overlay ${isTransitioning ? 'active' : ''}`}>
         <div className="text-center px-4 relative">
            <div className="absolute inset-0 bg-red-100/20 blur-3xl rounded-full scale-150 -z-10" />
            
            <div className="mb-8 flex justify-center">
              {!transImgError ? (
                <img 
                  src={CONFERENCE_INFO.logoUrl} 
                  onError={() => setTransImgError(true)}
                  className="h-32 md:h-40 w-auto object-contain logo-pop" 
                  alt="Logo" 
                />
              ) : (
                <div className="h-20 w-20 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl logo-pop">
                  K
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-red-800 font-black tracking-[0.2em] text-xs uppercase mb-2">
                Loading...
              </div>
              <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 animate-[loading_1s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
              </div>
            </div>
         </div>
      </div>

      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      
      <main className={`flex-grow w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
