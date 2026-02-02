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