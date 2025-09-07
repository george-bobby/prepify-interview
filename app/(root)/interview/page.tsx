import React from 'react';
import { Agent } from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const InterviewPage = async () => {
  const user = await getCurrentUser();

  // Redirect to signin if not authenticated
  if (!user) {
    redirect('/signin');
  }

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user?.name as string} userId={user?.id} type="generate"></Agent>
    </>
  )
}
export default InterviewPage