import '../styles/global.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import * as Icons from '@fortawesome/free-solid-svg-icons';
const { library } = require('@fortawesome/fontawesome-svg-core');

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

library.add(...iconList);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
