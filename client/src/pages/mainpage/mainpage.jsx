import './mainpage.scss'
import logo from '../../assets/logo.png'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import placeholder from '../../assets/placeholder.png'
import arrow from '../../assets/arrow.png'
import stars from '../../assets/stars.png'
import logo2 from '../../assets/logo2.png'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import change from '../../assets/changelater.png'
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

export default function MainPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestArticles = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/articles`);
                // Сортируем по дате (новые сверху) и берём первые 3
                const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setArticles(sorted.slice(0, 3));
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить новости');
            } finally {
                setLoading(false);
            }
        };
        fetchLatestArticles();
    }, []);

    return (
        <>
            <header className='main_header'>
                <Nav_menu />
                <div className='header_workspace'>
                    <div className='hw_logo'>
                        <img src={logo} alt="" />
                        <p>Angelus Novus</p>
                    </div>
                    <div className='hw_hard'>
                        <p className='hwh_bigp'>Angelus <br className='aw' /> Novus</p>
                        <div className='main_ad1'>
                            <div className='hwh_graybox'><p>Angelus Novus - Студия разработчиков ориентирующаяся на создание 2D-игр с пиксельной графикой, где упор идёт на геймплей и историю</p></div>
                            <img className='hwh_placeholder' src={placeholder} alt="" />
                        </div>
                        
                    </div>
                </div>
            </header>

            <section className='recents'>
                <div className='r_workspace'>
                    <p className='r_name'>Недавние игры:</p>
                    <div className='r_3divs'>
                        <div>
                            <div>
                                <button><p>Перейти</p></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='authors'>
                <div className='a_workspace'>
                    <p className='aw_title'>Основатели:</p>
                    <div className='aw_3divs'>
                        <div className='aw_1div'>
                            <div className='aw_divindiv'>
                                <div>
                                    <div></div>
                                    <p className='awp1'>NICKNAME</p>
                                    <p className='awp2'>Информация об основателе, чем занимается человек</p>
                                </div>
                            </div>
                        </div>
                        <div className='aw_1div'>
                            <div className='aw_divindiv'>
                                <div>
                                    <div></div>
                                    <p className='awp1'>NICKNAME</p>
                                    <p className='awp2'>Информация об основателе, чем занимается человек</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='learn_more'>
                        <button><p>Узнать больше</p> <img src={arrow} alt="" /></button>
                        <p>Lorem ipsum dolor sit amet, consec-tetur adipcing elit. Vestibulum sitam sagittis magna, id rho-nascus velit.</p>
                    </div>
                </div>
            </section>

            <section className='news'>
                <div className='news_workspace'>
                    <div className='news_notbd'>
                        <p className='news_title'>Новости:</p>
                        {loading ? (
                            <p className="news-loading">Загрузка...</p>
                        ) : error ? (
                            <p className="news-error">{error}</p>
                        ) : articles.length === 0 ? (
                            <p className="news-empty">Новостей пока нет</p>
                        ) : (
                            <div className='news_cards'>
                                {articles.map(article => (
                                    <Link to={`/article/${article.id}`} key={article.id} className='news_card_link'>
                                        <div className='news_card'>
                                            <img src={article.cover} alt={article.title} className='news_card_img' />
                                            <h2 className='news_card_type'>{article.type}</h2>
                                            <p className='news_card_desc'>{article.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className='review'>
                <div className='r_workspace'>
                    <p className='r_title'>Отзывы:</p>
                    <div className='r_place'>
                        <div className='r_3'>
                            <div className='r_g'></div>
                            <div className='r_lg'></div>
                            <div className='r_g'></div>
                        </div>
                        <div className='r_itself'>
                            <div>
                                <div className='r_text'>
                                    <p className='r_title'>Загаловок</p>
                                    <p className='r_itext'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet sagittis magna, id rhonascus velit. Nam euismod tristique ipsum, vitae vestibulum leo varius ac. Curabitur gravida purus volutpat neque tempor congue. Ut gravida est eu diam aliquet, vel scelerisque turpis sodales. Aenean non conguera felis, et facilisis quam. Pellentesque urna felis, lacinia vel this is placeholder block </p>
                                    <div>
                                        <p>NICKNAME</p>
                                        <img src={stars} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}