export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  ownerId: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  public: boolean;
  deleted: boolean;
}

export interface ProductListResponse {
  code: number;
  message: string;
  data: {
    totalProduct: number;
    listProduct: Product[];
  };
}