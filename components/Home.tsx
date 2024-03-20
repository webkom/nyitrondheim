import { Article } from '../utils/types';
import styles from './Home.module.css';
import SplashPage from './SplashPage';
import Image from 'next/image';

type Props = {
  articles: Article[];
};

const Home = ({ articles }: Props) => {
  return (
    <>
      <div className={`${styles.container}`}>
        <Image src="/22.png" width={500} height={500} alt="sommerfest"></Image>
        <div className={styles.main}>
          <SplashPage articles={articles} />
        </div>
      </div>
    </>
  );
};

export default Home;
