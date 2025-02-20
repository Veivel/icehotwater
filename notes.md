- auth
- orders (cart, order)
- product
- tenant
- wishlist

additional per service:
- src/db/
- src/shared/
- tsconfig.json
- package.json
- server.ts
- .env

additional steps
- change host in docker compose DONE
- change db name and port in src/db DONE
- move app.use(...routes) up DONE
- migrate

need to solve:
- src/shared/middleware/verifyJWTProduct -> requires product functionalities
- src/shared/middleware/verifyJWTTenant -> requires tenant functionalities

future:
- make environment from file
- make shared commons a package