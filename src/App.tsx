import Login from "./components/Login.tsx";
import {useState} from "react";
import Register from "./components/Register.tsx";
import "./scss/app.scss"
import Main from "./components/Main.tsx";
import Loading from "./components/Loading.tsx";
import {Route, Routes} from "react-router-dom";

function App() {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")))
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
        <Route path="/login" element={!isLoading ? <Login theme={theme} token={token} setToken={setToken} setIsLoading={setIsLoading}/> : ""}/>
        <Route path="/registration" element={!isLoading ? <Register token={token} theme={theme} setToken={setToken} setIsLoading={setIsLoading}/> : ""}/>
        <Route path="/main" element={token ? <Main theme={theme} setTheme={setTheme}/> : ""}/>
      </Routes>
      {isLoading ? <Loading theme={theme} /> : ""}
    </div>
  );
}

export default App;
