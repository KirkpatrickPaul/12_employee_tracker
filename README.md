# 12_employee_tracker

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

An application to allow users to manage their business's employees, roles, and departments.

## Table of Contents

- [Description](#Description)

- [Usage Guide](#Usage-Guide)

- [Questions and Reporting](#Questions-and-Reporting)

-[A Special Apology](#A-Special-Apology)

## Description

This webpage generator uses npm Inquirer to prompt the user a series of questions that allow the user to input data to manage their businesses. A MySQL server database schema is provided to get a server set up quickly and easily. From the command line, users can add and edit employees, roles, and departments. Managers can be changed for departments or employees, and employees can be put into new roles. The server automatically handles inputting any changes into the server.

## Usage Guide

Be sure to install all of the dependencies. To do this, a user may simply navigate in his/her terminal to the folder that holds the employee tracker files and type:

```bash
npm i
```

Once those are installed, he/she simply runs the program by typing:

```bash
node server.js
```

The program should prompt for answers with relevant questions. A general question about what type of thing the user wants to do will be the first question. Once he/she decides whether the goal he/she has has to do with employees, roles, or departments, a second question will prompt the user for what precisely it is he/she wants to do. Once there, further questions will allow the user to make as many changes as necessary.

## Questions and Reporting

This app was an assignement to help me learn server-side programming, MySQL and node.js. There are other apps that do this and support will be limited to non-existent. If, for some reason, you feel the need to use my app and run into problems, feel free to contact me through [my github](https://kirkpatrickpaul.github.io/contact.html).

## A Special Apology

I really struggled with this assignment and with getting both require and async functions to behave as I thought they should. I finally realized that, to meet the deadline, I would have to embrace callback functions. I may have spent too much time trying to make it too modular, and so almost every process in this app involves sending callback functions to my callback functions. Often nested several times. To whomever grades my work: I apologize. It was the only way I could figure out what I needed to do in the time I had.
