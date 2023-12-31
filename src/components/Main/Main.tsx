import styles from "./Main.module.scss";
import { Navigate } from "react-router-dom";
import Header from "../Header/Header.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import Dialog from "../Dialog/Dialog.tsx";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { useBeforeUnload } from "react-router-dom";

export default function Main() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  const dialog = useSelector((state: RootState) => state.dialog);
  const user = useSelector((state: RootState) => state.user);
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
  function setOnline() {
    axios.patch(`https://chatconnectapp.netlify.app/api/users/`, {
      userId: user.id,
      online: true,
    });
  }

  function setOffline() {
    axios.patch(`https://chatconnectapp.netlify.app/api/users/`, {
      userId: user.id,
      online: false,
    });
  }

  useBeforeUnload(
    useCallback(() => {
      setOffline();
    }, []),
  );

  useEffect(() => {
    setOnline();
    return () => {
      setOffline();
    };
  }, []);

  return (
    <div className={styles["main"]}>
      <Header user={user} setIsDialogLoading={setIsDialogLoading} />
      <div className={styles["main__content"]}>
        <Sidebar user={user} />
        {dialog.id ? (
          <Dialog
            dialog={dialog}
            user={user}
            isDialogLoading={isDialogLoading}
          />
        ) : !isDialogLoading ? (
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
