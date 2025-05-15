# KUBERNETES SETUP STEPS

## ISSUES
- security group
- need 2 min vCPUs for master
- dont use kops plz
- dont use calico for now (CIDR block issue needs manual intervention? or something else)
- dont use ingress, use gateway with Kong (gateway is newer kube feature)
- please run with root (sudo -i), not ubuntu
<!-- https://mrmaheshrajput.medium.com/deploy-kubernetes-cluster-on-aws-ec2-instances-f3eeca9e95f1 -->

## run on new node
```sh
sudo apt-get update
sudo apt-get install
sudo journalctl --vacuum-size=50M
```

## DOCKER
https://docs.docker.com/engine/install/

```sh
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker ps -a
```


## KUBERNETES INSTALL
this is before kubeadm

```sh
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable --now kubelet
```


## KUBE CLUSTER INIT
https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/
https://github.com/techiescamp/kubeadm-scripts/blob/main/scripts/master.sh

#### FOR CONTROL PLANE ONLY
```sh
kubeadm init

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=/etc/kubernetes/admin.conf

# use weavenet as CNI, do not use calico
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
```

#### FOR KUBELET ONLY
```sh
kubeadm join ...args...
```

## OTHERS
these ones are to be applied on all services

#### disable swap (should be disabled already)
```sh
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
```

#### kube module/network configuration
```sh
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay br_netfilter

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system
```

#### edit /etc/containerd/config.toml if haven't
Under [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]:
```sh
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
# Under [plugins."io.containerd.grpc.v1.cri".containerd]:
sudo sed -i 's|sandbox_image = .*|sandbox_image = "registry.k8s.io/pause:3.9"|' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl restart kubelet
```

dont forget to curl the IP of the worker node's host.

## ONCE EVERYTHING IS WORKING

#### create gateway
<!-- https://medium.com/@martin.hodges/using-kong-to-access-kubernetes-services-using-a-gateway-resource-with-no-cloud-provided-8a1bcd396be9 -->
<!-- https://gateway-api.sigs.k8s.io/guides/http-routing/ -->
```sh
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.3.0/standard-install.yaml
kubectl apply -k https://github.com/Kong/kubernetes-ingress-controller/config/crd
kubectl create namespace kong

helm repo add kong https://charts.konghq.com
helm repo update

# assuming cwd is in main github repo
helm install kong kong/ingress -f microservices/kong-values.yaml -n kong
# might need a while to make everything Ready
kubectl get all -n kong
# should all say ACCEPTED: True
kubectl get httproute && kubectl get gatewayclass && kubectl get gateway
# test curl (on the worker node where the gateway-proxy is deployed) to the nodePort

```

#### set up admin panel
```sh
# Add kubernetes-dashboard repository
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard

# run proxy to expose dashboard. make sure the port (8081) is allowed in security group
kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8081:443 --address='0.0.0.0'
# create bearer token to authenticate. make sure to apply kube yamls from microservices/k8s/dashboard
kubectl create token dashboard-user -n kubernetes-dashboard
```

#### add metrics server
```sh
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl edit deploy metrics-server -n kube-system
```
use `extras/metrics-server.yaml` and paste it in `kubectl edit deploy metrics-server -n kube-system`. tldr: you need a free port, the `command:` entries, `nodeName:` entry, and `hostNetwork: true`.

you will need to re-apply the metrics-server YAML if it disappears on cluster/node restart
<!-- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/ -->

#### get cluster up and running
```sh
mkdir ~/code
cd ~/code
git clone https://github.com/Veivel/icehotwater.git
cd ~/code/icehotwater/microservices
kubectl apply -R -f k8s/
```

#### add new node
```
sudo kubeadm token create --print-join-command
```
