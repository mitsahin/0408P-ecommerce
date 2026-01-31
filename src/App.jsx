import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './layout/Header.js'
import PageContent from './layout/PageContent.js'
import Footer from './layout/Footer.js'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <PageContent />
        <Footer />
      </div>
      <ToastContainer position="bottom-right" autoClose={2500} theme="light" />
    </Router>
  )
}

export default App
