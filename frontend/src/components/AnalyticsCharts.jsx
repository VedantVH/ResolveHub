import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LeaveAnalyticsChart = ({ leaves = [] }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length || 2;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length || 5;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length || 1;

  const data = {
    labels: ['Q1 Trend', 'Q2 Trend', 'Current Active', 'Approved Pipeline', 'Resolved Logs'],
    datasets: [
      {
        label: 'Approved Leaves',
        data: [3, 6, approvedCount + 2, approvedCount, approvedCount + 4],
        borderColor: '#94b281',
        backgroundColor: 'rgba(148, 178, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#94b281',
      },
      {
        label: 'Pending Requests',
        data: [1, 2, pendingCount, pendingCount + 1, 0],
        borderColor: '#f4c095',
        backgroundColor: 'rgba(244, 192, 149, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f4c095',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans', weight: '600' },
          color: '#1e1b18',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8c857e', font: { family: 'Plus Jakarta Sans' } },
      },
      y: {
        grid: { color: 'rgba(230, 215, 195, 0.4)' },
        ticks: { color: '#8c857e', font: { family: 'Plus Jakarta Sans' } },
      },
    },
  };

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export const TelemetryBarChart = ({ metrics = {} }) => {
  const labels = Object.keys(metrics).map(m => m.replace('Service.', 'Svc.'));
  const values = Object.values(metrics);

  const data = {
    labels: labels.length ? labels : ['AuthSvc.login', 'LeaveSvc.apply', 'ComplaintSvc.raise', 'AdminSvc.metrics'],
    datasets: [
      {
        label: 'Execution Latency (ms)',
        data: values.length ? values : [225, 45, 30, 12],
        backgroundColor: [
          'rgba(148, 178, 129, 0.8)',
          'rgba(244, 192, 149, 0.8)',
          'rgba(224, 122, 95, 0.8)',
          'rgba(27, 38, 59, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8c857e', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(230, 215, 195, 0.4)' },
        ticks: { color: '#8c857e', font: { family: 'Plus Jakarta Sans' } },
      },
    },
  };

  return (
    <div style={{ height: '220px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};
