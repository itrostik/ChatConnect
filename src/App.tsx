import Login from "./components/Login.tsx";
import {useState} from "react";
import Register from "./components/Register.tsx";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  return (
    <div>
      {!user ? <Login setUser={setUser}/> : ""}
      {!user ? <Register setUser={setUser}/> : ""}
      {user ? <div>Добро пожаловать, {user.username}</div> : ""}
    </div>
  );
}

export default App;
