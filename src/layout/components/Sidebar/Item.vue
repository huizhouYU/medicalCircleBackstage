<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      }else if(icon.includes('&#')) {
        // console.log("icon:",icon)
        var iconSting = icon.replace('&#',"")
        // console.log("iconSting:",iconSting)
       vnodes.push(<svg-icon icon-class='recruit' class="sort-icon" />)
      } else {
        // vnodes.push(<svg-icon icon-class={icon}/>)
        vnodes.push(<icon theme='filled' size="14" class='icon-public-margin'/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title' class='mean-title'>{(title)}</span>) 
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.sort-icon{
  color: inherit;
  margin-right:6px !important;
  font-size: 18px;
  padding-top: 2px;
  vertical-align: -5px !important;
}
.icon-public-margin{
  margin-right: 10px;
}
</style>
