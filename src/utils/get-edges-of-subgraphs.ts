import Graph, { Edge } from "./graph";

function getEdgesOfSubgraphs(subgraphs: Edge[][], graph: Graph) {
    const edges: [number, number][][] = [];

    subgraphs.forEach(component => {
        edges.push([] as [number, number][]);
        const vertices = getVerticesFromBiconnectedComponent(component);
        vertices.forEach(vertex => {
            const adjacents = graph.adj[vertex];
            for (const adj of adjacents) {
                if (vertex <= adj && vertices.has(adj)) {
                    edges[edges.length - 1].push([vertex, adj]);
                }
            }
        });
    });
    return edges;
}

function getVerticesFromBiconnectedComponent(component: Edge[]) {
    const vertices = new Set<number>();
    component.forEach(edge => {
        vertices.add(edge.u);
        vertices.add(edge.v);
    });
    return vertices;
}

export default getEdgesOfSubgraphs;
