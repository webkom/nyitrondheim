import * as Icons from '@fortawesome/free-solid-svg-icons';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import NitNavBar from '../components/Navbar';
import '../global.css';
const { library } = require('@fortawesome/fontawesome-svg-core');

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

library.add(...iconList);

const theme = createTheme({
  type: 'light',
  theme: {
    colors: {
      backgroundColor: '#eceff1',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={theme}>
      <NitNavBar />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
