import { Link } from "react-router-dom";

function Header(){
    return (
        <header className="header">
            <h1 className="title">PuzzleShowdown</h1>
            <Link to='/login'>Login</Link>
        </header>
    )
}

export default Header;