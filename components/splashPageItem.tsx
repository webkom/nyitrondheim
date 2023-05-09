import { Button } from '@nextui-org/react';
import Link from './link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Home.module.css';

const SplashPageItem: React.FC<{ article: any }> = ({ article }) => (
  <Link
    unstyled
    href={article.slug?.current || 'error'}
    key={article.title}
    className={styles.articlesLink}
  >
    <Button className={styles.button} auto>
      <FontAwesomeIcon icon={article.icon} className={styles.buttonIcon} />
      <span className={styles.buttonText}>{article.title}</span>
    </Button>
  </Link>
);

export default SplashPageItem;
