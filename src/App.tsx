import Login from "./components/Login.tsx";
import {useState} from "react";
import Register from "./components/Register.tsx";
import "./scss/app.scss"
import Main from "./components/Main.tsx";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [theme, setTheme] = useState(localStorage.getItem("theme"))
  if (!theme) {
    setTheme("Dark")
  }
  if (theme === "Dark") document.body.style.background = "#000"
  else if (theme === "Light") document.body.style.background = "#fff"
  return (
    <div className={theme === "Dark" ? "dark" : "light"}>
      {!user ? <Login theme={theme} setUser={setUser}/> : ""}
      {!user ? <Register theme={theme} setUser={setUser}/> : ""}
      {user ? <Main theme={theme} setTheme={setTheme}/> : ""}
    </div>
  );
}

export default App;
