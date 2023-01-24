import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from './header';
import MainContent from './mainContent';
import SplashPage from './splashPage';

const Home: NextPage = () => {
  return (
    <div className={`${styles.topContainer} ${styles.container}`}>
      <Head>
        <title>Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Header />
        <SplashPage />
      </div>
    </div>
  );
};

export default Home;
