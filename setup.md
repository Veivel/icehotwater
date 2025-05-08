## ISSUES
security group
need 2 vCPUs for master
dont use kops plz
<!-- https://mrmaheshrajput.medium.com/deploy-kubernetes-cluster-on-aws-ec2-instances-f3eeca9e95f1 -->
please run with root (sudo -i), not ubuntu

#### new node
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

kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml

# yes... this was apparently needed ON TOP OF weavenet?
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

#### FOR KUBELET ONLY
```sh
kubeadm join ...args...
```

## OTHERS

#### disable swap (should be disabled)\
```sh
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
```

#### cni stuffs
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

#### Edit /etc/containerd/config.toml if you haven't yet
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

<!-- #### create ingress
```sh
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm

# by gpt
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/aws/deploy.yaml
# assuming cwd is in main github repo
kubectl apply microservices/k8s/ingress
``` -->

#### create gateway
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
# should all say ACCEPTED True
kubectl get httproute && kubectl get gatewayclass && kubectl get gateway
# test curl (on the worker node where the gateway-proxy is deployed) to the nodePort

# edit /etc/nginx/sites-available/worlds.conf
# need to edit every time new worker is added
```

#### set up admin panel
```sh
# Add kubernetes-dashboard repository
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
```

#### add metrics server
```sh
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl edit deploy metrics-server -n kube-system
```
use `metrics-server.yaml` and paste it in `kubectl edit deploy metrics-server -n kube-system`. tldr: you need a free port, the `command:` entries, `nodeName:` entry, and `hostNetwork: true`.

you will need to re-apply the metrics-server YAML if it disappears on cluster/node restart


#### get cluster up and running
```sh
mkdir ~/code
cd ~/code
git clone https://github.com/Veivel/icehotwater.git
cd ~/code/icehotwater/microservices
kubectl apply -R -f k8s/

