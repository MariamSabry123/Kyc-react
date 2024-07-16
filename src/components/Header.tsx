// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, Image } from '@chakra-ui/react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add any sign-out logic here (e.g., clearing tokens)
    navigate('/'); // Navigate to the login page
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      bg="#1b4332" // Dark green background color
      color="white"
      px={6}
      py={3}
      boxShadow="md"
    >
      <Box>
        <Image src="momknspace green.png" alt="Logo" boxSize="50px" width="100px" />
      </Box>
      <Box>
        <Button width="100px" bg="#ff9f1c" color="white" _hover={{ bg: '#EA5A38' }} mr={2} onClick={handleSignOut}>
          sign out
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
