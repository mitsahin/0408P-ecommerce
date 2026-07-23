import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

const ProtectedRoute = ({ component: RouteComponent, ...rest }) => {
  const user = useSelector((state) => state.client?.user ?? {})
  const hasUser = Boolean(user && (user.id || user.email))
  const hasToken = Boolean(localStorage.getItem('token'))
  const isAuthenticated = hasUser || hasToken

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <RouteComponent {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute
