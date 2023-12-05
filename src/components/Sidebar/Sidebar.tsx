import styles from "./Sidebar.module.scss";
import React, { useEffect, useState } from "react";
import { DialogType } from "../../../@types/dialogType.ts";
import { MateType } from "../../../@types/mateType.ts";
import { collection, onSnapshot, or, where, query } from "firebase/firestore";
import db from "../../../utils/database.ts";
import { choose } from "../../../redux/slices/dialogSlice.ts";
import { useDispatch } from "react-redux";
import { UserType } from "../../../@types/userType.ts";
import axios from "axios";
import ContentLoader from "react-content-loader";
import { MessageType } from "../../../@types/messageType.ts";
type DialogsType = DialogType & MateType;

export default function Sidebar({
  user,
  isLoading,
  setIsLoading,
}: {
  user: UserType;
  isLoading: boolean;
  setIsLoading: React.Dispatch<boolean>;
}) {
  const [dialogs, setDialogs] = useState<DialogsType[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "dialogs"),
      or(where("user_id", "==", user.id), where("user2_id", "==", user.id)),
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const dialogs = [];
      const dialogSize = querySnapshot.docs.length;
      querySnapshot.docs.map(async (doc, index) => {
        const dialog = doc.data();
        const mateId =
          dialog.user_id === user.id ? dialog.user2_id : dialog.user_id;
        const mate = await axios.get<UserType>(
          `http://localhost:4444/api/users/${mateId}`,
        );
        if (mate.data) dialogs.push({ ...dialog, id: doc.id, mate: mate.data });
        else dialogs.push({ ...dialog, id: doc.id });
        if (index + 1 === dialogSize) {
          setDialogs(dialogs);
          setIsLoading(false);
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);
  function getLastMessage(messages: MessageType[]): MessageType {
    return messages[messages.length - 1];
  }
  function chooseDialog(dialog: DialogsType) {
    const { mate, ...dialogItem } = dialog;
    dispatch(choose(dialogItem));
  }
  return (
    <>
      {!isLoading ? (
        <div className={styles["sidebar"]}>
          {dialogs.map((dialog) => (
            <div
              key={dialog.id}
              className={styles["dialog"]}
              onClick={() => chooseDialog(dialog)}
            >
              <div className={styles["dialog__image"]}>
                <img src={dialog.mate.avatarUrl} alt="" />
              </div>
              <div className={styles["dialog__info"]}>
                <div className={styles["dialog__username"]}>
                  {dialog.mate.username}
                </div>
                <div className={styles["dialog__lastmessage"]}>
                  {dialog.messages.length > 0
                    ? getLastMessage(dialog.messages).messageText
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ContentLoader
          speed={2}
          width={550}
          height={280}
          viewBox="0 0 550 280"
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
        >
          <rect x="0" y="0" rx="4" ry="4" width="500" height="40" />
          <rect x="0" y="45" rx="4" ry="4" width="500" height="40" />
          <rect x="0" y="90" rx="4" ry="4" width="500" height="40" />
          <rect x="0" y="135" rx="4" ry="4" width="500" height="40" />
          <rect x="0" y="180" rx="4" ry="4" width="500" height="40" />
          <rect x="0" y="225" rx="4" ry="4" width="500" height="40" />
        </ContentLoader>
      )}
    </>
  );
}
