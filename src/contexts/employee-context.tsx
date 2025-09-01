"use client";

import { Employee } from "@/models/employee";
import React, { createContext, useContext, useState } from "react";

interface EmployeeContextType {
    assignedEmployee: Employee[];
    setAssignedEmployee: React.Dispatch<React.SetStateAction<Employee[]>>;
    selectedRole: number | undefined;
    setSelectedRole: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const EmployeeContext = createContext<EmployeeContextType| undefined>(undefined);


export const EmployeeContextProvider = ({ children }: any) => {
    const [assignedEmployee, setAssignedEmployee] = useState<Employee[]>([]);
    const [selectedRole, setSelectedRole] = useState<number>();

    return (
        <EmployeeContext.Provider value={{ assignedEmployee, setAssignedEmployee, selectedRole, setSelectedRole }}>
            {children}
        </EmployeeContext.Provider>
    );

};

export const useEmployeeContext = (): EmployeeContextType => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployeeContext must be used within a EmployeeProvider");
    }
    return context;
};