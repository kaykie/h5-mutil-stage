/* eslint-disabled */
import request from '../../utils/request';
import PublicService from '../PubliceService';
import config from '../../pages/pageA/config';

export default {


  // 获取组件列表
  getList(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 删除组件
  delArea(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/delete',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },
  // 添加组件应用
  addArea(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/create',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 修改组件应用
  editArea(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/update',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },


  // 添加应用关联设备
  addDevice(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/camera/add',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 获取应用绑定的设备列表
  async getAllDeviceList(params) {
    const res = await request({
      url: '/api/org/tree',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST'
    });
    const orgId = res.data[0].id;
    const data = {...params, accessToken: config.accessToken, orgId};
    return request({
      url: '/api/resource/camera/list/page',
      data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    });
  },

  // 获取应用绑定的设备列表
  getDeviceList(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/camera/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 应用取消关联设备(删除设备)
  delDevice(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/camera/delete',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 检索人脸
  getFaceToken(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/api/lapp/intelligence/face/analysis/detect',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
    });
  },


  // 检索人脸
  search(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/history/statistics',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },

  // 到检索结果页面点击某一条结果跳转到详情
  faceDetail(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/history/search',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },
};
