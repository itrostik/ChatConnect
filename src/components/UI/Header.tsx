import "../../scss/header.scss";
import { Dispatch, SetStateAction } from "react";
import { User } from "../../@types/types.ts";

const Header = ({
  theme,
  setTheme,
  user,
}: {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  user: User;
}) => {
  function themeChange() {
    if (theme === "Dark") {
      setTheme("Light");
      localStorage.setItem("theme", "Light");
    }
    if (theme === "Light") {
      setTheme("Dark");
      localStorage.setItem("theme", "Dark");
    }
  }

  console.log(user);
  return (
    <>
      {theme === "Dark" ? (
        <header className="header">
          <div className="header__logo header__logo-dark">ChatConnect</div>
          <div className="header__theme" onClick={() => themeChange()}>
            <img src="/img/moon.svg" alt="" />
          </div>
          <div className="header__user">
            <img src={user.avatar} alt="" className={"image-user"} />
          </div>
        </header>
      ) : (
        <header className="header">
          <div className="header__logo header__logo-light">ChatConnect</div>
          <div className="header__theme" onClick={() => themeChange()}>
            <img src="/img/sun.svg" alt="" />
          </div>
          <div className="header__user">
            <img src={user.avatar} alt="user" className={"image-user"} />
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
