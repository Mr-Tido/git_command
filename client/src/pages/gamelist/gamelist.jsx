import axios from 'axios';
import './gamelist.scss'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';


const API_URL = 'http://localhost:3001';

export default function Gamelist(){

    const [games, setGames] = useState([]);
    const {user} = useAuth()

    useEffect(() => {
        const fetchGames = async () => {
            const res = await axios.get(`${API_URL}/api/games`);
            setGames(res.data);
        };
        fetchGames();
    }, []);

    return(
        <>
            <Nav_menu/>

            <section className='news_space'>
                              <div className='news_wspace'>
                                <h1>Игры:</h1>
                                <div className='news_listt'>
                                  {games.map(game => (
                                    <div className='newit' key={game.id} >
                                      <Link to={`/game/${game.id}`}>
                                        <div>
                                            <img src={game.cover} alt="" />
                                            <h2>{game.title}</h2>
                                            <p>{game.description}</p>
                                          </div>
                                      </Link>
                                        
                                        
                                    </div>
                                ))}
                                </div>
                                
            
                                {user ? (
                                  <>
                                    {user.role === 'admin' && (
                                      <Link to='/createg'><button className='create_button'>Создать страницу игры</button></Link>
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