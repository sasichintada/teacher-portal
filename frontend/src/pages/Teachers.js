import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/api';
import { 
  Table, Button, Alert, Spinner, Badge, Form, InputGroup, 
  Modal, Row, Col, Card
} from 'react-bootstrap';
import { 
  Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight, 
  X, RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, filterUniversity, filterGender, teachers]);

  const fetchTeachers = async () => {
    try {
      const response = await teacherService.getAll();
      setTeachers(response.data.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch teachers');
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];
    
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.university_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterUniversity && filterUniversity !== '') {
      filtered = filtered.filter(teacher => teacher.university_name === filterUniversity);
    }
    
    if (filterGender && filterGender !== '') {
      filtered = filtered.filter(teacher => teacher.gender === filterGender);
    }
    
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterUniversity('');
    setFilterGender('');
    setFilteredTeachers(teachers);
    setCurrentPage(1);
    toast.info('Filters cleared');
  };

  const handleDelete = async () => {
    if (selectedTeacher) {
      try {
        await teacherService.delete(selectedTeacher.id);
        toast.success('Teacher deleted successfully!');
        fetchTeachers();
        setShowDeleteModal(false);
        setSelectedTeacher(null);
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  const confirmDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'University', 'Gender', 'Year Joined', 'Department', 'Designation'];
    const csvData = filteredTeachers.map(teacher => [
      teacher.id,
      `${teacher.first_name} ${teacher.last_name}`,
      teacher.email,
      teacher.phone || '',
      teacher.university_name,
      teacher.gender,
      teacher.year_joined,
      teacher.department || '',
      teacher.designation || ''
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Teachers exported successfully!');
  };

  const universities = [...new Set(teachers.map(t => t.university_name))];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Teacher Management</h2>
          <p className="text-muted">Manage and view all teacher records</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={exportToCSV}>
            <Download size={18} className="me-2" />
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => navigate('/teachers/new')}>
            + Add New Teacher
          </Button>
        </div>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={16} />
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
              >
                <option value="">All Universities</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={filterTeachers} className="flex-grow-1">
                  <Filter size={18} className="me-2" />
                  Apply
                </Button>
                {(searchTerm || filterUniversity || filterGender) && (
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    <RefreshCw size={18} />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          {(searchTerm || filterUniversity || filterGender) && (
            <div className="mt-3">
              <small className="text-muted">
                Showing {filteredTeachers.length} of {teachers.length} teachers
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={clearFilters}
                  className="ms-2"
                >
                  Clear all filters
                </Button>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-gradient-primary">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>University</th>
                  <th>Gender</th>
                  <th>Year Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>#{teacher.id}</td>
                    <td>
                      <strong>{teacher.first_name} {teacher.last_name}</strong>
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.university_name}</td>
                    <td>
                      <Badge 
                        bg={
                          teacher.gender === 'male' ? 'info' : 
                          teacher.gender === 'female' ? 'danger' : 'secondary'
                        }
                        className="px-3 py-2"
                      >
                        {teacher.gender}
                      </Badge>
                    </td>
                    <td>{teacher.year_joined}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                      >
                        <Edit size={14} className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(teacher)}
                      >
                        <Trash2 size={14} className="me-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="outline-primary"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="me-2"
          >
            <ChevronLeft size={18} />
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
              onClick={() => paginate(index + 1)}
              className="me-2"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline-primary"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete teacher <strong>{selectedTeacher?.first_name} {selectedTeacher?.last_name}</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Teachers;