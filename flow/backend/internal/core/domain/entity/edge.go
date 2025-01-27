package entity

type Point struct{}

type Edge struct {
	Id           int32
	SubFlowId    int32
	EdgeId       string
	SourceNodeId string
	TargetNodeId string
	Hidden       bool
	Points       []Point
}
