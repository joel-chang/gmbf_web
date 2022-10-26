import { Routes, Route, Link } from "react-router-dom"
import Home from "./home"
import Detect from "./detect"
import Learn from "./learn"
import Recommendations from "./recommendations"
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";

import { CREDS } from "./creds.js"
	// firebase stuff
// const app = initializeApp(CREDS);
// const db = getDatabase();
// const visitCountRef = ref(db, 'pub/visitor_count');

// // tensorflow
// const tf = require('@tensorflow/tfjs');
// const weights = '/web_model/model.json';
// const names = ['0_9', '10_11', '12_13', '14_15', '16_17', '18_20', '20_100']

function Top() {
	return (
		<div id="top_part">
			<Link id="home_icon" to="/" ><img src="img/logo.png"></img></Link>
			<div className="button_container">
				<Link className="perm_button" to="/">Home</Link>
				<Link className="perm_button" to="detect">Detection</Link>
			</div>
		</div>
	)
}

function Bottom() {
	return (
		<div id="bottom_part">
			<div className="cta_wrapper">
				<a href="https://www.reddit.com/r/guessmybf/">
					<img alt="Reddit" id="reddit_logo" src="./img/reddit_logo2.png"/>
				</a>
			</div>
			<div id="visitor_counter_wrapper"></div>
			<div id="det_counter_wrapper"></div>
		</div>
	)
}

function App() {
  return (
		<>
		<Top/>
    <div className="App">
			<Routes>
				<Route path="/" element={ <Home/> } />
				<Route path="/detect" element={ <Detect/>} />
				<Route path="/learn" element={ <Learn/>} />
				<Route path="/recommendations" element={ <Recommendations/>} />
			</Routes>
    </div>
		<Bottom/>
		</>
  )
}

export default App;