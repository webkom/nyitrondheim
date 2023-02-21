import { Navbar } from '@nextui-org/react';
import Link from 'next/link';
import Header from './header';

const NitNavBar = () => {
  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <Link href="/">
          <Header />
        </Link>
      </Navbar.Brand>
    </Navbar>
  );
};
export default NitNavBar;
