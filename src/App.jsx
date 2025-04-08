
import React, { useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

function App() {
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setLoading(true)
    try {
      const res = await axios.post('http://10.214.142.230:10000', formData)
      setData(res.data)
    } catch (err) {
      alert('Error analyzing data')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ad Analyzer Dashboard</h1>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Analyze</button>
      {loading && <p>Loading...</p>}
      {data && (
        <div>
          <h2>Metrics (Today vs Previous)</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['requests', 'fill_rate', 'ecpm', 'viewability'].map(metric => (
              <div key={metric} style={{ background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 5px #ccc' }}>
                <h4>{metric.toUpperCase()}</h4>
                <p>Today: {data.today[metric]}</p>
                <p>Previous: {data.previous[metric]}</p>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: '2rem' }}>Hourly Viewability</h3>
          <LineChart width={800} height={300} data={data.hourly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="today" stroke="#8884d8" />
            <Line type="monotone" dataKey="previous" stroke="#82ca9d" />
          </LineChart>
        </div>
      )}
    </div>
  )
}

export default App
