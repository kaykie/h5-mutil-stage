import request from '../../utils/request';
import PublicService from '../PubliceService';
import config from '../../config';

export default {

  // 到检索结果页面点击某一条结果跳转到详情
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

  // 删除设备
  delDevice(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/resource/res/device/delete',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 添加设备
  addDevice(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/resource/res/device/add',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 保存设备名称
  saveDeviceName(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/resource/res/device/name/update',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取设备下面关联的人员列表
  getRelationList(params) {
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

  // 获取设备下面关联的人员列表
  resolveRelationPerson(params) {
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

  // 获取事件搜索列表内容
  getEventList(params){
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/acs/acs/person/event/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  }


};
