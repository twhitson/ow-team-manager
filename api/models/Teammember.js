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
    
    rank: {
      type: 'int'
    },
    
    mostPlayed1: {
      type: 'string'
    },
    
    mostPlayed2: {
      type: 'string'
    },
    
    mostPlayed3: {
      type: 'string'
    },
    
    averageKd: {
      type: 'float'
    },
    
    lastUpdated: {
      type: 'date'
    },
    
    team: {
      model: 'team'
    }
    
  }
};