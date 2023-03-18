# Employee Tracker

![MIT license](https://img.shields.io/badge/license-MIT-blue)
## Description 

View and update a company database using a simple command line application which allows you to add and update employees. You can also add new roles and departments. FOr each employee you can assign a manager allowing you to create a hierarchy for your company.

## Table of Contents
* [installation](#installation)
* [Usage](#usage)
* [License](#license)

## Installation
To install necessary dependencies, run the following command:
```
npm i
```
Ensure that you have MySQL installed as well as an account created!

## Usage
First clone the repo and from the command line CD into the directory. Once in the directory follow the [install instructions](#installation) and then follow the following steps:

### Steps
* First create the necessary schema. To do this use the MySQL CLI by running the following commands:
    ```
    mysql -u <your username> -p
    ```
    the press enter and then put in your password

    Then run the following:
    ```
    source ./db/schema.sql
    source ./db/seed.sql
    ```
* Update the configuration file in the config folder to add your MySQL credentials
* Once the database is made and seeded and the configuration is corrected you can then run ```npm start```

Please refer to this [video demonstration](https://drive.google.com/file/d/1N4EfVf36TkXUKuiflzisIggnYnepr3Yh/view?usp=sharing) for a full demo of the application

## License
This project is licensed under the MIT.
