import styles from "./Main.module.scss";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "../Header/Header.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

export default function Main() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  const [activeDialog, setActiveDialog] = useState("");

  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  return (
    <div className={styles["main"]}>
      <Header user={user} />
      <div className={styles["main__content"]}>
        <Sidebar
          activeDialog={activeDialog}
          setActiveDialog={setActiveDialog}
        />
        {activeDialog ? (
          <div className={styles["main__content-dialog"]}></div>
        ) : (
          <div className={styles["main__content-dialog"]}>
            Выберите собеседника
          </div>
        )}
      </div>
    </div>
  );
}
