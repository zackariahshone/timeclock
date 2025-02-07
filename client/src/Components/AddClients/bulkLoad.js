import React,{useCallback, useState} from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { generateUniqueId } from "./helpers";
import { createItem } from "../../globalUtils/requests";
import { addEmployeeBulk } from "../../app/EmployeeListSlice";


export const BulkLoadO = () => {
    const onDrop = useCallback(acceptedFiles => {
        // Handle the dropped files here
        console.log(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    console.log(getInputProps);
    
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
}

const formatCSVforLoad = (data) => {
    const keys = Object.keys(data[0]);
    const program = data[0].programs
    console.log(keys);
    console.log(program)
    let formatedSet = []
    data.forEach((student)=>{
        keys.forEach(key=>{
            switch(key){
                case '':
                delete student[key]    
                break;
                case 'programs':
                    student[key] = {[program]:'out'}
                break;
                case 'lastname':
                break;
                case 'firstname':
                    student['name'] = `${student[key]} ${student.lastname.charAt(0)}`
                break;
                case 'type':
                    if(!student.key){
                        student[key] = 'student'
                    }
                break;
                case 'admissionDates':
                    student[key] = {[program]:new Date().getTime()}
                break;
                case 'id':
                    if(!student.key){
                        student[key] = generateUniqueId()
                    }
                break;
                case 'active':
                    if(!student.key){
                        student[key] = true
                    }
                break;
                case "status":
                    if(!student.key){
                        student[key] = 'out'
                    }
                break;
                default:
                    break;
            }
        })
    })
    return data;
}


export const BulkLoad = () => {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed CSV Data:", result.data);
          const formatedData = formatCSVforLoad(result.data)
          //send to back end for process
            createItem('/createstudentbulk',formatedData,addEmployeeBulk)
        },
        header: true, // Set to true if the first row contains headers
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <table border="1">
        <thead>
          <tr>
            {csvData.length > 0 &&
              Object.keys(csvData[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


