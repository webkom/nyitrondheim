import { Navbar, Text } from '@nextui-org/react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const NitNavBar = () => {
  return (
    <Navbar
      variant="sticky"
      css={{
        $$navbarBackgroundColor: '$backgroundColor',
        $$navbarBlurBackgroundColor: '$backgroundColor',
      }}
    >
      <Navbar.Brand>
        <Link href="/">
          <Text b className={styles.title}>
            Ny i Trondheim
          </Text>
        </Link>
      </Navbar.Brand>
    </Navbar>
  );
};

export default NitNavBar;
