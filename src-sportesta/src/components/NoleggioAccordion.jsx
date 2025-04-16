import React from "react";

const AccordionItem = ({ id, title, body, parentId }) => (
    <div className="accordion-item border rounded p-2 mb-2">
        <h2 className="accordion-header">
            <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${id}`}
                aria-expanded="false"
                aria-controls={id}
            >
                {title}
            </button>
        </h2>
        <div
            id={id}
            className="accordion-collapse collapse"
            data-bs-parent={`#${parentId}`}
        >
            <div className="accordion-body">{body}</div>
        </div>
    </div>
);

const NoleggioAccordion = ({ id, items }) => {
    return (
        <div className="accordion accordion-flush" id={id}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    id={`${id}-item-${index}`}
                    title={item.title}
                    body={item.body}
                    parentId={id}
                />
            ))}
        </div>
    );
};

export default NoleggioAccordion;
