import Game from "./components/Game"
import Auth from "./components/Auth"
import Navbar from "./components/Navbar"

import logo from './assets/logo.svg'

function App() {
  return (
    <>
      <img className="logo" src={logo} />
      <Game />
      <Auth />
      <Navbar />
    </>
  )
}

export default App
