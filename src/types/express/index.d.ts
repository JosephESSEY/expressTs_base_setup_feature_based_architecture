declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      full_name: string;
      role: "admin" | "user";
    };
  }
}
