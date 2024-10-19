import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ConversationList from './components/ConversationList'
import ConversationDetailPage from './components/ConversationDetailPage'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ConversationList />} />
          <Route path="/conversations/:id" element={<ConversationDetailPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App