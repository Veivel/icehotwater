##### ISSUES
# security: need INBOUND TCP!!!!
# need 2 vCPUs for master
# dont use kops plzzzz


sudo apt-get update
sudo apt-get install

##### DOCKER

# Add Docker's official GPG key:
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker ps -A

##### KUBERNETES INSTALL

sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable --now kubelet

##### KUBERNETES INIT
# https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/

# 1. re-enable cri sock in /etc/containerd/config.toml OR use another engine
# 2. RUN: sudo systemctl restart containerd

# for control plane
kubeadm init --pod-network-cidr=192.168.0.0/16
# don't forget to run the "finishing" script

# for kubelet
kubeadm join .......


##### SETUP NETWORKING

# https://kubernetes.io/docs/concepts/cluster-administration/networking/
# https://github.com/techiescamp/kubeadm-scripts/blob/main/scripts/master.sh

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml