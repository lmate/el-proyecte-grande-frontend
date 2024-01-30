import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="navbar">
            <ul className="menu"> 
                <li>
                    <Link className="menu-point" to='/'>
                        <img className="menu-icon" src="" />
                        <p className="menu-title">Home</p>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/profile'>
                        <img className="menu-icon" src="" />
                        <p className="menu-title">Profile</p>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/leaderboard'>
                        <img className="menu-icon" src="" />
                        <p className="menu-title">Leaderboard</p>
                    </Link>
                </li>
                <li>
                    <Link className="menu-point" to='/head2head'>
                        <img className="menu-icon" src="" />
                        <p className="menu-title">Head-2-Head</p>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;