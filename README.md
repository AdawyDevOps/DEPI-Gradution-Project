# 🚀 Project Name

Building and Monitoring a Containerized URL Shortener Service

## 👥 Team Members

- Ahmed Ibrahim Adawy Mohamed
- Ahmed Emadeldien Mohamed Elhamaly 
- Ahmed Kamal Ibrahim Elashmay
- Ahmed Mohamed Hassan Nassef
- Youssef Ahmed ezzat elsaadany
- Peter Osama Said Ibrahim
- Abdelrahman Sadek Aborwash

## 🎯 Project Objectives

Develop, containerize, and monitor a fully functional URL shortener service. The entire environment—including the application and monitoring stack (Prometheus, Grafana)—will run locally using Docker.

## 📌 Project Scope

This project aims to develop and containerize a lightweight URL shortener webservice using SQLite for data storage. The service will be instrumented to expose custom Prometheus metrics through a dedicated /metrics endpoint. Prometheus will be configured to scrape and store these metrics, while Grafana will be integrated to provide real-time visualization and actionable dashboards. The stack will also include alerting rules and persistent storage through Docker volumes to ensure reliability across restarts. Comprehensive documentation, including API specifications and setup instructions, will accompany the final delivery.

## 📝 Project Plan

- Week 1 Application Development & Containerization  
Build the core URL shortener webservice with SQLite storage. Implement the POST /shorten and GET /<short_code> endpoints. Write a Dockerfile to containerize the service and create an initial docker-compose.yml for local deployment.

- Week 2  Metrics Integration with Prometheus  
Instrument the application using a Prometheus client library to expose custom metrics (URL creation, redirects, failed lookups, latency) at the /metrics endpoint. Create and configure prometheus.yml to scrape the metrics and integrate Prometheus into the docker-compose.yml.

- Week 3  Visualization with Grafana  
Add Grafana to the stack, connect it to Prometheus as a data source, and build dashboards visualizing KPIs such as URL creation rates, redirect counts, latency percentiles, and error rates.

- Week 4  Alerting & Persistence  
Configure Grafana alerts for key performance thresholds (high latency, high 404 errors). Enable Docker volumes for SQLite, Prometheus, and Grafana to ensure data persistence across restarts.

- Week 5 Final Testing & Documentation  
Thoroughly test the full stack for functionality, persistence, and alerts. Prepare a comprehensive README including setup instructions, API documentation, and screenshots of dashboards.
