import { PortableText } from '@portabletext/react';
import { Article } from '../utils/types';
import styles from './Textbox.module.css';

type Props = {
  article: Article;
};

const TextBox = ({ article }: Props) => (
  <div className={styles.textBox}>
    <h1>{article?.title}</h1>
    <PortableText value={article.content} />
  </div>
);

export default TextBox;
