import { useLocale } from "react-intlayer";
import { useEffect } from "react";
import dayjs from "dayjs";

import "dayjs/locale/en";
import "dayjs/locale/uk";

export function DayjsLocale() {
    const { locale } = useLocale();

    useEffect(() => {
        dayjs.locale(locale);
    }, [locale]);

    return null; 
}
