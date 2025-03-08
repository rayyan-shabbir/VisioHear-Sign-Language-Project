import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import axios from "axios";
import "./App.css";
import { labelMap } from "./utilities";

const API_KEY = 'AIzaSyA59cYrt-VRTL27w-ci_RMJEVyxoq9N4Bs';  // Replace with your actual API key

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [results, setResults] = useState([]);

  const runCoco = async () => {
    const net = await tf.loadGraphModel('https://storage.googleapis.com/tensorflowjsrealtimemodel01/model.json');
    
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast('int32');
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();
      
      const detectionResults = [];
      for (let i = 0; i < boxes[0].length; i++) {
        if (scores[0][i] > 0.8) {
          const result = {
            class: classes[0][i],  // Store the class number
            name: labelMap[classes[0][i]].name,  // Store the corresponding Urdu name
          };
          detectionResults.push(result);
          console.log(`Class: ${result.class}, Name: ${result.name}, Score: ${Math.round(scores[0][i] * 100) / 100}`);
        }
      }
      setResults(detectionResults);

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  const speak = async () => {
    const textToSpeak = results.map(result => result.name).join('\n');
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
    const requestBody = {
      input: { text: textToSpeak },
      voice: { languageCode: 'ur-PK', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
  
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        if (response.data && response.data.audioContent) {
          const audioContent = response.data.audioContent;
          const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
          audio.play();
        } else {
          console.error('Response data does not contain audioContent:', response.data);
        }
      } else {
        console.error('Unexpected response from Google Cloud Text-to-Speech API:', response);
      }
    } catch (error) {
      console.error('Error with Google Cloud Text-to-Speech API:', error);
    }
  };
  

  return (
    <div className="App">
      <div className="nav">
        <h1>Translate Signs into Text</h1>
        <a href="#"><button>Back</button></a>
        <img src="images/logo.png" alt="Logo"/>
      </div>
      <body className="App-header">
        <div className="camera-container">
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: "max-content",
              height: "auto",
              maxWidth: "640px",
              maxHeight: "450px"
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 8,
              width: "100%",
              height: "auto",
              maxWidth: "640px",
              maxHeight: "450px",
              margin: "20px"
            }}
          />
        </div>
        <div className="textDisplay">
          <h2>Translate:</h2>
          <textarea
            readOnly
            value={results.map(result => result.name).join('\n')}
          />
          <button onClick={speak}>Speak</button>
        </div>
      </body>
    </div>
  );
}

export default App;
