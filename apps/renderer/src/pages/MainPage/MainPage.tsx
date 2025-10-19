import { RecordsSection } from "./components/RecordsSection";
import { ScanSection } from "./components/ScanSection";
import styles from "./MainPage.module.css";

export const MainPage = () => {
  return (
    <main className={styles.main}>
      <ScanSection />
      <RecordsSection />
    </main>
  );
};
