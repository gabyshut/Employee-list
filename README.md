# Тестовое задание: Редактируемый список сотрудников

## Структура проекта
```
employee-list/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── EmployeeForm.vue
│   │   └── EmployeeTable.vue
│   ├── models/
│   │   └── Employee.js
│   ├── controllers/
│   │   └── EmployeeController.js
│   ├── stores/
│   │   └── employeeStore.js
│   ├── views/
│   │   └── EmployeeView.vue
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
└── README.md
```

## Инструкция по установке и запуску

### Локальная установка

1. **Клонируйте или скачайте проект**
```bash
git clone <repository-url>
cd employee-list
```

2. **Установите зависимости**
```bash
npm install
```

3. **Запустите приложение в режиме разработки**
```bash
npm run dev
```

4. **Откройте браузер и перейдите по адресу**
```
http://localhost:3000
```

5. **Для сборки production версии**
```bash
npm run build
```

## Архитектура MVC в Vue 3

### Модель (Model) - `src/models/Employee.js`
```javascript
/**
 * Модель сотрудника
 * Определяет структуру данных сотрудника
 */
export class Employee {
  constructor(id, firstName, lastName, experience, age, address) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.experience = experience;
    this.age = age;
    this.address = address;
  }

  /**
   * Проверка валидности данных сотрудника
   */
  isValid() {
    return (
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.experience >= 0 &&
      this.age >= 18 &&
      this.age <= 100 &&
      this.address.trim() !== ''
    );
  }

  /**
   * Клонирование объекта сотрудника
   */
  clone() {
    return new Employee(
      this.id,
      this.firstName,
      this.lastName,
      this.experience,
      this.age,
      this.address
    );
  }
}
```

### Представление (View) - `src/views/EmployeeView.vue`
```vue
<template>
  <div class="employee-view">
    <!-- Hero-секция -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">👥 Управление сотрудниками</h1>
        <p class="hero-subtitle">Добавляйте, редактируйте и управляйте информацией о сотрудниках</p>
      </div>
      <button @click="openAddForm" class="floating-action-btn">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Новый сотрудник
      </button>
    </div>

    <!-- Статистика -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ employees.length }}</div>
          <div class="stat-label">Всего сотрудников</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ averageExperience }}</div>
          <div class="stat-label">Средний стаж</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎂</div>
        <div class="stat-info">
          <div class="stat-value">{{ averageAge }}</div>
          <div class="stat-label">Средний возраст</div>
        </div>
      </div>
    </div>

    <!-- Таблица сотрудников -->
    <EmployeeTable 
      :employees="employees"
      @edit="openEditForm"
      @delete="deleteEmployee"
    />

    <!-- Форма -->
    <EmployeeForm
      v-if="showForm"
      :employee="currentEmployee"
      :isEditing="isEditing"
      @save="saveEmployee"
      @cancel="closeForm"
    />

    <!-- Уведомление -->
    <div v-if="showNotification" class="notification" :class="notificationType">
      <span>{{ notificationMessage }}</span>
      <button @click="hideNotification" class="notification-close">×</button>
    </div>
  </div>
</template>

<script>
import EmployeeTable from '../components/EmployeeTable.vue';
import EmployeeForm from '../components/EmployeeForm.vue';
import { useEmployeeController } from '../controllers/EmployeeController.js';
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'EmployeeView',
  components: {
    EmployeeTable,
    EmployeeForm
  },
  setup() {
    const controller = useEmployeeController();
    const showForm = ref(false);
    const currentEmployee = ref(null);
    const isEditing = ref(false);
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationType = ref('success');

    const employees = ref([]);

    // Загружаем сотрудников при монтировании компонента
    onMounted(() => {
      employees.value = controller.getEmployees();
    });

    // Вычисляемые свойства для статистики
    const averageExperience = computed(() => {
      if (employees.value.length === 0) return 0;
      const sum = employees.value.reduce((acc, emp) => acc + emp.experience, 0);
      return (sum / employees.value.length).toFixed(1);
    });

    const averageAge = computed(() => {
      if (employees.value.length === 0) return 0;
      const sum = employees.value.reduce((acc, emp) => acc + emp.age, 0);
      return Math.round(sum / employees.value.length);
    });

    // Функция для показа уведомлений
    const showNotificationMessage = (message, type = 'success') => {
      notificationMessage.value = message;
      notificationType.value = type;
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    };

    // Методы для работы с формой
    const openAddForm = () => {
      currentEmployee.value = controller.createEmptyEmployee();
      isEditing.value = false;
      showForm.value = true;
    };

    const openEditForm = (employee) => {
      currentEmployee.value = { ...employee };
      isEditing.value = true;
      showForm.value = true;
    };

    const saveEmployee = (employeeData) => {
      let success;
      if (isEditing.value) {
        success = controller.updateEmployee(employeeData);
        if (success) {
          showNotificationMessage('Данные сотрудника успешно обновлены!', 'success');
          // Обновляем список сотрудников
          employees.value = controller.getEmployees();
        } else {
          showNotificationMessage('Ошибка при обновлении данных', 'error');
        }
      } else {
        success = controller.addEmployee(employeeData);
        if (success) {
          showNotificationMessage('Сотрудник успешно добавлен!', 'success');
          // Обновляем список сотрудников
          employees.value = controller.getEmployees();
        } else {
          showNotificationMessage('Ошибка при добавлении сотрудника', 'error');
        }
      }
      closeForm();
    };

    const deleteEmployee = (id) => {
      if (confirm('Вы уверены, что хотите удалить этого сотрудника?\nЭто действие нельзя отменить.')) {
        controller.deleteEmployee(id);
        showNotificationMessage('Сотрудник успешно удален!', 'info');
        // Обновляем список сотрудников
        employees.value = controller.getEmployees();
      }
    };

    const closeForm = () => {
      showForm.value = false;
      currentEmployee.value = null;
    };

    const hideNotification = () => {
      showNotification.value = false;
    };

    // Приветственное уведомление при первом запуске
    onMounted(() => {
      if (employees.value.length === 0) {
        showNotificationMessage('Добро пожаловать! Добавьте первого сотрудника.', 'info');
      }
    });

    return {
      employees,
      averageExperience,
      averageAge,
      showForm,
      currentEmployee,
      isEditing,
      showNotification,
      notificationMessage,
      notificationType,
      openAddForm,
      openEditForm,
      saveEmployee,
      deleteEmployee,
      closeForm,
      hideNotification
    };
  }
};
</script>

<style scoped>
.employee-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Стили для hero-секции, статистики, уведомлений и адаптивности остаются без изменений, как в предоставленном коде */
/* ... */
</style>
```

### Контроллер (Controller) - `src/controllers/EmployeeController.js`
```javascript
import { Employee } from '../models/Employee.js';
import { useEmployeeStore } from '../stores/employeeStore.js';

/**
 * Контроллер сотрудников
 * Управляет бизнес-логикой приложения
 */
export function useEmployeeController() {
  const employeeStore = useEmployeeStore();

  /**
   * Получить всех сотрудников
   * Возвращает массив сотрудников
   */
  const getEmployees = () => {
    return employeeStore.employees.value; // Возвращаем массив, а не computed
  };

  /**
   * Добавить нового сотрудника
   */
  const addEmployee = (employeeData) => {
    const employee = new Employee(
      Date.now(), // Генерация ID
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

  /**
   * Обновить данные сотрудника
   */
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

  /**
   * Удалить сотрудника
   */
  const deleteEmployee = (id) => {
    employeeStore.deleteEmployee(id);
  };

  /**
   * Создать пустого сотрудника для формы
   */
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
```

### Хранилище (Store) - `src/stores/employeeStore.js`
```javascript
import { ref, computed } from 'vue';
import { Employee } from '../models/Employee.js';

/**
 * Хранилище сотрудников
 * Управляет состоянием приложения
 */
export function useEmployeeStore() {
  const employees = ref([]);

  /**
   * Добавить сотрудника
   */
  const addEmployee = (employee) => {
    employees.value.push(employee);
    saveToLocalStorage();
  };

  /**
   * Обновить сотрудника
   */
  const updateEmployee = (updatedEmployee) => {
    const index = employees.value.findIndex(e => e.id === updatedEmployee.id);
    if (index !== -1) {
      employees.value[index] = updatedEmployee;
      saveToLocalStorage();
    }
  };

  /**
   * Удалить сотрудника
   */
  const deleteEmployee = (id) => {
    employees.value = employees.value.filter(e => e.id !== id);
    saveToLocalStorage();
  };

  /**
   * Сохранить в LocalStorage
   */
  const saveToLocalStorage = () => {
    localStorage.setItem('employees', JSON.stringify(employees.value));
  };

  /**
   * Загрузить из LocalStorage
   */
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

  /**
   * Загрузить демо-данные
   */
  const loadDemoData = () => {
    const demoEmployees = [
      new Employee(1, 'Иван', 'Иванов', 5, 30, 'ул. Ленина, д. 10'),
      new Employee(2, 'Мария', 'Петрова', 8, 35, 'ул. Центральная, д. 25'),
      new Employee(3, 'Алексей', 'Сидоров', 3, 28, 'ул. Садовая, д. 15')
    ];
    employees.value = demoEmployees;
    saveToLocalStorage();
  };

  // Инициализация хранилища
  const init = () => {
    const saved = localStorage.getItem('employees');
    if (!saved) {
      // Если нет сохраненных данных, загружаем демо-данные
      loadDemoData();
    } else {
      loadFromLocalStorage();
    }
  };

  // Вызываем инициализацию при создании хранилища
  init();

  return {
    employees: computed(() => employees.value),
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
}
```

### Компонент таблицы - `src/components/EmployeeTable.vue`
**ВНИМАНИЕ:** Это **обновленная** версия с использованием CSS Grid вместо HTML таблиц:

```vue
<template>
  <div class="employee-table">
    <!-- Заголовок таблицы -->
    <div class="table-header">
      <div class="header-cell" :style="{ width: '80px' }">ID</div>
      <div class="header-cell">Имя</div>
      <div class="header-cell">Фамилия</div>
      <div class="header-cell" :style="{ width: '120px' }">Стаж (лет)</div>
      <div class="header-cell" :style="{ width: '100px' }">Возраст</div>
      <div class="header-cell">Адрес</div>
      <div class="header-cell actions-header">Действия</div>
    </div>

    <!-- Тело таблицы -->
    <div class="table-body">
      <div v-for="employee in employees" :key="employee.id" class="table-row">
        <div class="data-cell" :style="{ width: '80px' }">{{ employee.id }}</div>
        <div class="data-cell">{{ employee.firstName }}</div>
        <div class="data-cell">{{ employee.lastName }}</div>
        <div class="data-cell" :style="{ width: '120px' }">{{ employee.experience }}</div>
        <div class="data-cell" :style="{ width: '100px' }">{{ employee.age }}</div>
        <div class="data-cell">{{ employee.address }}</div>
        <div class="data-cell actions-cell">
          <div class="actions-wrapper">
            <button @click="$emit('edit', employee)" class="btn-edit">
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Редактировать
            </button>
            <button @click="$emit('delete', employee.id)" class="btn-delete">
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </div>
      
      <!-- Пустое состояние -->
      <div v-if="employees.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>Список сотрудников пуст</h3>
        <p>Добавьте первого сотрудника, нажав кнопку выше</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeTable',
  props: {
    employees: {
      type: Array,
      required: true
    }
  },
  emits: ['edit', 'delete']
};
</script>

<style scoped>
.employee-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Заголовок таблицы */
.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 120px 100px 1fr 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-cell {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.actions-header {
  justify-content: center;
}

/* Тело таблицы */
.table-body {
  max-height: 500px;
  overflow-y: auto;
}

/* Строки таблицы */
.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr 120px 100px 1fr 200px;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  align-items: center;
}

.table-row:hover {
  background-color: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

/* Ячейки с данными */
.data-cell {
  padding: 0 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  min-height: 24px;
}

/* Контейнер для действий */
.actions-wrapper {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Стили кнопок */
.btn-edit, .btn-delete {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.btn-edit {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.icon {
  flex-shrink: 0;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.empty-state p {
  font-size: 14px;
  opacity: 0.7;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 1fr 100px 80px 1fr 180px;
  }
  
  .header-cell:first-child,
  .data-cell:first-child {
    width: 60px !important;
  }
  
  .btn-edit, .btn-delete {
    min-width: 100px;
    padding: 8px 10px;
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .employee-table {
    overflow-x: auto;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 50px 120px 120px 80px 70px 160px 140px;
    min-width: 800px;
  }
  
  .actions-wrapper {
    flex-direction: column;
    gap: 6px;
  }
  
  .btn-edit, .btn-delete {
    min-width: 100px;
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    padding: 12px 16px;
  }
  
  .header-cell {
    font-size: 12px;
  }
  
  .data-cell {
    font-size: 13px;
  }
  
  .btn-edit, .btn-delete {
    min-width: 90px;
    padding: 6px 8px;
  }
}

@media (max-width: 576px) {
  .table-header,
  .table-row {
    grid-template-columns: 40px 100px 100px 70px 60px 140px 130px;
    min-width: 700px;
  }
  
  .btn-edit, .btn-delete {
    min-width: 80px;
    font-size: 10px;
    padding: 5px 6px;
  }
  
  .empty-state {
    padding: 40px 16px;
  }
  
  .empty-icon {
    font-size: 36px;
  }
}

/* Стили для скроллбара */
.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
```

### Компонент формы - `src/components/EmployeeForm.vue`
```vue
<template>
  <div class="modal-overlay" @click.self="closeForm">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            {{ isEditing ? '✏️' : '👤' }}
          </div>
          <div>
            <h2>{{ isEditing ? 'Редактировать сотрудника' : 'Добавить нового сотрудника' }}</h2>
            <p class="subtitle">Заполните информацию о сотруднике</p>
          </div>
        </div>
        <button class="close-btn" @click="closeForm" aria-label="Закрыть">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName" class="form-label">
              <span class="label-text">Имя</span>
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              required
              placeholder="Например: Иван"
              class="form-input"
              :class="{ 'input-error': !formData.firstName && showErrors }"
            />
            <div v-if="!formData.firstName && showErrors" class="error-message">
              Пожалуйста, введите имя
            </div>
          </div>
          
          <div class="form-group">
            <label for="lastName" class="form-label">
              <span class="label-text">Фамилия</span>
              <span class="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              required
              placeholder="Например: Иванов"
              class="form-input"
              :class="{ 'input-error': !formData.lastName && showErrors }"
            />
            <div v-if="!formData.lastName && showErrors" class="error-message">
              Пожалуйста, введите фамилию
            </div>
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="age" class="form-label">
              <span class="label-text">Возраст</span>
              <span class="required">*</span>
            </label>
            <div class="input-with-unit">
              <input
                type="number"
                id="age"
                v-model.number="formData.age"
                min="18"
                max="100"
                required
                placeholder="25"
                class="form-input"
                :class="{ 'input-error': (formData.age < 18 || formData.age > 100) && showErrors }"
              />
              <span class="input-unit">лет</span>
            </div>
            <div v-if="(formData.age < 18 || formData.age > 100) && showErrors" class="error-message">
              Возраст должен быть от 18 до 100 лет
            </div>
          </div>
          
          <div class="form-group">
            <label for="experience" class="form-label">
              <span class="label-text">Стаж работы</span>
              <span class="required">*</span>
            </label>
            <div class="input-with-unit">
              <input
                type="number"
                id="experience"
                v-model.number="formData.experience"
                min="0"
                max="50"
                required
                placeholder="5"
                class="form-input"
                :class="{ 'input-error': (formData.experience < 0 || formData.experience > 50) && showErrors }"
              />
              <span class="input-unit">лет</span>
            </div>
            <div v-if="(formData.experience < 0 || formData.experience > 50) && showErrors" class="error-message">
              Стаж должен быть от 0 до 50 лет
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="address" class="form-label">
            <span class="label-text">Адрес</span>
            <span class="required">*</span>
          </label>
          <textarea
            id="address"
            v-model="formData.address"
            required
            placeholder="Введите полный адрес проживания"
            class="form-textarea"
            :class="{ 'input-error': !formData.address && showErrors }"
            rows="3"
          ></textarea>
          <div v-if="!formData.address && showErrors" class="error-message">
            Пожалуйста, введите адрес
          </div>
        </div>
        
        <div class="form-footer">
          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Отменить
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Сохранить изменения' : 'Добавить сотрудника' }}
              <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'EmployeeForm',
  props: {
    employee: {
      type: Object,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({ ...props.employee });
    const showErrors = ref(false);

    watch(() => props.employee, (newEmployee) => {
      formData.value = { ...newEmployee };
      showErrors.value = false;
    });

    const validateForm = () => {
      showErrors.value = true;
      
      return (
        formData.value.firstName &&
        formData.value.lastName &&
        formData.value.age >= 18 &&
        formData.value.age <= 100 &&
        formData.value.experience >= 0 &&
        formData.value.experience <= 50 &&
        formData.value.address
      );
    };

    const submitForm = () => {
      if (validateForm()) {
        emit('save', formData.value);
      }
    };

    const closeForm = () => {
      showErrors.value = false;
      emit('cancel');
    };

    return {
      formData,
      showErrors,
      submitForm,
      closeForm
    };
  }
};
</script>

<style scoped>
/* Стили остаются без изменений из предоставленного файла */
/* ... */
</style>
```

## Функциональность

### Реализовано:
1. **Просмотр списка сотрудников** в современном табличном формате (CSS Grid)
2. **Добавление нового сотрудника** через модальное окно
3. **Редактирование существующего сотрудника**
4. **Удаление сотрудников** с подтверждением
5. **Валидация всех полей** формы
6. **Сохранение данных** в LocalStorage
7. **Адаптивный дизайн** для мобильных устройств
8. **Статистика** (количество сотрудников, средний стаж, средний возраст)
9. **Уведомления** о выполнении операций

### 📱 Параметры сотрудника:
- Имя (обязательное)
- Фамилия (обязательное)
- Стаж в годах (0-50)
- Возраст (18-100)
- Адрес (обязательное)

## Технологии
- Vue 3 (Composition API)
- Vite для сборки
- Современный CSS (Grid, Flexbox, CSS-переменные)
- LocalStorage для хранения данных
- SVG иконки

## Особенности реализации

### Архитектура MVC:
- **Model**: `Employee.js` - класс с валидацией
- **View**: Компоненты Vue для отображения
- **Controller**: `EmployeeController.js` - бизнес-логика
- **Store**: `employeeStore.js` - управление состоянием


## Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Просмотр собранной версии
npm run preview

# Lint with [ESLint](https://eslint.org/)
npm run lint
```

## Структура проекта

```
src/
├── App.vue                 # Главный компонент
├── main.js                 # Точка входа
├── models/Employee.js      # Модель данных
├── controllers/EmployeeController.js  # Контроллер
├── stores/employeeStore.js            # Хранилище
├── views/EmployeeView.vue             # Главное представление
└── components/
    ├── EmployeeTable.vue   # Таблица сотрудников (CSS Grid)
    └── EmployeeForm.vue    # Форма добавления/редактирования
```