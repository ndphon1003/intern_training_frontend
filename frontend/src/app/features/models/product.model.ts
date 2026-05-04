export interface Product {
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
  product_id: string;
}

export interface GetOwnProductResponse {
  code: number;
  message: string;
  data: {
    totalProduct: number;
    listProduct: Product[];
  };
}