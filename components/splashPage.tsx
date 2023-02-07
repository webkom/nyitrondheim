import { Button } from '@nextui-org/react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
const SplashPage = () => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til skolestart.
    </p>

    <div className={styles.container} style={{ alignItems: 'stretch' }}>
      {[
        'SIT',
        'Komme seg rundt',
        'Bolig',
        'Trening',
        'Helse',
        'Apper',
        'Verv deg',
        'Kjekt å fikse',
        'Ordliste',
        


      ].map((item) => (
        <Link href="/sit" key={item} className={styles.link}>
          <Button className={styles.button} auto>
            <span className={styles.buttonText}>{item}</span>
          </Button>
        </Link>
      ))}
    </div>
  </>
);
export default SplashPage;
