import { decode } from "html-entities";

export const BASE_URL = "https://portal.zp.edu.ua";
export const TIME_TABLE_URL = `${BASE_URL}/time-table/student?type=1`;

export class GetOptionsElementHandler implements HTMLRewriterElementContentHandlers {
    options: [number, string][] = [];

    #currentId: number | undefined = undefined;
    #currentText = "";

    element(element: Element) {
        const id = parseInt(element.getAttribute("value") || "", 10);

        this.#currentId = Number.isNaN(id) ? undefined : id;
        this.#currentText = "";

        element.onEndTag(() => {
            if (this.#currentId) {
                this.options.push([this.#currentId, decode(this.#currentText)]);
            }
        });
    }

    text(element: Text) {
        if (this.#currentId) {
            this.#currentText += element.text;
        }
    }
}
