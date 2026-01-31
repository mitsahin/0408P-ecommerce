import { Route, Switch } from 'react-router-dom'
import HomePage from '../pages/HomePage.js'
import ShopPage from '../pages/ShopPage.js'
import AboutPage from '../pages/AboutPage.js'
import BlogPage from '../pages/BlogPage.js'
import ContactPage from '../pages/ContactPage.js'
import PagesPage from '../pages/PagesPage.js'
import LoginPage from '../pages/LoginPage.js'
import CartPage from '../pages/CartPage.js'
import WishlistPage from '../pages/WishlistPage.js'
import SearchPage from '../pages/SearchPage.js'
import ProductDetailPage from '../pages/ProductDetailPage.js'
import TeamPage from '../pages/TeamPage.js'
import SignupPage from '../pages/SignupPage.js'
import NotFound from '../pages/NotFound.js'

const PageContent = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/pages" component={PagesPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/wishlist" component={WishlistPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/product/:id" component={ProductDetailPage} />
        <Route component={NotFound} />
      </Switch>
    </main>
  )
}

export default PageContent
