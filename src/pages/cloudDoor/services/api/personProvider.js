import request from '../../utils/request';
import PublicService from '../PubliceService';
// import config from '../../config';

export default {
  // 获取人员列表
  getPersonList(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/person/person/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取人员详情
  getPersonInfo(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/person/person/info',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取人员关联设备列表
  getPersonRelatedDevice(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/authority/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 添加人员
  addPerson(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/person/person/add',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 编辑人员
  updatePerson(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/person/person/update',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    },'isShow');
  },

  // 删除人员
  delPerson(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/person/person/delete',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取设备列表
  getDeviceList(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/resource/res/device/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 权限下发（syncType = 'APPEND'）
  setPermission(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/person/add',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 权限下发（syncType = 'DELETE'）
  delPermission(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/person/delete',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取信息同步列表
  getMsgList(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/authority/sync/cnt/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取个人信息同步详情
  getPersonMsgList(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/authority/sync/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  }
};
