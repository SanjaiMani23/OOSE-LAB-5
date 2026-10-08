import React from 'react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  let cls = 'badge-neutral';

  if (s === 'active' || s === 'confirmed') cls = 'badge-success';
  else if (s === 'pending') cls = 'badge-warning';
  else if (s === 'full' || s === 'cancelled' || s === 'dropped') cls = 'badge-danger';
  else if (s === 'completed' || s === 'inactive') cls = 'badge-info';

  return <span className={`badge ${cls}`}>{status}</span>;
};

export default StatusBadge;
