import Header from "./UI/Header.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import Sidebar from "./Sidebar.tsx";
import {jwtDecode} from "jwt-decode";
import {Navigate} from "react-router-dom";

const Main = ({
                theme,
                setTheme,
                token
              }: {
  theme: string;
  token: string
  setTheme: Dispatch<SetStateAction<string>>;
}) => {
  if (!token) {
    return <Navigate to="/login"/>
  }
  const [activeDialog, setActiveDialog] = useState("");
  const [user, setUser] = useState(jwtDecode(token))
  return (
    <div className="main">
      <Header theme={theme} setTheme={setTheme} user={user}/>
      <div className="main__content">
        <Sidebar
          theme={theme}
          activeDialog={activeDialog}
          setActiveDialog={setActiveDialog}
        />
        {activeDialog ? (
          <div className="main__content-dialog"></div>
        ) : (
          <div className="main__content-dialog">Выберите собеседника</div>
        )}
      </div>
    </div>
  );
};
export default Main;