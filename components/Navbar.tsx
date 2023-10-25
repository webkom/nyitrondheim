import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const NitNavBar = () => {
  return (
    <Navbar position="sticky">
      <NavbarBrand>
        <Link href="/">
          <p className={styles.title}>Ny i Trondheim</p>
        </Link>
      </NavbarBrand>
    </Navbar>
  );
};

export default NitNavBar;
