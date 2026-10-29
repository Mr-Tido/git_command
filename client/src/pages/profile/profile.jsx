import { useAuth } from '../../context/AuthContext';
import './profile.scss'
import Nav_menu from '../../components/navmenu/navmenu';
import Footer from '../../components/footer/footer';
import Template from '../../assets/Template.jpg'

export default function Profile(){
    const {user} = useAuth()

    return(
        <>
            <Nav_menu/>
            <div className='profile_space'>
                <div className='profile_workspace'>
                    <img src={Template} alt="" />
                    <div>
                        <p>Никнейм: {user.username}</p>
                        <p>Описание: Work in progress. In Future you can change it</p>
                        <button>Изменить</button>   
                    </div>
                    
                </div>
                
            </div>
            <Footer/>
        </>
    )
}