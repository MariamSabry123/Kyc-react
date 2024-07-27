import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  Box, Button, Center, Flex, Image, Input, Table, Tbody, Td, Th, Thead, Tr, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Textarea
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface User {
  _id: string;
  businessUserId: number;
  userNationalID: {
    firstName: string;
    lastName: string;
    image: string; // encoded base 64
    nationalID: string;
    status: string;
    gender: string;
    birthdate: string;
    manuFactorId: string;
  };
  userEmail: string;
}

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');
  const [actionType, setActionType] = useState<'Accepted' | 'Rejected' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://super-app-backend-production.up.railway.app/users/getAllPendingUsers`);
        const userData = response.data.pendingUsers.find((user: User) => user._id === id);
        if (userData) {
          setUser(userData);
        } else {
          setError('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleAction = (type: 'Accepted' | 'Rejected') => {
    setActionType(type);
    onOpen();
  };

  const handleSubmit = async () => {
    if (!reason) {
      setValidationError('Reason is required');
      return;
    }
    setValidationError(null);

    try {
      const response = await axios.put('https://super-app-backend-production.up.railway.app/users/updateStatus', {
        userId: user?._id,
        newStatus: actionType,
        reasonOfRejection: reason,
      });
      console.log(response.data.message); // Log the success message from the API
      // Optionally, you can update the user state or perform any necessary actions upon success
      onClose();
    } catch (error) {
      console.error(`Error ${actionType?.toLowerCase()} user:`, error);
      // Handle error states here
    }
  };

  if (loading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (error) {
    return <Box p={4}>{error}</Box>;
  }

  if (!user) {
    return <Box p={4}>User not found</Box>;
  }

  // Log the image string to the console to check its format
  console.log('User Image Base64:', user.userNationalID.image);

  // Ensure the image source format is correct
  const imageSrc = `data:image/jpeg;base64,${user.userNationalID.image}`;

  return (
    <Box>
      <Header />
      <Center>
        <Box my={4}>
          <Image 
            src={imageSrc} 
            alt="User Image" 
            boxSize="300px" // Adjust the size as needed
            borderRadius="10px" // Make the image more rounded
          />
        </Box>
      </Center>
      <Box p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Field</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Business User ID</Td>
              <Td>{user.businessUserId}</Td>
            </Tr>
            <Tr>
              <Td>First Name</Td>
              <Td>{user.userNationalID.firstName}</Td>
            </Tr>
            <Tr>
              <Td>Last Name</Td>
              <Td>{user.userNationalID.lastName}</Td>
            </Tr>
            <Tr>
              <Td>Email</Td>
              <Td>{user.userEmail}</Td>
            </Tr>
            <Tr>
              <Td>National ID</Td>
              <Td>{user.userNationalID.nationalID}</Td>
            </Tr>
            <Tr>
              <Td>Status</Td>
              <Td>{user.userNationalID.status}</Td>
            </Tr>
            <Tr>
              <Td>Gender</Td>
              <Td>{user.userNationalID.gender}</Td>
            </Tr>
            <Tr>
              <Td>Birthdate</Td>
              <Td>{user.userNationalID.birthdate}</Td>
            </Tr>
            <Tr>
              <Td>Manufacturer ID</Td>
              <Td>{user.userNationalID.manuFactorId}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Actions */}
      <Flex justifyContent="center" mt={4} mb={20}>
        <Button
          width='150px'
          bg="#52b788"
          color="white"
          mr={10}
          onClick={() => handleAction('Accepted')} // Call handleAction function with 'Accepted'
        >
          Accept 
        </Button>
        <Button
          width='150px'
          bg="#d90429"
          color='white'
          onClick={() => handleAction('Rejected')} // Call handleAction function with 'Rejected'
        >
          Reject 
        </Button>
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reason for {actionType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea 
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {validationError && <Text color="red.500" mt={2}>{validationError}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              OK
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DetailsPage;
