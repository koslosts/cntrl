import '../styles/reset.css';
import type { AppProps } from 'next/app';
import { CntrlProvider, customItems } from '@cntrl-site/sdk-nextjs';
import '@cntrl-site/components/style/components.css';
import { AboutFounderCarousel } from '../components/AboutFounderCarousel';

customItems.define('Slider', AboutFounderCarousel);

function App({ Component, pageProps }: AppProps) {
  return (
    <CntrlProvider>
      <Component {...pageProps} />
    </CntrlProvider>
  );
}

export default App;
