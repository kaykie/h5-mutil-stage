#### 1 对官方提供的listView做一层封装

---
#### 2 初始化参数
参数|说明|类型|可选值
height|表示容器的高度|NUM|默认85
dataSource|需要渲染的数据|array|[]
isNoMoreData|是否有更多的数据,用来展示上拉时最下面是否还有更多的数据|boolean|false,false表示还有更多数据，true为没有更多数据
isLoading|是否在加载中|boolean|false
---
#### 3 事件
事件名称|说明|参数
onEndReached|到达底部时调用函数（即上拉刷新时）
onRefresh|下拉刷新时调用函数
