import { createClient } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { GetServerSidePropsContext } from 'next';
import TextBox from '../../components/textbox';

const article = ({ article }) => {
  return <TextBox article={article} />;
};

export default article;

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
  if (!articles.length){
    return {
      notFound: true,
    }
  }
  return {
    props: {
      article: articles[0],
    },
  };
}
