import { isValidElement as isValidNervElement, VType, isComponent } from 'nerv-shared'
import { nextTick } from 'nerv-utils'
import { render } from './render'
import { unmount } from './vdom/unmount'
import createElement from './create-element'
import Component from './component'

export function unmountComponentAtNode (dom) {
  const component = dom._component
  if (isValidNervElement(component)) {
    unmount(component, dom)
    delete dom._component
    return true
  }
  return false
}

export function findDOMNode (component) {
  return (isComponent(component) ? component.vnode.dom : component.dom) || component
}

export function createFactory (type) {
  return createElement.bind(null, type)
}

class WrapperComponent<P, S> extends Component<P, S> {
  getChildContext () {
    // tslint:disable-next-line
    return this.props.context
  }

  render () {
    return this.props.children
  }
}

export function unstable_renderSubtreeIntoContainer (
  parentComponent,
  vnode,
  container,
  callback
) {
  // @TODO: should handle props.context?
  const wrapper = createElement(
    WrapperComponent,
    { context: parentComponent.context },
    vnode
  )
  const rendered = render(wrapper as any, container)
  if (callback) {
    callback.call(rendered)
  }
  return rendered
}

export function isValidElement (element) {
  return (
    isValidNervElement(element) && (element.vtype & (VType.Composite | VType.Node)) > 0
  )
}

export const unstable_batchedUpdates = nextTick
