import { auth } from './classes/sync'
import Template from './template'
import Example from './example'
import Try1 from './try1'

if (window.location.hash === '#start') {
  const template = new Template()
  const try1 = new Try1()
  // const example = new Example()
} else {
  auth()
}