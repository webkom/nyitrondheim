import { createClient } from 'next-sanity';
import Home from '../components/Home';

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

export default Home;
