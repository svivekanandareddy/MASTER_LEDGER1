import React from "react";
import Dashboard from "./components/Dashboard";

function App() {

  const auth = {
    role: "admin",
    username: "admin"
  };

  return (
    <div>
      <Dashboard auth={auth} />
    </div>
  );
}

export default App;