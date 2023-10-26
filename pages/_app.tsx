import * as Icons from '@fortawesome/free-solid-svg-icons';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import NitNavBar from '../components/Navbar';
import '../global.css';
const { library } = require('@fortawesome/fontawesome-svg-core');

const iconList = Object.entries(Icons)
  .filter(([key]) => key !== 'fas' && key !== 'prefix')
  .map(([_, icon]) => icon);

library.add(...iconList);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NitNavBar />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
