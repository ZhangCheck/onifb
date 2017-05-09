# Frontend framework OniFB 

使用简单，作者是吃透了knockout, angular,rivets API设计出来，没有太多复杂的概念， 指令数量控制得当，基本能覆盖所有jQuery操作， 确保中小型公司的菜鸟前端与刚转行过来的后端也能迅速上手
兼容性好，支持IE6+，firefox3.5+, opera11+, safari5+, chrome4；飞博前端团队维护IE8+;
性能不错，由于avalon一直在那些上千的大表格里打滚，经历长期的优化， 它能支撑14000以上绑定（相对而言，angular一个页面只能放2000个绑定）
组件丰富，通过oniui的努力，加上飞博前端组的扩展，70多个控件可供选择使用，包含TreeGrid等复杂组件
MVVM机制，DOM操作的代码近乎绝迹，因此实现一个功能，大致把比jQuery所写的还要少50%，对ViewModel的操作都会同步到View与Model中去
易于维护，MVVM因其所有的Dom操作（属性，样式，事件）均绑定在Dom元素本身，非常容易定位问题所在，随着项目逐渐变大，这一点愈加明显，而Jquery对Dom的操作是游离的、无关联的，当一个Dom发生问题或者发生改变时，很难确定是由哪一段js操作的，即便在堪忧繁杂的js文件中找到一处，也很难确定是否还有另处操作同一个Dom。

----
see [Document](https://zhangcheck.github.io/onifb/)
