import clsx from "clsx";

type Props = {
    text: string;
    className?: string;
    wordDisplayStyle?: "inline-block" | "block";
};

export function TextSplitter({
    text,
    className,
    wordDisplayStyle = "inline-block",
}: Props) {
    if (!text) return null;

    const words = text.split(" ");

    return words.map((word: string, wordIndex: number) => {  //(elemento, indice, arrayOriginal) //ele passa por cada elemento e roda o comando
        const splitText = word.split("");
        return (
            <span
                className={clsx("split-word", className)}
                style={{ display: wordDisplayStyle, whiteSpace: "pre" }}
                key={`${wordIndex}-${word}`}
            >
                {splitText.map((char, charIndex) => {  //(elemento, indice, arrayOriginal)
                    if (char === " ") return ` `;
                    return (
                        <span
                            key={charIndex}
                            className={`split-char inline-block split-char--${wordIndex}-${charIndex}`}
                        >
                            {char}
                        </span>
                    );
                })}
                {wordIndex < words.length - 1 ? (
                    <span className="split-char">{` `}</span>
                ) : (
                    ""
                )}
            </span>
        );
    });
}
