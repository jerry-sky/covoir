# Covoir

*/ko-vwar/*

- [Purpose](#purpose)
- [Solution](#solution)
    - [Back-end](#back-end)
    - [Front-end](#front-end)
    - [Running the application](#running-the-application)

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

---

### Back-end

A simple ExpressJS back-end program that serves the purpose of a mediator between the actual COVID-19 API,
and the front-end application program.

The server hides the API key and caches the results from the COVID-19 API.

In order for the back-end program to run correctly,
a `.env` file must be provided containing the API key,
and the host information.
The names of the variables are regulated by the [`environment.ts`](backend/environment.ts) file (the `EnvironmentVariables` interface).

---

### Front-end

Standard issue Angular application program with routing, Angular Material,
and ESLint.

---

### Running the application

To run the application in development mode run

```bash
make dev
```

— this will run both the front-end and back-end programs.

---
