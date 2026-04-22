import { Await } from "react-router";
import Header from "~/components/index/Header";
import Footer from "~/components/index/Footer";
import Form from "~/components/index/Form";
import Schedule from "~/components/index/schedule/Schedule";
import headPortal from "~/lib/portal/head";
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Suspense } from "react";
import { getIntlayer } from "intlayer";
import LocaleSwitcher from "~/components/index/LocaleSwitcher";
import { errorBoundary, type Req } from "~/lib/portal";
import type { Route } from "./+types/($locale)._index";
import fetchTimetableData from "~/lib/portal/fetch-timetable-data";
import Error from "~/components/index/Error";
import Metadata from "~/components/index/Metadata";

export const headers: HeadersFunction = () => ({
    "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=3600",
});

export const meta: MetaFunction = ({ params }) => {
    const content = getIntlayer("index", params.locale);

    return [
        { title: "PZPE Mirror" },
        { name: "description", content: content.description },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const params = new URL(request.url).searchParams;
    const req = Object.fromEntries(params) as Req;

    return {
        head: headPortal(),
        data: errorBoundary(() => fetchTimetableData(req))
    };
};

export default function Home({ loaderData: { data, head } }: Route.ComponentProps) {
    return <main className="p-12 flex flex-col items-center gap-10">
        <Header head={head} />

        <Form data={data} />

        <Error data={data} />

        <Suspense fallback={<Footer />}>
            <Await resolve={data}>
                {resolved => <div>
                    {Object.keys(resolved.result?.schedule || {}).length > 0 
                        ? <Schedule schedule={resolved.result?.schedule} /> 
                        : <Footer />}

                    {resolved.result?.cacheCreatedAt && <Metadata createdAt={resolved.result?.cacheCreatedAt} />}
                </div>}
            </Await>
        </Suspense>

        <LocaleSwitcher />
    </main>;
}
