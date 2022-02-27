import { Category } from './category.model';

export interface Product {
    id?: string;
    name?: string;
    description?: string;
    richDescription?: string;
    image?: string;
    images?: string[];
    brand?: string;
    price?: number;
    category?: Category;
    countInStock?: number;
    rating?: number;
    numberReviews?: number;
    isFeatured?: boolean;
}
