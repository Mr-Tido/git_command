import axios from 'axios';
import './game.scss'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import placeholder from '../../assets/coolimageomg.png'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001';


export default function Game(){

    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth()
    const navigate = useNavigate();
    

    //отзывная шляпа
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const reviewsEndRef = useRef(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/games/${id}`);
                setGame(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить статью');
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить эту игру?')) return;
        try {
            await axios.delete(`${API_URL}/api/games/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('игра удалена');
            navigate('/gamelist'); 
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении статьи');
        }
    };

     // Загрузка отзывов
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/reviews_game/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Ошибка загрузки отзывов:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
            fetchReviews();
        }, [id]);

    // Отправка отзыва
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/api/games`, {
                game_id: parseInt(id),
                review_text: reviewText.trim()
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReviewText('');
            await fetchReviews(); // перезагружаем список
            // Прокрутка к последнему отзыву
            setTimeout(() => {
                reviewsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error(err);
            alert('Ошибка отправки отзыва');
        } finally {
            setSubmitting(false);
        }
    };

     if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    if (!game) return <div style={{ padding: '20px' }}>Статья не найдена</div>;

    return(
        <>
            <Nav_menu/>
           <div className='news_itself1'>
                           <div className='news_i_workspace1'>
                               <div className='news_test1'>
                                   <p className='n_title'>{game.title}</p>
                                   {user && user.role === 'admin' && <button onClick={handleDelete}>Удалить игру</button>}
                                   {user && user.role === 'admin' &&  <Link to={`/edit1/${game.id}`}><button>Редактировать игру</button></Link>}
                               </div>

                               <iframe
                                    src="/gamebuild/index.html"
                                    title="Unity Game"
                                    className="unity-iframe"    // добавьте класс
                                    scrolling="no"             // запрещает прокрутку
                                    allowFullScreen
                                />
                               
                               <div className='placeholder1' dangerouslySetInnerHTML={{ __html: game.content }} />
           
                               <div className="reviews-section">
                                   
                                   
                                   {user ? (
                                       <form onSubmit={handleSubmitReview} className="review-form">
                                           <textarea
                                               value={reviewText}
                                               onChange={(e) => setReviewText(e.target.value)}
                                               placeholder="Напишите ваш отзыв..."
                                               rows={3}
                                               required
                                           />
                                           <button type="submit" disabled={submitting}>
                                               {submitting ? 'Отправка...' : 'Оставить отзыв'}
                                           </button>
                                       </form>
                                   ) : (
                                       <div className="newlinks1">
                                           <p>Чтобы оставить отзыв:</p>
                                           <div>
                                               <Link to="/registration">Зарегистрируйтесь</Link>
                                               <p>или</p>
                                               <Link to="/login">Войдите в аккаунт</Link>
                                           </div>
                                       </div>
                                   )}
                                   
                                   <h3>Отзывы ({reviews.length})</h3>
                                   <div className="reviews-list">
                                       {reviewsLoading ? (
                                           <p>Загрузка отзывов...</p>
                                       ) : reviews.length === 0 ? (
                                           <p>Пока нет отзывов. Будьте первым!</p>
                                       ) : (
                                           reviews.map((rev) => (
                                               <div key={rev.id} className="review-item">
                                                   <div className="review-header">
                                                       <strong>{rev.username}</strong>
                                                       <span className="review-date">
                                                           {new Date(rev.created_at).toLocaleString()}
                                                       </span>
                                                   </div>
                                                   <p className="review-text">{rev.review_text}</p>
                                               </div>
                                           ))
                                       )}
                                       <div ref={reviewsEndRef} />
                                   </div>
           
                                   
           </div>
           
                               
           
                               
                           </div>
                           
                           
                       </div>
            <Footer/>
        </>
    )
}