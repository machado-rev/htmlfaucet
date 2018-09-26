var config = {
  local: {
    mode: 'local',
    port: 8090,
    mongo: {
      host: 'localhost',
      port: 27017
    },
    htmlcoin: {
      host: '127.0.0.1',
      port: 4889,
      user: 'leandro',
      pass: '260023',
      timeout: 30000
    },
    faucet_address: 'hNA7ViXRD3NzF8nZsbzNiQvWYaGMoGMHbZ',
    bit_limit: '5.0'
  },
  staging: {
    mode: 'staging',
    port: 8090,
    mongo: {
      host: 'localhost',
      port: 27017
    }
  },
  production: {
    mode: 'production',
    port: 8090,
    mongo: {
      host: 'localhost',
      port: 27017
    }
  }
}

module.exports = function(mode) {
  return config[mode || process.argv[2] || 'local'] || config.local;
}
