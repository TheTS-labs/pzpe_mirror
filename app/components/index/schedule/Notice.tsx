/* eslint-disable stylistic/comma-dangle */

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function Notice({ text }: { text: string }) {
    return (
        <div className="pl-4 break-words">
            {text.trim().split("\n").map((line, i) => (
                <p key={i}>
                    {line.split(URL_REGEX).map((part, j) => 
                        part.match(URL_REGEX) 
                            ? <a key={j} href={part} className="text-blue-400 underline" target="_blank" rel="noopener">{part}</a> 
                            : part
                    )}
                </p>
            ))}
        </div>
    );
}
