import Nav_menu from '../../components/navmenu/navmenu'
import './login.scss'
import Footer from '../../components/footer/footer'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

    return(
        <>
            <header className='reg_header'>
                <Nav_menu/>
            </header>

            <section className='reg_space'>
                <form className='log_form' onSubmit={handleSubmit}>
                    <p>Авторизация</p>
                    <input type="email" placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <div className="license-agreement">
                        <label>
                            <input type="checkbox" required />
                            <span className="license-text">
                                Я принимаю условия <Link to="/license">лицензионного соглашения</Link>
                            </span>
                        </label>
                    </div>
                    <Link to="/registration">Нет аккаунта? Зарегистрируйтесь</Link>
                    <button type='submit'>Войти</button>
                </form>
            </section>

            <Footer/>

        </>
    )
}