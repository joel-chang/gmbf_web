import React from "react";
import ReactDOM from "react-dom";
import MagicDropzone from "react-magic-dropzone";
import {COLORS} from "./colors.js"
import Detector from "./detector"
import Landing from "./landing"
import {Route, Link} from "react-router-dom"

import "./styles.css";
const tf = require('@tensorflow/tfjs');

const weights = '/web_model/model.json';

const names = ['0_9', '10_11', '12_13', '14_15', '16_17', '18_20', '20_100']

function dApp() {
    return (
        <div className="dApp">
            <Route exact path="/" component={Landing}/>
            <Route exact path="/detector" component={Detector}/>
        </div>
    );
}

export default dApp;