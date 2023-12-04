import styles from "./Dialog.module.scss";
import { useEffect } from "react";
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
  useEffect(() => {
    const getMate = async () => {
      const mateId =
        dialog.user2_id !== user.id ? dialog.user2_id : dialog.user_id;
      const mate = await axios.get<UserType>(
        `http://localhost:4444/api/users/${mateId}`,
      );
      console.log(mate.data);
    };
    getMate();
  }, [dialog]);

  return <div className={styles["dialog"]}>{dialog.id}</div>;
}
