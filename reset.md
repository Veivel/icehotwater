1. Run all:

```sh
kubeadm reset
sudo apt-get purge kubeadm kubectl kubelet kubernetes-cni kube*   
sudo apt-get autoremove  
sudo rm -rf ~/.kube
# REMINDER need to rejoin from worker node afterwards
```

2. If only resetting kubernetes cluster contents, just do `kubeadm reset`