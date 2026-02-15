import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.client?.user ?? {})
  const isAuthenticated = Boolean(user && (user.id || user.email))

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location.pathname },
            }}
          />
        )
      }
    />
  )
}

export default ProtectedRoute
