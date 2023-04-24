import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { isAny } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;
const RED_COLOR = "hsl(0,100%,50%)";

export default class UpmmRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, textRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.textRenderer = textRenderer;
        this.isTemplateModeler = window['isTemplateModeler'];
    }

    canRender(element) {
        return !isAny(
            element,
            [
                'bpmn:Participant',
                'bpmn:Lane',
                'bpmn:TextAnnotation',
                'bpmn:Group'
            ]
            ) && !element.labelTarget;
    }

    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);

        const upmmLabel = element.businessObject?.upmmName;
        const elementName = element.businessObject?.elementId;

        if (
            upmmLabel === undefined ||
            (this.isTemplateModeler && elementName === undefined)
        ) {
            shape.style.stroke = RED_COLOR;
        }

        return shape;
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }
}

UpmmRenderer.$inject = ["eventBus", "bpmnRenderer", "textRenderer"];
