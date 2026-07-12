import { Routes, Route, Navigate } from 'react-router-dom'
import LoginScreen from './screens/Login'
import RegisterScreen from './screens/Register'
import HomeScreen from './screens/Home'
import DiaryListScreen from './screens/DiaryList'
import DiaryDetailScreen from './screens/DiaryDetail'
import DiaryEditorScreen from './screens/DiaryEditor'
import BoardScreen from './screens/Board'
import DevKitScreen from './screens/DevKit'
import ProfileScreen from './screens/Profile'
import ProfileAccountScreen from './screens/ProfileAccount'
import AnalyticsScreen from './screens/Analytics'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/board" element={<BoardScreen />} />
      <Route path="/diary" element={<DiaryListScreen />} />
      <Route path="/diary/:id" element={<DiaryDetailScreen />} />
      <Route path="/diary/write" element={<DiaryEditorScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/profile/account" element={<ProfileAccountScreen />} />
      <Route path="/analytics" element={<AnalyticsScreen />} />
      <Route path="/dev-kit" element={<DevKitScreen />} />
      {/* 其餘畫面後續加入 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
