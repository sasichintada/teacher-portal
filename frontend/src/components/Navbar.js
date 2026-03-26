import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Users, LayoutDashboard, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-gradient">
      <Container>
        <Navbar.Brand href="/" className="fw-bold text-white">
          <Users size={24} className="me-2" />
          Teacher Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <Nav className="me-auto">
              <Nav.Link href="/" className="d-flex align-items-center text-white">
                <LayoutDashboard size={18} className="me-1" />
                Dashboard
              </Nav.Link>
              <Nav.Link href="/teachers" className="d-flex align-items-center text-white">
                <Users size={18} className="me-1" />
                Teachers
              </Nav.Link>
              <Nav.Link href="/activity" className="d-flex align-items-center text-white">
                <Activity size={18} className="me-1" />
                Activity
              </Nav.Link>
            </Nav>
          )}
          <Nav>
            {token ? (
              <>
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center text-white">
                      <User size={18} className="me-1" />
                      {user.first_name} {user.last_name}
                    </span>
                  } 
                  id="basic-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item href="/profile">
                    <User size={16} className="me-2" />
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/change-password">
                    <Settings size={16} className="me-2" />
                    Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/login" className="text-white">Login</Nav.Link>
                <Nav.Link href="/register" className="text-white">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;