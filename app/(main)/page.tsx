// import SignUpPage from "@/components/signup-page";

import { redirect } from "next/navigation";

export default function Home() {
  // route to alpha page
  redirect("/alpha");

  // return <SignUpPage />;
}
