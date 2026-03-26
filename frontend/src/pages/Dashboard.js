import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../services/api';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({
    totalTeachers: 0,
    maleTeachers: 0,
    femaleTeachers: 0,
    otherTeachers: 0,
    universities: [],
    totalUniversities: 0,
    yearsJoined: []
  });
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await teacherService.getAll();
      const teachers = response.data.data;
      
      // Calculate statistics
      const maleCount = teachers.filter(t => t.gender === 'male').length;
      const femaleCount = teachers.filter(t => t.gender === 'female').length;
      const otherCount = teachers.filter(t => t.gender === 'other').length;
      
      // Get unique universities
      const universities = [...new Set(teachers.map(t => t.university_name))];
      
      // Get year distribution
      const yearMap = {};
      teachers.forEach(t => {
        const year = t.year_joined;
        yearMap[year] = (yearMap[year] || 0) + 1;
      });
      const yearsJoined = Object.keys(yearMap).map(year => ({
        year: year,
        count: yearMap[year]
      })).sort((a, b) => a.year - b.year);
      
      // Get 5 most recent teachers
      const recent = [...teachers].reverse().slice(0, 5);
      
      setStats({
        totalTeachers: teachers.length,
        maleTeachers: maleCount,
        femaleTeachers: femaleCount,
        otherTeachers: otherCount,
        universities: universities,
        totalUniversities: universities.length,
        yearsJoined: yearsJoined
      });
      setRecentTeachers(recent);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gender distribution chart data
  const genderChartData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [stats.maleTeachers, stats.femaleTeachers, stats.otherTeachers],
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  // Year joined chart data
  const yearChartData = {
    labels: stats.yearsJoined.map(y => y.year),
    datasets: [
      {
        label: 'Teachers Joined',
        data: stats.yearsJoined.map(y => y.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted">Welcome back! Here's what's happening with your teachers today.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/teachers/new')}
          className="rounded-pill px-4"
        >
          <UserPlus size={18} className="me-2" />
          Add New Teacher
        </Button>
      </div>

      {/* Welcome Card */}
      <Card className="mb-4 gradient-bg text-white border-0">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="mb-2">Welcome back, {user.first_name} {user.last_name}! 👋</h3>
              <p className="mb-0 opacity-75">Email: {user.email}</p>
              <small className="opacity-75">You are successfully logged in to the Teacher Portal.</small>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="light" 
                onClick={fetchData}
                className="rounded-pill"
              >
                <RefreshCw size={16} className="me-2" />
                Refresh Data
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statistics Cards */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="stat-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Teachers</p>
                  <h2 className="display-4 mb-0">{stats.totalTeachers}</h2>
                </div>
                <div className="stat-icon bg-primary">
                  <Users size={24} color="white" />
                </div>
              </div>
              <div className="mt-3">
                <TrendingUp size={14} className="text-success me-1" />
                <small className="text-success">+{stats.totalTeachers} total</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Male Teachers</p>
                  <h2 className="display-4 mb-0">{stats.maleTeachers}</h2>
                </div>
                <div className="stat-icon bg-info">
                  <Users size={24} color="white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Female Teachers</p>
                  <h2 className="display-4 mb-0">{stats.femaleTeachers}</h2>
                </div>
                <div className="stat-icon bg-danger">
                  <Users size={24} color="white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Universities</p>
                  <h2 className="display-4 mb-0">{stats.totalUniversities}</h2>
                </div>
                <div className="stat-icon bg-success">
                  <GraduationCap size={24} color="white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4 g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4">
              <div className="d-flex align-items-center">
                <PieChart size={20} className="me-2 text-primary" />
                <h5 className="mb-0">Gender Distribution</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Pie data={genderChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4">
              <div className="d-flex align-items-center">
                <Calendar size={20} className="me-2 text-primary" />
                <h5 className="mb-0">Teachers by Year Joined</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={yearChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Teachers */}
      {recentTeachers.length > 0 && (
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0 pt-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BookOpen size={20} className="me-2 text-primary" />
                <h5 className="mb-0">Recently Added Teachers</h5>
              </div>
              <Button 
                variant="link" 
                onClick={() => navigate('/teachers')}
                className="text-decoration-none"
              >
                View All →
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>University</th>
                    <th>Department</th>
                    <th>Gender</th>
                    <th>Year Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <strong>{teacher.first_name} {teacher.last_name}</strong>
                      </td>
                      <td>{teacher.university_name}</td>
                      <td>{teacher.department || '-'}</td>
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
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate('/teachers')}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;