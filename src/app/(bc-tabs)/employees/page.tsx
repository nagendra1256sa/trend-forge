import EmployeeClient from '@/components/employee/employee.client'
import React from 'react';

interface PageProps {
  searchParams: Promise<{
    firstName?: string;
	  lastName?: string;
    empId?: string;
    role?: string;
    email?: string;
  }>;
};

const page = async ({searchParams}: PageProps) => {
  const {firstName, lastName, empId, role, email } = await searchParams;
  const selectedRoles = role?.split(',') ?? []
  return (
    <div>
       <EmployeeClient firstName={firstName} lastName={lastName} empId={empId} role={selectedRoles} email={email} />
    </div>
  )
}

export default page
