import { useContext } from "react";
import { User } from "../../../../@types/types.ts";
import { ThemeContext } from "../../../../contexts/ThemeContext.ts";
import styles from "./Header.module.scss";

const Header = ({ user }: { user: User }) => {
  const themeContext = useContext(ThemeContext);

  function themeChange() {
    if (themeContext.theme === "dark") {
      themeContext.setTheme("light");
      localStorage.setItem("theme", "light");
    }
    if (themeContext.theme === "light") {
      themeContext.setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <header className={styles["header"]}>
      <div className={styles["header__logo"]}>ChatConnect</div>
      <div className={styles["header__theme"]} onClick={() => themeChange()}>
        <div className={styles["header__theme-img"]}></div>
      </div>
      <div className={styles["header__user"]}>
        <img src={user.avatar} alt="" className={styles["image-user"]} />
      </div>
    </header>
  );
};

export default Header;
