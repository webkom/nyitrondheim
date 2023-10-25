import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { Article } from '../utils/types';
import Link from './Link';
import styles from './SplashPageItem.module.css';

type Props = {
  article: Article;
};

const SplashPageItem = ({ article }: Props) => (
  <Link
    unstyled
    href={article.slug?.current || 'error'}
    key={article.title}
    className={styles.articlesLink}
  >
    <Button className={styles.button}>
      <div className={styles.buttonContent}>
        <FontAwesomeIcon icon={article.icon} className={styles.buttonIcon} />
        <span className={styles.buttonText}>{article.title}</span>
      </div>
    </Button>
  </Link>
);

export default SplashPageItem;
