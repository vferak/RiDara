import { Injectable } from '@nestjs/common';
import { CreateRelationOntologyDto } from '../../ontology/dto/create-relation-ontology.dto';
import * as N3 from 'n3/lib';
import { CreateNodeOntologyDto } from '../../ontology/dto/create-node-ontology.dto';
import { TurtleData } from './turtle.data';

@Injectable()
export class TurtleService {
    public parseTurtleFile(fileBuffer: Buffer): TurtleData {
        const parser: N3.Parser = new N3.Parser({ format: 'Turtle' });
        const quads: N3.Quad[] = parser.parse(fileBuffer.toString());

        const ontologyNodesMap =
            this.createOntologyNodesMap(quads);

        const ontologyNodesRelations =
            this.createOntologyNodesRelations(quads, ontologyNodesMap);

        const ontologyNodes = [...ontologyNodesMap].map(
            ([, ontologyNodeDto]) => ontologyNodeDto,
        );

        return new TurtleData(ontologyNodes, ontologyNodesRelations);
    }

    private createOntologyNodesMap(
        quads: N3.Quad[],
    ): Map<string, CreateNodeOntologyDto> {
        const ontologyNodes = new Map<string, CreateNodeOntologyDto>();

        for (const quad of quads) {
            const isValidClassQuad =
                quad._predicate.id.includes('#type') &&
                quad._object.id.includes('#Class') &&
                quad._subject.constructor.name !== 'BlankNode';

            if (!isValidClassQuad) {
                continue;
            }

            const ontologyNodeName = quad._subject.id.toString().split('#')[1];

            const isNodeAlreadyCreated = !!ontologyNodes.get(ontologyNodeName);

            if (isNodeAlreadyCreated) {
                continue;
            }

            ontologyNodes.set(
                ontologyNodeName,
                new CreateNodeOntologyDto(ontologyNodeName),
            );
        }

        return ontologyNodes;
    }

    private createOntologyNodesRelations(
        quads: N3.Quad[],
        ontologyNodesMap: Map<string, CreateNodeOntologyDto>,
    ): CreateRelationOntologyDto[] {
        const ontologyNodesRelations: CreateRelationOntologyDto[] = [];

        for (const quad of quads) {
            const isPossibleRelation = quad._predicate.id.includes('#seeAlso');

            if (!isPossibleRelation) {
                continue;
            }

            const sourceRef = quad._subject.id.toString().split('#')[1];
            const targetRef = quad._object.id.toString().split('#')[1];

            const isSourceRefNodeDefined = !!ontologyNodesMap.get(sourceRef);
            const isTargetRefNodeDefined = !!ontologyNodesMap.get(targetRef);

            if (!isSourceRefNodeDefined || !isTargetRefNodeDefined) {
                continue;
            }

            ontologyNodesRelations.push(
                new CreateRelationOntologyDto(sourceRef, targetRef),
            );
        }

        return ontologyNodesRelations;
    }
}
