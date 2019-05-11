import PubliceService from '../../../services/PubliceService';
import api from '../../../services/api/index';
import {Toast, ListView} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();
export default {

  namespace: 'faceApp',

  state: {
    selectedTab: 'faceArea', // 最下面tab标签选中哪个
    isBtnLoading: false,

    alertInstance: null,// 弹出确认框
    // 获取组件应用参数
    pageSize: 15,
    pageNo: 1,
    startTime: '',
    endTime: '',
    applicationList: [], // 应用原始数据
    isLoadingFace: false,
    isNoMoreData: false, // 没有更多的应用数据
    uniqueApplication: {}, // 点击了哪个应用
    isEdit: false,// 是否是编辑操作  false为添加区域操作

    // 添加组件应用参数
    applicationName: '', // 应用名称即区域名称
    score: '', // 阈值

    // 获取设备时参数
    // deviceList:[{key:1}], // 添加设备时，一共添加了几个可选
    pageNoDevice: 1,
    pageSizeDevice: 15,
    deviceOriginList: [],// 设备列表源数据
    dataSourceDevice: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),

    // 获取所有设备列表时参数
    pageNoAllDevice: 1,
    pageSizeAllDevice: 15,
    allDeviceOriginList: [],
    selectDevice: [], // 复选框勾选的设备

    // 人脸检索相关参数
    imgFiles: [],
    isFromSearch: false, // 跳转是否来自人脸检索页面
    scoreSearch: '',
    startTimeSarch: '',
    endTimeSarch: '',
    pageNoSearch: 1,
    pageSizeSearch: 15,
    resultList: [],// 点击检索后返回的结果列表
    resultParams: {}, // 用来保存人脸检索条件
    resultDetailList: [], // 用来保存结果详情页面相关数据
    uniqueDetail: {}, // 用来保存展示当前哪张图片
    pageNoDetail: 1,
    pageSizeDetail: 10,
    uniqueIndex: 0, // 当前图片的索引到需要加载下一页图片时需要设置
    resultDetailTotal: 0, // 结果一共有多少条
    index: 0,// 滑到哪张图片了
  },

  effects: {

    * getApplicationList({payload}, {put, take, select, call}) {
      if (!payload) {
        yield put({type: 'save', payload: {isLoadingFace: true}});
      }
      const {pageSize, pageNo, startTime, endTime, applicationList} = yield select(({faceApp}) => faceApp),
        params = {endTime, pageNo, pageSize, startTime};
      try {
        const res = yield call(api.getList, params);
        // let dataSource = [];
        if (res.code === '200') {
          yield put({
            type: 'successHandle',
            payload: {res, target: 'applicationList', isEndRefresh: !!(payload && payload.isEndRefresh)}
          });
          // if (res.data && res.data.length === 0) {
          //   yield put({type: 'save', payload: {isNoMoreData: true}});
          // }
          // dataSource = res.data;
          // if (payload && payload.isEndRefresh) {
          //   dataSource = [...applicationList, ...dataSource];
          // }
          //
          // yield put({
          //   type: 'save',
          //   payload: {
          //     applicationList: dataSource,
          //     isLoadingFace: false
          //   }
          // });
        }else{
          yield put({type:'save',payload:{isLoadingFace:false}})
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }

    },

    // 下拉刷新 重置pageNo
    * topRefresh({payload}, {put, call, select, take}) {
      yield put({type: 'save', payload: {pageNo: 1, isNoMoreData: false}});
      yield put({type: 'getApplicationList'});
    },
    // 上拉刷新 pageNo+1
    * endRefresh({payload}, {put, call, select, take}) {
      const {pageNo, isNoMoreData} = yield select(({faceApp}) => faceApp);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNo: pageNo + 1}});
      yield put({type: 'getApplicationList', payload: {isEndRefresh: true}});
    },
    // 保存一个应用
    * saveArea({payload}, {put, call, select, take}) {
      const {score, applicationName, isEdit, uniqueApplication} = yield select(({faceApp}) => faceApp);
      try {
        let res = {};
        const params = {applicationName, score};
        if (isEdit) {
          res = yield call(api.editArea, {...params, id: uniqueApplication.id});
        } else {
          res = yield call(api.addArea, params);
        }
        if (res.code === '200') {
          Toast.success(res.msg);
          yield put({type: 'initData'});
          history.goBack();
        }
      } catch (e) {
        console.log(e);
      }

    },

    // 删除一个应用
    * delArea({payload}, {take, select, put, call}) {
      const {uniqueApplication} = yield select(({faceApp}) => faceApp),
        params = {id: uniqueApplication.id};
      try {
        const res = yield call(api.delArea, params);
        if (res.code === '200') {
          Toast.success(res.msg);
          yield put({type: 'topRefresh'});
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },

    // 编辑一个应用
    * editArea({payload}, {select, put}) {
      const {uniqueApplication} = yield select(({faceApp}) => faceApp);
      yield put({
        type: 'save',
        payload: {applicationName: uniqueApplication.applicationName, score: uniqueApplication.score, isEdit: true}
      });
    },

    // 时间筛选条件
    * dateChange({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {startTime: payload.start_date, endTime: payload.end_date, pageNo: 1}});
      yield put({type: 'getApplicationList'});
    },


    /* 以下设备相关 */
    // 添加一组
    // *addDelhandle({payload},{put,call,select}){
    //   const {deviceList} = yield select(({faceApp}) => faceApp);
    //   if(deviceList.length === 1 && payload.type === 'del'){
    //     Toast.info('最后一组了,不能再删除了!');
    //     return;
    //   }
    //   if(payload.type === 'add'){
    //     const key = deviceList[deviceList.length - 1].key + 1,
    //       obj = {key};
    //     deviceList.push(obj);
    //   }else{
    //     deviceList.pop();
    //   }
    //   yield put({type:'save',payload:{deviceList:JSON.parse(JSON.stringify(deviceList))}});
    // },

    * getDeviceList({payload}, {put, call, select}) {
      if (!payload) {
        yield put({type: 'save', payload: {isLoadingFace: true}});
      }
      const {pageNoDevice, pageSizeDevice, uniqueApplication, deviceOriginList} = yield select(({faceApp}) => faceApp),
        params = {pageNo: pageNoDevice, pageSize: pageSizeDevice, id: uniqueApplication.id};
      try {
        const res = yield call(api.getDeviceList, params);
        // let dataSource = [];
        if (res.code === '200') {
          yield put({
            type: 'successHandle',
            payload: {res, target: 'deviceOriginList', isEndRefresh: !!(payload && payload.isEndRefresh)}
          });

          // yield put({type: 'save', payload: {isNoMoreData: res.data.length === 0}});
          // yield put({
          //   type: 'save',
          //   payload: {
          //     isLoadingFace: false
          //   }
          // });
          // dataSource = res.data;
          // if (payload && payload.isEndRefresh) {
          //   dataSource = [...deviceOriginList, ...dataSource];
          // }
          // yield put({
          //   type: 'save',
          //   payload: {
          //     deviceOriginList: dataSource,
          //   }
          // });
        }else{
          yield put({type:'save',payload:{isLoadingFace:false}});
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }

    },

    // 下拉刷新 重置pageNo
    * topRefreshDevice({payload}, {put, call, select, take}) {
      yield put({type: 'save', payload: {pageNoDevice: 1, isNoMoreData: false}});
      yield put({type: 'getDeviceList'});
    },
    // 上拉刷新 pageNo+1
    * endRefreshDevice({payload}, {put, call, select, take}) {
      const {pageNoDevice, isNoMoreData} = yield select(({faceApp}) => faceApp);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoDevice: pageNoDevice + 1}});
      yield put({type: 'getDeviceList', payload: {isEndRefresh: true}});
    },
    * delDevice({payload}, {put, call, select, take}) {
      const {uniqueApplication} = yield select(({faceApp}) => faceApp),
        {item} = payload, params = {
          id: uniqueApplication.id,
          device: `${item.deviceSerial}#${item.channelNo}`
        };
      try {
        const res = yield call(api.delDevice, params);
        if (res.code === '200') {
          Toast.success(res.msg);
          yield put({type: 'save', payload: {pageNoDevice: 1}});
          yield put({type: 'getDeviceList'});
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },


    // 以下为所有设备列表页面

    // 获取所有设备列表
    * getAllDeviceList({payload}, {put, call, select, take}) {
      if (!payload) {
        yield put({type: 'save', payload: {isLoadingFace: true}});
      }
      const {pageNoAllDevice, pageSizeAllDevice, allDeviceOriginList} = yield select(({faceApp}) => faceApp),
        params = {pageNo: pageNoAllDevice, pageSize: pageSizeAllDevice};
      try {
        const res = yield call(api.getAllDeviceList, params);
        yield put({
          type: 'save',
          payload: {
            isLoadingFace: false
          }
        });
        if (res.code === '200') {
          yield put({
            type: 'successHandle',
            payload: {res, target: 'allDeviceOriginList', isEndRefresh: !!(payload && payload.isEndRefresh)}
          });
        }else{
          yield put({type:'save',payload:{isLoadingFace:false}});
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },

    // 下拉刷新 重置pageNo
    * topRefreshAllDevice({payload}, {put, call, select, take}) {
      yield put({type: 'save', payload: {pageNoAllDevice: 1, isNoMoreData: false}});
      yield put({type: 'getAllDeviceList'});
    },
    // 上拉刷新 pageNo+1
    * endRefreshAllDevice({payload}, {put, call, select, take}) {
      const {pageNoAllDevice, isNoMoreData} = yield select(({faceApp}) => faceApp);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoAllDevice: pageNoAllDevice + 1}});
      yield put({type: 'getAllDeviceList', payload: {isEndRefresh: true}});
    },

    // 选择一个设备
    * checkBoxChange({payload}, {put, take, select, call}) {
      const {selectDevice} = yield select(({faceApp}) => faceApp),
        {item, boolean} = payload;
      if (boolean) {
        selectDevice.push(item);
      } else {
        selectDevice.filter(data => data.id !== item.id);
      }
      yield put({type: 'save', payload: {selectDevice: JSON.parse(JSON.stringify(selectDevice))}});
    },

    // 保存设备列表
    * saveDevice({payload}, {put, call, select, take}) {
      // const {deviceList,uniqueApplication} = yield select(({faceApp}) => faceApp),obj = payload.obj,
      //   deviceArray = [];
      // deviceList.forEach(item =>{
      //   // eslint-disable-line
      //   const str = obj[`deviceSerial${item.key}`] + '#' +obj[`channelNo${item.key}`];
      //   deviceArray.push(str);
      // });
      // const params = {
      //   device:deviceArray.join(','),
      //   id:uniqueApplication.id
      // };
      const {selectDevice, uniqueApplication} = yield select(({faceApp}) => faceApp), deviceArray = [];
      if (selectDevice.length === 0) {
        Toast.info('未选择设备,请勾选设备!');
        return;
      }
      selectDevice.forEach(item => {
        deviceArray.push(`${item.deviceSerial}#1`);
      });
      const params = {
        device: deviceArray.join(','),
        id: uniqueApplication.id
      };
      try {
        const res = yield call(api.addDevice, params);
        if (res.code === '200') {
          Toast.success(res.msg);
          history.goBack();
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },


    /* 以下为人脸检索相关 */

    * areaChange({payload}, {put, call, select}) {
      const {applicationList} = yield select(({faceApp}) => faceApp);
      yield put({
        type: 'save',
        payload: {
          uniqueApplication: payload.uniqueApplication,
          applicationList: JSON.parse(JSON.stringify(applicationList))
        }
      });
    },

    * selectDevice({payload}, {put, call, select}) {
      const {uniqueApplication} = yield select(({faceApp}) => faceApp);
      if (!uniqueApplication.id) {
        Toast.info('请先选择区域!');
        return;
      }
      yield put({type: 'save', payload: {isFromSearch: true, pageNoDevice: 1, selectDevice: []}});
      history.push('/deviceList');
    },


    * faceSearch({payload}, {put, call, select}) {
      const {uniqueApplication, imgFiles} = yield select(({faceApp}) => faceApp);
      if (imgFiles.length === 0) {
        Toast.info('未选择图片!');
        return;
      }
      if (!uniqueApplication.applicationName) {
        Toast.info('未选择区域!');
        return;
      }
      yield put({type: 'getSearchResult'});
    },


    // 获取结果页面
    * getSearchResult({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isLoadingFace: true, isBtnLoading: true}});
      const {imgFiles, selectDevice, startTimeSarch, endTimeSarch, scoreSearch, uniqueApplication} = yield select(({faceApp}) => faceApp),
        deviceArray = [];
      selectDevice.forEach(item => {
        deviceArray.push(`${item.deviceSerial}#1`);
      });
      const base642 = yield call(PubliceService.getImgBase64, imgFiles[0].file);
      const resultParams = {
        startTime: startTimeSarch,
        endTime: endTimeSarch,
        score: scoreSearch,
        device: deviceArray.join(','),
        applicationId: uniqueApplication.id,
        // applicationId: 20,
        dataType: 2,
        image:encodeURIComponent(base642.split(',')[1]),
        // image: 'FACE1f4a59e3H50eaI4053K8e19H879fc6b6d42a',
      };
      const res2 = yield call(api.search, resultParams);
      if (res2.code === '200') {
        yield put({
          type: 'successHandle',
          payload: {res: res2, target: 'resultList', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
        // yield put({type: 'save', payload: {isNoMoreData: res.data.length === 0}});
        // dataSource = res.data;
        // if (payload && payload.isEndRefresh) {
        //   dataSource = [...resultList, ...dataSource];
        // }
        // yield put({
        //   type: 'save',
        //   payload: {
        //     resultList: dataSource,
        //     isLoadingFace: false
        //   }
        // });
        history.push('/resultList');
        yield put({type: 'save', payload: {isBtnLoading: false, isLoadingFace: false, resultParams}});
      }else{
        yield put({type:'save',payload:{isLoadingFace:false}});
      }


      // const base64 = imgFiles[0].url.split(',')[1], params = {
      //   // startTime: startTimeSarch,
      //   // endTime: endTimeSarch,
      //   // score: scoreSearch,
      //   // device: deviceArray.join(','),
      //   // applicationId: uniqueApplication.id,
      //   // applicationId: 20,
      //   dataType: 1,
      //   // dataType: 2,
      //   image: encodeURIComponent(base642.split(',')[1]),
      //   // image: 'FACE1f4a59e3H50eaI4053K8e19H879fc6b6d42a',
      // };
      // // try {
      // const res = yield call(api.getFaceToken, params);
      // let image = '';
      // if(res.data && res.data.faces){
      //   image = res.data.faces[0].faceToken;
      // }else {
      //   Toast.fail('获取人脸信息失败!');
      // }
      // if (res.code === '200') {
      //
      //
      // }
      yield put({type: 'save', payload: {isBtnLoading: false, isLoadingFace: false}});
      // } catch (e) {
      //   yield put({type: 'save', payload: {isBtnLoading: false, isLoadingFace: false}});
      //   Toast.fail('请稍后重试!');
      // }
    },

    // 下拉刷新 重置pageNo
    * topRefreshAllSearch({payload}, {put, call, select, take}) {
      yield put({type: 'save', payload: {pageNoSearch: 1, isNoMoreData: false}});
      yield put({type: 'getSearchResult'});
    },
    // 上拉刷新 pageNo+1
    * endRefreshAllSearch({payload}, {put, call, select, take}) {
      const {pageNoSearch, isNoMoreData} = yield select(({faceApp}) => faceApp);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoSearch: pageNoSearch + 1}});
      yield put({type: 'getSearchResult', payload: {isEndRefresh: true}});
    },

    /* 以下为结果详情页面 */

    // 点击某一条结果时,跳转到详情页面
    * readResultDetail({payload}, {put, call, select}) {
      const {resultParams, pageNoDetail, pageSizeDetail} = yield select(({faceApp}) => faceApp);
      resultParams.device = payload.item.device;
      resultParams.pageNo = pageNoDetail;
      resultParams.pageSize = pageSizeDetail;
      try {
        const res = yield call(api.faceDetail, resultParams);
        if (res.code === '200') {
          yield put({
            type: 'successHandle',
            payload: {res, target: 'resultDetailList', isEndRefresh: !!(payload && payload.isEndRefresh)}
          });
          yield put({type: 'save', payload: {uniqueDetail: res.data[0], index: 1, resultDetailTotal: res.page.total}});
          history.push('/resultDetail');
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },

    // 点击某一张图片时 切换图片
    * afterChangeImage({payload}, {put, call, select}) {
      const {resultDetailList, uniqueIndex} = yield select(({faceApp}) => faceApp), {index} = payload;
      yield put({type: 'save', payload: {uniqueDetail: resultDetailList[index], index: index + 1}});
      if (index === resultDetailList.length - 2 && uniqueIndex !== index) {
        yield put({type: 'endRefreshAllDetail'});
        yield put({type: 'save', payload: {uniqueIndex: index}});
      }

    },

    // 上拉刷新 pageNo+1
    * endRefreshAllDetail({payload}, {put, call, select, take}) {
      const {pageNoDetail, isNoMoreData, resultParams} = yield select(({faceApp}) => faceApp);
      if (isNoMoreData) {
        return;
      }
      resultParams.pageNo = pageNoDetail + 1;
      try {
        const res = yield call(api.faceDetail, resultParams);
        if (res.code === '200') {
          yield put({
            type: 'successHandle',
            payload: {res, target: 'resultDetailList', isEndRefresh: true}
          });
          yield put({type: 'save', payload: {pageNoDetail: resultParams.pageNo}});
        } else {
          yield put({type: 'save', payload: {uniqueIndex: 0}});
        }
      } catch (e) {
        Toast.fail('请稍后重试!');
      }
    },


    * successHandle({payload}, {put, call, select}) {
      const {res, target, isEndRefresh} = payload, targetResult = yield select((state) => state.faceApp[target]);
      let dataSource = [];
      yield put({type: 'save', payload: {isNoMoreData: res.data.length === 0}});
      dataSource = res.data;
      if (isEndRefresh) {
        dataSource = [...targetResult, ...dataSource];
      }
      yield put({
        type: 'save',
        payload: {
          [target]: dataSource,
          isLoadingFace: false
        }
      });
    },

    // 初始化数据
    * initData({payload}, {put, select}) {
      const {alertInstance} = yield select(({faceApp}) => faceApp);
      if (alertInstance) {
        alertInstance.close();
      }
      yield put({
        type: 'save',
        payload: {
          isEdit: false,
          applicationName: '',
          alertInstance: null,
          pageNo: 1,
          pageNoAllDevice: 1,
          pageNoDevice: 1,
          score: '',
          uniqueApplication: {},
          isNoMoreData: false,
          isFromSearch: false,
          selectDevice: [],
          isBtnLoading: false,
          startTimeSarch: '',
          endTimeSarch: '',
          scoreSearch: '',
          imgFiles: [],
          pageNoSearch: 1,
        }
      });

    },

    * fetch({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save'});
    },
  },

  reducers: {
    save(state, {payload}) {
      console.log(payload, 'reduce');
      return {...state, ...payload};
    }
  },

};
