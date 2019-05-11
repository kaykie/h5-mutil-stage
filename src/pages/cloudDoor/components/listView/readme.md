#### 1 对官方提供的listView做一层封装

---
#### 2 初始化参数
参数|说明|类型|可选值  
--|:--|--:|--:  
height|表示底部tabBar高度|NUM|默认100  
dataSource|需要渲染的数据|array|[]  
isLoading|第二次以后是否在加载中|boolean|false  
isEndLoading|第二次以后上拉是否在加载中|boolean|false  
isInitLoading|是否为第一次加载|boolean|false  
isInitError|第一次加载是否出错|boolean|false  
isError|第二次以后下拉是否有加载出错|boolean|false  
isEndError|第二次以后上拉是否有加载出错|boolean|false  
renderRow|列表需要展示的内容|reactNode|null  



---
#### 3 事件
事件名称|说明|参数  
--|:--|--:|--:  
onEndReached|到达底部时调用函数（即上拉刷新时）  
onRefresh|下拉刷新时调用函数


