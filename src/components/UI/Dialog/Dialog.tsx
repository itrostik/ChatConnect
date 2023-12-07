import styles from "./Dialog.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../../../../@types/userType.ts";
import { DialogType } from "../../../../@types/dialogType.ts";
import db from "../../../../utils/database.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { choose } from "../../../../redux/slices/dialogSlice.ts";
import ContentLoader from "react-content-loader";
import Messages from "../Messages/Messages.tsx";
import { MateType } from "../../../../@types/mateType.ts";
export default function Dialog({
  dialog,
  user,
}: {
  dialog: DialogType & MateType;
  user: UserType;
}) {
  const [mate, setMate] = useState<UserType>(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(true);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "dialogs", dialog.id), (doc) => {
      dispatch(choose({ ...doc.data(), id: doc.id, mate: dialog.mate }));
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!dialog.mate) {
      setIsLoading(true);
      const getMate = async () => {
        const mateId =
          dialog.user2_id !== user.id ? dialog.user2_id : dialog.user_id;
        const mate = await axios.get<UserType>(
          `http://localhost:4444/api/users/${mateId}`,
        );
        setMate(mate.data);
        setIsLoading(false);
      };
      getMate();
    } else {
      setMate(dialog.mate);
    }
  }, [dialog.id]);

  return (
    <div className={styles["dialog"]}>
      {!isLoading && mate ? (
        <>
          <div className={styles["dialog__header"]}>
            <div className={styles["dialog__header-image"]}>
              <img src={mate.avatarUrl} alt="avatar" />
            </div>
            <div className={styles["dialog__header-info"]}>
              <div className={styles["dialog__header-name"]}>
                {mate.username}
              </div>
              <div className={styles["dialog__header-time"]}>
                был в сети 5 минут назад
              </div>
            </div>
          </div>
          <Messages
            user={user}
            dialog={dialog}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling}
          />
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
