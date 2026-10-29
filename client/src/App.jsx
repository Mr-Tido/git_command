import MainPage from "./pages/mainpage/mainpage"
import Registration from "./pages/registration/registration";
import Login from "./pages/login/login";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Profile from "./pages/profile/profile";
import Newslist from "./pages/newslist/newslist";
import Gamelist from "./pages/gamelist/gamelist";
import News from "./pages/news/news";
import Game from "./pages/game/game";
import CreateArticle from "./pages/createarticle/cratearticle";
import EditArticle from "./pages/editarticle/editarticle";
import CreateGame from "./pages/creategame/crategame";
import EditGame from "./pages/editgame/editgame";
import About from './pages/about/About';
import License from './pages/license/License';

function App() {
  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/newslist" element={<Newslist/>}/>
            <Route path="/gamelist" element={<Gamelist/>}/>
            <Route path="/article/:id" element={<News/>}/>         
            <Route path="/game/:id" element={<Game/>}/>         
            <Route path="/createa" element={<CreateArticle/>}/>  
            <Route path="/edit/:id" element={<EditArticle />} />   
            <Route path="/edit1/:id" element={<EditGame />} />   
            <Route path="/createg" element={<CreateGame/>}/> 
            <Route path="/about" element={<About />} />
            <Route path="/license" element={<License />} />  
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
