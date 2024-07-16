import React from 'react';
import { Flex } from '@chakra-ui/react';
import Header from './components/Header';// Assuming you have a Header component defined

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage';

function App() {
  return (
    // <Flex direction="column" minHeight="100vh">
    //   <Header />

      
    //     <HomePage />
    //   </Flex>

<Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        {/* Add more routes as needed */}
      </Routes>
      </Router>
  );
}

export default App;
