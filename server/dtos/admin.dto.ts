// server/dtos/admin.dto.ts

export interface CreateAdminDto {
    username: string;
    password: string;
  }
  
  export interface UpdateAdminDto {
    username?: string;
    password?: string;
  }
  