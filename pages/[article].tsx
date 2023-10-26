import { client } from '@/utils/sanityHelper';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import TextBox from '../components/Textbox';
import { Article } from '../utils/types';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const articles = await client.fetch(
    `*[_type == "article" && slug.current == "${context.params?.article}"]`,
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
        <title>{article.title + ' | Ny i Trondheim'}</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TextBox article={article} />
    </>
  );
};

export default ArticlePage;
