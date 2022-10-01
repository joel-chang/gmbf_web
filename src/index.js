import React from "react";
import ReactDOM from "react-dom";
import MagicDropzone from "react-magic-dropzone";
import {COLORS} from "./colors.js"

import "./styles.css";

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase, onDisconnect, onValue, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIo",
  authDomain: "rm",
  databaseURL: "hp",
  projectId: "r2",
  storageBucket: "rom",
  messagingSenderId: "44",
  appId: "1:9",
  measurementId: "G-"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase();
const visitCountRef = ref(db, 'pub/visitor_count');

onValue(visitCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  set(visitCountRef, data+1);
}, {onlyOnce: true});

onValue(visitCountRef, (snapshot) => {
  const data = snapshot.val();
  document.getElementById("visitor_counter_wrapper").innerHTML = "Visit #"+data;
});


const userCountRef = ref(db, 'pub/det_count');
onValue(userCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  document.getElementById('det_counter_wrapper').innerHTML = "Used "+data+" times.";
}, {onlyOnce: true});



const tf = require('@tensorflow/tfjs');

const weights = '/web_model/model.json';

const names = ['0_9', '10_11', '12_13', '14_15', '16_17', '18_20', '20_100']



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
  }

  onDrop = (accepted, rejected, links) => {
    this.setState({ preview: accepted[0].preview || links[0] });
  };

  cropToCanvas = (image, canvas, ctx) => {
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    // canvas.width = image.width;
    // canvas.height = image.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = COLORS.img_bg; // for the image square background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const ratio = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const newWidth = Math.round(naturalWidth * ratio);
    const newHeight = Math.round(naturalHeight * ratio);
    ctx.drawImage(
      image,
      0,
      0,
      naturalWidth,
      naturalHeight,
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

      this.setState( {num_of_detect: valid_detections_data});
      console.log(valid_detections_data);
      tf.dispose(res)


      // This block is used to draw all bounding boxes.
      var i;
      const box_colors = [COLORS.det0,COLORS.det1,COLORS.det2,
                          COLORS.det3,COLORS.det4,COLORS.det5,
                          COLORS.det6,COLORS.det7,COLORS.det8,
                          COLORS.det9,COLORS.det10,COLORS.det11
                          ];

      const res_list = [];
      for (i = 0; i < valid_detections_data; ++i){
        let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
        x1 *= c.width;
        x2 *= c.width;
        y1 *= c.height;
        y2 *= c.height;
        const width = x2 - x1;
        const height = y2 - y1;
        const klass = names[classes_data[i]];
        const score = scores_data[i].toFixed(2);

        // split lower and upper boundaries for body fat
        var lower = klass.split('_')[0]
        var upper = klass.split('_')[1]

        // Draw the bounding box.
        ctx.strokeStyle = box_colors[i%12];
        var cur_color = box_colors[i%12];
        ctx.lineWidth = 4;
        ctx.strokeRect(x1, y1, width, height);

        // Draw the label background.
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(x1, y1, 11 * (1 + parseInt(i/10)), 15);
        ctx.fillStyle = COLORS.black;
        ctx.fillText(i, x1, y1);
        const new_subject = [lower, upper, parseInt(score*100), cur_color];
        res_list.push(new_subject);
      }

      var description = [];
      if (this.state.num_of_detect === 0) {
        description.push(
        <div className="img_desc">
          Couldn't get a reading. Maybe try a different image?
        </div>
        );
      } else if (this.state.num_of_detect === 1) {
        description.push(
        <div className="img_desc" key={i} style={{background:res_list[0][3]}}>
          Your estimated bf is between {res_list[0][0]}% and {res_list[0][1]}% with a confidence of {res_list[0][2]}%.
        </div>);
      } else if (this.state.num_of_detect > 1) {
        for (i=0;i<this.state.num_of_detect;++i) {
          description.push(
          <div className="img_desc" key={i} style={{background:res_list[i][3]}}>
            Subject #{i}: {res_list[i][0]} to {res_list[i][1]}% with {res_list[i][2]}% confidence.
          </div>);
        }
      }
      this.setState( {img_desc: description}); //lower, higher, confidencevar data;
      const newdets = this.state.num_of_detect;
      const userCountRef = ref(db, 'pub/det_count');
      onValue(userCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        const updata = data + newdets;
        set(userCountRef, updata);
        document.getElementById('det_counter_wrapper').innerHTML = "Used "+updata+" times.";
      }, {onlyOnce: true});
      


      // This block used to be for drawing labels for bounding boxes
      // }
      // for (i = 0; i < valid_detections_data; ++i){
      //   let [x1, y1, , ] = boxes_data.slice(i * 4, (i + 1) * 4);
      //   x1 *= c.width;
      //   y1 *= c.height;
      //   // const klass = names[classes_data[i]];
      //   const klass = i;
      //   // const score = scores_data[i].toFixed(2);

      //   // Draw the text last to ensure it's on top.
      //   ctx.fillStyle = COLORS.dark_blue;
      //   ctx.fillText(klass, x1, y1);
      //   ctx.fillRect(x1, y1, x1+10, y1-10);
      // }
    });
  };

  render() {
    return (
      <div className="Dropzone-page">
        {this.state.model ? (
          <>
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
              "Choose or drop a file to get a reading."
            )}
            <canvas id="canvas" height="640" width="640" color="#d2ff40" />
          </MagicDropzone>
          </>
        ) : (
          <div className="Dropzone">Loading model...</div>
        )}
        {<>{this.state.img_desc}</>}
      </div>
    );
  }
}

const rootElement = document.getElementById("landing_card_right_half");
ReactDOM.render(<App />, rootElement);

// const cardElement = document.getElementById("root");
// ReactDOM.render(<Detector />, cardElement);