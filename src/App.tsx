import { useState, useCallback, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Game from "./components/Game/Game.tsx";
import Auth from "./components/auth/Auth.tsx";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile.tsx";
import CreateRace from "./components/Game/CreateRace.tsx";
import Race from "./components/Game/Race.tsx";
import LeaderBoard from "./components/Leaderboard.tsx"
import logo from "./assets/logo.svg";
import User from "./types/user.ts";

import quotes  from  "./assets/quotes";
import {Quote}  from "./assets/quotes.ts";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const autoLogin = useCallback(
    async function () {
    
        const response = await fetch("/api/user/login", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          setUser(await response.json());
        }
    },
    []
  );

  useEffect(() => {
    if (!user) {
      autoLogin();
    }
  }, [user, autoLogin]);

  const race = {
    racePuzzleFirst: "",
    racePuzzleStep: 0,
    handlePuzzleDone: () => {}
  }

  useEffect(() => {
    function getQuote(){
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
    setInterval(getQuote, 120000);
    getQuote()
  }, [])
  
  return (
    <>
      <img className="logo" src={logo} />
      <Auth user={user} setUser={setUser} />
        {quote &&
      <p className="quote">
        <>
        {"“" + quote.quote + "”"}<br/><b className="quote-name">{quote.name}</b>
        </>
        </p>
        }
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
              <Game startGamemode={""} user={user} race={race}/>
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
        <Route
          path="/race/:raceId/:isAlreadyJoined"
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
