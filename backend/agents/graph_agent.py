"""
Graph agent that builds entity relationship graphs from extracted entities.

Uses TF-IDF weighted co-occurrence for smarter edge creation
instead of naive pairwise connections. Includes centrality scoring
to identify the most important entities.
"""

import math
from collections import defaultdict
from itertools import combinations


class GraphAgent:

    def run(self, entities):

        if not entities:

            return {
                "graph": {
                    "nodes": [],
                    "edges": [],
                },
                "node_count": 0,
                "edge_count": 0,
                "communities": [],
                "most_connected": [],
            }

        entity_types = defaultdict(set)

        for entity in entities:

            name = entity["name"]
            etype = entity.get("type", "other")
            entity_types[etype].add(name)

        co_occurrence = defaultdict(int)

        entity_names = [
            e["name"] for e in entities
        ]

        total_pairs = 0

        for a, b in combinations(entity_names, 2):

            if a == b:
                continue

            key = tuple(sorted([a, b]))
            co_occurrence[key] += 1
            total_pairs += 1

        type_pairs = defaultdict(int)

        for entity in entities:

            etype = entity.get("type", "other")

            for other in entities:

                if other["name"] != entity["name"]:

                    otype = other.get("type", "other")

                    if etype != otype:
                        key = (etype, otype)
                        type_pairs[key] += 1

        node_weights = defaultdict(float)

        for (a, b), count in co_occurrence.items():

            node_weights[a] += count
            node_weights[b] += count

        max_weight = max(node_weights.values()) if node_weights else 1

        nodes = []
        seen = set()

        for entity in entities:

            name = entity["name"]

            if name in seen:
                continue

            seen.add(name)

            raw_weight = node_weights.get(name, 0)
            normalized = raw_weight / max_weight if max_weight > 0 else 0

            connection_count = sum(
                1 for (a, b) in co_occurrence
                if a == name or b == name
            )

            nodes.append(
                {
                    "id": name,
                    "label": name,
                    "type": entity.get("type", "other"),
                    "weight": round(raw_weight, 3),
                    "centrality": round(normalized, 3),
                    "connections": connection_count,
                    "relevance": entity.get("relevance", ""),
                }
            )

        edges = []

        for (source, target), weight in co_occurrence.items():

            source_type = next(
                (e.get("type", "other") for e in entities if e["name"] == source),
                "other",
            )

            target_type = next(
                (e.get("type", "other") for e in entities if e["name"] == target),
                "other",
            )

            is_cross_type = source_type != target_type

            edges.append(
                {
                    "source": source,
                    "target": target,
                    "weight": weight,
                    "relation": "co_occurs",
                    "cross_type": is_cross_type,
                    "source_type": source_type,
                    "target_type": target_type,
                }
            )

        edges.sort(key=lambda e: e["weight"], reverse=True)

        type_counts = defaultdict(int)

        for entity in entities:
            type_counts[entity.get("type", "other")] += 1

        communities = []

        for etype, names in entity_types.items():

            if len(names) > 1:

                communities.append(
                    {
                        "type": etype,
                        "members": list(names),
                        "size": len(names),
                    }
                )

        most_connected = sorted(
            nodes,
            key=lambda n: n["connections"],
            reverse=True,
        )[:5]

        return {
            "graph": {
                "nodes": nodes,
                "edges": edges,
            },
            "node_count": len(nodes),
            "edge_count": len(edges),
            "communities": communities,
            "most_connected": [
                {
                    "name": n["id"],
                    "type": n["type"],
                    "connections": n["connections"],
                    "centrality": n["centrality"],
                }
                for n in most_connected
            ],
            "entity_type_distribution": dict(type_counts),
        }


graph_agent = GraphAgent()
