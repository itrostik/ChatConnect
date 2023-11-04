import "../../scss/header.scss";
import { Dispatch, SetStateAction } from "react";

const Header = ({
                  theme,
                  setTheme,
                }: {
  theme: String;
  setTheme: Dispatch<SetStateAction<string>>;
}) => {
  function themeChange() {
    if (theme === "Dark") {
      setTheme("Light");
      localStorage.setItem("theme", "Light")
    }
    if (theme === "Light") {
      setTheme("Dark");
      localStorage.setItem("theme", "Dark")
    }
  }
  return (
    <>
      {theme === "Dark" ? (
        <header className="header">
          <div className="header__logo header__logo-dark">ChatConnect</div>
          <div className="header__theme" onClick={() => themeChange()}>
            <img src="/img/moon.svg" alt="" />
          </div>
          <div className="header__user">
            <img src="/img/user-dark.svg" alt="" />
          </div>
        </header>
      ) : (
        <header className="header">
          <div className="header__logo header__logo-light">ChatConnect</div>
          <div className="header__theme" onClick={() => themeChange()}>
            <img src="/img/sun.svg" alt="" />
          </div>
          <div className="header__user">
            <img src="/img/user-light.svg" alt="" />
          </div>
        </header>
      )}
    </>
  );
};

export default Header;