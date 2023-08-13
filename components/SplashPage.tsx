import { Text } from '@nextui-org/react';
import styles from './SplashPage.module.css';
import SplashPageItem from './SplashPageItem';

const SplashPage = ({ articles }) => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til skolestart.
    </p>

    <Text id="before-arrival" b className={styles.articlesContainerTitle}>
      Før ankomst
    </Text>
    <div className={styles.articlesContainer} style={{ alignItems: 'stretch' }}>
      {articles
        ?.filter((article) => article.category === 'before')
        .map((article) => (
          <SplashPageItem key={article.title} article={article} />
        ))}
    </div>

    <Text id="after-arrival" b className={styles.articlesContainerTitle}>
      Etter ankomst
    </Text>
    <div className={styles.articlesContainer} style={{ alignItems: 'stretch' }}>
      {articles
        ?.filter((article) => article.category === 'after')
        .map((article) => (
          <SplashPageItem key={article.title} article={article} />
        ))}
    </div>
  </>
);
export default SplashPage;