# CSE-Alumni-Reunion-2025-Official-Website
# API Documentation

## Base URL
```
http://localhost:PORT
```

---

## Routes

### 1. Alumni Registration
#### POST `/alumni-registration`
**Description:** Register a new alumni.

**Request Headers:**
- Content-Type: `multipart/form-data`

**Request Body:**
- `jsonData` (JSON string): Contains alumni data.
- `profilePictureInfo` (File): Alumni profile picture.

**Response:**
- `201 Created`: Registration successful.
- `400 Bad Request`: Validation error or duplicate transaction ID.
- `500 Internal Server Error`: Server issue.

---

### 2. Fetch All Alumni
#### GET `/alumni`
**Description:** Fetch all registered alumni.

**Response:**
- `200 OK`: List of alumni.
- `500 Internal Server Error`: Server issue.

---

### 3. Update Alumni
#### PUT `/alumni/:id`
**Description:** Update alumni information and optionally update/delete their profile picture.

**Request Headers:**
- Content-Type: `multipart/form-data`

**Request Body:**
- `jsonData` (JSON string): Updated alumni data.
- `profilePictureInfo` (File, optional): Updated profile picture.

**Response:**
- `200 OK`: Update successful.
- `400 Bad Request`: Validation error.
- `404 Not Found`: Alumni not found.
- `500 Internal Server Error`: Server issue.

---

### 4. Delete Alumni
#### DELETE `/alumni/:id`
**Description:** Delete an alumni and their profile picture.

**Response:**
- `200 OK`: Deletion successful.
- `404 Not Found`: Alumni not found.
- `500 Internal Server Error`: Server issue.

---

### 5. Update Alumni Payment Status
#### PUT `/alumni/paymentUpdate/:id/:status`
**Description:** Update payment status for an alumni.

**Path Parameters:**
- `id` (String): Alumni ID.
- `status` (Number): New status (0: Not Paid, 1: Paid, 3: Rejected).

**Response:**
- `200 OK`: Update successful.
- `404 Not Found`: Alumni not found.
- `500 Internal Server Error`: Server issue.

---

### 6. Student Registration
#### POST `/student-registration`
**Description:** Register a new student.

**Request Headers:**
- Content-Type: `multipart/form-data`

**Request Body:**
- `jsonData` (JSON string): Contains student data.
- `profilePictureInfo` (File): Student profile picture.

**Response:**
- `201 Created`: Registration successful.
- `400 Bad Request`: Validation error or duplicate transaction ID.
- `500 Internal Server Error`: Server issue.

---

### 7. Fetch All Students
#### GET `/student`
**Description:** Fetch all registered students.

**Response:**
- `200 OK`: List of students.
- `500 Internal Server Error`: Server issue.

---

### 8. Update Student
#### PUT `/student/:id`
**Description:** Update student information and optionally update/delete their profile picture.

**Request Headers:**
- Content-Type: `multipart/form-data`

**Request Body:**
- `jsonData` (JSON string): Updated student data.
- `profilePictureInfo` (File, optional): Updated profile picture.

**Response:**
- `200 OK`: Update successful.
- `400 Bad Request`: Validation error.
- `404 Not Found`: Student not found.
- `500 Internal Server Error`: Server issue.

---

### 9. Delete Student
#### DELETE `/student/:id`
**Description:** Delete a student and their profile picture.

**Response:**
- `200 OK`: Deletion successful.
- `404 Not Found`: Student not found.
- `500 Internal Server Error`: Server issue.

---

### 10. Update Student Payment Status
#### PUT `/student/paymentUpdate/:id/:status`
**Description:** Update payment status for a student.

**Path Parameters:**
- `id` (String): Student ID.
- `status` (Number): New status (0: Not Paid, 1: Paid, 3: Rejected).

**Response:**
- `200 OK`: Update successful.
- `404 Not Found`: Student not found.
- `500 Internal Server Error`: Server issue.

---
