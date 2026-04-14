import { getLocalizedUrl, getPathWithoutLocale, Locales, type LocalesValues } from "intlayer";
import { useLocale } from "react-intlayer";
import { Link, useLocation } from "react-router";

function LocaleLink(props: { locale: LocalesValues, name: string }) {
    const { pathname } = useLocation();
    const { locale: currentLocale, setLocale } = useLocale();
    const pathWithoutLocale = getPathWithoutLocale(pathname);

    return <Link
        onClick={() => setLocale(props.locale)}
        to={getLocalizedUrl(pathWithoutLocale, props.locale)}
        className={currentLocale == props.locale ? "text-indigo-500 font-bold" : ""}
    >
        {props.name}
    </Link>
}

export default function LocaleSwitcher() {
    return (
        <div className="flex flex-row gap-2">
            <LocaleLink locale={Locales.ENGLISH_UNITED_STATES} name="English" />

            <p>|</p>

            <LocaleLink locale={Locales.UKRAINIAN_UKRAINE} name="Українська" />
        </div>
    );
};
