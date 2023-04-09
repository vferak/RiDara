import { SelectEntry, isSelectEntryEdited } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

export default function (element) {
    return {
        id: "upmmId",
        element,
        component: UpmmId,
        isEdited: isSelectEntryEdited,
    };
}

function UpmmId(props) {
    const { element, id } = props;

    const modeling = useService("modeling");
    const translate = useService("translate");
    const debounce = useService("debounceInput");

    const upmmElements = window["upmmElements"];

    const getValue = () => {
        return element.businessObject.upmmId || "";
    };

    const setValue = (value) => {
        const upmmElement = getOptions()
            .filter((upmmElement) => upmmElement.value === value)
            .shift();

        return modeling.updateProperties(element, {
            upmmId: upmmElement.value,
            upmmName: upmmElement.label,
        });
    };

    const getOptions = () => {
        return [
            { value: "", label: translate("< select UPMM ID >") },
            ...upmmElements,
        ];
    };

    const select = SelectEntry({
        element: element,
        id: id,
        label: translate("UPMM ID"),
        getValue,
        setValue,
        getOptions,
        debounce,
    });

    if (getValue() === "") {
        select.props.class += " has-error";
    }

    return select;
}
