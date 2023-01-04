import './recommendations.css'

function Recommendations() {
  return (
    <div id="recom_page">
      <h1 id="recom_title">Recommendations</h1>
      <div id="recom_section">
        <p>
          As of now, the model is in it's early stages, so it's not very smart.
          To overcome this, you can take pictures a certain way to get better
          readings.
        </p>
        <ol class="recom_list">
          <li class="recom_item">
            <p>
              Check out the{' '}
              <a title="guessmybf" href="https://www.reddit.com/r/guessmybf/">
                r/guessmybf
              </a>
              subreddit. The more your pictures resemble those posted in r/gmbf,
              the easier it is for the model to give you a reading.
            </p>
          </li>
          <li class="recom_item">
            <p>
              Images in which your torso is encased in a 480x480px area are
              best.
            </p>
          </li>
          <li class="recom_item">
            <p>
              For some reason, most people on r/gmbf are clean shaven, tan and
              take mirror selfies. Mimicking them will let the model make a
              better prediction.
            </p>
          </li>
          <li class="recom_item">
            <p>
              If none of the above work, then ask the folks in r/gmbf to give
              you a reading and the model will improve over time. (it's a manual
              process for now, so don't expect too much:p )
            </p>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Recommendations
