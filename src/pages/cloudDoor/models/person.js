import personProvider from '../services/api/personProvider';
import {Toast} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();
export default {

  namespace: 'person',

  state: {
    // 公共状态
    isLoading: false, // 第二次及以后下拉加载loading状态
    isEndLoading: false, // 第二次及以后上拉加载loading状态
    isInitLoading: false, // 是否为第一次加载 仅在第一次进入页面时修改此参数
    isInitError: false, // 第一次加载是否有报错 仅在第一次进入页面时修改此参数
    isError: false, // 下拉取列表时是否报错
    isEndError: false, // 上拉取列表时是否报错
    isNoMoreData: false,// 是否有更多数据
    isInitResult: false, // 是否输入搜索过内容 false为没有搜索过内容展示空白页面，true为搜索过内容
    btnLoading: false, // 按钮状态，false正常状态，true为提交中状态

    // 人员列表
    pageNo: 1,
    pageSize: 10,
    dataSource: [], // 人员列表
    personName: null, // 人员名称搜索名称
    currentPerson: {}, // 当前操作人员（查看详情/删除人员）
    isDelVisible: false, // 是否弹出删除弹框

    // 权限下发人员
    permissionPerson: {}, // 权限下发人员
    permissionDevice: {}, // 权限下发人员
    permissionLoading: false, // 下发loading是否关闭，false不关闭，true关闭

    // 人员详情
    detailIsOperate: true, // 人员详情是否展示操作按钮
    initPersonName: '', // 人员默认名称
    initPhoneNumber: '', // 人员默认手机号码
    initGender: '', // 人员默认性别
    initPersonNative: '', // 人员默认籍贯
    initCertificateType: '', // 人员默认证件类型
    initCertificateNumber: '', // 人员默认证件号码
    personInfo: {}, // 人员详情
    personRelationDevice: [], // 人员关联设备列表
    personRelationStatus: 'loading', // 人员关联设备列表加载状态

    // 添加人员
    pageType: '', // 信息页面是从添加进入还是编辑进入（add/update）
    addPerson: {},// 成功添加设备后需要保存的人员id

    // 编辑人员
    updatePerson: {}, // 当前编辑人员

    // 上传照片
    uploadPerson: {}, // 当前上传图片人员
    uploadFiles: '', // 上传照片暂存
    isSelectDialog: false, // 是否弹出选择弹窗

    // 信息正在保存弹窗
    isSyncVisible: false, // 是否弹出信息同步弹窗
    isStartCountdown: false, // 按钮是否开始倒计时
    isLookOver: false, // 是否可点击查看结果按钮

    // 信息同步
    updateInfoPerson: {}, // 当前同步信息人员信息
    dataSourceMsg: [], // 信息同步列表
    pageNoMsg: 1,
    pageSizeMsg: 10,
    personMsgList: [], // 个人信息同步列表
    pageNoPersonMsg: 1,
    pageSizePersonMsg: 10,
  },

  effects: {
    // 初始化人员列表
    * getInitPersonList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitLoading: true, isInitError: false, pageNo: 1}});
      yield put({type: 'getPersonList', payload: {isInit: true}});
    },

    // 人员列表下拉加载时调用接口，此函数可用于添加删除人员后调用
    * onRefreshInitPersonList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNo: 1}});
      yield put({type: 'getPersonList'});
    },

    // 人员列表上拉刷新 pageNo+1
    * endRefreshPersonList({payload}, {put, call, select, take}) {
      const {pageNo, isNoMoreData} = yield select(({person}) => person);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNo: pageNo + 1, isEndLoading: true}});
      yield put({type: 'getPersonList', payload: {isEndRefresh: true}});
    },

    // 获取人员列表
    * getPersonList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true}});
      }
      const {pageNo, pageSize, personName} = yield select(({person}) => person),
        params = {pageNo, pageSize, personName},
        res = yield call(personProvider.getPersonList, params);
      if (Number(res.code) === 200) {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'dataSource', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 添加人员
    * addPerson({payload}, {put, call, select}) {
      const {addPerson, uploadFiles} = yield select(({person}) => person),
        params = {
          'cards[0].cardNo': addPerson.phoneNumber,
          'extension.userType': '2',
          'validateFaceType': '2',
          base64FaceImageFile: uploadFiles,
          ...addPerson
        },
        res = yield call(personProvider.addPerson, params);
      yield put({type: 'save', payload: {btnLoading: false}});
      if (Number(res.code) === 200) {
        history.go(-2);
        // yield put({type: 'save', payload: {pageType: ''}});
        yield put({type: 'save', payload: {uploadFiles: ''}});
        yield put({type: 'onRefreshInitPersonList'});
      } else {
        console.log('添加失败处理');
      }
    },

    // 上传照片
    * uploadPhoto({payload}, {put, call, select}) {
      const {uploadPerson, uploadFiles, pageType} = yield select(({person}) => person),
        params = {
          id: uploadPerson.id,
          seq: uploadPerson.seq,
          'validateFaceType': '2',
          base64FaceImageFile: uploadFiles
        },
        res = yield call(personProvider.updatePerson, params);
      yield put({type: 'save', payload: {btnLoading: false}});
      if (Number(res.code) === 200) {
        // 照片修改成功回到人员详情页
        yield put({
          type: 'save',
          payload: {
            // pageType: '',
            isSyncVisible: true,
            updateInfoPerson: uploadPerson,
            isStartCountdown: true
          }
        });
      } else if (res.code === 'saas-70003') {
        Toast.info('未检查到更新内容!');
      } else {
        Toast.info(res.msg);
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 编辑人员
    * updatePerson({payload}, {put, call, select}) {
      const {currentPerson} = yield select(({person}) => person),
        params = {id: currentPerson.id, seq: currentPerson.seq, ...payload.values},
        res = yield call(personProvider.updatePerson, params);
      yield put({type: 'save', payload: {btnLoading: false}});
      if (res.code === '200') {
        yield put({type: 'save', payload: {isSyncVisible: true, updateInfoPerson: res.data, isStartCountdown: true}});
      }
    },

    // 获取人员详情
    * getPersonInfo({payload}, {put, call, select}) {
      const params = payload,
        res = yield call(personProvider.getPersonInfo, params);
      if (Number(res.code) === 200) {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'personInfo', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 获取人员相关设备列表
    * getPersonRelatedDevice({payload}, {put, call, select}) {
      const params = {personId: payload.id, isNeedFace: 1, pageNo: 1, pageSize: 200},
        res = yield call(personProvider.getPersonRelatedDevice, params);
      if (Number(res.code) === 200) {
        yield put({type: 'save', payload: {personRelationStatus: 'success', personRelationDevice: res.data || []}});
      } else {
        yield put({type: 'save', payload: {personRelationStatus: 'error'}});
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 删除人员
    * delPerson({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isDelVisible: false}});
      const {currentPerson} = yield select(({person}) => person),
        params = {'ids': currentPerson.id},
        res = yield call(personProvider.delPerson, params);
      if (res.code === '200') {
        Toast.info(res.msg);
        yield put({type: 'onRefreshInitPersonList'});
      }
      yield put({type: 'save', payload: {currentPerson: {}}});
    },

    // 权限下发
    * setPermission({payload}, {put, call, select}) {
      const {permissionPerson, permissionDevice} = yield select(({person}) => person),
        params = {personId: permissionPerson.id, deviceSerial: permissionDevice.deviceSerial},
        res = yield call(personProvider.setPermission, params);
      yield put({type: 'save', payload: {updateInfoPerson: permissionPerson}});
      yield put({type: 'setPermissionResult', payload: {res}});
    },

    // 人员搜索结果页面
    * searchSubmit({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitResult: true}});
      yield put({type: 'onRefreshInitPersonList'});
    },

    // 初始化信息同步列表
    * getInitMsgList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitLoading: true, isInitError: false}});
      yield put({type: 'getMsgList', payload: {isInit: true}});
    },

    // 信息同步列表下拉加载时调用接口
    * onRefreshInitMsgList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNoMsg: 1}});
      yield put({type: 'getMsgList'});
    },

    // 信息同步列表上拉刷新 pageNo+1
    * endRefreshMsgList({payload}, {put, call, select, take}) {
      const {pageNoMsg, isNoMoreData} = yield select(({person}) => person);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoMsg: pageNoMsg + 1, isEndLoading: true}});
      yield put({type: 'getMsgList', payload: {isEndRefresh: true}});
    },

    // 获取信息同步列表
    * getMsgList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true}});
      }
      const {pageNoMsg, pageSizeMsg} = yield select(({person}) => person),
        params = {
          pageNo: pageNoMsg,
          pageSize: pageSizeMsg,
          isGroupBySaasPersonId: true,
          isGroupByDeviceSerial: false,
          isGroupBySyncId: false
        },
        res = yield call(personProvider.getMsgList, params);
      if (Number(res.code) === 200) {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'dataSourceMsg', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 初始化个人信息同步列表
    * getInitPersonMsgList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {isInitLoading: true, isInitError: false}});
      yield put({type: 'getPersonMsgList', payload: {isInit: true}});
    },

    // 个人信息同步列表下拉加载时调用接口
    * onRefreshInitPersonMsgList({payload}, {put, call, select}) {
      yield put({type: 'save', payload: {pageNoPersonMsg: 1}});
      yield put({type: 'getPersonMsgList'});
    },

    // 个人信息同步列表上拉刷新 pageNo+1
    * endRefreshPersonMsgList({payload}, {put, call, select, take}) {
      const {pageNoPersonMsg, isNoMoreData} = yield select(({person}) => person);
      if (isNoMoreData) {
        return;
      }
      yield put({type: 'save', payload: {pageNoPersonMsg: pageNoPersonMsg + 1, isEndLoading: true}});
      yield put({type: 'getPersonMsgList', payload: {isEndRefresh: true}});
    },

    // 获取个人信息同步列表
    * getPersonMsgList({payload}, {put, call, select}) {
      if (!(payload && payload.isEndRefresh)) {
        yield put({type: 'save', payload: {isLoading: true}});
      }
      const {pageNoPersonMsg, pageSizePersonMsg, updateInfoPerson} = yield select(({person}) => person),
        id = updateInfoPerson.saasPersonId ? updateInfoPerson.saasPersonId : updateInfoPerson.id,
        params = {pageNo: pageNoPersonMsg, pageSize: pageSizePersonMsg, saasPersonId: id},
        res = yield call(personProvider.getPersonMsgList, params);
      if (Number(res.code) === 200) {
        yield put({
          type: 'successHandle',
          payload: {res, target: 'personMsgList', isEndRefresh: !!(payload && payload.isEndRefresh)}
        });
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    // 重新下发
    * setRepeatPermission({payload}, {put, call, select}) {
      const params = payload.values;
      let res = {};
      switch (payload.syncType) {
        case 'APPEND':
          // 调用添加接口
          res = yield call(personProvider.setPermission, params);
          break;
        case 'DELETE':
          // 调用删除接口
          res = yield call(personProvider.delPermission, params);
          break;
        default:
          Toast.info('无法判断下发类型');
          break;
      }
      yield put({type: 'setPermissionResult', payload: {res}});
    },

    // 下发权限后结果处理
    * setPermissionResult({payload}, {put, call, select}) {
      const {res} = payload;
      yield put({type: 'save', payload: {permissionLoading: true, permissionDevice: {}}});
      if (Number(res.code) === 200) {
        // authorityStatus:
        //    1表示下发成功；700表示权限已下发，重复下发，均表示成功，
        //    其余为失败
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            if (item.crVerifyMode === '人脸') {
              // 人脸数组
              if (Number(item.authorityStatus) === 1 || Number(item.authorityStatus) === 700) {
                // 下发成功
                Toast.info(item.remarks || `${item.crVerifyMode}权限下发失败`);
              } else {
                // 人脸下发失败
                Toast.info(item.remarks || `${item.crVerifyMode}权限下发失败`);
              }
              break;
            } else {
              // 非人脸数组
              if (i === res.data.length - 1) {
                Toast.info(item.remarks || `${item.crVerifyMode}权限下发失败`);
              }
            }
            // if (Number(item.authorityStatus) === 1 || Number(item.authorityStatus) === 700) {
            //   Toast.info(item.remarks || `${item.crVerifyMode}权限下发成功`);
            // } else if(item.crVerifyMode === '人脸') {
            //   Toast.info(item.remarks || `${item.crVerifyMode}权限下发失败`);
            //   break;
            // }
          }
        } else {
          Toast.info('权限下发失败');
        }
      } else {
        yield put({type: 'fetchDataError', payload});
      }
    },

    /* 以下为公共使用方法*/
    * successHandle({payload}, {put, call, select}) {
      const {res, target, isEndRefresh} = payload, targetResult = yield select((state) => state.person[target]);
      let dataSource = [];
      yield put({type: 'save', payload: {isNoMoreData: res.data ? res.data.length === 0 : true}});
      dataSource = res.data || [];
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
          isEndLoading: false,
          isInitError: false,
          isError: false,
          isEndError: false,
          pageNo: 1,
          pageNoMsg: 1,
          pageNoPersonMsg: 1,
          isDelVisible: false,
          currentPerson: {},
          permissionPerson: {},
          permissionDevice: {},
          addPerson: {},
          isSyncVisible: false,
          isStartCountdown: false,
          isSelectDialog: false,
        }
      });
    },

    * initData({payload}, {put, call, select}) {
      yield put({
        type: 'save',
        payload: {
          isInitLoading: false,
          isLoading: false,
          isEndLoading: false,
          isInitError: false,
          isError: false,
          isEndError: false,
          btnLoading: false,
          isDelVisible: false,
          permissionDevice: {},
          uploadFiles: '',
          addPerson: {},
          isSyncVisible: false,
          isStartCountdown: false,
          isSelectDialog: false,
          initPersonName: '',
          initPhoneNumber: '',
          initGender: '',
          initPersonNative: '',
          initCertificateType: '',
          initCertificateNumber: '',
        }
      });
    },
  },

  reducers: {
    save(state, {payload}) {
      // console.log(payload, 'reduce');
      return {...state, ...payload};
    }
  },

};
