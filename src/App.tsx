import Game from "./components/Game"
import Header from "./components/Header"
import Navbar from "./components/Navbar"

import logo from './assets/logo.svg'

function App() {
  return (
    <>
      <img className="logo" src={logo} />
      <Game />
      <Header />
      <Navbar />
    </>
  )
}

export default App
