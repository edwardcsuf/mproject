# mproject
Masters Project
<hr>
This is a demo on how to use Docker Compose to configure a Docker swarm to run an application stack.

This demonstration project uses Microsoft Windows Server 2019 and Ubuntu 16.04 Operating Systems to deploy a simple web chat application using Node.js and Redis.

Adapted from: https://github.com/Scalegrid/code-samples/tree/sg-redis-node-socket-chat/redis-node-socket-chat

Here is an overview diagram:

![FinalProject](https://user-images.githubusercontent.com/40835338/133151935-b39af907-5324-4fed-8b56-f0a0bd10bccc.png)
<hr>
How to run the project:

1. Install Docker on both Microsoft Windows Server 2019 and Ubuntu 16.04
1. Create a Docker swarm on Windows from the Command Prompt or PowerShell: docker swarm init --advertise-addr=\<IPADDRESS> --listen-addr \<IPADDRESS>:2377
1. Join the existing Docker swarm from Ubuntu with the following: docker swarm join --token <WORKERJOINTOKEN> \<MANAGERIPADDRESS>
1. Add labels to each node: docker node update --label-add \<LABELNAME>=\<LABELVALUE> \<NODENAME>
	1. For Windows would be: docker node update --label-add os=windows \<NODENAME>
	1. For Ubuntu would be: docker node update --label-add os=linux \<NODENAME>
1. Deploy the stack with the following on the master node: docker stack deploy --compose-file \<FILENAME>.yml \<STACKNAME>
