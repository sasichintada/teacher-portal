import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService, teacherService } from '../services/api';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [teacherData, setTeacherData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await teacherService.getAll();
      const teachers = response.data.data;
      const teacher = teachers.find(t => t.email === user.email);
      if (teacher) {
        setTeacherData(teacher);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update profile API call (you may need to add this endpoint)
      // For now, we'll simulate success
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="profile-avatar mx-auto mb-3">
                <User size={48} />
              </div>
              <h4>{user.first_name} {user.last_name}</h4>
              <p className="text-muted">{user.email}</p>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/change-password')}
                className="w-100 mt-3"
              >
                Change Password
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                {!editMode ? (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit2 size={16} className="me-1" />
                    Edit Profile
                  </Button>
                ) : (
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setEditMode(false)}
                      className="me-2"
                    >
                      <X size={16} className="me-1" />
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      <Save size={16} className="me-1" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={user.email}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          
          {teacherData && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-white border-0 pt-4">
                <h5 className="mb-0">Teaching Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>University:</strong> {teacherData.university_name}</p>
                    <p><strong>Department:</strong> {teacherData.department || 'Not specified'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Designation:</strong> {teacherData.designation || 'Not specified'}</p>
                    <p><strong>Qualification:</strong> {teacherData.qualification || 'Not specified'}</p>
                    <p><strong>Year Joined:</strong> {teacherData.year_joined}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Profile;