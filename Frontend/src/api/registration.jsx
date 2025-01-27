import axios from "axios";
import { API_URL } from "@/lib/authConfig";

export const registrationApi = {
  submitStudentForm: async (formData) => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "profilePictureInfo") {
          data.append(key, JSON.stringify(formData[key]));
        }
      });

      const response = await axios.post(
        `${API_URL}/api/registration/student-registration`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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
          data.append("profilePictureInfo", formData[key].image);
        } else {
          data.append(key, JSON.stringify(formData[key]));
        }
      });

      const response = await axios.post(
        `${API_URL}/api/registration/alumni-registration`,
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
