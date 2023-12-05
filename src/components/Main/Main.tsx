import styles from "./Main.module.scss";
import { Navigate } from "react-router-dom";
import Header from "../Header/Header.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import Dialog from "../UI/Dialog/Dialog.tsx";
import { useState } from "react";

export default function Main() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  const dialog = useSelector((state: RootState) => state.dialog);
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className={styles["main"]}>
      <Header user={user} />
      <div className={styles["main__content"]}>
        <Sidebar
          user={user}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        {dialog.id ? (
          <Dialog dialog={dialog} user={user} />
        ) : !isLoading ? (
          <div className={styles["main__content-dialog"]}>
            Выберите собеседника
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
