import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TypedObject } from 'sanity';

export type Article = {
  id: string;
  title: string;
  icon: IconProp;
  category: string;
  slug: { current: string };
  content: TypedObject[];
};
