export { default } from "next-auth/middleware";

export const config = {
  matchers: ["/posts/:id"],
};
