// @ts-ignore
import Modeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import upmmPropertiesProviderModule from './upmm/provider';
import upmmRendererModule from './upmm/renderer';
import upmmModdleDescriptor from './upmm/descriptor.json';

export type SelectOption = {
    value: string,
    label: string,
}

export default defineNuxtPlugin(() => {
    let modeler: Modeler;

    const init = (
        container: string,
        propertiesPanel: string,
        upmmElements: SelectOption[],
        isTemplateModeler: boolean = false
    ): Modeler => {
        // @ts-ignore
        window['upmmElements'] = upmmElements;
        // @ts-ignore
        window['isTemplateModeler'] = isTemplateModeler;

        if (modeler === undefined) {
            modeler = new Modeler({
                container: container,
                keyboard: {
                    bindTo: document
                },
                propertiesPanel: {
                    parent: propertiesPanel,
                    layout: {
                        groups: {
                            general: {
                                open: true
                            },
                            documentation: {
                                open: true
                            },
                            upmm: {
                                open: true
                            },
                        }
                    }
                },
                additionalModules: [
                    BpmnPropertiesPanelModule,
                    BpmnPropertiesProviderModule,
                    upmmPropertiesProviderModule,
                    upmmRendererModule,
                ],
                moddleExtensions: {
                    upmmModdleDescriptor
                }
            });
        }
    }

    const destroy = (): Modeler => {
        modeler = undefined;
    }

    const get = (): Modeler => {
        return modeler;
    }

    const downloadSVG = async () => {
        const svg = await modeler.saveSVG();
        const blob = new Blob([svg.svg], { type: 'XML' });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'diagram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }

    const downloadBPMN = async () => {
        const xml = await modeler.saveXML();
        const blob = new Blob([xml.xml], { type: 'XML' });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = 'diagram.bpmn';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }

    return {
        provide: {
            bpmnModeler: {
                init,
                get,
                destroy,
                downloadBPMN,
                downloadSVG
            }
        }
    };
});
