import {useEffect, useState} from "react";

import axios from "axios";

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    async function getData() {
      const data = await axios.get("https://chatconnectapp.netlify.app/api/users")
      setData(data.data)
    }

    getData()
  }, []);
  return (
    <div>
      {data.length > 0 ? (
        data.map((user) => <div key={user.id}>{user.id}</div>)
      ) : (
        <div>No data available</div>
      )}
    </div>
  )
}

export default App
