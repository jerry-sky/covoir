# Covoir

*/ko-vwar/*

- [Purpose](#purpose)
- [Solution](#solution)
- [Running the application](#running-the-application)
- [Front-end](#front-end)
    - [Deployment (FE)](#deployment-fe)
- [Back-end](#back-end)
    - [Deployment (BE)](#deployment-be)
    - [The `countries` directory](#the-countries-directory)

---

## Purpose

This repository contains the solution for the *Nokia Front-end Trainee Summer Trainee* recruitment task.

> Please create a simple Angular 11 application that displays Covid-19 statistics.
> The application should use a free public API to gather data
> (e.g. <https://rapidapi.com/api-sports/api/covid-193>).
> Let user filter and sort data — it’s up to you in what way.

---

## Solution

The solution consists of an Angular web application and a simple API middleware,
that serves as a mediator between the Angular application and the COVID-19 statistics API.

You can view the demo [here](https://covoir.jerry-sky.me).

---

## Running the application

To run the application in development mode run

```bash
make dev
```

— this will run both front-end and back-end programs.

---

## Front-end

Standard issue Angular application program with routing, Angular Material, and ESLint.

---

### Deployment (FE)

The Angular application program uses GH Actions for deployment.

The [script](.github/workflows/frontend.yml) first installs and setups all necessary programs
and dependencies, and then compiles it using the standard `ng build` command.

It is served as a `.github.io`-type webpage which is routed to <https://covoir.jerry-sky.me>.

---

## Back-end

A simple ExpressJS back-end program that serves the purpose of a mediator between the actual COVID-19 API,
and the front-end application program.

The server hides the API key and caches the results from the COVID-19 API.

In order for the back-end program to run correctly,
a `.env` file must be provided containing the API key,
and the host information.
The names of the variables are regulated by the [`environment.ts`](backend/environment.ts) file (the `EnvironmentVariables` interface).

---

### Deployment (BE)

The program uses [Heroku](https://heroku.com) for deployment.

The [deployment script](deploy-backend.sh) compiles the program,
initializes a Git repository (inside the `dist` directory),
and pushes it to the Heroku remote server.

The application is served on <https://covoir.herokuapp.com>,
although you can’t view it in a web browser.
It requires the `Origin` HTTP header to be set.

---

### The `countries` directory

This directory contains two sets of data and their ‘cross product’ so to say.
The issue here was to match the countries’ names from the COVID-19 API,
with the countries’ codes from the countries’ flags website.

The [`cross.py`](backend/countries/cross.py) Python3 script matches countries’ names
and codes together.
Fortunately, most countries did match up.
The rest of them were added by hand.

Thus, the static [`countries.json`](backend/countries/countries.json) file containing a map
between countries’ names (from the COVID-19 API) and the countries’ codes
from the countries’ flags website.

---
