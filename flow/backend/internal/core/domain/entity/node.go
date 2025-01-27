package entity

type Position struct {
	X int32
	Y int32
}

type Style struct {
	BgColor     string
	Color       string
	BorderStyle string
	BorderColor string
	Width       int32
	Height      int32
	Hidden      bool
}

type Node struct {
	Id        int32
	SubFlowId int32
	NodeId    string
	Kind      string
	Label     string
	GroupId   string
	Position  Position
	Style     Style
	Desc      string
}
