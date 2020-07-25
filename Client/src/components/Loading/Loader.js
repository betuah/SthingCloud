import React from 'react';
import './loader.scss';
import ReactLoader from "react-spinners/HashLoader"
import ReactBarLoader from "react-spinners/BarLoader"

export const HashLoader = () => (
  <ReactLoader 
      size={75}
      color={"#F44336"}
      loading={true}
  />
)

export const BarLoader = () => (
  <ReactBarLoader 
      width="100%"
      height={4}
      color={"#F44336"}
      loading={true}
  />
)

const Loader = () => (
  <svg className="spinner" width="60px" height="60px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle className="path" fill="none" strokeWidth="4" strokeLinecap="round" cx="30" cy="30" r="28"></circle>
  </svg>
)

export default Loader;