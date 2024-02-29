import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Game from "./components/Game/Game.tsx";
import Auth from "./components/auth/Auth.tsx";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile.tsx";
import CreateRace from "./components/Game/CreateRace.tsx";
import Race from "./components/Game/gametypes/Race.tsx";
import LeaderBoard from "./components/LeaderBoard.tsx"

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
          path="/profile/:username"
          element={
            <>
              <Profile user={user} />
            </>
          }
        ></Route>
        <Route path="/leaderboard" element={<LeaderBoard currentUser={user}/>}></Route>
        <Route
          path="/head2head"
          element={
            <>
              <CreateRace user={user} />
            </>
          }
        ></Route>
        <Route
          path="/race/:raceId"
          element={
            <>
              <Race user={user} />
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
