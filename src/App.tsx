import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import WorkflowList from './components/WorkflowList'
import WorkflowDetailPage from './components/WorkflowDetailPage'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<WorkflowList />} />
          <Route path="/workflow/:id" element={<WorkflowDetailPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App