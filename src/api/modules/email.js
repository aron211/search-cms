import axios from "axios";

export async function sendEmail(emailData) {
  try {
    const response = await axios.post("/api/v1/mail", emailData);
    return response;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}