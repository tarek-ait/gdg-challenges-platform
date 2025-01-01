import { User, LogOut, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const NavBar = () => {

    const { user, logout, teamId } = useAuthStore();

    return (
        <div className="navbar bg-base-100 px-6 shadow-md fixed z-50 top-0">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns=""
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {user && (
                            <>
                                <Link to={"/challenges"} className='btn'>Challenges</Link>
                                <Link to={teamId !== null && teamId !== undefined ? `/team/${teamId}` : "/join-team"} className="btn">Team</Link>
                                <Link to={"/submission"} className='btn'>Submission</Link>
                            </>
                        )}
                    </ul>
                </div>
                <Link to={"/"} className="btn btn-ghost text-xl">
                    <Swords />
                    GDG!
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-3">
                    {user && (
                        <>
                            <Link to={"/challenges"} className='btn'>Challenges</Link>
                            <Link to={teamId !== null && teamId !== undefined ? `/team/${teamId}` : "/join-team"} className="btn">Team</Link>
                            <Link to={"/submission"} className='btn'>Submission</Link>
                        </>
                    )}
                </ul>
            </div>
            <div className="navbar-end gap-5">
                {user && (
                    <>
                        <Link to={"/profile"} className='flex gap-1 items-center justify-center'>
                            <User className="size-5"></User>
                            <span className="hidden sm:inline">Profile</span>
                        </Link>

                        <Link to={"/"}>
                            <button className="flex gap-1.5 items-center justify-center" onClick={logout}>
                                <LogOut className="size-5"></LogOut>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </Link>

                    </>
                    // we will leave the settings option inside the profile page.
                )}
                {!user && (
                    <>
                        <Link to={"/login"} className="btn">Login</Link>
                        <Link to={"/signup"} className="btn">Signup</Link>
                    </>
                )}
            </div>

        </div>
    )
}

export default NavBar
