import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './layout/Header.js'
import PageContent from './layout/PageContent.js'
import Footer from './layout/Footer.js'
import { fetchCategories } from './store/actions/productActions'
import { verifyTokenIfExists } from './store/actions/clientActions'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(verifyTokenIfExists())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-slate-900">
        <Header />
        <PageContent />
        <Footer />
      </div>
      <ToastContainer position="bottom-right" autoClose={2500} theme="light" />
    </Router>
  )
}

export default App
