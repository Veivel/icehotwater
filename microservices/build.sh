docker build --platform linux/amd64 -t veivel/auth-service:1.0 -f service-auth/Dockerfile ./service-auth/
docker build --platform linux/amd64 -t veivel/order-service:1.0 -f service-order/Dockerfile ./service-order/
docker build --platform linux/amd64 -t veivel/product-service:1.0 -f service-product/Dockerfile ./service-product/
docker build --platform linux/amd64 -t veivel/tenant-service:1.0 -f service-tenant/Dockerfile ./service-tenant/
docker build --platform linux/amd64 -t veivel/wishlist-service:1.0 -f service-wishlist/Dockerfile ./service-wishlist/