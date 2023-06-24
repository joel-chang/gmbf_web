import '../styles/learn.css'

function Learn() {
  return (
    <div id="faq_page">
      <h1 id="faq_title">FAQ</h1>
      <div id="qna_section">
        <h2 class="question">Are you saving my pictures?</h2>
        <p class="answer">
          No, the inference (the thinking of the AI) is done completely on your
          device. You can even turn off your wifi/data after the model is
          loaded, and select or drag a picture, and you will still be able to
          get a reading! P.S. the only images I get (or want) to see are those
          posted in the subreddit.
        </p>
        <h2 class="question">How does this app work?</h2>
        <p class="answer">
          Well, all the pictures and body fat estimates came from the{' '}
          <a title="guessmybf" href="https://www.reddit.com/r/guessmybf/">
            r/guessmybf
          </a>{' '}
          subreddit. After that, it was just a matter of repeatedly slamming my
          head against the keyboard, and reading of course.
        </p>
        <h2 class="question">
          Do I need an internet connection to run this app?
        </h2>
        <p class="answer">
          You do, up to the point where the image dropzone tells you to drop or
          choose a file. After that, you don't need any internet connection (but
          I won't be able to track how many detections have been done).
        </p>
        <h2 class="question">
          I feel like the app is not accurate. Why am I getting innacurate
          readings?!
        </h2>
        <p class="answer">
          Yeah, due to the nature of the{' '}
          <a title="guessmybf" href="https://www.reddit.com/r/guessmybf/">
            r/guessmybf
          </a>{' '}
          subreddit, the model is trained with mostly pictures of male humans
          who aren't too pale, too tan, or too hairy. This also explains why
          some angles may give you more accurate readings than others.{' '}
          <i>(I'm also not an expert at machine learning, so sorry.)</i>
        </p>
        <h2 class="question">
          Is there any way to improve the accuracy of the model?
        </h2>
        <p class="answer">
          Yes! Head over to the{' '}
          <a title="guessmybf" href="https://www.reddit.com/r/guessmybf/">
            r/guessmybf
          </a>{' '}
          subreddit, and post your picture or make a comment. <br />
          The more samples (e.g. people posting and commenting on r/guessmybf),
          the better the model should be! <br />
          Alternatively, try taking a picture from a different
          angle/distance/lighting or cropping it to a square ratio. Check the
          <a href="recommendations">recommendations</a> page for more info.
        </p>
        <h2 class="question">
          So the model isn't 100% accurate. Does this mean it's useless?
        </h2>
        <p class="answer">
          Not really (bias much). <br />
          You can compare it to one of those electrical impedance devices. Maybe
          you're not getting a 'correct' reading, but if you keep the lighting,
          distance, and angles the same, then you will definitely be able to
          track your progress over time. Let's stay you start at the 20% - 100%
          range, but you were actually 17%, then you dropped 3% body fat, the
          app would put you in a different body fat percentage range.
        </p>
      </div>
    </div>
  )
}

export default Learn
