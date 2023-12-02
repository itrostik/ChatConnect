import styles from "./Loading.module.scss";

export default function Loading() {
  return (
    <div className={styles["loading__block"]}>
      <div className={styles["loading__logo"]}>ChatConnect</div>
      <div className={styles["loading__text"]}>загрузка...</div>
    </div>
  );
}
