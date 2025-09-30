# InfoShop Point of Sale (POS) System

Welcome to the InfoShop Point of Sale (POS) System! This is a comprehensive application built with modern web technologies to streamline sales and inventory management.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Modules](#modules)
- [Features](#features)
- [License](#license)

## Requirements

To run this application, ensure you have the following installed:

- **PHP**: 8.2 or higher
- **Laravel**: 11
- **Node.js**: (for Inertia JS and React)
- **MySQL**: (for the database)

## Installation

To get started with the POS system, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd InfoShop
Install PHP dependencies:

bash
Copy code
composer install
Install Node.js dependencies:

bash
Copy code
npm install
Set up your environment file:
Copy the .env.example to .env and configure your database and other settings.

Generate the application key:

bash
Copy code
php artisan key:generate
Create the Database:

Set up a new database in MySQL and update the .env file with your database credentials:

env
Copy code
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
Run migrations:

bash
Copy code
php artisan migrate --seed
Link Storage:

bash
Copy code
php artisan storage:link
Copy template files:
Place the template files in the storage/app/public/templates folder by copying them from resources/views/templates.

Start the application:

bash
Copy code
php artisan serve
Compile assets:

bash
Copy code
npm run dev
Modules
The POS system includes the following modules:

POS: Manage point-of-sale transactions seamlessly.

Sales: Track and manage sales data.

Products: Handle batch products efficiently.

Purchases: Record and manage purchase orders.

Payments: Process various payment types.

Expenses: Keep track of business expenses.

Contacts: Manage customer and vendor information.

Contact Balances: Easily manage and view balances for contacts.

Features
Built with Laravel for robust server-side functionality.

Utilizes Inertia JS and React JS for a modern, reactive user interface.

MUI (Material-UI) as the components library for beautiful, responsive design.

Styled with Tailwind CSS for a clean and customizable look.

MySQL as the database for reliable data storage.


Feel free to contribute or use this project for your own POS system. Happy coding! 🚀