import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import { MixpanelUser } from './lib/mixpanel'
import * as routes from './lib/routes'
import { SentryUser } from './lib/sentry'
import { TrpcProvider } from './lib/trpc'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { AllIdeasPage } from './pages/ideas/AllIdeasPage'
import { EditIdeaPage } from './pages/ideas/EditIdeaPage'
import { NewIdeaPage } from './pages/ideas/NewIdeaPage'
import { ViewIdeaPage } from './pages/ideas/ViewIdeaPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import './styles/global.scss'

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <SentryUser />
            <MixpanelUser />
            <NotAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllIdeasRoute.definition} element={<AllIdeasPage />} />
                <Route path={routes.getViewIdeaRoute.definition} element={<ViewIdeaPage />} />
                <Route path={routes.getEditIdeaRoute.definition} element={<EditIdeaPage />} />
                <Route path={routes.getNewIdeaRoute.definition} element={<NewIdeaPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
