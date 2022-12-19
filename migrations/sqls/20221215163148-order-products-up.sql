CREATE TABLE IF NOT EXISTS order_products (id serial primary key,order_id int NOT NULL,product_id int NOT NULL,quantity int NOT NULL DEFAULT 0,FOREIGN KEY(order_id) REFERENCES orders(id),FOREIGN KEY(product_id) REFERENCES products(id));