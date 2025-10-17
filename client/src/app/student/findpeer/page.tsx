'use client';

import AuthGuard from '@/components/AuthGuard';
import PeerFinder from './peer';

export default function FindPeerPage() {
  return (
    <AuthGuard requiredRole="student">
      <PeerFinder />
    </AuthGuard>
  );
}
