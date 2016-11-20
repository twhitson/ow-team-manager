module.exports = {

  attributes: {
    
    battletag: {
      type: 'string',
      required: true
    },
    
    region: {
      type: 'string',
      enum: ['eu', 'us', 'kr', 'cn', 'global']
    },
    
    team: {
      model: 'team'
    }
    
  }
};