import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Header from '../../components/Header';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WorkIcon from '@mui/icons-material/Work';

const AdminDashboard = () => {
  const [staffCount, setStaffCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0); // Update this to fetch actual jobs count

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const staffResponse = await axios.get('http://localhost:4000/staff/getAllStaffCount');
        setStaffCount(staffResponse.data.count);

        const clientResponse = await axios.get('http://localhost:4000/client/getAllClientCount');
        setClientCount(clientResponse.data.count);

        const jobResponse = await axios.get('http://localhost:4000/job/getCount');
        setJobsCount(jobResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Header title="Admin Dashboard" subtitle="Managing your business" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <Card sx={{ minHeight: 160, width: '30%', background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)', color: 'white', padding: '10px', borderRadius: "10px" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Total Employees
              </Typography>
              <Typography variant="h3">
                {staffCount}
              </Typography>
              <Typography variant="subtitle1">
                {/* Update this with actual data if needed */}
                50,000+
              </Typography>
            </Box>
            <PeopleIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        <Card sx={{ minHeight: 160, width: '30%', background: 'linear-gradient(90deg, #FF512F 0%, #DD2476 100%)', color: 'white', padding: '10px', borderRadius: "10px" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Clients
              </Typography>
              <Typography variant="h3">
                {clientCount}
              </Typography>
              <Typography variant="subtitle1">
                {/* Update this with actual data if needed */}
                4,000+
              </Typography>
            </Box>
            <GroupAddIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
        <Card sx={{ minHeight: 160, width: '30%', background: 'linear-gradient(90deg, #2980b9 0%, #2c3e50 100%)', color: 'white', padding: '10px', borderRadius: "10px" }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="div">
                Jobs
              </Typography>
              <Typography variant="h3">
                {jobsCount}
              </Typography>
              <Typography variant="subtitle1">
                {/* Update this with actual data if needed */}
                97+
              </Typography>
            </Box>
            <WorkIcon sx={{ fontSize: 60 }} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
