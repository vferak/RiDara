// @ts-ignore
import Modeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import upmmPropertiesProviderModule from './upmm/provider';
import upmmModdleDescriptor from './upmm/descriptor.json';

export default defineNuxtPlugin(() => {
    let modeler: Modeler;

    const init = (container: string, propertiesPanel: string): Modeler => {
        if (modeler === undefined) {
            modeler = new Modeler({
                container: container,
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
                ],
                moddleExtensions: {
                    upmmModdleDescriptor
                }
            });
        }
    }

    const get = (): Modeler => {
        return modeler;
    }

    return {
        provide: {
            bpmnModeler: {
                init,
                get
            }
        }
    };
});
