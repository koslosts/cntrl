import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { CntrlProvider, customItems } from '@cntrl-site/sdk-nextjs';
import '@cntrl-site/components/style/components.css';
import { AboutFounderCarousel } from '../components/AboutFounderCarousel';

// TODO: rename 'about-founder-carousel' to match exactly the name given to
// the custom-component placeholder in the Editor (Puzzle icon -> double-click name).
customItems.define('about-founder-carousel', AboutFounderCarousel);

function App({ Component, pageProps }: AppProps) {
  return (
    <CntrlProvider>
      <Component {...pageProps} />
    </CntrlProvider>
  );
}

export default App;
