import styles from './Link.module.css';
import NextLink from 'next/link';

const Link: React.FC<
  { unstyled?: boolean } & React.ComponentProps<typeof NextLink>
> = (props) => {
  return (
    <NextLink
      className={props.unstyled ? styles.unstyled : styles.link}
      {...{ ...props, unstyled: undefined }}
    ></NextLink>
  );
};

export default Link;
