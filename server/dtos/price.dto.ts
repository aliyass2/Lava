// server/dtos/price.dto.ts

export interface CreatePriceDto {
    productName: string;
    time: number;         // For example: 1 (hour)
    price: number;        // Base price, e.g., 10
    discountRate?: number; // Discount percentage (optional), e.g., 30
    finalPrice?: number;  // Optionally provided final price after discount, e.g., 7
    image: string;        // Base64-encoded string representing the image
  }
  
  export interface UpdatePriceDto {
    productName?: string;
    time?: number;
    price?: number;
    discountRate?: number;
    finalPrice?: number;
    image?: string;
  }
  