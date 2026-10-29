import axios from 'axios';
import './news.scss'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import placeholder from '../../assets/1.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

export default function News(){
    const { id } = useParams();
    const [article, setArticle] = useState(null);
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
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/articles/${id}`);
                setArticle(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить статью');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) return;
        try {
            await axios.delete(`${API_URL}/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Статья удалена');
            navigate('/newslist'); 
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении статьи');
        }
    };

     // Загрузка отзывов
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/reviews/${id}`);
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

    // const handleDeleteArticle = async () => {
    //     if (!window.confirm('Удалить статью?')) return;
    //     try {
    //         await axios.delete(`${API_URL}/api/articles/${id}`, {
    //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    //         });
    //         alert('Статья удалена');
    //         navigate('/newslist');
    //     } catch (err) {
    //         console.error(err);
    //         alert('Ошибка удаления');
    //     }
    // };

    // Отправка отзыва
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/api/reviews`, {
                article_id: parseInt(id),
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
    if (!article) return <div style={{ padding: '20px' }}>Статья не найдена</div>;

    return(
        <>
            <Nav_menu/>
            <div className='news_itself1'>
                <div className='news_i_workspace1'>
                    <div className='news_test1'>
                        <p className='n_title'>{article.title}</p>
                        {user && user.role === 'admin' && <button onClick={handleDelete}>Удалить статью</button>}
                        {user && user.role === 'admin' &&  <Link to={`/edit/${article.id}`}><button>Редактировать статью</button></Link>}
                    </div>
                    
                    <div className='placeholder1' dangerouslySetInnerHTML={{ __html: article.content }} />

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