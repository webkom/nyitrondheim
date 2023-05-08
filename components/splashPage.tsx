import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import styles from '../styles/Home.module.css';
import Link from './link';

const SplashPage = ({ articles }) => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til skolestart.
    </p>

    <div className={styles.articlesContainer} style={{ alignItems: 'stretch' }}>
      {articles?.map((article) => (
        <Link
          unstyled
          href={article.slug?.current || 'error'}
          key={article.title}
          className={styles.articlesLink}
        >
          <Button className={styles.button} auto>
            <FontAwesomeIcon
              icon={article.icon}
              className={styles.buttonIcon}
            />
            <span className={styles.buttonText}>{article.title}</span>
          </Button>
        </Link>
      ))}
    </div>
  </>
);
export default SplashPage;
