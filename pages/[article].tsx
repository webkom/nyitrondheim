import type { GetServerSidePropsContext } from 'next';
import { createClient } from 'next-sanity';
import Head from 'next/head';
import TextBox from '../components/Textbox';
import { Article } from '../utils/types';

const client = createClient({
  projectId: 'e0ffh349',
  dataset: 'production',
  useCdn: false, // false because we want to use preview mode
  apiVersion: '2023-02-01',
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const articles = await client.fetch(
    `*[_type == "article" && slug.current == "${context.params.article}"]`,
  );
  if (!articles.length) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      article: articles[0],
    },
  };
}

type Props = {
  article: Article;
};

const ArticlePage = ({ article }: Props) => {
  return (
    <>
      <Head>
        <title>{article.title} | Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TextBox article={article} />
    </>
  );
};

export default ArticlePage;
