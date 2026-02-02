import { ref, computed } from 'vue';
import { Employee } from '../models/Employee.js';

export function useEmployeeStore() {
  const employees = ref([]);

  const addEmployee = (employee) => {
    employees.value.push(employee);
    saveToLocalStorage();
  };

  const updateEmployee = (updatedEmployee) => {
    const index = employees.value.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      employees.value[index] = updatedEmployee;
      saveToLocalStorage();
    }
  };

  const deleteEmployee = (id) => {
    employees.value = employees.value.filter(e => e.id !== id);
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(employees.value));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      const data = JSON.parse(saved);
      employees.value = data.map(e => new Employee(
        e.id,
        e.firstName,
        e.lastName,
        e.experience,
        e.age,
        e.address
      ));
    }
  };

  // Загружаем демо-данные при первом запуске
  const loadDemoData = () => {
    if (!localStorage.getItem('employees')) {
      const demoEmployees = [
        new Employee(1, 'Иван', 'Иванов', 5, 30, 'ул. Ленина, д. 10'),
        new Employee(2, 'Мария', 'Петрова', 8, 35, 'ул. Центральная, д. 25'),
        new Employee(3, 'Алексей', 'Сидоров', 3, 28, 'ул. Садовая, д. 15')
      ];
      employees.value = demoEmployees;
      saveToLocalStorage();
    }
  };

  // Инициализация
  loadDemoData();
  loadFromLocalStorage();

  return {
    employees: computed(() => employees.value),
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
}