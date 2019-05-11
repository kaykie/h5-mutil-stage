import PubliceService from '../../../services/PubliceService';
import api from '../services/api/xnwApi';
import {Toast} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';
import moment from 'moment';

const history = createHashHistory();
export default {

  namespace: 'cloudDoor',

  state: {
    // 公共状态
    isLoading: false, // 第二次及以后下拉加载loading状态
    isEndLoading: false, // 第二次及以后上拉加载loading状态
    isInitLoading: false, // 是否为第一次加载 仅在第一次进入页面时修改此参数
    isInitError: false, // 第一次加载是否有报错 仅在第一次进入页面时修改此参数
    isError: false, // 下拉取列表时是否报错
    isEndError: false, // 上拉取列表时是否报错
    isDelVisible: false, // 是否弹出删除弹框
    isNoMoreData: false,// 是否有更多数据
    isSwiperOpen: false, // 页面中是否有向左滑动的动作

    // 以下为设备管理变量
    pageNo: 1,
    pageSize: 10,
    dataSource: [],
    status: '',
    uniqueDevice: {}, // 点击了哪个设备（用于删除，跳转设备详情 修改设备名称等）
    deviceSerialOrName: '', // 搜索结果
    isInitResult: false, // 是否输入搜索过内容 false为没有搜索过内容展示空白页面，true为搜索过内容

    // 以下为添加设备页面
    initialValueDeviceName: '',// 设备名称默认参数
    deviceNameError: '', // 错误信息
    addDeviceSerial: '', // 成功添加设备后需要保存的设备序列号


    // 以下为设备详情页面变量
    isRelation: false, // 是否切换到解决人员关联状态
    dataSourceRelation: [], // 人员关联列表
    pageNoRelation: 1,
    pageSizeRelation: 10,
    isShowRelation: false, // 是否展示解决关联按钮操作按钮
    uniquePerson: {}, // 点击了哪个人，为之后解除关联人员存储
    isFromDeviceDetail: true, // 否来自设备详情页面，为后面的修改设备名称作判断

    // 以下为事件查询
    pageNoEvent: 1,
    pageSizeEvent: 10,
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    personName: '', // 姓名查询
    dataSourceEvent: [],
    acsEventType: '', // 门禁事件类型,点击筛选 然后点击完成
    spreadList: [], // 哪些是展开的
    submitPersonName: '', // 点击搜索的时候需要保存的搜索名称,用来展示为红色
    searchType: 'acsEventName', // 当前是搜索事件还是人名
    isSearchSubmit: false, // 是否点击了搜索 搜索后把 查找包含 等置为空
  },

  effects: {
    * getInitDeviceList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitLoading: true, isInitError: false, pageNo: 1}});
      yield put({type: 'getDeviceList', payload: {isInit: true}});
    },

    // 页面下拉加载时调用接口，此函数可用于添加删除设备后调用
    * onRefreshInitDeviceList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNo: 1}});
      yield put({type: 'getDeviceList'});
    },

    // 设备列表上拉刷新 pageNo+1
    * endRefreshAllSearch({payload}, {put, call, select, take}) {
      const {pageNo, isNoMoreData} = yield select(({cloudDoor}) => cloudDoor);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNo: pageNo + 1}});
      yield put({type: 'getDeviceList', payload: {isEndRefresh: true}});
    },

    // 获取设备列表
    * getDeviceList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true}});
      }
      const {pageNo, pageSize, status, deviceSerialOrName} = yield select(({cloudDoor}) => cloudDoor),
        params = {pageNo, pageSize, status, deviceSerialOrName, model: 'DS-K1T'},
        res = yield call(api.getDeviceList, params);
      if (res.code === '200') {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'dataSource', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 添加搜索条件
    * searchDevice({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {status: payload.status}});
      yield put({type: 'onRefreshInitDeviceList'});
    },

    // 删除设备
    * delDevice({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isDelVisible: false}});
      const {uniqueDevice} = yield select(({cloudDoor}) => cloudDoor),
        params = {'deviceList[0].deviceSerial': uniqueDevice.deviceSerial},
        res = yield call(api.delDevice, params);
      if (res.code === '200') {
        Toast.info(res.msg);
        yield put({type: 'onRefreshInitDeviceList'});
      }
    },

    /* 以下为设备搜索结果页面*/
    * searchSubmit({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitResult: true, dataSource: [], status: ''}});
      yield put({type: 'onRefreshInitDeviceList'});
    },

    * searchChange({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {deviceSerialOrName:payload.deviceSerialOrName,}});
      yield put({type: 'searchSubmit'});
    },


    /* 以下为添加设备页面 */
    // 点击添加时如果有报错
    // * saveErrorInfo({payload}, {put, call, select}) {
    //   const {inputList} = yield select(({cloudDoor}) => cloudDoor);
    //   inputList.forEach(item => {
    //     if (payload.errors && payload.errors[item.key]) {
    //       item.error = payload.errors[item.key].errors[0].message;
    //     } else {
    //       item.error = '';
    //     }
    //   });
    //   yield put({type: 'save', payload: {inputList}});
    // },

    // 没有错误的时候调用保存接口
    * saveDevice({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isBtnLoading: true}});
      const params = payload.values,
        res = yield call(api.addDevice, params);
      if (res.code === '200') {
        yield put({
          type: 'save',
          payload: {addDeviceSerial: params.deviceSerial, isFromDeviceDetail: true, isBtnLoading: false}
        });
        history.push('/addDeviceName');
        // yield put({type: 'onRefreshInitDeviceList'});
      } else {
        yield put({type: 'save', payload: {isBtnLoading: false}});
      }
    },

    // 保存出错信息
    * saveErrorInfoName({payload}, {put, call, select}) {
      if (payload.errors && payload.errors.deviceName) {
        yield put({type: 'save', payload: {deviceNameError: payload.errors.deviceName.errors[0].message}});
      }
    },

    // 没有错误的时候调用保存接口
    * saveDeviceName({payload}, {put, call, select}) {
      const params = payload.values, {addDeviceSerial, initialValueDeviceName, uniqueDevice} = yield select(({cloudDoor}) => cloudDoor),
        res = yield call(api.saveDeviceName, {...params, deviceSerial: addDeviceSerial});
      if (res.code === '200') {
        Toast.info(res.msg);
        if (initialValueDeviceName) {
          history.goBack();
          uniqueDevice.deviceName = params.deviceName;
          yield put({
            type: 'save',
            payload: {
              initialValueDeviceName: '',
              isShowRelation: false,
              uniqueDevice: JSON.parse(JSON.stringify(uniqueDevice))
            }
          });
        } else {
          history.go(-2);
        }
        yield put({type: 'initDataAfterHandle'});
        yield put({type: 'onRefreshInitDeviceList'});
        // yield put({type: 'save', payload: {addDeviceSerial: params.deviceSerial}});
      }
    },


    /* 以下为设备详情页面*/
    * getInitRelation({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNoRelation: 1}});
      yield put({type: 'getRelationList'});
    },

    * getRelationList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true, isError: false, isEndError: false}});
      }
      // isNeedFace为后面新加参数，是否需要人脸下发成功
      const {uniqueDevice, pageNoRelation, pageSizeRelation} = yield select(({cloudDoor}) => cloudDoor),
        params = {
          deviceSerial: uniqueDevice.deviceSerial,
          pageNo: pageNoRelation,
          pageSize: pageSizeRelation,
          isNeedFace: 1
        },
        res = yield call(api.getRelationList, params);
      if (res.code === '200') {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'dataSourceRelation', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        if (payload && payload.isEndRefresh) {
          yield put({type: 'save', payload: {isEndError: true, dataSourceRelation: []}});
        } else {
          yield put({type: 'save', payload: {isError: true, isLoading: false, dataSourceRelation: []}});
        }
      }
    },

    // 设备详情页面人员上拉刷新 pageNo+1
    * endRefreshRelation({payload}, {put, call, select, take}) {
      const {pageNoRelation, isNoMoreData} = yield select(({cloudDoor}) => cloudDoor);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoRelation: pageNoRelation + 1, isEndLoading: true}});
      yield put({type: 'getRelationList', payload: {isEndRefresh: true}});
    },

    // 确认解决关联某一设备下的人员
    * resolveRelationConfirm({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isDelVisible: false}});
      const {uniquePerson, uniqueDevice} = yield select(({cloudDoor}) => cloudDoor),
        params = {personId: uniquePerson.person.id, deviceSerial: uniqueDevice.deviceSerial},
        res = yield call(api.resolveRelationPerson, params);
      if (res.code === '200') {
        const errorArray = res.data.filter(item => item.authorityStatus !== '1');
        // errorMessage = errorArray.reduce((pre, next) => {
        //   return pre + next.remarks + '<br/>';
        // }, '');
        if (errorArray && errorArray.length) {
          Toast.info(errorArray[0].remarks);
        } else {
          Toast.info(res.msg);
        }
        yield put({type: 'getInitRelation'});
      }
    },


    /* 以下为事件查询*/
    * getInitEventList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitLoading: true, isInitError: false, pageNoEvent: 1}});
      yield put({type: 'getEventList', payload: {isInit: true}});
    },

    // 页面下拉加载时调用接口
    * onRefreshInitEventList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNoEvent: 1}});
      yield put({type: 'getEventList'});
    },

    // 事件上拉刷新 pageNo+1
    * endRefreshEventList({payload}, {put, call, select, take}) {
      const {pageNoEvent, isNoMoreData} = yield select(({cloudDoor}) => cloudDoor);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoEvent: pageNoEvent + 1, isEndLoading: true}});
      yield put({type: 'getEventList', payload: {isEndRefresh: true}});
    },

    // 时间切换后 列表跟着改变
    * selectDateEvent({payload}, {put, call, select}) {
      yield put({type: 'save', payload});
      yield put({type: 'getEventList'});
    },

    * clearDate({payload}, {put, call, select}) {
      yield put({
        type: 'save', payload: {
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
      });
      yield put({type: 'getEventList'});
    },

    // 事件类型切换后 列表跟着改变
    * eventTypeSearch({payload}, {put, call, select}) {
      yield put({type: 'save', payload});
      yield put({type: 'getEventList'});
    },

    // 获取事件列表
    * getEventList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true}});
      }
      const {pageNoEvent, pageSizeEvent, startTime, endTime, personName, acsEventType, searchType} = yield select(({cloudDoor}) => cloudDoor),
        params = {
          pageNo: pageNoEvent,
          pageSize: pageSizeEvent,
          startTime,
          endTime,
          // [searchType === 'personName' ? 'persons[0].personName' :searchType]:personName,
          acsEventType,
          eventType: 'AccessControllerEvent',
          // acsEventType: '50001'
        };
      if (personName.length) {
        const type = searchType === 'personName' ? 'persons[0].personName' : searchType;
        params[type] = personName;
      }
      const res = yield call(api.getEventList, params);

      if (res.code === '200') {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'dataSourceEvent', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    * searchSubmitEvent({payload}, {put, call, select}) {
      const {personName} = yield select(({cloudDoor}) => cloudDoor);
      let searchType = '';
      if (payload && payload.searchType) {
        searchType = payload.searchType;
      } else {
        searchType = 'acsEventName';
      }
      yield put({
        type: 'save',
        payload: {isInitResult: true, submitPersonName: personName, searchType, isSearchSubmit: true}
      });
      yield put({type: 'onRefreshInitEventList'});
    },

    // 点击扩展按钮
    * spreadDetail({payload}, {put, call, select}) {
      let {spreadList} = yield select(({cloudDoor}) => cloudDoor);
      if (spreadList.includes(payload.id)) {
        spreadList = spreadList.filter(item => item !== payload.id);
      } else {
        spreadList.push(payload.id);
      }
      yield put({type: 'save', payload: {spreadList: JSON.parse(JSON.stringify(spreadList))}});
    },

    // 在搜索页面 点击取消返回主页面 需要重新加载数据
    * goBackFromSearch({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {personName: '', pageNo: 1}});
      // yield put({type: 'getInitEventList'});
    },


    /* 以下为公共使用方法*/
    * successHandle({payload}, {put, call, select}) {
      const {res, target, isEndRefresh} = payload, targetResult = yield select((state) => state.cloudDoor[target]);
      if(res.code === '200'){
        let dataSource = res.data || [];
        yield put({type: 'save', payload: {isNoMoreData: dataSource.length === 0}});
        if (isEndRefresh) {
          dataSource = [...targetResult, ...dataSource];
        }
        yield put({
          type: 'save',
          payload: {
            [target]: dataSource,
            isLoading: false
          }
        });
        yield put({type: 'initData'});
      }
    },

    * fetchDataError({payload}, {put, call, select}) {
      if (payload && payload.isInit) {
        yield put({type: 'save', payload: {isInitError: true, isInitLoading: false}});
      } else {
        if (payload && payload.isEndRefresh) {
          yield put({type: 'save', payload: {isEndError: true, isEndLoading: false}});
        } else {
          yield put({type: 'save', payload: {isError: true, isLoading: false}});
        }
      }
    },

    * initDataAfterHandle({payload}, {put}) {
      yield put({
        type: 'save',
        payload: {
          isInitLoading: false,
          isLoading: false,
          isDelVisible: false,
          pageNo: 1,
          pageNoRelation: 1,
          pageNoEvent: 1,
          addDeviceSerial: '',
          deviceNameError: '',
          isEndLoading: false,
          // spreadList: [],
          isShowRelation: false,
          isError: false,
          isEndError: false,
          isInitError: false
        }
      });
    },

    * initData({payload}, {put, call, select}) {
      yield put({
        type: 'save',
        payload: {
          isInitLoading: false,
          isLoading: false,
          isDelVisible: false,
          addDeviceSerial: '',
          isEndLoading: false,
          // spreadList: [],
          isShowRelation: false,
          isError: false,
          isEndError: false,
          isInitError: false
        }
      });
    },
  },

  reducers: {
    save(state, {payload}) {
      console.log(payload, 'reduce');
      return {...state, ...payload};
    }
  },

};
