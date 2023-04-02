# RiDara

Software for semiformal business processes modelling in BPMN notation with formal validation against ontology schemes.

It is comprised from two separate application:
- Api - REST API providing all the business logic and functionality
- App - Web UI consuming the Api

## Setup

### Prerequisites
To run this project, you'll need two things:
- Linux environment
- Docker with Docker Compose extension 

#### Linux environment
If you use Linux as your main OS, you can skip this step.

As windows user you will need to download and install WSL2 with Ubuntu distribution to run this project.
To install WSL2 and Ubuntu you can use this link: [https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview]()

#### Docker with Docker Compose extension
You can follow this guide for detailed step-by-step process of installing Docker in your Linux environment: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04.

After that verify your docker compose installation by running this command:
```bash
docker-compose -v
```

### Installation
Copy all source codes to your Linux environment. The root directory contains **build.sh** script for easy installation. Just run in by typing this command in your Linux terminal from the root of this project:

```bash
./build.sh
```

### Troubleshooting

#### -bash: ./build.sh: /bin/bash^M: bad interpreter: No such file or directory
To fix this error, you will need to run these commands:

```bash
sudo apt install dos2unix
dos2unix build.sh
```

Running build.sh should work after that.
