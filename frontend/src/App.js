import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {

  // Always authenticated as admin
  const [auth] = useState({
    role: "admin",
    username: "admin"
  });

  return (
    <div>
      <Dashboard auth={auth} />
    </div>
  );
}

export default App;