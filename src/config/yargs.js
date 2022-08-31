const argv = require('yargs')
.option('p',{
    alias: 'port',
    type: 'number',
    default: 8080
})
.check((argv,options)=>{
    console.log('yargs',argv)
    if(isNaN(argv.p)){
        throw 'el puerto tiene que ser un numero'

    }
    return true
})
.argv

module.exports = argv