import React from 'react';
import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../Pages/LoginPage'
import HomePage from '../Pages/HomePage'
import CreateNewAccountPage from '../Pages/CreateNewAccountPage'
import TestPage from '../Pages/TestPage'
import TestHomePage from '../Pages/TestHomePage'
import CreateTestPage from '../Pages/TestCreatePage'
import ForgotPasswordPage from '../Pages/ForgotPasswordPage'
import ResultsPage from '../Pages/ResultsPage'
import FlashcardHomePage from '../Pages/FlashcardHomePage'
import FlashcardCreatePage from '../Pages/FlashcardCreatePage'
import FlashcardPage from '../Pages/FlashcardPage'

import ProtectedRouter from '../Routes/protected_router'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage/>,
  },
  {
    element: <ProtectedRouter/>,
    children: [
      {
        path: "/home",
        element: <HomePage/>,
      },
    ],
  },
  {
    path: "/create-account",
    element: <CreateNewAccountPage/>,
  },
  {
    path: "/test",
    element: <TestPage/>
  },
  {
    path: "/test-home",
    element: <TestHomePage/>
  },
  {
    path: "/create-test",
    element: <CreateTestPage/>
  },
  {
    path: "/results",
    element: <ResultsPage/>
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage/>,
  },
  {
    path: "/flashcard-home",
    element: <FlashcardHomePage/>
  },
  {
    path: "/create-flashcard",
    element: <FlashcardCreatePage/>
  },
  {
    path: "flashcard",
    element: <FlashcardPage/>
  }
])

export default routes