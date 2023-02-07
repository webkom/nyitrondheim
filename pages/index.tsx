import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from './header';
import MainContent from '../components/mainContent';
import SplashPage from '../components/splashPage';

import { createClient } from 'next-sanity';

const Home = ({ articles }) => {
  return (
    <div className={`${styles.topContainer} ${styles.container}`}>
      <Head>
        <title>Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <Header />
        <SplashPage articles={articles} />
        <MainContent articles={articles} />
      </div>
    </div>
  );
};

const client = createClient({
  projectId: 'e0ffh349',
  dataset: 'production',
  useCdn: false, // false because we want to use preview mode
  apiVersion: '2023-02-01',
});

export async function getStaticProps() {
  const articles = await client.fetch(`*[_type == "article"]`);
  return {
    props: {
      articles,
    },
  };
}

export default Home;
