
import { ElDialog } from 'element-plus'
import { getCurrentInstance, h, render, VNode } from 'vue'

export function useDialog() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const current = getCurrentInstance()
  
  function mounted(opt: any) {
    const vnode = h(
      ElDialog,
      {
        modelValue: true,
        title: '默认弹框',
        closOnClickModal: false,
        ...opt.dialogProps,
        customClass: `app-custom_dialog ${opt.dialogProps.customClass || ''}`,
        onRemove: () => unmount(),
        'onUpdate:modelValue': (v: boolean) => {
          if (!v) {
            unmount()
          }
        }
      },
      {
        // ElDialog 默认插槽
        default: () =>
          h(opt.component, {
            ...opt.childrenProps,
            onRemove: () => {
              unmount()
            }
          }),
        ...opt.childrenSlot
      }
    )
    vnode.appContext = current?.appContext!
    render(vnode, div)
    return unmount
  }
  
  function unmount() {
    render(null, div)
  }
  
  return {
    mounted,
    unmount
  }
}
