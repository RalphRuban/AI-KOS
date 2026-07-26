from collections import defaultdict
from itertools import combinations

from db.chroma_client import get_collection


class RelationshipGraphAgent:

    def run(self, doc_id: str):

        collection = get_collection()

        result = collection.get(
            where={
                "doc_id": doc_id
            },
            include=[
                "metadatas"
            ]
        )

        metadatas = result.get(
            "metadatas",
            []
        )

        if not metadatas:

            return {
                "nodes": [],
                "edges": [],
                "node_count": 0,
                "edge_count": 0
            }

        entities = metadatas[0].get(
            "keywords",
            {}
        ).get(
            "entities",
            []
        )

        if not entities:

            return {
                "nodes": [],
                "edges": [],
                "node_count": 0,
                "edge_count": 0
            }

        nodes = []

        seen = set()

        for entity in entities:

            name = entity["name"]

            if name not in seen:

                seen.add(name)

                nodes.append(
                    {
                        "id": name,
                        "label": name,
                        "type": entity["type"]
                    }
                )

        edge_weights = defaultdict(int)

        entity_names = [
            entity["name"]
            for entity in entities
        ]

        for a, b in combinations(entity_names, 2):

            key = tuple(sorted([a, b]))

            edge_weights[key] += 1

        edges = []

        for (source, target), weight in edge_weights.items():

            edges.append(
                {
                    "source": source,
                    "target": target,
                    "weight": weight
                }
            )

        return {
            "nodes": nodes,
            "edges": edges,
            "node_count": len(nodes),
            "edge_count": len(edges)
        }


relationship_graph_agent = RelationshipGraphAgent()
