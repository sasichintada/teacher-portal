import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';  // Change this line
import { Clock, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/activity/logs');  // Use api directly
      setLogs(response.data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch activity logs');
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const badges = {
      'create_teacher': { bg: 'success', text: 'Create Teacher' },
      'update_teacher': { bg: 'warning', text: 'Update Teacher' },
      'delete_teacher': { bg: 'danger', text: 'Delete Teacher' },
      'login': { bg: 'info', text: 'Login' }
    };
    const config = badges[action] || { bg: 'secondary', text: action };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getActionIcon = (action) => {
    const icons = {
      'create_teacher': '➕',
      'update_teacher': '✏️',
      'delete_teacher': '🗑️',
      'login': '🔐'
    };
    return icons[action] || '📝';
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Activity Logs</h2>
          <p className="text-muted">Track all user activities and system events</p>
        </div>
        <Badge bg="primary" className="p-3">
          <Clock size={16} className="me-1" />
          Last {logs.length} activities
        </Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ minWidth: '180px' }}>
                      <small className="text-muted">
                        {new Date(log.created_at).toLocaleString()}
                      </small>
                    </td>
                    <td>
                      <strong>{log.first_name} {log.last_name}</strong>
                      <br />
                      <small className="text-muted">{log.email}</small>
                    </td>
                    <td>
                      <span className="d-flex align-items-center">
                        <span className="me-1">{getActionIcon(log.action)}</span>
                        {getActionBadge(log.action)}
                      </span>
                    </td>
                    <td>
                      <small>{log.details || 'No details'}</small>
                    </td>
                    <td>
                      <small className="text-muted">{log.ip_address || 'N/A'}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {logs.length === 0 && (
        <div className="text-center mt-5">
          <Activity size={48} className="text-muted mb-3" />
          <p className="text-muted">No activity logs found yet.</p>
          <p className="text-muted small">Perform some actions to see logs here.</p>
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;