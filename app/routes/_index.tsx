import { Await, useFetcher, useLoaderData, type ActionFunctionArgs } from "react-router";
import getCascading, { type CascadingRequest } from "~/lib/portal/get-cascading";
import Header from "~/components/index/Header";
import Footer from "~/components/index/Footer";
import Form from "~/components/index/Form";
import Schedule from "~/components/index/schedule/Schedule";
import headPortal from "~/lib/portal/head";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import getInit from "~/lib/portal/get-init";
import { Suspense } from "react";

export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=3600",
    };
};

export async function loader({ request }: LoaderFunctionArgs) { 
    const params = new URL(request.url).searchParams;
    const req = Object.fromEntries(params) as Partial<CascadingRequest>;
    const runBootstrap = !!req["facultyId"] && !!req["course"];

    return {
        faculties: getInit(),
        head: headPortal(),
        bootstrap: runBootstrap ? getCascading(req as CascadingRequest) : undefined,
    };
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const req = Object.fromEntries(formData) as Partial<CascadingRequest>;

    if (!req.facultyId || !req.course) {
        return null;
    }

    return getCascading(req as CascadingRequest);
}

export default function Home() {
    const { faculties, head, bootstrap } = useLoaderData<typeof loader>();
    const fetcher = useFetcher<typeof action>();

    return <main className="p-12 flex flex-col items-center gap-10">
        <Header head={head} />

        <Form faculties={faculties} fetcher={fetcher} bootstrap={bootstrap} />

        <Suspense fallback={<Footer />}>
            <Await resolve={bootstrap}>
                {resolved => {
                    const activeSchedule = fetcher.data?.schedule || resolved?.schedule;

                    return activeSchedule ? <Schedule schedule={activeSchedule} /> : <Footer />;
                }}
            </Await>
        </Suspense>
    </main>;
}
