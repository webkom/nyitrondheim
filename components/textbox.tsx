import { PortableText } from '@portabletext/react';
import styles from '../styles/Home.module.css';

const TextBox = ({ article }) => (
  <div className={styles.textBox}>
    <h1>{article?.title}</h1>
    <PortableText value={article.content} />
  </div>
);
export default TextBox;
