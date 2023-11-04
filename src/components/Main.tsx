import Header from "./UI/Header.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import Sidebar from "./Sidebar.tsx";

const Main = ({
                theme,
                setTheme,
              }: {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}) => {
  const [activeDialog, setActiveDialog] = useState("");
  return (
    <div className="main">
      <Header theme={theme} setTheme={setTheme} />
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