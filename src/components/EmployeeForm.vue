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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.header-icon {
  font-size: 32px;
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

.subtitle {
  margin: 4px 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.form-container {
  padding: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.required {
  color: #f44336;
}

.label-text {
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: white;
  color: #333;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
}

.input-error {
  border-color: #f44336 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
}

.input-with-unit {
  position: relative;
}

.input-unit {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
  pointer-events: none;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: fadeInUp 0.2s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.btn-icon {
  flex-shrink: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .modal-header {
    padding: 20px;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .modal-header h2 {
    font-size: 20px;
  }
  
  .form-container {
    padding: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .btn-primary,
  .btn-secondary {
    min-width: 140px;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-content {
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
  }
  
  .header-content {
    width: 100%;
  }
  
  .close-btn {
    align-self: flex-end;
    margin-top: -40px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    min-width: unset;
  }
}
</style>