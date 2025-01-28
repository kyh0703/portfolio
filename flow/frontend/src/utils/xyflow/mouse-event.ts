export function isTargetPane(event: MouseEvent | React.MouseEvent) {
  const classList = (event.target as HTMLElement)?.classList
  return classList.contains('react-flow__pane')
}

export function isTargetGroup(event: MouseEvent | React.MouseEvent) {
  const classList = (event.target as HTMLElement)?.classList
  return classList.contains('react-flow__group')
}

export function isTargetMemo(event: MouseEvent | React.MouseEvent) {
  const classList = (event.target as HTMLElement)?.classList
  return classList.contains('react-flow__memo')
}

export function isAllowTarget(event: MouseEvent | React.MouseEvent) {
  return isTargetPane(event) || isTargetGroup(event) || isTargetMemo(event)
}
