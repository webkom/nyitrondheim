import Head from 'next/head';
import SplashPage from './SplashPage';
import styles from './Home.module.css';

const Home = ({ articles }) => {
  return (
    <>
      <div className={`${styles.topContainer} ${styles.container}`}>
        <Head>
          <title>Ny i Trondheim</title>
          <meta name="description" content="Ny i Trondheim" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.main}>
          <SplashPage articles={articles} />
        </div>
      </div>
    </>
  );
};

export default Home;
