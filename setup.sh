##### ISSUES
# security: need INBOUND TCP!!!!
# need 2 vCPUs for master
# dont use kops plz
# please run with root (sudo -i), not ubuntu

sudo apt-get update
sudo apt-get install

##### DOCKER
# https://docs.docker.com/engine/install/

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

##### KUBERNETES INSTALL
# this is before kubeadm

sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable --now kubelet

##### KUBERNETES INIT
# https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/
# https://github.com/techiescamp/kubeadm-scripts/blob/main/scripts/master.sh

# FOR CONTROL PLANE ONLY
** please take containerd-config.toml and apply it to /etc/containerd/config.toml
sudo systemctl restart containerd kubelet

kubeadm init --pod-network-cidr=192.168.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
export KUBECONFIG=/etc/kubernetes/admin.conf

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# FOR KUBELET ONLY
kubeadm join ...

##### OTHERS; master node(?)

# disable swap (should be disabled)
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# cni stuffs
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

# containerd (should already be configured)
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
# Under [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]:
# 
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
# Under [plugins."io.containerd.grpc.v1.cri".containerd]:
sudo sed -i 's|sandbox_image = .*|sandbox_image = "registry.k8s.io/pause:3.9"|' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl restart kubelet
# dont forget to curl the IP of the worker node's host.

# ONCE EVERYTHING IS WORKING

# add metrics server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl edit deploy metrics-server -n kube-system
# write the following under spec.template.spec.containers.args
```
        command:
        - /metrics-server
        - --kubelet-insecure-tls
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
```

