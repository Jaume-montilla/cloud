export async function sign(n, p, e) {
  try {
    const data = {
      accion: "create",
      name: n,
      password: p,
      email: e,
    };
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch {
    return "error al conectarse con el servidor";
  }
}
export async function logIn(nom, pwd) {
  try {
    const data = {
      accion: "check",
      name: nom,
      password: pwd,
    };
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch {
    return "error al conectarse con el servidor";
  }
}
