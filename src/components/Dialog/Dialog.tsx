import styles from "./Dialog.module.scss";
import { useEffect } from "react";
import { UserType } from "../../../@types/userType.ts";
import { DialogType } from "../../../@types/dialogType.ts";
import db from "../../../utils/database.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { choose } from "../../../redux/slices/dialogSlice.ts";

import ContentLoader from "react-content-loader";
import Messages from "../Messages/Messages.tsx";
import { MateType } from "../../../@types/mateType.ts";
import { setIsScrolling } from "../../../redux/slices/messagesSlice.ts";
import { MessageType } from "../../../@types/messageType.ts";
import DialogHeader from "./DialogHeader/DialogHeader.tsx";
export default function Dialog({
  dialog,
  user,
  isDialogLoading,
}: {
  dialog: DialogType & MateType;
  user: UserType;
  isDialogLoading: boolean;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "dialogs", dialog.id), (doc) => {
      const countNotRead = dialog.messages.reduce(
        (accumulator: number, message: MessageType) => {
          if (message.sender_id !== user.id && !message.read) {
            accumulator++;
          }
          return accumulator;
        },
        0,
      );
      dispatch(
        choose({ ...doc.data(), id: doc.id, mate: dialog.mate, countNotRead }),
      );
      localStorage.setItem("messages", JSON.stringify(dialog.messages));
    });
    return () => {
      unsub();
    };
  }, [dialog.id]);

  useEffect(() => {
    dispatch(setIsScrolling(true));
    localStorage.setItem("messages", JSON.stringify(dialog.messages));
  }, [dialog.id]);
  return (
    <div className={styles["dialog"]}>
      {!isDialogLoading && dialog.mate ? (
        <>
          <DialogHeader dialog={dialog} />
          <Messages user={user} />
        </>
      ) : (
        <ContentLoader
          speed={2}
          max-width={1200}
          height={55}
          viewBox="0 0 1200 55"
          backgroundColor="#5e5e5e"
          foregroundColor="#5e5e5e"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100%" height="55" />
        </ContentLoader>
      )}
    </div>
  );
}
