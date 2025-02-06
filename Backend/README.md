# API Documentation

This document provides an overview of the API routes, their purpose, and expected behavior. The API is organized into different modules based on functionality.

---

## **Main App Routes**
- `/api/registration` - Handles registration-related requests.
- `/api/student` - Handles student-related requests.
- `/api/announcement` - Handles announcements.
- `/api/admin` - Handles admin authentication and management.
- `/api/alumni` - Handles alumni-related requests.
- `/api/payment` - Handles payment validation and status updates.

---

## **Admin Routes**
### **Register Admin**
- **Route**: `POST /api/admin/register`
- **Authentication**: Yes (admin authentication required)
- **Description**: Registers a new admin.

### **Login Admin**
- **Route**: `POST /api/admin/login`
- **Authentication**: No
- **Description**: Logs in an admin and returns an authentication token.

---

## **Alumni Routes**
### **Get All Alumni**
- **Route**: `GET /api/alumni/`
- **Authentication**: Yes (admin authentication required)
- **Description**: Fetches all alumni records.

### **Update Alumni**
- **Route**: `POST /api/alumni/update/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates alumni data, including profile picture.

### **Delete Alumni**
- **Route**: `DELETE /api/alumni/delete/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Deletes an alumni record.

### **Update Payment Status**
- **Route**: `PUT /api/alumni/paymentUpdate/:id/:status`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates the payment status for a specific alumni.
- **Status Values**:
  - `0`: Pending
  - `1`: Paid
  - `2`: Rejected

---

## **Announcement Routes**
### **Create Announcement**
- **Route**: `POST /api/announcement/add`
- **Authentication**: Yes (admin authentication required)
- **Description**: Adds a new announcement.

### **Get Announcements**
- **Route**: `GET /api/announcement/get-announcement`
- **Authentication**: No
- **Description**: Fetches all announcements.

### **Update Announcement**
- **Route**: `GET /api/announcement/update/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates a specific announcement.

### **Delete Announcement**
- **Route**: `DELETE /api/announcement/delete/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Deletes a specific announcement.

---

## **Payment Routes**
### **Check Payment**
- **Route**: `GET /api/payment/check/:roll/:reg/:transactionId`
- **Authentication**: No
- **Description**: Verifies payment details for both students and alumni.

### **Update Payment Status**
- **Route**: `GET /api/payment/Update/:transactionId/:status`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates the payment status for a given transaction ID.

---

## **Registration Routes**
### **Alumni Registration**
- **Route**: `POST /api/registration/alumni-registration`
- **Authentication**: No
- **Description**: Registers a new alumni with personal and payment details, and uploads a profile picture.

### **Student Registration**
- **Route**: `POST /api/registration/student-registration`
- **Authentication**: No
- **Description**: Registers a new student with personal and payment details, and uploads a profile picture.

---

## **Student Routes**
### **Get All Students**
- **Route**: `GET /api/student/`
- **Authentication**: Yes (admin authentication required)
- **Description**: Fetches all student records.

### **Update Student**
- **Route**: `POST /api/student/update/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates student data, including profile picture.

### **Delete Student**
- **Route**: `DELETE /api/student/delete/:id`
- **Authentication**: Yes (admin authentication required)
- **Description**: Deletes a student record.

### **Update Payment Status**
- **Route**: `PUT /api/student/paymentUpdate/:id/:status`
- **Authentication**: Yes (admin authentication required)
- **Description**: Updates the payment status for a specific student.
- **Status Values**:
  - `0`: Pending
  - `1`: Paid
  - `2`: Rejected

---

## **Authentication Middleware**
- **adminAuth.authAdmin**: Middleware that verifies admin authentication for protected routes.

