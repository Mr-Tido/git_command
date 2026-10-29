import Nav_menu from '../../components/navmenu/navmenu'
import './registration.scss'
import Footer from '../../components/footer/footer'
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Registration(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth()

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await api.post('/register', { username, password, email });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

    return(
        <>
            <header className='reg_header'>
                <Nav_menu/>
            </header>

            <section className='reg_space'>
                <form className='reg_form' onSubmit={handleSubmit}>
                    <p>Регистрация</p>
                    <input type="email" placeholder='Введите email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <input type="password" placeholder='Подтвердите пароль' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    <input type="text" placeholder='Введите никнейм' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <div className="license-agreement">
                        <label>
                            <input type="checkbox" required />
                            <span className="license-text">
                                Я принимаю условия <Link to="/license">лицензионного соглашения</Link>
                            </span>
                        </label>
                    </div>
                    <Link to="/login">Уже есть аккаунт? Войдите</Link>
                    <button type='submit'>Зарегистрироваться</button>
                </form>
            </section>

            <Footer/>

        </>
    )
}