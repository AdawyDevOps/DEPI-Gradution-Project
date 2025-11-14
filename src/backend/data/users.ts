export interface User {
  username: string;
  password: string;
}

// Add your users here
export const users: User[] = [
  { username: "admin", password: "admin123" },
  { username: "user1", password: "pass123" },
  // Add more users as needed
];
