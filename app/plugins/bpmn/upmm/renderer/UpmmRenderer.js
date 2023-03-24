import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    classes as svgClasses,
} from 'tiny-svg';

import {
    transform,
} from 'diagram-js/lib/util/SvgTransformUtil';


const HIGH_PRIORITY = 1500;
const BLACK_COLOR = 'hsl(225, 10%, 15%)';
const RED_COLOR = 'hsl(0,100%,50%)';


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

        const upmmLabel = element.businessObject?.upmmName === undefined ?
            'Missing UPMM ID!' : element.businessObject.upmmName;

        const options = {
            align: 'center-top',
            fitBox: true,
            style: {
                fill: BLACK_COLOR
            }
        };

        if (element.businessObject.upmmName === undefined) {
            options.style.fill = RED_COLOR;
        }

        const text = this.renderLabel(
            parentNode,
            upmmLabel,
            options,
        );

        const textX = text.getBBox().x !== 0 ?
            text.getBBox().x : upmmLabel.length * 5.55;

        const translateX = (element.width / 2) - textX / 2;

        transform(text, translateX, -20, 0);

        return shape;
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }

    renderLabel(parentGfx, label, options) {
        const text = this.textRenderer.createText(label, options);

        svgClasses(text).add('upmm-label');

        svgAppend(parentGfx, text);

        return text;
    }
}

UpmmRenderer.$inject = [ 'eventBus', 'bpmnRenderer', 'textRenderer' ];
