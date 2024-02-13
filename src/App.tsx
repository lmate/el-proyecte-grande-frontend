import { Route, Routes } from "react-router-dom";

import Game from "./components/Game"
import Auth from "./components/Auth"
import Navbar from "./components/Navbar"
import Profile from './components/Profile.tsx'

import logo from './assets/logo.svg'

function App() {

  return (
    <>
      <img className="logo" src={logo} />
      <Auth />

      <Routes>
        <Route path="/" element={(
          <>
            <Game />
            <Navbar />
          </>
        )}>
        </Route>
        <Route path="/profile" element={(
          <>
            <Profile />
            <Navbar />
          </>
        )}>
        </Route>
        <Route path="/leaderboard" element={(
          <>
            {/* LEADERBOARD */}
            <Navbar />
          </>
        )}>
        </Route>
        <Route path="/head2head" element={(
          <>
            {/* HEAD2HEAD */}
            <Navbar />
          </>
        )}>
        </Route>
      </Routes>
    </>
  )
}

export default App
