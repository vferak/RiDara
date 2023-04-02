# RiDara Api

REST API for RiDara project written with Nest JS framework.

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Database
You can manage the database with these commands:

```bash
# complete rebuild of full database structure
npm run database:fresh

# complete rebuild of full database structure, but initialized with demo data
npm run database:fresh:seeded

# this will create database migration based on current differences
# between database structure and domain entities definition
npm run database:diff

# applies new migration to current database
npm run database:migrate

# used to create template for new seeder
npm run database:seeder:create
```
