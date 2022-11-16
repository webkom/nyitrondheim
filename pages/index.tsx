import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from '@nextui-org/react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
              <Header />
              <SplashPage />
              <MainContent />
      </div>
    </div>
  );
};

export default Home;
