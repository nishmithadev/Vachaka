import React from 'react';
import HandTracker from '../component/HandTracker';

const Home = () => {
  const handleResults = (results) => {
    console.log('Hand landmarks:', results.multiHandLandmarks);
  };

  return (
    <div className="home-container">
      <HandTracker onResults={handleResults} />
    </div>
  );
};

export default Home;
