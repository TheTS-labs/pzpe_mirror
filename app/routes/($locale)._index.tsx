import { Await, useFetcher } from "react-router";
import Header from "~/components/index/Header";
import Footer from "~/components/index/Footer";
import Form from "~/components/index/Form";
import Schedule from "~/components/index/schedule/Schedule";
import headPortal from "~/lib/portal/head.server";
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Suspense } from "react";
import { getIntlayer } from "intlayer";
import LocaleSwitcher from "~/components/index/LocaleSwitcher";
import { type Req } from "~/lib/portal";
import type { Route } from "./+types/($locale)._index";
import fetchTimetableData from "~/lib/portal/fetch-timetable-data.server";
import Error from "~/components/index/Error";
import Metadata from "~/components/index/Metadata";
import { withLogger } from "~/lib/log.server";
import { errorBoundary } from "~/lib/portal/error-boundary.server";

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

export const loader = withLogger(async ({ request }: LoaderFunctionArgs) => {
    const params = new URL(request.url).searchParams;
    const req = Object.fromEntries(params) as Req;

    return {
        head: headPortal(),
        data: errorBoundary(() => fetchTimetableData(req)),
    };
});

export const action = withLogger(async ({ request }: Route.ActionArgs) => {
    const params = new URL(request.url).searchParams;
    const req = Object.fromEntries(params) as Req;

    return errorBoundary(() => fetchTimetableData(req, true));
});

export default function Home({ loaderData: { data, head } }: Route.ComponentProps) {
    const fetcher = useFetcher<typeof action>();

    return <main className="justify-center p-6 pt-12 flex flex-col items-center gap-10 w-full md:max-w-prose mx-auto">
        <Header head={head} />

        <Form data={data} />

        <Error data={data} />

        <Suspense fallback={<Footer />}>
            <Await resolve={data}>
                {resolved => <div className="w-full md:max-w-2xl">
                    {Object.keys(resolved.result?.schedule || {}).length > 0
                        ? <>
                            <Schedule schedule={resolved.result?.schedule} />
                            {resolved.result?.cacheCreatedAt && <Metadata
                                error={fetcher.data?.errCode !== undefined}
                                loading={fetcher.state !== "idle"}

                                onRefresh={() => fetcher.submit({}, { method: "POST" })}
                                createdAt={resolved.result?.cacheCreatedAt}
                            />}
                        </>
                        : <Footer />}
                </div>}
            </Await>
        </Suspense>

        <LocaleSwitcher />
    </main>;
}
