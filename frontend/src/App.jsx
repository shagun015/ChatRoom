import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Register from './pages/Register/Register';
import LogIn from './pages/LogIn/Login';

function App() {
  return(
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' exact element={<Home />}/>
        <Route path='/register' exact element={<Register />}/>
        <Route path='/login' exact element={<LogIn />}/>
      </Routes>
        
    </BrowserRouter>
  ) 
}

export default App
