docker build -t auth-service:1.0 -f service-auth/Dockerfile ./service-auth/
docker build -t order-service:1.0 -f service-order/Dockerfile ./service-order/
docker build -t product-service:1.0 -f service-product/Dockerfile ./service-product/
docker build -t tenant-service:1.0 -f service-tenant/Dockerfile ./service-tenant/
docker build -t wishlist-service:1.0 -f service-wishlist/Dockerfile ./service-wishlist/