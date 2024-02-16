import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Game from "./components/Game/Game.tsx";
import Auth from "./components/auth/Auth.tsx";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile.tsx";

import logo from "./assets/logo.svg";

function App() {
  const [user, setUser] = useState();

  return (
    <>
      <img className="logo" src={logo} />
      <Auth user={user} setUser={setUser} />
      <Navbar user={user} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Game />
            </>
          }
        ></Route>
        <Route
          path="/profile/:userName"
          element={
            <>
              <Profile user={user} />
            </>
          }
        ></Route>
        <Route path="/leaderboard" element={<>{/* LEADERBOARD */}</>}></Route>
        <Route path="/head2head" element={<>{/* HEAD2HEAD */}</>}></Route>
      </Routes>
    </>
  );
}

export default App;
