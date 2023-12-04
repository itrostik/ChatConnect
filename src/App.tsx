import Login from "./components/Login/Login.tsx";
import { useState } from "react";
import Register from "./components/Register/Register.tsx";
import "./scss/app.scss";
import Main from "./components/Main/Main.tsx";
import Loading from "./components/UI/Loading/Loading.tsx";
import { Route, Routes } from "react-router-dom";
function App() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className={"layout"}>
      <Routes>
        <Route
          path="/login"
          element={!isLoading ? <Login setIsLoading={setIsLoading} /> : ""}
        />
        <Route
          path="/registration"
          element={!isLoading ? <Register setIsLoading={setIsLoading} /> : ""}
        />
        <Route path="/" element={!isLoading ? <Main /> : ""} />
      </Routes>
      {isLoading ? <Loading /> : ""}
    </div>
  );
}

export default App;
