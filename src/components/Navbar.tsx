import { Link } from "react-router-dom";

import homeIcon from '../assets/home-icon.svg'
import profileIcon from '../assets/profile-icon.svg'
import leaderboardIcon from '../assets/leaderboard-icon.svg'
import head2headIcon from '../assets/head2head-icon.svg'

function Navbar(){
    return(
        <nav className="Navbar">
            <ul className="menu"> 
                <li>
                    <Link className="menu-point" to='/'>
                        <img src={homeIcon} />
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/profile'>
                        <img src={profileIcon} />
                        <span>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/leaderboard'>
                        <img src={leaderboardIcon} />
                        <span>Leaderboard</span>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/head2head'>
                        <img src={head2headIcon} />
                        <span>Head-2-Head</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;