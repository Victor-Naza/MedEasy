import { UserRole } from '../types';

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }

  static fromJSON(json: any): User {
    return new User({
      id: json.id,
      name: json.name,
      email: json.email,
      role: json.role,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}