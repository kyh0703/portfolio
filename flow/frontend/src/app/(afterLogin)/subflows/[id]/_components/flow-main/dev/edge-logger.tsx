import { useEdges } from '@xyflow/react'

export default function EdgeLogger() {
  const edges = useEdges()

  return (
    <div className="react-flow__devtools-Edgechangelogger absolute right-0 top-10 text-xs">
      <div className="react-flow__devtools-title">🏷️Edge Logger🏷️</div>
      <div>총개수: {edges.length}</div>
      <div>
        {edges.map((edge) => (
          <div key={edge.id}>
            {edge.source} → {edge.target}
          </div>
        ))}
      </div>
    </div>
  )
}
