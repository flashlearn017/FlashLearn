import React from 'react';
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../Pages/LoginPage'
import HomePage from '../Pages/HomePage'
import CreateNewAccountPage from '../Pages/CreateNewAccountPage'
import TestPage from '../Pages/TestPage'
import TestHomePage from '../Pages/TestHomePage'
import TestResultsPage from '../Pages/TestResultsPage'
import TestEditPage from '../Pages/TestEditPage'
import CreateTestPage from '../Pages/TestCreatePage'
import ForgotPasswordPage from '../Pages/ForgotPasswordPage'
import FlashcardCreatePage from '../Pages/FlashcardCreatePage'
import FlashcardPage from '../Pages/FlashcardPage'
import ProfilePage from '../Pages/ProfilePage'

import ProtectedRouter from '../Routes/protected_router'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage/>,
  },
  {
    path: "/create-account",
    element: <CreateNewAccountPage/>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage/>,
  },
  {
    element: <ProtectedRouter/>,
    children: [
      {
        path: "/home",
        element: <HomePage/>,
      },
      {
        path: "/test/:testId",
        element: <TestPage/>
      },
      {
        path: "/create-test",
        element: <CreateTestPage/>
      },
      {
        path: "/test-home",
        element:<TestHomePage/>
      },
      {
        path: "/edit-test/:testId",
        element:<TestEditPage/>
      },
      {
        path: "/results",
        element: <TestResultsPage/>
      },
      {
        path: "/create-flashcard",
        element: <FlashcardCreatePage/>
      },
      {
        path: "flashcard",
        element: <FlashcardPage/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      }
    ],
  }
])

export default routes