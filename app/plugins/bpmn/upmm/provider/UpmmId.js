import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {
    return {
        id: 'upmmId',
        element,
        component: UpmmId,
        isEdited: isSelectEntryEdited
    };
}

function UpmmId(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.upmmId || '';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            upmmId: value
        });
    }

    const getOptions = () => {
        return [
            { value: '', label: translate('<none>') },
            ...window['upmmElements']
        ];
    };

    return SelectEntry({
        element: element,
        id: id,
        label: translate('UPMM Id'),
        getValue,
        setValue,
        getOptions,
        debounce
    });
}

