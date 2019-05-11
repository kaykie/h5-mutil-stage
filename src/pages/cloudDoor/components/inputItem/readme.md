#### 1 对官方提供的inputItem做一层封装

---
#### 2 初始化参数
参数|说明|类型|可选值  
--|:--|--:|--:  
dataSource|需要渲染的inputItem|array|格式例子 [{
                                                    label: '设备序列号',
                                                    placeholder: '请输入设备序列号',
                                                    initialValue: '',
                                                    key: 'deviceSerial',
                                                    rules: [
                                                      {required: true, message: '请输入设备序列号'},
                                                      {pattern: /[0-9A-Z]{9}/, message: '设备序列号只能为9位的大写字母或数字'}
                                                    ],
                                                    error: ''
                                                  }]



---
####3 获取里面数据方式
在父组件 添加属性 获取此组件实例：wrappedComponentRef={ref => this.myInputItem = ref}
然后调用实例方法this.myInputItem.myValidateFields((obj)=>{  
              // obj 即为输入的数据  
             });


