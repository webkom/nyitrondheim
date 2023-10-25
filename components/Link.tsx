import NextLink from 'next/link';
import { ComponentProps } from 'react';
import styles from './Link.module.css';

type Props = {
  unstyled?: boolean;
} & ComponentProps<typeof NextLink>;

const Link = ({ unstyled, ...linkProps }: Props) => {
  return (
    <NextLink
      className={unstyled ? styles.unstyled : styles.link}
      {...linkProps}
    />
  );
};

export default Link;
