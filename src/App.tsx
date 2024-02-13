import { useState } from "react";

import Game from "./components/Game"
import Auth from "./components/Auth"
import Navbar from "./components/Navbar"

import logo from './assets/logo.svg'

function App() {

  const [user, setUser] = useState()

  return (
    <>
      <img className="logo" src={logo} />
      <Game />
      <Auth user={user} setUser={setUser} />
      <Navbar />
    </>
  )
}

export default App
