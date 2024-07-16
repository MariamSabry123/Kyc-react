import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://super-app-backend-production.up.railway.app/users/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password,
          nationalID: nationalId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Login successful') {
          console.log( data);
          navigate('/home'); // Navigate to the home page on successful login
        } else {
          setError(data.message);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgImage="url('background.jpg')" // Replace with the path to your image
      bgSize="cover"
      bgPosition="center"
    >
      <Box
        width="100vw"
        maxW="500px"
        p={8}
        borderRadius={8}
        boxShadow="lg"
        bg="rgba(45, 106, 79, 0.5)"
        color="white"
      >
        {/* Logo */}
        <Box mb={4}>
          <Box as="img" src="momknspace green.png" alt="Logo" boxSize="70px" />
        </Box>

        {/* Login Form */}
        <Center flexDir="column" textAlign="left">
          <Heading mb={4}>LOGIN</Heading>

          {/* Error Message */}
          {error && <Text color="red.500" mb={4}>{error}</Text>}

          {/* Form Fields */}
          <Stack spacing={3} mb={4}>
            <Text>Email</Text>
            <Input
              height='30px'
              width='300px'
              backgroundColor='#2d6a4f'
              type="email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl>
              <Text>Password</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  {/* Optionally add icon or left element */}
                </InputLeftElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  variant="filled"
                  height='30px'
                  backgroundColor='#2d6a4f'
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement height='30px' width="4.5rem">
                  <Button h="20px" size="sm" onClick={handleShowClick}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Text>National ID</Text>
            <Input
              height='30px'
              backgroundColor='#2d6a4f'
              type="text"
              variant="filled"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </Stack>

          {/* Sign In Button */}
          <Button
            mb={4}
            mt={4}
            width='120px'
            bg="#f48c06"
            colorScheme="white"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </Center>
      </Box>
    </Flex>
  );
};

export default LoginPage;
