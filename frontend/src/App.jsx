import { Route, Routes } from 'react-router'
import './App.css'
import Home from './components/Home'
import Library from './components/Library'
import AppSidebar from '@/components/ui/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

function App() {
  return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
