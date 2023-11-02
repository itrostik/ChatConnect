import { useEffect, useState } from "react";

import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      const data = await axios.get(
        "https://chatconnectapp.netlify.app/api/users",
      );
      setData(data.data);
    }

    getData();
  }, []);
  return (
    <div>
      {data.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}

export default App;
