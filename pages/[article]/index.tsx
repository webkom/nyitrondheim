import { createClient } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { GetServerSideProps } from 'next';

const article = ({ articles }) => {
  const article = articles[0];
  return (
    <div>
      <h1>{article?.title}</h1>
      <PortableText value={article.content} />
    </div>
  );
};

export default article;

const client = createClient({
  projectId: 'e0ffh349',
  dataset: 'production',
  useCdn: false, // false because we want to use preview mode
  apiVersion: '2023-02-01',
});

export async function getServerSideProps(context: GetServerSideProps) {
  const articles = await client.fetch(
    `*[_type == "article" && slug.current == "${
      (context as any).params.article
    }"]`,
  );
  return {
    props: {
      articles,
    },
  };
}
