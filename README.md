# Chat Interaction Platform - Kabupaten Bandung

## Description

This is a foundational setup for a chat interaction platform, specifically focusing on implementing Role-Based Access Control (RBAC). While the full chatbot functionality is not included yet, this project lays the groundwork by managing user roles and permissions securely. Built with Laravel, Inertia, and React, it also includes a dark mode option for better user experience.

> [!WARNING]
> Note: This project currently only includes RBAC implementation. Chatbot features are not yet developed.

### Build With

- [Laravel](https://laravel.com/)
- [Inertia](https://inertiajs.com/)
- [ReactJS](https://vite.dev/)
- [deck.gl](https://deck.gl/)

# Getting Started

## Dependencies

You need to use Composer and npm to install any depedencies like Laravel and TailwindCSS.

You could go to [Composer](https://getcomposer.org/) and [npm](https://www.npmjs.com/) sites for proper installation.

## Installation

1. Install Composer dependencies `composer install`
2. Install npm dependencies `npm install`
3. Create a copy of your .env file `cp .env.example .env`
4. Generate an app encryption key `php artisan key:generate`
5. Create an empty database.
6. In the .env file, add database information to allow Laravel to connect to the database.
7. Migrate the database `php artisan migrate`
8. Seed the database `php artisan db:seed`

## Executing Program

1. Run Laravel `composer run dev`
2. Open http://localhost:8000 with your browser to see the result.

# TODO

Current progress and upcoming features:
- [x] Role-Based Access Control (RBAC) implementation
- [x] Dark mode implementation
- [x] GIS implementation using deck.gl
- [ ] Chatbot integration
- [ ] User interface improvements
- [ ] Additional GIS features and layers

# Author

- GitHub: [@repiyann](https://github.com/repiyann)
- Instagram: [@repiyann](https://instagram.com/repiyann)
