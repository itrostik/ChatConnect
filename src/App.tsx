import Login from "./components/Login.tsx";
import {useState} from "react";
import Register from "./components/Register.tsx";
import "./scss/app.scss"
import Main from "./components/Main.tsx";
import Loading from "./components/Loading.tsx";
import {Route, Routes} from "react-router-dom";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [theme, setTheme] = useState(localStorage.getItem("theme"))
  if (!theme) {
    setTheme("Dark")
  }
  const [isLoading, setIsLoading] = useState(false)
  if (theme === "Dark") document.body.style.background = "#000"
  else if (theme === "Light") document.body.style.background = "#fff"
  return (
    <div className={theme === "Dark" ? "dark" : "light"}>
      <Routes>
        <Route path="/login" element={!user && !isLoading ? <Login theme={theme} setUser={setUser} setIsLoading={setIsLoading}/> : ""}/>
        <Route path="/registration" element={!user && !isLoading ? <Register theme={theme} setUser={setUser} setIsLoading={setIsLoading}/> : ""}/>
        <Route path="/main" element={user ? <Main theme={theme} setTheme={setTheme}/> : ""}/>
      </Routes>
      {!user && isLoading ? <Loading theme={theme} /> : ""}
    </div>
  );
}

export default App;
