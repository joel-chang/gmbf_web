import React from "react";
import ReactDOM from "react-dom";
import MagicDropzone from "react-magic-dropzone";
import { COLORS } from "./colors.js"
import { CREDS } from "./creds.js"
import "./styles.css";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";


// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

// firebase stuff
const app = initializeApp(CREDS);
const db = getDatabase();
const visitCountRef = ref(db, 'pub/visitor_count');

// tensorflow
const tf = require('@tensorflow/tfjs');
const weights = '/web_model/model.json';
const names = ['0_9', '10_11', '12_13', '14_15', '16_17', '18_20', '20_100']

// update db visitor count on load website
onValue(visitCountRef, (snapshot) => {
  let data = snapshot.val();
  data += 1;
  set(visitCountRef, data);
}, { onlyOnce: true });

// display visitor count displayed in DOM everytime it changes
onValue(visitCountRef, (snapshot) => {
  const data = snapshot.val();
  document.getElementById("visitor_counter_wrapper").innerHTML = "Visit #" + data;
});

// display number of detections in database
const userCountRef = ref(db, 'pub/det_count');
onValue(userCountRef, (snapshot) => {
  const data = snapshot.val();
  document.getElementById('det_counter_wrapper').innerHTML = "Used " + data + " times.";
});


class App extends React.Component {
  state = {
    model: null,
    preview: "",
    predictions: []
  };

  componentDidMount() {
    tf.loadGraphModel(weights).then(model => {
      this.setState({
        model: model
      });
    });
  };

  onDrop = (accepted, rejected, links) => {
    this.setState({ preview: accepted[0].preview || links[0] });
  };

  cropToCanvas = (image, canvas, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = COLORS.img_bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ratio = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const newWidth = Math.round(image.naturalWidth * ratio);
    const newHeight = Math.round(image.naturalHeight * ratio);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      (canvas.width - newWidth) / 2,
      (canvas.height - newHeight) / 2,
      newWidth,
      newHeight,
    );
  };

  onImageChange = e => {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    this.cropToCanvas(e.target, c, ctx);

    let [modelWidth, modelHeight] = this.state.model.inputs[0].shape.slice(1, 3);
    const input = tf.tidy(() => {
      return tf.image.resizeBilinear(tf.browser.fromPixels(c), [modelWidth, modelHeight])
        .div(255.0).expandDims(0);
    });

    this.state.model.executeAsync(input).then(res => {
      // Font options.
      const font = "16px sans-serif";
      ctx.font = font;
      ctx.textBaseline = "top";

      const [boxes, scores, classes, valid_detections] = res;
      const valid_detections_data = valid_detections.dataSync()[0];
      const boxes_data = boxes.dataSync();
      const scores_data = scores.dataSync();
      const classes_data = classes.dataSync();

      this.setState({ num_of_detect: valid_detections_data });
      tf.dispose(res);

      const box_colors = [
        COLORS.det0, COLORS.det1, COLORS.det2,
        COLORS.det3, COLORS.det4, COLORS.det5,
        COLORS.det6, COLORS.det7, COLORS.det8,
        COLORS.det9, COLORS.det10, COLORS.det11
      ];

      const res_list = [];
      var i;
      for (i = 0; i < valid_detections_data; ++i) {
        let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
        x1 *= c.width;
        x2 *= c.width;
        y1 *= c.height;
        y2 *= c.height;
        const width = x2 - x1;
        const height = y2 - y1;
        const klass = names[classes_data[i]];
        const score = scores_data[i].toFixed(2);

        // get lower and upper boundaries for body fat
        const lower = klass.split('_')[0];
        const upper = klass.split('_')[1];

        const cur_color = box_colors[i % 12];

        // draw the bounding box
        ctx.strokeStyle = cur_color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x1, y1, width, height);

        // draw the label background
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x1, y1, 11 * (1 + parseInt(i / 10)), 15);

        // draw the actual label
        ctx.fillStyle = COLORS.black;
        ctx.fillText(i, x1, y1);
        const new_drawing = {
          lower: lower,
          upper: upper,
          conf: parseInt(score * 100),
          color: cur_color
        }
        res_list.push(new_drawing);
      }

      // description is the info displayed under the canvas
      // two curly brackets for coloring
      const description = [];
      if (valid_detections_data === 0) {{
        description.push(
          <div className="img_desc">
            Couldn't get a reading. Maybe try a different image?
          </div>
        );
      }}
      else if (valid_detections_data === 1) {{
        const single_det = res_list[0];
        description.push(
          <div className="img_desc" key={i} style={{ background: single_det.color }}>
            Your estimated bf is between {single_det.lower}% and {single_det.upper}% with a confidence of {single_det.conf}%.
          </div>
        );
      }}
      else {
        for (i = 0; i < valid_detections_data; ++i) {
          const cur_det = res_list[i];
          description.push(
            <div className="img_desc" key={i} style={{ background: cur_det.color }}>
              Subject #{i + 1}: {cur_det.lower} to {cur_det.upper}% with {cur_det.conf}% confidence.
            </div>
          );
        }
      }

      this.setState({ img_desc: description }); // lower, higher, confidencevar data;

      // add number of just found detections to database
      const userCountRef = ref(db, 'pub/det_count');
      onValue(userCountRef, (snapshot) => {
        let data = snapshot.val();
        data += valid_detections_data; 
        set(userCountRef, data);
      }, { onlyOnce: true });

    });
  };

  render() {
    return (
      <div className="Dropzone-page">
        {this.state.model ? (
          <MagicDropzone
            className="Dropzone"
            accept="image/jpeg, image/png, .jpg, .jpeg, .png"
            multiple={false}
            onDrop={this.onDrop}
          >
            {this.state.preview ? (
              <img
                alt="Processing image..."
                onLoad={this.onImageChange}
                className="Dropzone-img"
                src={this.state.preview}
              />
            ) : (
              "Choose or drop an image to get a reading."
            )}
            <canvas id="canvas" height="640" width="640" color="#d2ff40" />
          </MagicDropzone>
        ) : (
          <div className="Dropzone">Loading model...<br></br>(This might take a while!)</div>
        )}
        {
          <>
          {this.state.img_desc}
          </>
        }
      </div>
    );
  };
};

const rootElement = document.getElementById("landing_card_right_half");
ReactDOM.render(<App />, rootElement);