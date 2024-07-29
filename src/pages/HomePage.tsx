import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Flex, Input, InputGroup, InputLeftElement, Table, Tbody, Td, Th, Thead, Tr, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import Header from '../components/Header';

interface User {
  _id: string;
  businessUserId: number;
  userNationalID: {
    firstName: string;
    lastName: string;
    image: string;
  };
  userEmail: string;
  createdAt?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<User[]>([]);
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const itemsPerPage = 7;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://super-app-backend-production.up.railway.app/users/getAllPendingUsers');
      setData(response.data.pendingUsers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedIds(filteredData.map((d: User) => d._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/details/${id}`);
  };

  const openModal = (userId: string, action: string) => {
    setModalUserId(userId);
    setModalAction(action);
    setReason('');
    onOpen();
  };

  const handleModalConfirm = async () => {
    if (modalUserId && modalAction) {
      const status = modalAction === 'accept' ? 'Accepted' : 'Rejected';
      try {
        const response = await axios.put('https://super-app-backend-production.up.railway.app/users/updateStatus', {
          userId: modalUserId,
          newStatus: status,
          reasonOfRejection: reason,
        });
        console.log(response.data); // Handle success message
        fetchData();
      } catch (error) {
        console.error(`Error ${modalAction === 'accept' ? 'accepting' : 'rejecting'} user:`, error);
      }
      onClose();
    }
  };

  const filteredData = data.filter((d) =>
    `${d.businessUserId} ${d.userNationalID.firstName} ${d.userNationalID.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <Header />
      <Box ml={4} p={4}>
        <Box mb={4} mt={4} width='500px'>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              borderRadius="full"
            />
          </InputGroup>
        </Box>

        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Date of Submission</Th>
              
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {currentPageData.map((d) => (
              <Tr key={d._id}>
                <Td>{d.businessUserId}</Td>
                <Td>{d.userNationalID.firstName}</Td>
                <Td>{d.userNationalID.lastName}</Td>
                <Td>{d.userEmail}</Td>
                <Td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</Td> {/* Updated column */}
                
                <Td>
                  <Flex>
                    <Button
                      size="sm"
                      bg="#ffe5d9"
                      color="orange"
                      _hover={{ bg: '#fbb394' }}
                      mr={1}
                      onClick={() => handleDetailsClick(d._id)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      bg="#ade8f4"
                      color="green"
                      _hover={{ bg: '#fbb394' }}
                      mr={1}
                      onClick={() => openModal(d._id, 'accept')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      bg="#ffccd5"
                      color="red"
                      _hover={{ bg: '#fbb394' }}
                      onClick={() => openModal(d._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Divider */}
        <div className='divider'></div>

        {/* Pagination */}
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text color='gray'>{`Showing ${(currentPage - 1) * itemsPerPage + 1}-${
            currentPage * itemsPerPage > filteredData.length
              ? filteredData.length
              : currentPage * itemsPerPage
          } of ${filteredData.length} results`}</Text>
          <Flex>
            <Button
              color='teal.500'
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
              mr={2}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                bg={i + 1 === currentPage ? 'teal.500' : 'gray.300'}
                color={i + 1 === currentPage ? 'white' : 'black'}
                mx={1}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              color='teal.500'
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              ml={2}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Modal for accepting/rejecting with reason */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalAction === 'accept' ? 'Accept User' : 'Reject User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={handleModalConfirm}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HomePage;
