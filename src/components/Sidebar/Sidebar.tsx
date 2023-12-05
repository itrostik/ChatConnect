import styles from "./Sidebar.module.scss";
import { useEffect, useState } from "react";
import { DialogType } from "../../../@types/dialogType.ts";
import { MateType } from "../../../@types/mateType.ts";
import { collection, onSnapshot, or, where, query } from "firebase/firestore";
import db from "../../../utils/database.ts";
// import { choose } from "../../../redux/slices/dialogSlice.ts";
// import { useDispatch } from "react-redux";
import { UserType } from "../../../@types/userType.ts";
import axios from "axios";
import { MessageType } from "../../../@types/messageType.ts";

type DialogsType = DialogType & MateType;

export default function Sidebar({ user }: { user: UserType }) {
  const [dialogs, setDialogs] = useState<DialogsType[]>([]);
  // const dispatch = useDispatch();
  useEffect(() => {
    const q = query(
      collection(db, "dialogs"),
      or(where("user_id", "==", user.id), where("user2_id", "==", user.id)),
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const dialogs = [];
      querySnapshot.forEach(async (doc) => {
        const dialog = doc.data();
        const mateId =
          dialog.user_id === user.id ? dialog.user2_id : dialog.user_id;
        const mate = await axios.get<UserType>(
          `http://localhost:4444/api/users/${mateId}`,
        );
        if (mate.data) dialogs.push({ ...dialog, id: doc.id, mate: mate.data });
        else dialogs.push({ ...dialog, id: doc.id });
        setDialogs(dialogs);
      });
    });
    return () => {
      unsub();
    };
  }, []);

  function getLastMessage(messages: MessageType[]): MessageType {
    return messages[messages.length - 1];
  }

  return (
    <div className={styles["sidebar"]}>
      {dialogs.map((dialog) => (
        <div key={dialog.id} className={styles["dialog"]}>
          <div className={styles["dialog__image"]}>
            <img src={dialog.mate.avatarUrl} alt="" width={30} />
          </div>
          <div className={styles["dialog__info"]}>
            <div className={styles["dialog__username"]}>
              {dialog.mate.username}
            </div>
            <div className={styles["dialog__lastmessage"]}>
              {getLastMessage(dialog.messages).messageText}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
