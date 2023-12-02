import styles from "./Main.module.scss";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../Header/Header.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { User } from "../../../@types/types.ts";

export default function Main({ token }: { token: string }) {
  if (!token) {
    return <Navigate to="/login" />;
  }
  const [activeDialog, setActiveDialog] = useState("");
  const [user, setUser] = useState<User>(jwtDecode(token));
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
