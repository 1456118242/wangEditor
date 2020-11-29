import $, { DomElement } from '../../utils/dom-core'
import BtnMenu from '../menu-constructors/BtnMenu'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import { createTodo, isAllTodo } from './create-todo-node'
import bindEvent from './bind-event'

class Todo extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu">
                    <i class="w-e-icon-quotes-left"></i>
                </div>`
        )
        super($elem, editor)
        bindEvent(editor)
    }

    /**
     * 点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        if (!isAllTodo(editor)) {
            // 设置todolist
            this.setTodo()
            this.active()
        } else {
            // 取消设置todolist
            this.cancelTodo()
            this.unActive()
        }
    }
    tryChangeActive() {
        if (isAllTodo(this.editor)) {
            this.active()
        } else {
            this.unActive()
        }
    }

    /**
     * 设置todo
     */
    private setTodo() {
        const editor = this.editor
        const topNodeElem: DomElement[] = editor.selection.getSelectionRangeTopNodes(editor)
        topNodeElem.forEach($node => {
            const nodeName = $node?.getNodeName()
            if (nodeName === 'P') {
                const img = $node.children()?.get() as DomElement
                // 对于图片进行特殊处理
                if (img?.length > 0 && img?.getNodeName() === 'IMG') {
                    return
                }
                const todoNode = createTodo($node)
                const child = todoNode.children()?.getNode() as Node
                todoNode.insertAfter($node)
                todoNode.text() === ''
                    ? editor.selection.moveCursor(child, 1)
                    : editor.selection.moveCursor(child)
                $node.remove()
            }
        })
    }

    /**
     * 取消设置todo
     */
    private cancelTodo() {
        const editor = this.editor
        const $topNodeElems: DomElement[] = editor.selection.getSelectionRangeTopNodes(editor)

        $topNodeElems.forEach($topNodeElem => {
            const content = $topNodeElem.childNodes()?.childNodes()?.getNode(1)
            const $p = $(`<p></p>`)
            if (content?.nodeType === 3) {
                $p.text(content.nodeValue as string)
            } else {
                const $content = $(content)
                $p.append($content)
            }
            $p.insertAfter($topNodeElem)
            editor.selection.moveCursor($p.getNode())
            $topNodeElem.remove()
        })
    }
}

export default Todo
