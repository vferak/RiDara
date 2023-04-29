# RiDara

Software for semiformal business processes modelling in BPMN notation with formal validation against ontology schemes.

It is comprised from two separate application:
- Api - REST API providing all the business logic and functionality
- App - Web UI consuming the Api

## Contents of this file

[Setup](#setup)

[Initial data](#initial-data-in-database)


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

If you are on windows, make sure you have enabled your Linux WSL integration in Docker Desktop Settings/Resources. 

After that verify your docker compose installation by running this command in your Linux environment:
```bash
docker-compose -v
```

### Installation
Copy all source codes to your Linux environment. The root directory contains **build.sh** script for easy installation. Just run in by typing this command in your Linux terminal from the root of this project:

```bash
./build.sh
```

You can access the website on http://localhost:3010 afterwards. 

### Troubleshooting

#### -bash: ./build.sh: /bin/bash^M: bad interpreter: No such file or directory
To fix this error, you will need to run these commands:

```bash
sudo apt install dos2unix
dos2unix build.sh
```

Running build.sh should work after that.

## Initial data in database

Freshly installed application should be populated with initial data. If it isn't, or you want to regenerate them, use the following command:
```bash
docker-compose run api npm run database:fresh:seeded
```

### Available users

| User e-mail     | Password | Role  |
|-----------------|----------|-------|
| ferak@ferak.com | asd      | Basic |
| besta@besta.com | asd      | Basic |
| admin@admin.com | admin    | Admin |

User admin has a special workspace called **Analyze examples workspace**. This workspace contains several projects with different analysis examples. 
