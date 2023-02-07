import styles from '../styles/Home.module.css';
import { PortableText } from '@portabletext/react';

const MainContent = ({ articles }) => {
  return (
    <div className={styles.mainContent}>
      {console.log(articles)}
      {articles?.map((article) => {
        return (
          <div key={article.title}>
            {article.title}
            <p>{article.content.text}</p>
            <PortableText value={article.content} />
          </div>
        );
      })}
    </div>
  );
};

export default MainContent;
