module.exports = {
    database: "mongodb://admin:nghia123@ds263436.mlab.com:63436/th16-news",
    port: process.env.PORT|| 4200,
    secret: "nghiasdklasdlaskqlwenjoq",
    host: process.env.PORT? 'https://th16-news.herokuapp.com' :'https://localhost:4200',
    facebookApp: {
        clientID: "353645022016635",
        clientSecret: "96f15d9d932b634acc3bcc67adf4218c"
    },

    googleApp: {
        clientID: '565230475014-but330a8tqpkkkonm7gpd2e30vc6e96c.apps.googleusercontent.com',
        clientSecret: 'OBf18uG4BslF9nXqklRzCodH'
    },

    sendgrid_mail: { //@sendgird/mail 
        api_key: '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'
    }
}