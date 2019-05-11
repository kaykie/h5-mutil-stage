


export default {
  namespace:'app',
  state:{
    selectedTab:'deviceManage'
  },


  reducers: {
    save(state, {payload}) {
      console.log(payload, 'reduce');
      return {...state, ...payload};
    }
  },
};
