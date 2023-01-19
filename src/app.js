import { Routes, Route, Link } from 'react-router-dom'
import './app.css'
import Home from './home'
import Detect from './detect'
import Learn from './learn'
import Recommendations from './recommendations'
import { auth, provider } from '.'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithRedirect } from 'firebase/auth'
import Popup from 'reactjs-popup'

// Sign in with google
const signin = async () => {
  await signInWithRedirect(auth, provider)
}


const LoginBTN = () => {
  return (
    <Popup trigger={<button className="login_button">SIGN IN</button>}>
      <div id="login_popup_container">
        <center>
          <button onClick={signin}>Google</button>
        </center>
      </div>
      <div id="cancel_login"></div>
    </Popup>
  )
}


const LogoutBTN = () => {
  // Signout function
  const logout = () => {
    auth.signOut()
  }

  return (
    <button className="login_button" onClick={logout}>
      log out
    </button>
  )
}


const LogButton = () => {
  const [user] = useAuthState(auth)
  return user ? <LogoutBTN /> : <LoginBTN />
}


function Top() {
  return (
    <div id="top_part">
      <Link id="home_icon" to="/">
        <img src="img/logo.png"></img>
      </Link>
      <div className="button_container">
        <Link className="perm_button" to="/">
          Home
        </Link>
        <Link className="perm_button" to="detect">
          Detection
        </Link>
        <LogButton className="login_button" />
      </div>
    </div>
  )
}


function Bottom() {
  return (
    <div id="bottom_part">
      <div className="cta_wrapper">
        <a href="https://www.reddit.com/r/guessmybf/">
          <img alt="Reddit" id="reddit_logo" src="./img/reddit_logo2.png" />
        </a>
      </div>
      {/* <div id="visitor_counter_wrapper"></div> */}
      <div id="det_counter_wrapper"></div>
    </div>
  )
}


function App() {
  return (
    <>
      <Top />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </div>
      <Bottom />
    </>
  )
}

export default App
