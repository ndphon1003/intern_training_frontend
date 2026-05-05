export interface Cart {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addAt: string; 
}

export interface AddCartRequest {
  productId: string;
  quantity: number;
}

export interface ResponseFormat {
  code: number;
  message: string;
  data: Cart;
}

export interface CartView {
  id: string;
  productName: string;
  quantity: number;
  addAt: string;
}