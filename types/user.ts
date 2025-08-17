export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  image?: string;
}

export interface UserSession {
  user: User;
  expires: string;
}