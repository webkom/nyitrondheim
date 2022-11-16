import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from './header';
import MainContent from './mainContent';
import SplashPage from './splashPage';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Parallax pages={1.4} style={{ height: '100vh' }}>
          <ParallaxLayer offset={0} speed={-1.1} factor={0.1}>
            <div className={styles.container}>
              <Header />
            </div>
          </ParallaxLayer>
          <ParallaxLayer offset={0.099} speed={2} factor={0.2}>
            <div className={styles.container}>
              <SplashPage />
            </div>
          </ParallaxLayer>
          <ParallaxLayer offset={0.7} speed={0.3}>
            <div className={styles.container}>
              <MainContent />
            </div>
          </ParallaxLayer>
        </Parallax>
      </div>
    </div>
  );
};

export default Home;
