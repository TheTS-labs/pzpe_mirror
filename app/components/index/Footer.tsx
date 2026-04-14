import { BASE_URL } from "~/lib/portal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { COLOR_OFFLINE, COLOR_ONLINE, COLOR_UNKNOWN } from "./Header";
import { useIntlayer } from "react-intlayer";

export default function Footer() {
    const i18n = useIntlayer("footer");

    return <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto px-4">
        <AccordionItem value="item-0">
            <AccordionTrigger>{i18n.item_zero}</AccordionTrigger>
            <AccordionContent className="pl-4">
                <span className="font-bold">P</span>ortal.<span className="font-bold">ZP</span>.<span className="font-bold">E</span>du.ua
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
            <AccordionTrigger>{i18n.item_one.q}</AccordionTrigger>
            <AccordionContent className="pl-4">
                <ul className="list-disc list-inside space-y-1">
                    <li><span className={`font-semibold ${COLOR_ONLINE}`}>PZPE</span>: <a className="text-blue-400 underline" href={BASE_URL}>{BASE_URL}</a> {i18n.item_one.green}</li>
                    <li><span className={`font-semibold ${COLOR_OFFLINE}`}>PZPE</span>: {i18n.item_one.red}</li>
                    <li><span className={`font-semibold ${COLOR_UNKNOWN}`}>PZPE</span>: {i18n.item_one.gray}</li>
                </ul>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
            <AccordionTrigger>{i18n.item_two.q}</AccordionTrigger>
            <AccordionContent className="pl-4">
                {i18n.item_two.a[0]} <a className="text-blue-400 underline" href="https://github.com/TheTS-labs/pzpe_mirror" target="_blank" rel="noopener noreferrer">GitHub</a>. {i18n.item_two.a[1]}
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
            <AccordionTrigger>{i18n.item_three.q}</AccordionTrigger>
            <AccordionContent className="pl-4">
                <p>{i18n.item_three.a[0]}</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>{i18n.item_three.a[1]}</li>
                    <li>{i18n.item_three.a[2]}</li>
                </ol>
        
                <p className="mt-6 mb-2 text-sm text-neutral-400 italic">{i18n.item_three.a[3]}</p>
                <ol className="list-decimal list-inside" start={3}>
                    <li>{i18n.item_three.a[4]}</li>
                </ol>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger>{i18n.item_four.q}</AccordionTrigger>
            <AccordionContent className="pl-4">
                {i18n.item_four.a} <a className="text-blue-400 underline" href="https://send.monobank.ua/4vQFjAuSmJ" target="_blank" rel="noopener noreferrer">Monobank</a>
            </AccordionContent>
        </AccordionItem>
    </Accordion>;
}
