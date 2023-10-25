import { Text } from '@nextui-org/react';
import { Article } from '../utils/types';
import styles from './SplashPage.module.css';
import SplashPageItem from './SplashPageItem';

type SectionProps = {
  title: string;
  articles: Article[];
};

const SplashPageSection = ({ title, articles }: SectionProps) => {
  return (
    <>
      <Text b className={styles.articlesContainerTitle}>
        {title}
      </Text>

      <div className={styles.articlesContainer}>
        {articles.map((article) => (
          <SplashPageItem key={article.title} article={article} />
        ))}
      </div>
    </>
  );
};

type PageProps = {
  articles: Article[];
};

const SplashPage = ({ articles }: PageProps) => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til studiestart!
    </p>

    <SplashPageSection
      title="Før ankomst"
      articles={articles.filter((article) => article.category === 'before')}
    />

    <SplashPageSection
      title="Etter ankomst"
      articles={articles.filter((article) => article.category === 'after')}
    />
  </>
);

export default SplashPage;
