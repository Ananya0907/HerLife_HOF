'use client';

import React, { Suspense } from 'react';
import ReportPage from '../../../components/learn/ReportPage';

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading report details...</div>}>
      <ReportPage />
    </Suspense>
  );
}
