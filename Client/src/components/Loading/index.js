import React from 'react';
import { HashLoader } from './Loader';

const Loading = (props) => {
  if (props.error) {
    return (
      <div className="loader-container text-danger font-weight-bold">Error! Please refresh the page</div>
    )
  } else if (props.pastDelay) {
    return (
      <div className="loader-container"> 
        <div className="loader-body">
          <center><HashLoader /> </center>
          <h5 className="text-danger font-weight-bold">Loading...</h5>
        </div>
      </div>
    )
  } else {
    return null; // Avoiding Flash Of Loading Component (<200ms)
  }
}

export default Loading;