import { useFetcher, useLoaderData, type ActionFunctionArgs } from "react-router";
import getSchedule, { type Req } from "~/lib/portal/schedule";
import initPortal from "~/lib/portal/init";
import Header from "~/components/index/Header";
import Footer from "~/components/index/Footer";
import Form from "~/components/index/Form";
import Schedule from "~/components/index/Schedule";
import headPortal from "~/lib/portal/head";

export const loader = () => ({ init: initPortal(), head: headPortal() });

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const req = Object.fromEntries(formData) as Partial<Req>;

    if (!req.csrfToken || !req.metaCsrfToken || !req.cookies || !req.facultyId || !req.course) {
        return null;
    }

    return getSchedule(req as Req);
}

export default function Home() {
    const { init, head } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    return <main className="p-12 flex flex-col items-center gap-10">
        <Header head={head} />

        <Form init={init} fetcher={fetcher} />
        <Schedule schedule={fetcher.data?.schedule} />

        {!fetcher.data?.schedule && <Footer />}
    </main>;
}
