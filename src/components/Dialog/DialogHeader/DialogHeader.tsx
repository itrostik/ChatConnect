import styles from "./DialogHeader.module.scss";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import db from "../../../../utils/database.ts";
import { choose } from "../../../../redux/slices/dialogSlice.ts";
import { useDispatch } from "react-redux";
import { getDate } from "../../../../utils/date.ts";

export default function DialogHeader({ dialog }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", dialog.mate.id), (doc) => {
      dispatch(
        choose({
          ...dialog,
          mate: { ...dialog.mate, online: doc.data().online },
        }),
      );
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={styles["dialog__header"]}>
      <div className={styles["dialog__header-image"]}>
        <img src={dialog.mate.avatarUrl} alt="avatar" />
      </div>
      <div className={styles["dialog__header-info"]}>
        <div className={styles["dialog__header-name"]}>
          {dialog.mate.username}
        </div>
        <div className={styles["dialog__header-time"]}>
          {dialog.mate.online
            ? "В сети"
            : "Был в сети: " + getDate(dialog.mate.lastActive)}
        </div>
      </div>
    </div>
  );
}
