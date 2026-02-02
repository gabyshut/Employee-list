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

    onMounted(() => {
      employees.value = controller.getEmployees();
      
      if (employees.value.length === 0) {
        showNotificationMessage('Добро пожаловать! Добавьте первого сотрудника.', 'info');
      }
    });

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

    const showNotificationMessage = (message, type = 'success') => {
      notificationMessage.value = message;
      notificationType.value = type;
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    };

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

/* Hero-секция */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
}

.floating-action-btn {
  position: relative;
  z-index: 1;
  background: white;
  color: #667eea;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.floating-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.floating-action-btn:active {
  transform: translateY(-1px);
}

/* Статистика */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Уведомление */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  color: #333;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1001;
  animation: slideInRight 0.3s ease;
  max-width: 400px;
}

.notification.success {
  border-left: 4px solid #4CAF50;
}

.notification.error {
  border-left: 4px solid #f44336;
}

.notification.info {
  border-left: 4px solid #2196F3;
}

.notification-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.notification-close:hover {
  background-color: #f5f5f5;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Адаптивность */
@media (max-width: 992px) {
  .hero-section {
    padding: 30px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .employee-view {
    padding: 16px;
  }
  
  .hero-section {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .floating-action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .notification {
    left: 16px;
    right: 16px;
    bottom: 16px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
  }
  
  .floating-action-btn {
    padding: 14px 24px;
    font-size: 0.9rem;
  }
}
</style>