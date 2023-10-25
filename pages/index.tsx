import { client } from '@/utils/sanityHelper';
import Head from 'next/head';
import Home from '../components/Home';
import { Article } from '../utils/types';

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
