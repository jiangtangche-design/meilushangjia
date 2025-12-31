export interface Item {
  id: string;
  title: string;
  image: string;
  description: string;
  price: string;
  stock: string;
  remarks: string;
  createdAt: number;
}

export type ViewState = 'form' | 'list';