// server/dtos/price.dto.ts

export interface CreatePriceDto {
  productName: string;
  mostused: boolean;        // required
  features: string[];       // required
  time: number;             // e.g. number of hours
  price: number;            // base price
  discountRate?: number;    // optional percentage
  finalPrice?: number;      // optional override
  image: string;            // Cloudinary URL
}

export interface UpdatePriceDto {
  productName?: string;
  mostused?: boolean;
  features?: string[];
  time?: number;
  price?: number;
  discountRate?: number;
  finalPrice?: number;
  image?: string;
}
