import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link to="/" className="text-lg font-semibold tracking-wide">
              0408P Ecommerce
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="text-slate-300 hover:text-white" to="/">
                Home
              </Link>
              <Link className="text-slate-300 hover:text-white" to="/missing">
                Missing
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={2500} theme="dark" />
    </Router>
  )
}

export default App
