export class Employee {
  constructor(id, firstName, lastName, experience, age, address) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.experience = experience;
    this.age = age;
    this.address = address;
  }

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