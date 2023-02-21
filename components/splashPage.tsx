import { Button } from '@nextui-org/react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
const SplashPage = ({ articles }) => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til skolestart.
    </p>

    <div className={styles.container} style={{ alignItems: 'stretch' }}>
      {articles?.map((article) => (
        <Link
          href={article.slug?.current || 'error'}
          key={article.title}
          className={styles.link}
        >
          <Button className={styles.button} auto>
            {/*ionicons should go here*/}
            <span className={styles.buttonText}>{article.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  </>
);
export default SplashPage;
