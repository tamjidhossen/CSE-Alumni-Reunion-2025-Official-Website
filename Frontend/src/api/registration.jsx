import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/registration";

export const registrationApi = {
  submitStudentForm: async (formData) => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "profilePictureInfo" && formData[key].image) {
          data.append("profilePicture", formData[key].image);
        } else {
          data.append(key, JSON.stringify(formData[key]));
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/student-registration`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  submitAlumniForm: async (formData) => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "profilePictureInfo" && formData[key].image) {
          data.append("profilePicture", formData[key].image);
        } else {
          data.append(key, JSON.stringify(formData[key]));
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/alumni-registration`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
