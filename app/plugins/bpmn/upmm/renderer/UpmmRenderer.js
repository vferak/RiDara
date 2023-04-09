import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { append as svgAppend, classes as svgClasses } from "tiny-svg";

const HIGH_PRIORITY = 1500;
const BLACK_COLOR = "hsl(225, 10%, 15%)";
const RED_COLOR = "hsl(0,100%,50%)";

export default class UpmmRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, textRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.textRenderer = textRenderer;
    }

    canRender(element) {
        return !element.labelTarget;
    }

    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);

        const upmmLabel = element.businessObject?.upmmName;
        const elementName = element.businessObject?.elementId;

        if (upmmLabel === undefined || (window['isTemplateModeler'] && elementName === undefined)) {
            shape.style.stroke = RED_COLOR;
            return shape;
        }

        return shape;
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }

    renderLabel(parentGfx, label, options) {
        const text = this.textRenderer.createText(label, options);

        svgClasses(text).add("upmm-label");

        svgAppend(parentGfx, text);

        return text;
    }
}

UpmmRenderer.$inject = ["eventBus", "bpmnRenderer", "textRenderer"];
