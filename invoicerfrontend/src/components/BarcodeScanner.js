import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const webcamRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  
  useEffect(() => {
    
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: webcamRef.current,
      },
      decoder: {
        readers: ['ean_reader', 'code_128_reader', 'upc_reader'],
      },
    }, (err) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
        return;
      }
      Quagga.start();
    });

   
    Quagga.onDetected((data) => {
      const code = data.codeResult.code;
      setScannedData(code);
      Quagga.stop(); 
    });


    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);

  return (
    <div className="product-search">
      <input
        className=""
        type="text"
        name="searchBox"
        placeholder="Search Product"
        value={scannedData}
        onChange={(e) => setScannedData(e.target.value)}
      />

      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      </div>
    </div>
  );
};

export default BarcodeScanner;
