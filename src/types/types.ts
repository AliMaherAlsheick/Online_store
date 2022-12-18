export {
    User,
    Product,
    Order,
    OrderDTO,
    ProductDTO,
    validationResponse,
    orders_product,
};

interface User {
    id: number;
    first_name: string;
    last_name: string;
    date_of_creation: string;
    email: string;
    user_name: string;
    user_password: string;
    user_type: string;
    phone: string;
}
interface Product {
    id: number;
    name: string;
    price: number;
    amount: number;
    img_url: string;
    rating: number;
    date_of_change: string;
}
interface Order {
    id: number;
    user_id: number;
    status: string;
    total_cost: number;
    delivery_cost: number;
    products_cost: number;
    date_of_creation: string;
    order_address: string;
    num_of_orders: Number;
    products: orders_product[];
}
interface orders_product {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
}
interface ProductDTO {
    img_url: string;
    name: string;
    price: number;
    amount: number;
    date_of_change: string;
}
interface OrderDTO {
    user_id: number;
    product_id: number;
    amount: number;
    date: string;
    status: string;
    delivery_cost: number;
    order_address: string;
}
interface validationResponse {
    valid: boolean;
    msg: string;
}
