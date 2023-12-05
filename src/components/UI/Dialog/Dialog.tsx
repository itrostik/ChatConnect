import styles from "./Dialog.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../../../../@types/userType.ts";
import { DialogType } from "../../../../@types/dialogType.ts";

export default function Dialog({
  dialog,
  user,
}: {
  dialog: DialogType;
  user: UserType;
}) {
  const [mate, setMate] = useState<UserType>(null);
  useEffect(() => {
    console.log(52);
    const getMate = async () => {
      const mateId =
        dialog.user2_id !== user.id ? dialog.user2_id : dialog.user_id;
      const mate = await axios.get<UserType>(
        `http://localhost:4444/api/users/${mateId}`,
      );
      setMate(mate.data);
    };
    getMate();
  }, [dialog]);

  return (
    <div className={styles["dialog"]}>
      {mate ? (
        <div className={styles["dialog__header"]}>
          <div className={styles["dialog__header-image"]}>
            <img src={mate.avatarUrl} alt="avatar" />
          </div>
          <div className={styles["dialog__header-info"]}>
            <div className={styles["dialog__header-name"]}>{mate.username}</div>
            <div className={styles["dialog__header-time"]}>
              был в сети 5 минут назад
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
