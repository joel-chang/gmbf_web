import { Link } from "react-router-dom"
import "./home.css"
function Home() {
	return (
		<div className="landing_card_title_group">
			<div id="landing_card_left_half">
				<h1 className="landing_card_title" >
					Measure your body fat % with the power of Reddit and AI.
				</h1>
				<p className="landing_card_description">
					Body fat percentage readings, <br/>
					Without expensive equipment, <br/>
					Without electrical impedance, <br/>
					In less than a minute.
				</p>
				<div className="home_links">
					<Link className="highlight_button" to="detect">TRY IT OUT</Link>
					<Link className="cta" to="learn">Learn more.</Link>
					<Link className="cta" to="recommendations">Recommendations.</Link>
				</div>
			</div>
			<div id="landing_card_right_half">
				<img id="home_img" src="img/website_image.png"></img>
			</div>
		</div>
	);
}

export default Home;