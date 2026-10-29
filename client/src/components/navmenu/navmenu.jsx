import './navmenu.scss'
import logo2 from '../../assets/logo2.png'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Nav_menu (){
    const {user, logout} = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    return(
        <div className='nav_space'>
            <div className='nav_workspace'>
                <Link to="/" onClick={closeMenu}><img src={logo2} alt="Logo" /></Link>
                
                <div className='nav_links'>
                    <Link to="/gamelist">Наши игры</Link>
                    <Link to="/newslist">Новости</Link>
                    <Link to="/about">О нас</Link>

                    {user ? (
                        <>
                            <Link className='login_text' to="/profile">{user.username}</Link>
                            <button className='login_button' onClick={logout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Войти</Link>
                            <Link to="/registration">Зарегистрироваться</Link>
                        </>
                    )}
                </div>

                {/* Бургер-иконка */}
                <div className={`burger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                {/* Мобильное выпадающее меню */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/gamelist" onClick={closeMenu}>Наши игры</Link>
                    <Link to="/newslist" onClick={closeMenu}>Новости</Link>
                    <a href="" onClick={closeMenu}>О нас</a>
                    {user ? (
                        <>
                            <Link to="/profile" onClick={closeMenu}>{user.username}</Link>
                            <button onClick={() => { logout(); closeMenu(); }}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu}>Войти</Link>
                            <Link to="/registration" onClick={closeMenu}>Зарегистрироваться</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}