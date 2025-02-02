import { ActionFunction, redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader = () => redirect("/");