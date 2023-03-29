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

        const classes = quads
            .filter(
                (quad) =>
                    quad._predicate.id.includes('#type') &&
                    quad._object.id.includes('#Class') &&
                    quad._subject.constructor.name !== 'BlankNode',
            )
            .map(function (quad): string {
                return quad._subject.id.toString().split('#')[1];
            });

        const uniqueClasses = [...new Set(classes)];

        const relations = quads
            .filter((quad) => quad._predicate.id.includes('#seeAlso'))
            .map(function (quad): { sourceRef: string; targetRef: string } {
                return {
                    sourceRef: quad._subject.id.toString().split('#')[1],
                    targetRef: quad._object.id.toString().split('#')[1],
                };
            });

        const ontologyNodes: CreateNodeOntologyDto[] = [];
        for (const className of uniqueClasses) {
            ontologyNodes.push(new CreateNodeOntologyDto(className));
        }

        const ontologyRelations: CreateRelationOntologyDto[] = [];
        for (const relation of relations) {
            if (
                !uniqueClasses.includes(relation.sourceRef) ||
                !uniqueClasses.includes(relation.targetRef)
            ) {
                continue;
            }

            ontologyRelations.push(
                new CreateRelationOntologyDto(
                    relation.sourceRef,
                    relation.targetRef,
                ),
            );
        }

        return new TurtleData(ontologyNodes, ontologyRelations);
    }
}
