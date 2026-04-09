import { useLoaderData } from "react-router";
import FacultySelector from "~/components/index/FacultySelector";
import initPortal from "~/lib/portal/init";

export async function loader() {
  const init = initPortal();

  return { init };
}

export default function Home() {
  const { init } = useLoaderData<typeof loader>();

  return (
    <main className="p-12"> 
      <FacultySelector init={init} />
    </main>
  );
}