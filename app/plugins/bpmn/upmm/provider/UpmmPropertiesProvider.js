import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import upmmId from "./UpmmId";
import elementId from "./ElementId";

const HIGH_PRIORITY = 1500;

export default function UpmmPropertiesProvider(propertiesPanel, translate) {
    this.getGroups = function (element) {
        return function (groups) {
            if (
                !isAny(
                element,
                [
                    'bpmn:Process',
                    'bpmn:Participant',
                    'bpmn:Lane',
                    'bpmn:MessageFlow',
                    'bpmn:DataOutputAssociation',
                    'bpmn:DataInputAssociation',
                    'bpmn:SequenceFlow',
                ])
            ) {
                groups.push(createUpmmGroup(element, translate));
            }

            return groups;
        };
    };

    propertiesPanel.registerProvider(HIGH_PRIORITY, this);
}

UpmmPropertiesProvider.$inject = ["propertiesPanel", "translate"];

function createUpmmGroup(element, translate) {
    const isTemplateModeler = window['isTemplateModeler'];

    const entries = [upmmId(element)];

    if (isTemplateModeler) {
        entries.push(elementId(element));
    }

    return {
        id: "upmm",
        label: translate("UPMM Mapping"),
        entries: entries,
    };
}
