## IP addresses

- master: 34.232.30.223
- worker1: 34.204.27.199
- worker2: 67.202.37.232
- worker3: ...

## Kubernetes Cluster Setup

[kube.md](kube.md)

## Monitoring

On master node, hosted with Docker Compose (for simplicity's sake, because fuck k*be): https://github.com/stefanprodan/dockprom
- user: admin
- pass: <password>

Import the Grafana dashboard from `extras/grafana.json`.