export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default async function ExplorePage() {
  return redirect("/catalogo/todos");
}
