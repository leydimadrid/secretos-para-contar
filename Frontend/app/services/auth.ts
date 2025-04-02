export async function Login(email: string, password: string) {
  try {
    const response = await fetch(
      "http://localhost:5046/api/authenticate/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Error en login");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function Register(formData: {
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(
      "http://localhost:5046/api/authenticate/register/admin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
