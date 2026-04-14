import { BASE_URL } from "~/lib/portal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { COLOR_OFFLINE, COLOR_ONLINE, COLOR_UNKNOWN } from "./Header";

export default function Footer() {
    return <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto px-4">
        <AccordionItem value="item-0">
            <AccordionTrigger>What does "PZPE" stand for?</AccordionTrigger>
            <AccordionContent className="pl-4">
                <span className="font-bold">P</span>ortal.<span className="font-bold">ZP</span>.<span className="font-bold">E</span>du.ua
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
            <AccordionTrigger>What do the "PZPE" colors mean?</AccordionTrigger>
            <AccordionContent className="pl-4">
                <ul className="list-disc list-inside space-y-1">
                    <li><span className={`font-semibold ${COLOR_ONLINE}`}>PZPE</span>: <a className="text-blue-400 underline" href={BASE_URL}>{BASE_URL}</a> is online and operational</li>
                    <li><span className={`font-semibold ${COLOR_OFFLINE}`}>PZPE</span>: The portal is offline or unresponsive</li>
                    <li><span className={`font-semibold ${COLOR_UNKNOWN}`}>PZPE</span>: Checking connection status...</li>
                </ul>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
            <AccordionTrigger>Is this project open source?</AccordionTrigger>
            <AccordionContent className="pl-4">
                    Yes! The source code is available on <a className="text-blue-400 underline" href="https://github.com/TheTS-labs/pzpe_mirror" target="_blank" rel="noopener noreferrer">GitHub</a>. Feel free to drop a star, report bugs, or propose changes.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
            <AccordionTrigger>What was your motivation for this project?</AccordionTrigger>
            <AccordionContent className="pl-4">
                <p>My reasons for doing things:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Spite</li>
                    <li>The Aesthetic</li>
                </ol>
        
                <p className="mt-6 mb-2 text-sm text-neutral-400 italic">...okay I lied.</p>
                <ol className="list-decimal list-inside" start={3}>
                    <li>Attention</li>
                </ol>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
            <AccordionTrigger>omg ur so goated its actually insane. Do you accept donations by any chance?</AccordionTrigger>
            <AccordionContent className="pl-4">
                    Of course!! Donations are always welcome: <a className="text-blue-400 underline" href="https://send.monobank.ua/4vQFjAuSmJ" target="_blank" rel="noopener noreferrer">Monobank</a>
            </AccordionContent>
        </AccordionItem>
    </Accordion>;
}
