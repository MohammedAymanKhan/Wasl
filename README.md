# Wasl 📹
> Enterprise-grade video conferencing platform with Keycloak authentication and meeting management

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Highlights](#architecture-highlights)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Installation](#installation)

---

## About

Wasl lets teams host instant or scheduled video meetings, manage private meeting rooms, record sessions, and invite users via Keycloak. Built for enterprises needing secure, authenticated video collaboration.

---

## Features

🚀 **Instant Meetings** - Start video calls immediately  
📅 **Scheduled Meetings** - Create meetings with description and datetime  
🔗 **Join by ID** - Enter meeting rooms using unique IDs  
📼 **Meeting Recordings** - Access previous session recordings  
🔒 **Private Meeting Rooms** - Invite-only personal spaces  
👥 **Smart User Search** - Find and invite users by name/email via Keycloak Admin API  

---

## Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat)
![Spring Boot](https://img.shields.io/badge/-Spring_Boot-6DB33F?logo=spring-boot&logoColor=white&style=flat)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat)
![Keycloak](https://img.shields.io/badge/-Keycloak-339933?logo=keycloak&logoColor=white&style=flat)
![JUnit](https://img.shields.io/badge/-JUnit-%23E33332?logo=junit5&logoColor=white&style=flat)

**Backend:** Spring Boot • Keycloak OAuth2 • MySQL • REST APIs  
**Frontend:** React • TailwindCSS  
**Video SDK:** GetStream.io  
**Testing:** JUnit • Testcontainers

---

## Architecture Highlights

- **Keycloak Integration**: Leverages Admin API for user search and authentication
- **Custom Notification System**: Spring Boot handles meeting invitations 
- **Secure Token Management**: Backend generates Separate token for authentication & GetStream (GetStream.io) tokens for video sessions
- **Secure Access**: Host controls and invite-only meeting rooms

---

## Screenshots

| Feature | Preview |
|---------|---------|
| **Meeting Dashboard** | <img width="1907" height="935" alt="Screenshot 2025-09-19 202310" src="https://github.com/user-attachments/assets/a605968d-75d5-4656-8575-8efdedf8d254" />|
| **Invite users** | <img width="1903" height="946" alt="Screenshot 2025-09-19 202830" src="https://github.com/user-attachments/assets/378356bf-83b7-430e-9cb2-7446dbe219a6" />|
| **Video Conference** | <img width="1910" height="949" alt="Screenshot 2025-09-19 203312" src="https://github.com/user-attachments/assets/a7e38ad6-5de8-45fb-bf36-3050ccb5873d" />|
| **Personal Meeting** |  <img width="1908" height="935" alt="Screenshot 2025-09-19 203345" src="https://github.com/user-attachments/assets/9d07cdd7-35ec-42ef-aabb-5021c5253473" />|

---

## Testing

- **85% Test Coverage** with JUnit & Testcontainers
- **API Testing** with Postman collection
- **Integration Tests** for Keycloak and GetStream flows

---

## Installation

**Prerequisites**  
- Java JDK 17+  
- Node.js 16+  
- MySQL  
- Keycloak Server  
- GetStream.io account  

**Steps**  
```bash
# Clone the repo
git clone https://github.com/MohammedAymanKhan/Wasl.git
cd Wasl

# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd ../frontend
npm install
npm start
```

You're now ready to run the app! 🎉

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
