import { createClient } from 'next-sanity';
import Head from 'next/head';
import Home from '../components/Home';
import { Article } from '../utils/types';

const client = createClient({
  projectId: 'e0ffh349',
  dataset: 'production',
  useCdn: false, // false because we want to use preview mode
  apiVersion: '2023-02-01',
});

export async function getStaticProps() {
  const articles = await client.fetch(`*[_type == "article"]`);
  return {
    props: {
      articles,
    },
  };
}

type Props = {
  articles: Article[];
};

const HomePage = ({ articles }: Props) => {
  return (
    <>
      <Head>
        <title>Ny i Trondheim</title>
        <meta name="description" content="Ny i Trondheim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home articles={articles} />
    </>
  );
};

export default HomePage;
