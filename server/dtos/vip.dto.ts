// server/dtos/vip.dto.ts
export interface CreateVipDto {
    name: string;
    description: string;
    price: number;
    discount?: number;
    platform: string;
  }
  export interface UpdateVipDto {
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    platform?: string;
  }