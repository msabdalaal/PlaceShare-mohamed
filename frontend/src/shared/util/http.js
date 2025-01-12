import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchUsers() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/`,{credentials: 'include'});
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
export async function sendToken() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkToken`,{credentials:'include'});
  const data=await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function deleteToken() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteToken`,{credentials:'include'});
  const data=await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function login({ state, body }) {
  let url = `${import.meta.env.VITE_BACKEND_URL}/api/users/`;
  let options = { method: "POST" , credentials: 'include'};
  if (state === "login") {
    url += "login";
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  } else if (state === "signup") {
    url += "signup";
    options.body = body;
  }
  const response = await fetch(url, options );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function AddPlace({ body }) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/`, {
    method: "POST",
    credentials: 'include',
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
export async function getPlaceByUserId({ signal, id }) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/user/${id}`, {
    signal,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function getPlaceById({ signal, id }) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/${id}`, {
    signal,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function updatePlaceById({ id, body }) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/${id}`, {
    method: "PATCH",
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
export async function deletePlaceById({ id }) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/${id}`, {
    method: "DELETE",
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}
