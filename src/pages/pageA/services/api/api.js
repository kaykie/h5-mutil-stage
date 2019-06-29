import request from '../../utils/request';
import PublicService from '../PubliceService';
import config from '../../config';

export default {

  // 到检索结果页面点击某一条结果跳转到详情
  getDeviceList(params) {
    const data = {...params, accessToken: localStorage.getItem('accessToken')}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '**',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },


};
