import { TextFieldEntry, isSelectEntryEdited } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

export default function (element) {
    return {
        id: "elementId",
        element,
        component: ElementId,
        isEdited: isSelectEntryEdited,
    };
}

function ElementId(props) {
    const { element, id } = props;

    const modeling = useService("modeling");
    const translate = useService("translate");
    const debounce = useService("debounceInput");

    const getValue = () => {
        return element.businessObject.elementId || "";
    };

    const setValue = (value) => {
        return modeling.updateProperties(element, {
            elementId: value,
        });
    };

    const validate = (value) => {
        if (!value) {
            return translate("Element ID must not be empty.");
        }
    };

    return TextFieldEntry({
        element: element,
        id: id,
        label: translate("Element ID"),
        getValue,
        setValue,
        debounce,
        validate,
    });
}
