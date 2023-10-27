import React, { useState, useEffect } from "react";

import "./FileVersions.css";




// ----------------------------------- File Retrieve Section -------------------------------------------------- //


function FileVersionsList(props) {
  // This component takes a prop called `file_versions`, which is an array of file version objects.
  const file_versions = props.file_versions;
  // It then maps over the array and returns a `div` element for each file version object.
  // The `div` element contains the file name and version number.
  return file_versions.map((file_version) => (
    <div className="file-version" key={file_version.id}>
      <h2>File Name: {file_version.file_name}</h2>
      <p>
        ID: {file_version.id} Version: {file_version.version_number}
      </p>
    </div>
  ));
}



function FileVersions() {
  // This component uses the `useState` hook to store the following state:
  // * `data`: An array of file version objects.
  // * `filter`: A string that is used to filter the file version list.
  const [data, setData] = useState([]);
  console.log(data);
  
  // When the component mounts, it uses the `useEffect` hook to fetch the file version data from the API.
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch("http://localhost:8001/api/file_versions")
      ).json();

      // set state when the data received
      setData(data);
    };

    dataFetch();
  }, []);

 
  const [filter, setFilter] = useState('');
  
  // The component then filters the file version list based on the `filter` state.
  const filteredData = data.filter(item => item.file_name.toLowerCase().includes(filter.toLowerCase()));

  // The component also handles changes to the `filter` state.
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  

  
// --------------------------------------- File Upload Section ----------------------------------------------------- //


  // Sample list of versions for the dropdowns.
  
  const versions = ['2', '3','4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  // Define state variables to store the selected file and version.
  const [selectedFile, setSelectedFile] = useState(null);
  const [version, setVersion] = useState('');

  // Handle the file change event.
  const handleFileChange = (event) => {
     // Get the file from the event.
    const file = event.target.files[0];
    // Set the selected file state variable.
    setSelectedFile(file);
  };
  
  // Handle the version change event.
  const handleVersionChange = (event) => {
    // Set the version state variable.
    setVersion(event.target.value);
  };

  // Handle the upload button click event.
  const handleUpload = () => {
    // Check if the selected file and version are defined.
    if (selectedFile) { // Make sure 'version' is defined
        console.log(selectedFile);
        // Create a FormData object to store the file and version data.
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('version', version); // Appends the file and version data to formData

        // Make a POST request to the upload API endpoint.
        fetch('http://localhost:8001/api/upload/', {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
          // Check if the response is successful.
            if (response.ok) {
                // Parse the JSON response.
                return response.json();
            } else {
              // Throw an error if the response is not successful.
                throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            // Handle the response from the server (success or failure)
            console.log(data.message);
        })
        .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
        });
    } else {
      // Display an error message if the selected file or version is not defined.
        console.error('No file or version selected.');
    }
}


  return (
    // File upload section
    <><div className="div1">
      <h1 className="div1-title">File Submission Form</h1>
        <div className="div1-fileblock">
          <input className="input" type="file" onChange={handleFileChange} />
        </div>
      
      <div className="div1-versionblock">
        <label>Select Version:  </label>

        {/* This block of code represents a dropdown select element in JSX (JavaScript XML). */}
        <select className='versionselect' value={version} onChange={handleVersionChange}>
          {/* An empty option with no value is often used as a placeholder or initial option. */}
          <option value="1"></option>

          {/* This part of the code maps over an array called 'versions' to create options dynamically. */}
          {versions.map((version, index) => (
            <option key={index} value={version}>
              {/* The text inside each option is the 'version' from the 'versions' array. */}
              {version}
            </option>
          ))}
        </select>
        </div>

      <button className="submitbutton" onClick={handleUpload}>Submit File</button>

    </div>
    
    {/* File retrieve section */}
    <div className="div2-filterblock">
      <h1 className="div2-title">Filtered Table</h1>
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
    
    <div className="display-filter">
    
    {/* This code checks if the 'filter' variable is truthy (e.g., not null or undefined). */}
    {filter && (
      <div>
        {/* If 'filter' is truthy, this block of code will be rendered. */}
        {/* For each item in the 'filteredData' array, render a 'file-version' element. */}
          {filteredData.map((file_version) => (
            <div className="file-version" key={file_version.id}>
            <h2>File Name: {file_version.file_name}</h2>
            <p>
              ID: {file_version.id} Version: {file_version.version_number}
            </p>
          </div>
          ))}
        </div>
      )}
      {/* Closing the main container 'div'. */}
    </div>


    <div>
        <h2 className="div3-title">Found {data.length} File Versions</h2>
        <div>
          <FileVersionsList file_versions={data} />
        </div>
      </div></>
  );
}

export default FileVersions;
