import { UserRole } from '../types';

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crm?: string;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    crm?: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.crm = data.crm;
  }

  static fromJSON(json: any): User {
    return new User({
      id: json.id,
      name: json.name,
      email: json.email,
      role: json.role,
      crm: json.crm,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      crm: this.crm,
    };
  }
}