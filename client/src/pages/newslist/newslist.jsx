import axios from 'axios';
import './newslist.scss'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import Template from '../../assets/Template.jpg'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3001';

export default function Newslist(){

    const [articles, setArticles] = useState([]);
    const {user} = useAuth()

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await axios.get(`${API_URL}/api/articles`);
            setArticles(res.data);
        };
        fetchArticles();
    }, []);

    return(
        <>
            <Nav_menu/>
                <section className='news_space'>
                  <div className='news_wspace'>
                    <h1>Новости:</h1>
                    <div className='news_listt'>
                      {articles.map(article => (
                        <div className='newit' key={article.id} >
                          <Link to={`/article/${article.id}`}>
                            <div>
                                <img src={article.cover} alt="" />
                                <h2>{article.type}</h2>
                                <p>{article.description}</p>
                              </div>
                          </Link>
                            
                            
                        </div>
                    ))}
                    </div>
                    

                    {user ? (
                      <>
                        {user.role === 'admin' && (
                          <Link to='/createa'><button className='create_button'>Создать статью</button></Link>
                        )}
                      </>
                    ) : (
                      <p></p>
                    )}
                  </div>
                    
                  
                </section>
            <Footer/>
        </>
    )
}