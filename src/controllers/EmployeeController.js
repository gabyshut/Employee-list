import { Employee } from '../models/Employee.js';
import { useEmployeeStore } from '../stores/employeeStore.js';

export function useEmployeeController() {
  const employeeStore = useEmployeeStore();

  const getEmployees = () => {
    return employeeStore.employees.value;
  };

  const addEmployee = (employeeData) => {
    const employee = new Employee(
      Date.now(),
      employeeData.firstName,
      employeeData.lastName,
      employeeData.experience,
      employeeData.age,
      employeeData.address
    );

    if (employee.isValid()) {
      employeeStore.addEmployee(employee);
      return true;
    }
    return false;
  };

  const updateEmployee = (employeeData) => {
    const employee = new Employee(
      employeeData.id,
      employeeData.firstName,
      employeeData.lastName,
      employeeData.experience,
      employeeData.age,
      employeeData.address
    );

    if (employee.isValid()) {
      employeeStore.updateEmployee(employee);
      return true;
    }
    return false;
  };

  const deleteEmployee = (id) => {
    employeeStore.deleteEmployee(id);
  };

  const createEmptyEmployee = () => {
    return new Employee(
      null,
      '',
      '',
      0,
      25,
      ''
    );
  };

  return {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    createEmptyEmployee
  };
}