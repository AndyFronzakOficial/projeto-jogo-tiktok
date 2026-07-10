import { Navigate, Route, Routes } from 'react-router-dom'
import { ControlPage, RankingPage } from './pages'

export default function App() {
  return (
    <Routes>
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/controle" element={<ControlPage />} />
      <Route path="*" element={<Navigate to="/controle" replace />} />
    </Routes>
  )
}
