import React,{useState, useEffect, useRef} from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import "@tensorflow/tfjs";
import './App.css';
// import {  BarChart } from "./BarChart";
// import {response} from './data/image_data'
// import iti from './badimages/bad_image_1.jpeg'
// let res = response.images;

//TODO ADD the different column to the chart
function App() {
  const[isModelLoading, setIsModelLoading] = useState(false);
  const[model, setModel] = useState<any | null>();
  const[imageSelected, setImageSelected] = useState<any | null>();
  const[results, setResults] = useState<any[]>([]);
  // const [chartData, setChartData] = useState({});
  const [goodImage, setGoodImage] = useState<any[]>([]);
  const [badImage, setBadImage] = useState<any[]>([]);

  const imageRef = useRef<any | null>();
  const fileInputRef = useRef<any | null>();

  // useEffect(() => {
  //   setChartData({
  //     labels: response.images.map((result) => result.id),
  //     datasets: [
  //       {
  //         label: "Number of Images",
  //         data: response.images.map((results) => results.image1),
  //         backgroundColor: [
  //           "#ffbb11",
  //           "#ecf0f1",
  //           "#50AF95",
  //           "#f3ba2f",
  //           "#2a71d0"
  //         ]
  //       }
  //     ]
  //   });
  // },[])
  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch(error){
      console.log(error)
      setIsModelLoading(false)
    }
  }
  
  const imageUpload = (e:any) => {
    const {files} = e.target;
    if(files.length > 0){
      const url = URL.createObjectURL(files[0])
      setImageSelected(url)
    }else {
      setImageSelected(null)
    }
  }

  const analize = async () => {
    const results = await model.classify(imageRef.current)
    setResults(results)
    console.log("@@@@@@@@",results)
    if(results.probability > 0.3){
      setBadImage(results)
    }else{
      setGoodImage(results)
    }
  }

  const triggerUpload = () => {
    fileInputRef.current.click()
  }
  useEffect(() => {
    loadModel()
  },[])


  if(isModelLoading){
    return <h2>Model Loading...</h2>
  }

  // console.log("@@@@@@@@",results)
  // console.log("bad image",badImage)
  // console.log("good image",goodImage)
  return (
    <>
        <h1 className='App-header'>Yembo Data Visualization Tool</h1>
        <div className='inputHolder'>
            <input type='file' accept='image/*'  className='uploadInput' onChange={imageUpload} ref={fileInputRef} />
            <button className='uploadImage' onClick={triggerUpload}>Upload Image</button>

        </div>
        <div className="mainContainer">
            <div className="mainContent">
                <div className="imageContainer">
                    {imageSelected && <img src={imageSelected} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef}/>}
                </div>
                {results.length > 0 && <div className='resultsHolder'>
                    {results.map((result, index) => {  
                        return (
                            <div className='result' key={result.className}>
                                <span className='name'>{result.className}</span>
                                <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                            </div>
                        )
                    })}
                </div>}
            </div>
            {imageSelected && <button className='button' onClick={analize}>Analize Image</button>}
        </div>
        <div className='image_group'>
        <ul><h1>Good Images</h1>
          <li> 
              {goodImage.map((result, index) => {
                  return (
                      <div className='result' key={result.className}>
                          <span className='name'>{result.className}</span>    
                      </div>
                  )
              })}
                
            </li>
        </ul>
        <ul><h1>Bad Images</h1>
          <li> 
              {badImage.map((result, index) => {
                  return (
                      <div className='result' key={result.className}>
                          <span className='name'>{result.className}</span>
                      </div>
                  )
              })}
          </li>
          </ul>
       
 
        </div> 
    </>
);
}

export default App;

