import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AppStoreProvider } from '../components/AppStore';
import { ToasterProvider } from '../components/Toaster';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <ToasterProvider>
        <Component {...pageProps} />
      </ToasterProvider>
    </AppStoreProvider>
  );
}

export default MyApp;