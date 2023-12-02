import styles from "./Sidebar.module.scss";
import { Dispatch, SetStateAction } from "react";

export default function Sidebar({
  activeDialog,
  setActiveDialog,
}: {
  activeDialog: string;
  setActiveDialog: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div onClick={() => setActiveDialog("")} className={styles["sidebar"]}>
      <div>{activeDialog}</div>
      <div>
        <div className={styles["dialog"]}>
          <div className={styles["dialog__image"]}></div>
          <div className={styles["dialog__info"]}>
            <div className={styles["dialog__username"]}>Name</div>
            <div className={styles["dialog__lastmessage"]}>LastMessage</div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles["dialog"]}>
          <div className={styles["dialog__image"]}></div>
          <div className={styles["dialog__info"]}>
            <div className={styles["dialog__username"]}>Name</div>
            <div className={styles["dialog__lastmessage"]}>LastMessage</div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles["dialog"]}>
          <div className={styles["dialog__image"]}></div>
          <div className={styles["dialog__info"]}>
            <div className={styles["dialog__username"]}>Name</div>
            <div className={styles["dialog__lastmessage"]}>LastMessage</div>
          </div>
        </div>
      </div>
    </div>
  );
}
