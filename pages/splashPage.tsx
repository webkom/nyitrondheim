import { Button } from '@nextui-org/react';
import styles from '../styles/Home.module.css';
const SplashPage = () => (
  <>
    <p className={styles.tagline}>
      Skal du begynne å studere til høsten? Her kan du finne all informasjonen
      du trenger til skolestart.
    </p>

    <div className={styles.container}>
      {[
        'SIT',
        'Komme seg rundt',
        'Bolig',
        'Trening',
        'Helsetjenester',
        'Apper å laste ned',
      ].map((item) => (
        <Button className={styles.button} auto>
          <span className={styles.buttonText}>{item}</span>
        </Button>
      ))}
    </div>
  </>
);
export default SplashPage;
