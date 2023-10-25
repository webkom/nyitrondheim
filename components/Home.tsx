import { Article } from '../utils/types';
import styles from './Home.module.css';
import SplashPage from './SplashPage';

type Props = {
  articles: Article[];
};

const Home = ({ articles }: Props) => {
  return (
    <>
      <div className={`${styles.topContainer} ${styles.container}`}>
        <div className={styles.main}>
          <SplashPage articles={articles} />
        </div>
      </div>
    </>
  );
};

export default Home;
