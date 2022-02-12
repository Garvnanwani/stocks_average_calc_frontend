import { useState } from 'react'
import './App.css'
import { v4 as uuid } from 'uuid'

const App = () => {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [average, setAverage] = useState(null)

  const onChange = (event) => {
    console.log('something')
    setFile(event.target.files[0])
    setFileName(event.target.files[0].name)
  }

  const handleFileUpload = () => {
    if (file.type === 'text/csv') {
      const userId = uuid()
      localStorage.setItem('userId', userId)
      const data = new FormData()
      data.append('file', file)
      data.append('userId', userId)
      fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            alert('File uploaded successfully')
          }
        })
    } else {
      alert('Please upload a CSV file')
    }
  }

  const getAverage = () => {
    const userId = localStorage.getItem('userId')
    fetch(`http://localhost:5000/api/average/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setAverage(data.average)
      })
  }

  const resetData = () => {
    const userId = localStorage.getItem('userId')
    fetch(`http://localhost:5000/api/delete-data/${userId}`)
    setAverage(null)
    setFileName('')
    setFile(null)
    localStorage.removeItem('userId')
  }

  return (
    <div className="App">
      <h2>Stock Average Calculator</h2>
      <div className="App-header">
        <div className="inputData">
          <div className="fileInput">
            <input
              type="file"
              onChange={onChange}
              onClick={(event) => {
                event.target.value = null
              }}
              name="file"
              id="file"
              className="file"
            />
            <label htmlFor="file">Select file</label>
            <p className="fileName">{fileName}</p>
          </div>
          <button onClick={handleFileUpload}>Upload</button>
        </div>
        <div className="functionalityBox">
          <button onClick={getAverage}>Calculate Average</button>
          <button onClick={resetData}>Reset Data</button>
        </div>
        {average && <h2>Stock Price Average : {Number(average).toFixed(3)}</h2>}
      </div>
    </div>
  )
}

export default App
