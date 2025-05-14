import http from 'k6/http';
import { check, sleep } from 'k6';
const testType = __ENV.TEST_TYPE || 'smoke';
export let options={thresholds:{http_req_failed:['rate<0.01'],http_req_duration:['p(95)<1000']}};
switch(testType){
  case'smoke':options.stages=[{duration:'10s',target:5},{duration:'20s',target:5},{duration:'10s',target:0}];break;
  case'average':options.stages=[{duration:'1m',target:20},{duration:'3m',target:20},{duration:'30s',target:0}];break;
  case'stress':options.stages=[{duration:'2m',target:50},{duration:'2m',target:100},{duration:'1m',target:100},{duration:'30s',target:0}];break;
}
function exponentialDelay(rate){const U=Math.random();return -Math.log(1-U)/rate;}

const AUTH = 'http://localhost:8000/api/auth';
const PRODUCT = 'http://localhost:8002/api/product';
const CART = 'http://localhost:8001/api/cart';

function login() {
  const creds = JSON.stringify({ username: 'testuser', password: 'testpass' });
  const res = http.post(AUTH, creds, { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'login 200': r => r.status === 200 });
  const token = res.json('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function () {
  /* Login */
  const authHeaders = login();

  /* Browse product list (halaman 1) */
  let res = http.get(`${PRODUCT}?page_number=1&page_size=10`, authHeaders);
  check(res, { 'list 200': r => r.status === 200 });

  /* View cart, lalu refresh 2× */
  for (let i = 0; i < 3; i++) {
    res = http.get(CART, authHeaders);
    check(res, { [`cart view ${i}`]: r => r.status === 200 });
    sleep(1);
  }

  sleep(exponentialDelay(3));
}